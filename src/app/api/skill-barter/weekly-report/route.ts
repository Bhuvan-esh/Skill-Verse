import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateAICreditDraft } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    await requireAuth(['FOUNDER']);

    // Find all completed mentorship sessions that do not have a pending report yet
    const completedChats = await db.skillChat.findMany({
      where: {
        status: 'COMPLETED',
        pending_reports: { none: {} },
      },
      include: {
        mentor: true,
        request: true,
      },
    });

    if (completedChats.length === 0) {
      return NextResponse.json({ message: 'No new completed mentorship sessions to process.' });
    }

    const participantsData = await Promise.all(
      completedChats.map(async (chat) => {
        let credits = await db.studentCredit.findUnique({ where: { student_id: chat.mentor_id } });
        if (!credits) {
          credits = await db.studentCredit.create({ data: { student_id: chat.mentor_id } });
        }

        return {
          student_id: chat.mentor.id,
          student_name: chat.mentor.name,
          current_credit: credits.domain_1,
          role_in_event: `Mentor for '${chat.request.skill}'`,
        };
      })
    );

    const draftProposals = await generateAICreditDraft({
      competition_name: 'Weekly Micro-Mentorship Credits',
      domain: 'DOMAIN_1',
      configured_credit_value: 5, // 5 credits per completed mentorship
      participants: participantsData,
    });

    const report = await db.pendingReport.create({
      data: {
        type: 'MENTORSHIP',
        report_data: JSON.stringify(draftProposals),
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: `Weekly AI credit report drafted for ${completedChats.length} completed mentorship sessions.`,
      report_id: report.id,
      draft_proposals: draftProposals,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
