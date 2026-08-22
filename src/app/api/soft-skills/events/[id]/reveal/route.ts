import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const actorId = session?.id || 'founder-system';
    const actorRole = session?.role || 'FOUNDER';

    const event = await db.skillLeagueEvent.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const revealTime = new Date();

    const updated = await db.skillLeagueEvent.update({
      where: { id: params.id },
      data: {
        challenge_revealed_at: revealTime,
        status: 'CHALLENGE_REVEALED',
      },
    });

    await createAuditLog({
      actorId,
      actorRole,
      action: 'CHALLENGE_REVEALED',
      entity: 'EVENT',
      entityId: params.id,
      newValue: {
        revealedChallengeType: event.internal_challenge_type,
        timestamp: revealTime,
      },
      reason: `Founder officially revealed secret challenge: ${event.internal_challenge_type}`,
    });

    return NextResponse.json({
      message: `🎉 Challenge Revealed! Today's Challenge: ${event.internal_challenge_type}`,
      revealedChallengeType: event.internal_challenge_type,
      revealedAt: revealTime,
      event: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Challenge reveal failed' }, { status: 500 });
  }
}
