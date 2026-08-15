import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';
import { emailQueue } from '@/lib/queue';

const ApproveReportSchema = z.object({
  edited_data: z
    .array(
      z.object({
        student_id: z.string(),
        domain: z.enum(['DOMAIN_1', 'DOMAIN_2', 'DOMAIN_3', 'DOMAIN_4']),
        credit_added: z.number().int(),
        reason: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const founderSession = await requireAuth(['FOUNDER']);
    const reportId = params.id;

    const report = await db.pendingReport.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ error: 'Report draft not found' }, { status: 404 });
    }

    // IDEMPOTENCY GUARD: Prevent duplicate approvals
    if (report.status === 'APPROVED') {
      return NextResponse.json(
        { error: 'This credit report has ALREADY been approved and processed.' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { edited_data } = ApproveReportSchema.parse(body);

    const proposals = edited_data || JSON.parse(report.report_data);

    // Transactional Credit Update
    await db.$transaction(async (tx) => {
      for (const p of proposals) {
        const domainKey = p.domain.toLowerCase() as 'domain_1' | 'domain_2' | 'domain_3' | 'domain_4';

        let studentCredit = await tx.studentCredit.findUnique({
          where: { student_id: p.student_id },
        });

        if (!studentCredit) {
          studentCredit = await tx.studentCredit.create({
            data: { student_id: p.student_id },
          });
        }

        const currentVal = studentCredit[domainKey];
        const newVal = currentVal + p.credit_added;

        await tx.studentCredit.update({
          where: { student_id: p.student_id },
          data: { [domainKey]: newVal },
        });

        // Enqueue email notification to student
        const student = await tx.user.findUnique({ where: { id: p.student_id } });
        if (student) {
          emailQueue.enqueue({
            to: student.college_email,
            subject: `Credit Update: +${p.credit_added} in ${p.domain}`,
            html: `<p>Hello ${student.name},</p><p>You have been awarded <strong>+${p.credit_added} credits</strong> in <strong>${p.domain}</strong>!</p><p>Reason: ${p.reason}</p>`,
            type: 'CREDITS',
            userId: student.id,
          });
        }
      }

      // Mark report approved
      await tx.pendingReport.update({
        where: { id: reportId },
        data: {
          status: 'APPROVED',
          reviewed_by: founderSession.id,
          reviewed_at: new Date(),
          report_data: JSON.stringify(proposals),
        },
      });

      await tx.auditLog.create({
        data: {
          actor_id: founderSession.id,
          action: 'APPROVE_CREDIT_REPORT',
          target: reportId,
          details: JSON.stringify({ proposals_count: proposals.length }),
        },
      });
    });

    // Invalidate leaderboard cache so updates reflect immediately for all users
    invalidateCache('leaderboard');

    return NextResponse.json({ message: 'Credit report approved and credits applied successfully.' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
