import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { processCreditTransaction } from './creditService';
import { generateAIAchievementReport } from './achievementService';
import { sendAchievementEmail } from './emailService';
import { StructuredAchievementReport } from './types';

export interface PostWinnerWorkflowResult {
  eventId: string;
  resultId: string;
  processedWinners: Array<{
    studentId: string;
    studentName: string;
    previousCredits: number;
    creditsEarned: number;
    newTotalCredits: number;
    badgeCode: string;
    report: StructuredAchievementReport;
  }>;
  processedRunnerUps: Array<{
    studentId: string;
    studentName: string;
    previousCredits: number;
    creditsEarned: number;
    newTotalCredits: number;
    badgeCode: string;
    report: StructuredAchievementReport;
  }>;
}

export async function executePostWinnerWorkflow(
  resultId: string,
  founderId: string,
  founderName: string = 'Founder'
): Promise<PostWinnerWorkflowResult> {
  const result = await db.skillLeagueResult.findUnique({
    where: { id: resultId },
    include: {
      event: true,
      winning_team: {
        include: {
          members: {
            include: { registration: true },
          },
        },
      },
      runner_up_team: {
        include: {
          members: {
            include: { registration: true },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error('Competition result not found');
  }

  if (result.status !== 'FOUNDER_CONFIRMED') {
    throw new Error('CRITICAL VIOLATION: AI Post-Winner workflow can only execute on FOUNDER_CONFIRMED results.');
  }

  const event = result.event;
  const winnerReward = event.credits_reward || 50;
  const runnerUpReward = Math.max(10, Math.round(winnerReward * 0.6));

  const processedWinners = [];
  const processedRunnerUps = [];

  // 1. Collect Winner Participants
  const winningStudents: Array<{ id: string; name: string; email: string; teamName?: string }> = [];
  if (result.winning_team) {
    for (const m of result.winning_team.members) {
      winningStudents.push({
        id: m.student_id,
        name: m.student_name,
        email: m.registration?.email || `${m.usn.toLowerCase()}@college.edu`,
        teamName: result.winning_team.team_name,
      });
    }
  } else if (result.winning_student_id) {
    const reg = await db.skillLeagueRegistration.findFirst({
      where: { event_id: event.id, student_id: result.winning_student_id },
    });
    winningStudents.push({
      id: result.winning_student_id,
      name: result.winning_student_name || 'Champion Student',
      email: reg?.email || 'winner@college.edu',
    });
  }

  // 2. Process Winners: Credits -> Achievement Report -> Email
  for (const student of winningStudents) {
    // Step A: Idempotent Credit Transaction
    const creditRes = await processCreditTransaction({
      studentId: student.id,
      studentName: student.name,
      eventId: event.id,
      resultId: result.id,
      transactionType: 'WINNER',
      creditsToAward: winnerReward,
      reason: `Official 1st Place Winner in ${event.public_event_name} (${event.internal_challenge_type})`,
      confirmedBy: founderName,
    });

    // Step B: AI Structured Achievement Report & Badge Awarding
    const report = await generateAIAchievementReport({
      studentId: student.id,
      studentName: student.name,
      eventId: event.id,
      eventName: event.public_event_name,
      challengeType: event.internal_challenge_type,
      resultId: result.id,
      resultStatus: 'WINNER (1st Place)',
      teamName: student.teamName,
      judgeScore: 9.5,
      judgeRemarks: result.judge_remarks,
      previousCredits: creditRes.previousBalance,
      creditsEarned: creditRes.creditsEarned,
      newTotalCredits: creditRes.newBalance,
      badgeCode: 'DEBATE_CHAMPION',
      founderName,
    });

    // Step C: Automated Email Notification
    await sendAchievementEmail({
      studentId: student.id,
      studentEmail: student.email,
      report,
      eventId: event.id,
    });

    processedWinners.push({
      studentId: student.id,
      studentName: student.name,
      previousCredits: creditRes.previousBalance,
      creditsEarned: creditRes.creditsEarned,
      newTotalCredits: creditRes.newBalance,
      badgeCode: 'DEBATE_CHAMPION',
      report,
    });
  }

  // 3. Process Runner-Up Participants (if any)
  const runnerUpStudents: Array<{ id: string; name: string; email: string; teamName?: string }> = [];
  if (result.runner_up_team) {
    for (const m of result.runner_up_team.members) {
      runnerUpStudents.push({
        id: m.student_id,
        name: m.student_name,
        email: m.registration?.email || `${m.usn.toLowerCase()}@college.edu`,
        teamName: result.runner_up_team.team_name,
      });
    }
  }

  for (const student of runnerUpStudents) {
    const creditRes = await processCreditTransaction({
      studentId: student.id,
      studentName: student.name,
      eventId: event.id,
      resultId: result.id,
      transactionType: 'RUNNER_UP',
      creditsToAward: runnerUpReward,
      reason: `Official 2nd Place Runner-Up in ${event.public_event_name} (${event.internal_challenge_type})`,
      confirmedBy: founderName,
    });

    const report = await generateAIAchievementReport({
      studentId: student.id,
      studentName: student.name,
      eventId: event.id,
      eventName: event.public_event_name,
      challengeType: event.internal_challenge_type,
      resultId: result.id,
      resultStatus: 'RUNNER_UP (2nd Place)',
      teamName: student.teamName,
      judgeScore: 8.8,
      judgeRemarks: result.judge_remarks,
      previousCredits: creditRes.previousBalance,
      creditsEarned: creditRes.creditsEarned,
      newTotalCredits: creditRes.newBalance,
      badgeCode: 'RISING_STAR',
      founderName,
    });

    await sendAchievementEmail({
      studentId: student.id,
      studentEmail: student.email,
      report,
      eventId: event.id,
    });

    processedRunnerUps.push({
      studentId: student.id,
      studentName: student.name,
      previousCredits: creditRes.previousBalance,
      creditsEarned: creditRes.creditsEarned,
      newTotalCredits: creditRes.newBalance,
      badgeCode: 'RISING_STAR',
      report,
    });
  }

  // Mark event as COMPLETED
  await db.skillLeagueEvent.update({
    where: { id: event.id },
    data: { status: 'COMPLETED' },
  });

  await createAuditLog({
    actorId: founderId,
    actorRole: 'FOUNDER',
    action: 'POST_WINNER_WORKFLOW_COMPLETED',
    entity: 'EVENT',
    entityId: event.id,
    newValue: {
      winnersProcessed: processedWinners.length,
      runnerUpsProcessed: processedRunnerUps.length,
    },
    reason: 'Executed full post-winner pipeline: credit transactions, AI reports, badge assignments, and email notifications.',
  });

  return {
    eventId: event.id,
    resultId: result.id,
    processedWinners,
    processedRunnerUps,
  };
}
