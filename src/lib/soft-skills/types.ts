export type ChallengeType =
  | 'SPEAK_IT'
  | 'DEBATE_BATTLE'
  | 'THINK_FAST'
  | 'CEO_CHALLENGE'
  | 'ROLEPLAY_CHALLENGE'
  | 'NEWSROOM_CHALLENGE';

export type EventStatus =
  | 'DRAFT'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'TEAM_FORMATION'
  | 'TEAM_APPROVAL_PENDING'
  | 'TEAMS_APPROVED'
  | 'CHALLENGE_REVEALED'
  | 'IN_PROGRESS'
  | 'JUDGING'
  | 'RESULT_SUBMITTED'
  | 'FOUNDER_REVIEW'
  | 'WINNER_CONFIRMED'
  | 'RECOGNITION_PROCESSING'
  | 'COMPLETED';

export type TeamStatus =
  | 'DRAFT'
  | 'AI_GENERATED'
  | 'FOUNDER_APPROVED'
  | 'LOCKED'
  | 'COMPLETED';

export type ResultStatus =
  | 'JUDGE_SUBMITTED'
  | 'FOUNDER_REVIEW'
  | 'FOUNDER_CONFIRMED'
  | 'REJECTED'
  | 'REVIEW_REQUIRED';

export type TransactionType =
  | 'EVENT_PARTICIPATION'
  | 'WINNER'
  | 'RUNNER_UP'
  | 'BEST_SPEAKER'
  | 'MOST_IMPROVED'
  | 'MOST_CONSISTENT'
  | 'BEST_TEAM_PLAYER'
  | 'RISING_STAR'
  | 'SPECIAL_ACHIEVEMENT'
  | 'MANUAL_ADJUSTMENT';

export interface ScoringCriteriaMap {
  communication?: number;
  confidence?: number;
  creativity?: number;
  quickThinking?: number;
  adaptability?: number;
  leadership?: number;
  teamwork?: number;
  problemSolving?: number;
  contentLogic?: number;
  timeManagement?: number;
  [key: string]: number | undefined;
}

export interface StructuredAchievementReport {
  studentName: string;
  studentId: string;
  eventName: string;
  challengeType: string;
  result: string;
  teamName?: string | null;
  judgeScore: number;
  judgeRemarks: string;
  previousCredits: number;
  creditsEarned: number;
  newTotalCredits: number;
  previousRelevantAchievements: string[];
  newAchievement: {
    name: string;
    badgeCode: string;
    description: string;
  };
  participationHistorySummary: string;
  currentStreak: number;
  date: string;
  founderConfirmationStatus: string;
  founderConfirmedBy: string;
  personalizedRecognition: string;
}
