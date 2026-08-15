import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';

const DecideCancellationSchema = z.object({
  request_id: z.string(),
  decision: z.enum(['APPROVED', 'REJECTED']),
});

export async function GET() {
  try {
    await requireAuth(['FOUNDER']);

    const requests = await db.cancellationRequest.findMany({
      include: {
        student: { select: { id: true, name: true, usn: true, college_email: true } },
        competition: { select: { id: true, name: true, domain: true, event_date: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const founderSession = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { request_id, decision } = DecideCancellationSchema.parse(body);

    const cancelReq = await db.cancellationRequest.findUnique({
      where: { id: request_id },
      include: { competition: true },
    });

    if (!cancelReq || cancelReq.status !== 'PENDING') {
      return NextResponse.json({ error: 'Pending cancellation request not found.' }, { status: 404 });
    }

    // Always remove the registration
    await db.registration.deleteMany({
      where: {
        student_id: cancelReq.student_id,
        competition_id: cancelReq.competition_id,
      },
    });

    let creditPenaltyApplied = false;

    // If REJECTED -> Cancellation still happens, but student loses 1 credit from relevant domain
    if (decision === 'REJECTED') {
      creditPenaltyApplied = true;
      const domainKey = cancelReq.competition.domain.toLowerCase() as 'domain_1' | 'domain_2' | 'domain_3' | 'domain_4';

      const credits = await db.studentCredit.findUnique({
        where: { student_id: cancelReq.student_id },
      });

      if (credits) {
        const currentVal = credits[domainKey];
        const newVal = Math.max(0, currentVal - 1);

        await db.studentCredit.update({
          where: { student_id: cancelReq.student_id },
          data: { [domainKey]: newVal },
        });

        invalidateCache('leaderboard');
      }
    }

    const updated = await db.cancellationRequest.update({
      where: { id: request_id },
      data: {
        status: decision,
        credit_penalty: creditPenaltyApplied,
        decided_at: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: founderSession.id,
        action: `CANCELLATION_${decision}`,
        target: cancelReq.student_id,
        details: JSON.stringify({ competition: cancelReq.competition.name, penalty: creditPenaltyApplied }),
      },
    });

    return NextResponse.json({
      message: decision === 'APPROVED'
        ? 'Cancellation approved with no penalty.'
        : 'Cancellation rejected. Registration removed with 1 credit penalty.',
      request: updated,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
