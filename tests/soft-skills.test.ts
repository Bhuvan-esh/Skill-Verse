import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../src/lib/db';
import { generateMixedYearTeams } from '../src/lib/soft-skills/teamFormationService';
import { submitScore, submitCompetitionResult } from '../src/lib/soft-skills/judgingService';
import { confirmWinnerByFounder } from '../src/lib/soft-skills/winnerConfirmationService';
import { getStudentCreditBalance, processCreditTransaction } from '../src/lib/soft-skills/creditService';
import { executePostWinnerWorkflow } from '../src/lib/soft-skills/postWinnerWorkflow';

describe('Skill League Soft Skills Challenge System — Complete Backend Test', { timeout: 90000 }, () => {
  let testEventId: string;
  const studentAId = 'stu-test-a-' + Date.now();
  const studentBId = 'stu-test-b-' + Date.now();
  const studentCId = 'stu-test-c-' + Date.now();
  const studentDId = 'stu-test-d-' + Date.now();

  beforeAll(async () => {
    // 1. Create a mystery Skill League Event
    const event = await db.skillLeagueEvent.create({
      data: {
        public_event_name: 'Skill League — Mystery Challenge #001',
        internal_challenge_type: 'DEBATE_BATTLE',
        description: 'Elite collegiate mystery soft skills competition.',
        registration_open_time: new Date(Date.now() - 3600000),
        registration_close_time: new Date(Date.now() + 86400000),
        event_date: new Date(Date.now() + 86400000 * 2),
        participant_limit: 50,
        team_based: true,
        team_size: 4,
        credits_reward: 50,
        status: 'REGISTRATION_OPEN',
        created_by: 'founder-test',
      },
    });
    testEventId = event.id;

    // Preload Student A with previous credits = 120
    await db.skillLeagueCreditAccount.create({
      data: {
        student_id: studentAId,
        student_name: 'Student A (1st Year)',
        current_balance: 120,
      },
    });
  });

  it('1. Should register 4 students across 1st, 2nd, 3rd, and 4th years', async () => {
    const participants = [
      { id: studentAId, name: 'Student A', usn: '1MS24CS001', year: 1 },
      { id: studentBId, name: 'Student B', usn: '1MS23CS002', year: 2 },
      { id: studentCId, name: 'Student C', usn: '1MS22CS003', year: 3 },
      { id: studentDId, name: 'Student D', usn: '1MS21CS004', year: 4 },
    ];

    for (const p of participants) {
      const reg = await db.skillLeagueRegistration.create({
        data: {
          event_id: testEventId,
          student_id: p.id,
          student_name: p.name,
          usn: p.usn,
          email: `${p.usn.toLowerCase()}@college.edu`,
          year: p.year,
          branch: 'Computer Science',
          status: 'REGISTERED',
        },
      });
      expect(reg.year).toBe(p.year);
    }

    const regCount = await db.skillLeagueRegistration.count({ where: { event_id: testEventId } });
    expect(regCount).toBe(4);
  });

  it('2. Should prevent duplicate registration by the same student', async () => {
    let duplicateError = false;
    try {
      await db.skillLeagueRegistration.create({
        data: {
          event_id: testEventId,
          student_id: studentAId,
          student_name: 'Student A Duplicate',
          usn: '1MS24CS001',
          email: 'duplicate@college.edu',
          year: 1,
          status: 'REGISTERED',
        },
      });
    } catch (e) {
      duplicateError = true;
    }
    expect(duplicateError).toBe(true);
  });

  it('3. Should generate AI Mixed-Year Teams without finalizing them', async () => {
    const teamGen = await generateMixedYearTeams(testEventId, 'founder-test', 'FOUNDER', 4);
    
    expect(teamGen.teams).toHaveLength(1);
    const team = teamGen.teams[0];
    expect(team.members).toHaveLength(4);
    
    // Check cross-year representation
    expect(team.yearDistribution[1]).toBe(1);
    expect(team.yearDistribution[2]).toBe(1);
    expect(team.yearDistribution[3]).toBe(1);
    expect(team.yearDistribution[4]).toBe(1);

    // Verify team status is AI_GENERATED (not yet approved)
    const dbTeam = await db.skillLeagueTeam.findFirst({ where: { event_id: testEventId } });
    expect(dbTeam?.status).toBe('AI_GENERATED');
  });

  it('4. Should allow Founder to approve teams', async () => {
    await db.skillLeagueTeam.updateMany({
      where: { event_id: testEventId },
      data: { status: 'FOUNDER_APPROVED', approved_by: 'founder-test' },
    });

    await db.skillLeagueEvent.update({
      where: { id: testEventId },
      data: { status: 'TEAMS_APPROVED' },
    });

    const dbTeam = await db.skillLeagueTeam.findFirst({ where: { event_id: testEventId } });
    expect(dbTeam?.status).toBe('FOUNDER_APPROVED');
  });

  it('5. Should execute Challenge Reveal with timestamp', async () => {
    const revealDate = new Date();
    const updated = await db.skillLeagueEvent.update({
      where: { id: testEventId },
      data: {
        challenge_revealed_at: revealDate,
        status: 'CHALLENGE_REVEALED',
      },
    });

    expect(updated.challenge_revealed_at).toBeDefined();
    expect(updated.internal_challenge_type).toBe('DEBATE_BATTLE');
  });

  it('6. Should record Judge evaluation & submit result (JUDGE_SUBMITTED)', async () => {
    const team = await db.skillLeagueTeam.findFirst({ where: { event_id: testEventId } });
    expect(team).toBeDefined();

    const round = await db.skillLeagueRound.create({
      data: {
        event_id: testEventId,
        round_number: 1,
        round_name: 'Final Rebuttal Round',
        challenge_type: 'DEBATE_BATTLE',
        status: 'LIVE',
      },
    });

    // Score submission
    const score = await submitScore({
      eventId: testEventId,
      roundId: round.id,
      judgeId: 'judge-dr-smith',
      judgeName: 'Dr. Smith',
      teamId: team!.id,
      criteriaScores: {
        communication: 9,
        confidence: 10,
        quickThinking: 9,
        contentLogic: 9,
      },
      comments: 'Masterful debate rebuttal with sharp logical flow.',
    });

    expect(score.total_score).toBeGreaterThan(8);

    // Judge submits competition result
    const result = await submitCompetitionResult({
      eventId: testEventId,
      judgeId: 'judge-dr-smith',
      judgeName: 'Dr. Smith',
      winningTeamId: team!.id,
      judgeRemarks: 'Team demonstrated peerless articulation and cross-year synergy.',
    });

    expect(result.status).toBe('JUDGE_SUBMITTED');
  });

  it('7. Should require Founder confirmation to make winner official and trigger post-processing', { timeout: 60000 }, async () => {
    const pendingResult = await db.skillLeagueResult.findFirst({
      where: { event_id: testEventId },
    });
    expect(pendingResult?.status).toBe('JUDGE_SUBMITTED');

    // Confirm Winner by Founder
    const confirmation = await confirmWinnerByFounder({
      resultId: pendingResult!.id,
      founderId: 'founder-test',
      founderName: 'Chief Founder',
      founderRemarks: 'Ratified and approved for official certificate.',
    });

    expect(confirmation.result.status).toBe('FOUNDER_CONFIRMED');
    expect(confirmation.postWinnerWorkflow.processedWinners.length).toBe(4);

    // 8. Verify Student A's Credit Calculation: 120 -> +50 -> 170
    const studentABalance = await getStudentCreditBalance(studentAId);
    expect(studentABalance).toBe(170); // 120 previous + 50 reward

    // Verify Credit Transaction
    const transaction = await db.skillLeagueCreditTransaction.findFirst({
      where: { student_id: studentAId, event_id: testEventId },
    });
    expect(transaction).toBeDefined();
    expect(transaction?.previous_balance).toBe(120);
    expect(transaction?.credits_earned).toBe(50);
    expect(transaction?.new_balance).toBe(170);
  });

  it('8. Should enforce IDEMPOTENCY: Re-executing post-winner workflow cannot double-award credits', async () => {
    const confirmedResult = await db.skillLeagueResult.findFirst({
      where: { event_id: testEventId },
    });

    // Attempt double execution
    const duplicateRun = await executePostWinnerWorkflow(
      confirmedResult!.id,
      'founder-test',
      'Chief Founder'
    );

    // Balance must remain exactly 170
    const finalBalance = await getStudentCreditBalance(studentAId);
    expect(finalBalance).toBe(170);

    // Only 1 transaction record exists
    const txCount = await db.skillLeagueCreditTransaction.count({
      where: { student_id: studentAId, event_id: testEventId },
    });
    expect(txCount).toBe(1);
  });

  it('9. Should verify AI Report, Badge Assignment, and Email Logs are created', async () => {
    const report = await db.skillLeagueReport.findFirst({
      where: { student_id: studentAId, event_id: testEventId },
    });
    expect(report).toBeDefined();
    expect(report?.personalized_message).toBeDefined();

    const achievement = await db.skillLeagueStudentAchievement.findFirst({
      where: { student_id: studentAId, event_id: testEventId },
      include: { achievement: true },
    });
    expect(achievement?.achievement.badge_code).toBe('DEBATE_CHAMPION');

    const emailLog = await db.skillLeagueEmailLog.findFirst({
      where: { student_id: studentAId, event_id: testEventId },
    });
    expect(emailLog).toBeDefined();
    expect(emailLog?.status).toBe('SENT');
  });
});
