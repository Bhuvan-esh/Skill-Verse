export interface SessionFeedbackEntry {
  id: string;
  sessionId: string;
  giverName: string;
  receiverName: string;
  skill: string;
  rating: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  feedbackText: string;
  creditImpact: number;
  isPeerVaultLinked: boolean;
  createdAt: string;
}

// In-memory store for session feedbacks
export const GLOBAL_SESSION_FEEDBACKS: SessionFeedbackEntry[] = [];
