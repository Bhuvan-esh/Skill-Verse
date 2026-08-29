import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const queryId = params.id;
    const body = await req.json().catch(() => ({}));
    const { action } = body; // 'ACCEPT' | 'DECLINE'

    const isDecline = action === 'DECLINE';
    const status = isDecline ? 'DECLINED' : 'ACCEPTED';
    const sessionId = isDecline ? undefined : `s-${Date.now()}`;

    return NextResponse.json({
      success: true,
      query_id: queryId,
      status,
      session_id: sessionId,
      message: isDecline
        ? '✓ Video query request declined.'
        : '✓ Video query request accepted! 1:1 barter session is now active and communication is unlocked.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process query acceptance' }, { status: 500 });
  }
}
