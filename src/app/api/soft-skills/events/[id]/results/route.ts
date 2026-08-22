import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { submitCompetitionResult } from '@/lib/soft-skills/judgingService';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const results = await db.skillLeagueResult.findMany({
      where: { event_id: params.id },
      orderBy: { submitted_at: 'desc' },
      include: {
        winning_team: { include: { members: true } },
        runner_up_team: { include: { members: true } },
        credit_transactions: true,
        reports: true,
      },
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const judgeId = session?.id || 'judge-system';
    const judgeName = session?.name || 'Head Judge';

    const body = await req.json();
    const {
      winning_team_id,
      winning_student_id,
      winning_student_name,
      runner_up_team_id,
      runner_up_student_id,
      judge_remarks,
      scores_summary,
    } = body;

    if (!judge_remarks) {
      return NextResponse.json({ error: 'Judge remarks are required' }, { status: 400 });
    }

    if (!winning_team_id && !winning_student_id) {
      return NextResponse.json({ error: 'Must specify a winning team or student' }, { status: 400 });
    }

    const result = await submitCompetitionResult({
      eventId: params.id,
      judgeId,
      judgeName,
      winningTeamId: winning_team_id,
      winningStudentId: winning_student_id,
      winningStudentName: winning_student_name,
      runnerUpTeamId: runner_up_team_id,
      runnerUpStudentId: runner_up_student_id,
      judgeRemarks: judge_remarks,
      scoresSummary: scores_summary,
    });

    return NextResponse.json({
      message: 'Competition result successfully submitted by Judge (Status: JUDGE_SUBMITTED, Awaiting Founder Ratification).',
      result,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Result submission failed' }, { status: 500 });
  }
}
