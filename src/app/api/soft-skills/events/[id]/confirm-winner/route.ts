import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { confirmWinnerByFounder, rejectOrReviewResult } from '@/lib/soft-skills/winnerConfirmationService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const founderId = session?.id || 'lead-founder-system';
    const founderName = session?.name || 'Lead Founder';

    const body = await req.json();
    const { result_id, action, founder_remarks } = body;

    if (!result_id) {
      return NextResponse.json({ error: 'result_id is required' }, { status: 400 });
    }

    if (action === 'REJECT') {
      const rejected = await rejectOrReviewResult(result_id, 'REJECTED', founderId, founder_remarks || 'Founder rejected judge results.');
      return NextResponse.json({ message: 'Result rejected by Founder.', result: rejected });
    }

    if (action === 'REQUEST_REVIEW') {
      const reviewReq = await rejectOrReviewResult(result_id, 'REVIEW_REQUIRED', founderId, founder_remarks || 'Founder requested further score review.');
      return NextResponse.json({ message: 'Review requested by Founder.', result: reviewReq });
    }

    // Default action: CONFIRM_WINNER
    const outcome = await confirmWinnerByFounder({
      resultId: result_id,
      founderId,
      founderName,
      founderRemarks: founder_remarks || 'Founder officially confirmed competition winner. Post-processing pipeline executed.',
    });

    return NextResponse.json({
      message: '🎉 Winner officially ratified by Founder! AI post-winner workflow completed: credits awarded, achievements assigned, AI reports generated, and email notifications logged.',
      outcome,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Confirmation failed' }, { status: 500 });
  }
}
