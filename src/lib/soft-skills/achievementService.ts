import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { StructuredAchievementReport } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const DEFAULT_ACHIEVEMENTS = [
  {
    name: 'Debate Champion',
    badge_code: 'DEBATE_CHAMPION',
    description: 'Awarded for supreme argumentative eloquence, rhetorical agility, and victorious round defense in Debate Battle.',
    category: 'DEBATE',
    icon_url: '⚔️',
  },
  {
    name: 'Best Speaker',
    badge_code: 'BEST_SPEAKER',
    description: 'Recognizes exceptional vocal delivery, pacing, clarity, and persuasive impact in Speak It challenges.',
    category: 'PUBLIC_SPEAKING',
    icon_url: '🎙️',
  },
  {
    name: 'Quick Thinker',
    badge_code: 'QUICK_THINKER',
    description: 'Celebrates immediate crisis resolution and agile tactical problem-solving under sudden time compression.',
    category: 'IMPROV',
    icon_url: '⚡',
  },
  {
    name: 'Adaptability Master',
    badge_code: 'ADAPTABILITY_MASTER',
    description: 'Conquered sudden twist disruptions and position reversals with seamless composure.',
    category: 'AGILITY',
    icon_url: '🌀',
  },
  {
    name: 'Leadership Star',
    badge_code: 'LEADERSHIP_STAR',
    description: 'Demonstrated visionary cross-functional leadership, executive presence, and strategic direction.',
    category: 'LEADERSHIP',
    icon_url: '🌟',
  },
  {
    name: 'Communication Pro',
    badge_code: 'COMMUNICATION_PRO',
    description: 'Mastery of professional articulation, empathetic listening, and high-impact stakeholder address.',
    category: 'COMMUNICATION',
    icon_url: '💬',
  },
  {
    name: 'Best Team Player',
    badge_code: 'BEST_TEAM_PLAYER',
    description: 'Fostered inclusive synergy, elevated squad members, and collaborated seamlessly across academic years.',
    category: 'TEAMWORK',
    icon_url: '🤝',
  },
  {
    name: 'Rising Star',
    badge_code: 'RISING_STAR',
    description: 'Outstanding breakout performance and exponential growth across Skill League events.',
    category: 'GROWTH',
    icon_url: '🚀',
  },
];

export async function seedDefaultAchievementsIfNeeded(): Promise<void> {
  const count = await db.skillLeagueAchievement.count();
  if (count === 0) {
    for (const a of DEFAULT_ACHIEVEMENTS) {
      await db.skillLeagueAchievement.upsert({
        where: { badge_code: a.badge_code },
        update: {},
        create: a,
      });
    }
  }
}

export async function assignStudentAchievement(input: {
  studentId: string;
  studentName: string;
  badgeCode: string;
  eventId: string;
  reason: string;
}): Promise<any> {
  await seedDefaultAchievementsIfNeeded();

  const achievement = await db.skillLeagueAchievement.findUnique({
    where: { badge_code: input.badgeCode },
  });

  if (!achievement) {
    throw new Error(`Achievement badge code '${input.badgeCode}' not found.`);
  }

  const idempotencyKey = `${input.eventId}_${input.studentId}_${achievement.id}`;

  const existing = await db.skillLeagueStudentAchievement.findUnique({
    where: { idempotency_key: idempotencyKey },
    include: { achievement: true },
  });

  if (existing) {
    return existing;
  }

  const record = await db.skillLeagueStudentAchievement.create({
    data: {
      idempotency_key: idempotencyKey,
      student_id: input.studentId,
      student_name: input.studentName,
      achievement_id: achievement.id,
      event_id: input.eventId,
      awarded_reason: input.reason,
      awarded_at: new Date(),
    },
    include: { achievement: true },
  });

  await createAuditLog({
    actorId: 'SYSTEM',
    actorRole: 'FOUNDER',
    action: 'BADGE_ASSIGNED',
    entity: 'STUDENT_ACHIEVEMENT',
    entityId: record.id,
    newValue: { badgeCode: input.badgeCode, badgeName: achievement.name },
    reason: input.reason,
  });

  return record;
}

export async function generateAIAchievementReport(input: {
  studentId: string;
  studentName: string;
  eventId: string;
  eventName: string;
  challengeType: string;
  resultId: string;
  resultStatus: string;
  teamName?: string | null;
  judgeScore: number;
  judgeRemarks: string;
  previousCredits: number;
  creditsEarned: number;
  newTotalCredits: number;
  badgeCode?: string;
  founderName: string;
}): Promise<StructuredAchievementReport> {
  const badgeCode = input.badgeCode || (input.resultStatus === 'WINNER' ? 'DEBATE_CHAMPION' : 'RISING_STAR');
  
  // Retrieve previous achievements for this student
  const priorBadges = await db.skillLeagueStudentAchievement.findMany({
    where: {
      student_id: input.studentId,
      event_id: { not: input.eventId },
    },
    include: { achievement: true },
  });

  const previousRelevantAchievements = priorBadges.map((b) => b.achievement.name);

  // Retrieve participation count
  const priorParticipations = await db.skillLeagueRegistration.count({
    where: {
      student_id: input.studentId,
      status: { in: ['REGISTERED', 'ATTENDED', 'COMPLETED'] },
    },
  });

  const achievementRecord = await assignStudentAchievement({
    studentId: input.studentId,
    studentName: input.studentName,
    badgeCode,
    eventId: input.eventId,
    reason: `Official Founder-confirmed achievement for ${input.eventName} (${input.challengeType})`,
  });

  let personalizedRecognition = `Outstanding performance by ${input.studentName} during the ${input.eventName} (${input.challengeType}). Demonstrated exemplary poise, sharp analytical depth, and collaborative excellence on stage.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'mock-or-real-gemini-key') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Write a short, highly professional 2-3 sentence personalized recognition paragraph celebrating student ${input.studentName} who won/placed in the Soft Skills Skill League event '${input.eventName}' (${input.challengeType}). Judge remarks were: "${input.judgeRemarks}". Score: ${input.judgeScore}/10. Emphasize growth, communication leadership, and peer collaboration.`;
      const aiRes = await model.generateContent(prompt);
      const text = aiRes.response.text().trim();
      if (text.length > 20) {
        personalizedRecognition = text;
      }
    } catch (e) {
      console.warn('AI personalization fallback used:', e);
    }
  }

  const structuredReport: StructuredAchievementReport = {
    studentName: input.studentName,
    studentId: input.studentId,
    eventName: input.eventName,
    challengeType: input.challengeType,
    result: input.resultStatus,
    teamName: input.teamName,
    judgeScore: input.judgeScore,
    judgeRemarks: input.judgeRemarks,
    previousCredits: input.previousCredits,
    creditsEarned: input.creditsEarned,
    newTotalCredits: input.newTotalCredits,
    previousRelevantAchievements,
    newAchievement: {
      name: achievementRecord.achievement.name,
      badgeCode: achievementRecord.achievement.badge_code,
      description: achievementRecord.achievement.description,
    },
    participationHistorySummary: `Attended ${priorParticipations} prior club league sessions with active standing.`,
    currentStreak: Math.max(1, priorParticipations),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    founderConfirmationStatus: 'FOUNDER_CONFIRMED',
    founderConfirmedBy: input.founderName,
    personalizedRecognition,
  };

  const reportIdempotencyKey = `${input.eventId}_${input.studentId}_${input.resultId}`;

  await db.skillLeagueReport.upsert({
    where: { idempotency_key: reportIdempotencyKey },
    update: {
      report_json: JSON.stringify(structuredReport),
      personalized_message: personalizedRecognition,
    },
    create: {
      idempotency_key: reportIdempotencyKey,
      student_id: input.studentId,
      student_name: input.studentName,
      event_id: input.eventId,
      result_id: input.resultId,
      report_json: JSON.stringify(structuredReport),
      personalized_message: personalizedRecognition,
      founder_confirmed_by: input.founderName,
    },
  });

  await createAuditLog({
    actorId: 'AI_AGENT',
    actorRole: 'FOUNDER',
    action: 'REPORT_GENERATED',
    entity: 'REPORT',
    entityId: reportIdempotencyKey,
    newValue: { studentName: input.studentName, newTotalCredits: input.newTotalCredits },
    reason: `Generated structured achievement report for ${input.studentName}`,
  });

  return structuredReport;
}
