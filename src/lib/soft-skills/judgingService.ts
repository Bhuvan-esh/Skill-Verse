import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { ScoringCriteriaMap } from './types';

export interface SubmitScoreInput {
  eventId: string;
  roundId: string;
  judgeId: string;
  judgeName?: string;
  teamId?: string;
  studentId?: string;
  criteriaScores: ScoringCriteriaMap;
  comments?: string;
}

export interface SubmitResultInput {
  eventId: string;
  judgeId: string;
  judgeName?: string;
  winningTeamId?: string;
  winningStudentId?: string;
  winningStudentName?: string;
  runnerUpTeamId?: string;
  runnerUpStudentId?: string;
  judgeRemarks: string;
  scoresSummary?: Record<string, any>;
}

export async function submitScore(input: SubmitScoreInput): Promise<any> {
  const values = Object.values(input.criteriaScores).filter((v): v is number => typeof v === 'number');
  const totalScore = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;

  const scoreRecord = await db.skillLeagueScore.create({
    data: {
      event_id: input.eventId,
      round_id: input.roundId,
      judge_id: input.judgeId,
      judge_name: input.judgeName || 'Official Judge',
      team_id: input.teamId || null,
      student_id: input.studentId || null,
      criteria_scores: JSON.stringify(input.criteriaScores),
      total_score: Math.round(totalScore * 10) / 10,
      comments: input.comments || null,
    },
  });

  await createAuditLog({
    actorId: input.judgeId,
    actorRole: 'JUDGE',
    action: 'SCORE_SUBMITTED',
    entity: 'SCORE',
    entityId: scoreRecord.id,
    newValue: { totalScore: scoreRecord.total_score, roundId: input.roundId },
    reason: input.comments || 'Evaluated participant performance',
  });

  return scoreRecord;
}

export async function submitCompetitionResult(input: SubmitResultInput): Promise<any> {
  const event = await db.skillLeagueEvent.findUnique({
    where: { id: input.eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  // Create result record in JUDGE_SUBMITTED status (Awaiting Founder Confirmation)
  const result = await db.skillLeagueResult.create({
    data: {
      event_id: input.eventId,
      judge_id: input.judgeId,
      judge_name: input.judgeName || 'Head Judge',
      winning_team_id: input.winningTeamId || null,
      winning_student_id: input.winningStudentId || null,
      winning_student_name: input.winningStudentName || null,
      runner_up_team_id: input.runnerUpTeamId || null,
      runner_up_student_id: input.runnerUpStudentId || null,
      scores_summary: JSON.stringify(input.scoresSummary || {}),
      judge_remarks: input.judgeRemarks,
      status: 'JUDGE_SUBMITTED',
    },
    include: {
      winning_team: {
        include: { members: true },
      },
      runner_up_team: {
        include: { members: true },
      },
    },
  });

  // Update event status to JUDGING or RESULT_SUBMITTED
  await db.skillLeagueEvent.update({
    where: { id: input.eventId },
    data: { status: 'RESULT_SUBMITTED' },
  });

  await createAuditLog({
    actorId: input.judgeId,
    actorRole: 'JUDGE',
    action: 'RESULT_SUBMITTED',
    entity: 'RESULT',
    entityId: result.id,
    newValue: {
      winningTeamId: input.winningTeamId,
      winningStudentId: input.winningStudentId,
      judgeRemarks: input.judgeRemarks,
    },
    reason: 'Judge submitted competition result for Founder review.',
  });

  return result;
}
