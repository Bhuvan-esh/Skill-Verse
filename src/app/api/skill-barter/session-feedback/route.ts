import { NextResponse } from 'next/server';
import { GLOBAL_SESSION_FEEDBACKS, SessionFeedbackEntry } from '@/lib/sessionFeedbackStore';

export interface SessionFeedbackPayload {
  sessionId: string;
  giverName: string;
  receiverName: string;
  skill: string;
  topic?: string;
  rating: number; // 1 to 5
  feedbackText: string;
  isPeerVaultLinked?: boolean;
}

export async function POST(req: Request) {
  try {
    const body: SessionFeedbackPayload = await req.json();
    const {
      sessionId,
      giverName = 'Anusha A',
      receiverName = 'Peer',
      skill = 'Technical Barter',
      rating = 5,
      feedbackText = 'Great session!',
      isPeerVaultLinked = false,
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const creditDelta = rating >= 4 ? 15 : rating === 3 ? 5 : -10;
    const sentiment = rating >= 4 ? 'POSITIVE' : rating === 3 ? 'NEUTRAL' : 'CRITICAL';

    const feedbackEntry: SessionFeedbackEntry = {
      id: `fb-${Date.now()}`,
      sessionId,
      giverName,
      receiverName,
      skill,
      rating,
      sentiment: sentiment as any,
      feedbackText,
      creditImpact: creditDelta,
      isPeerVaultLinked: Boolean(isPeerVaultLinked),
      createdAt: new Date().toISOString(),
    };

    GLOBAL_SESSION_FEEDBACKS.unshift(feedbackEntry);

    return NextResponse.json({
      success: true,
      feedback: feedbackEntry,
      creditDelta,
      message: `✓ Session completed! Feedback & ${creditDelta >= 0 ? `+${creditDelta}` : creditDelta} Credits applied to progress and PeerVault!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit session feedback' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const participantName = searchParams.get('name');

    if (!participantName) {
      return NextResponse.json({ success: true, feedbacks: GLOBAL_SESSION_FEEDBACKS });
    }

    const received = GLOBAL_SESSION_FEEDBACKS.filter(
      (f) => f.receiverName.toLowerCase() === participantName.toLowerCase()
    );
    const given = GLOBAL_SESSION_FEEDBACKS.filter(
      (f) => f.giverName.toLowerCase() === participantName.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      received,
      given,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch session feedbacks' }, { status: 500 });
  }
}
