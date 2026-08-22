import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { submitScore } from '@/lib/soft-skills/judgingService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const judgeId = session?.id || 'judge-system';
    const judgeName = session?.name || 'Assigned Event Judge';

    const body = await req.json();
    const { round_id, team_id, student_id, criteria_scores, comments } = body;

    if (!round_id || !criteria_scores) {
      return NextResponse.json({ error: 'Missing round_id or criteria_scores' }, { status: 400 });
    }

    const score = await submitScore({
      eventId: params.id,
      roundId: round_id,
      judgeId,
      judgeName,
      teamId: team_id,
      studentId: student_id,
      criteriaScores: criteria_scores,
      comments,
    });

    return NextResponse.json({ message: 'Score successfully recorded', score }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit score' }, { status: 500 });
  }
}
