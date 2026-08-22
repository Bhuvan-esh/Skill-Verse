import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const isPrivileged = session && (session.role === 'FOUNDER' || (session as any).role === 'ADMIN' || (session as any).role === 'JUDGE');

    const event = await db.skillLeagueEvent.findUnique({
      where: { id: params.id },
      include: {
        registrations: true,
        teams: {
          include: { members: true },
        },
        rounds: true,
        event_twists: {
          include: { twist: true },
        },
        results: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const isRevealed = !!event.challenge_revealed_at;

    const sanitizedEvent = {
      ...event,
      internal_challenge_type: (isPrivileged || isRevealed) ? event.internal_challenge_type : 'MYSTERY_CHALLENGE (Hidden until Event Day)',
      actual_challenge_revealed: isRevealed,
      // Filter unrevealed twists for non-privileged viewers
      event_twists: event.event_twists.map((et) => {
        if (!isPrivileged && !et.is_revealed) {
          return {
            id: et.id,
            round_number: et.round_number,
            is_revealed: false,
            twist: {
              title: '🔒 Secret Round Twist (Unrevealed)',
              description: 'Will be activated live by judges during the round.',
              category: 'SECRET',
            },
          };
        }
        return et;
      }),
    };

    return NextResponse.json({ event: sanitizedEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const actorId = session?.id || 'founder-system';
    const actorRole = session?.role || 'FOUNDER';

    const body = await req.json();
    const existing = await db.skillLeagueEvent.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const updated = await db.skillLeagueEvent.update({
      where: { id: params.id },
      data: {
        public_event_name: body.public_event_name ?? existing.public_event_name,
        description: body.description ?? existing.description,
        event_location: body.event_location ?? existing.event_location,
        participant_limit: body.participant_limit ?? existing.participant_limit,
        status: body.status ?? existing.status,
        team_size: body.team_size ?? existing.team_size,
        credits_reward: body.credits_reward ?? existing.credits_reward,
      },
    });

    await createAuditLog({
      actorId,
      actorRole,
      action: 'EVENT_UPDATED',
      entity: 'EVENT',
      entityId: params.id,
      oldValue: { status: existing.status },
      newValue: { status: updated.status },
      reason: body.reason || 'Founder updated event configuration',
    });

    return NextResponse.json({ event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
  }
}
