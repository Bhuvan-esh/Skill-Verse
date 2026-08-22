import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';
import { seedDefaultTwistsIfNeeded } from '@/lib/soft-skills/twistService';
import { seedDefaultAchievementsIfNeeded } from '@/lib/soft-skills/achievementService';

export async function GET(req: NextRequest) {
  try {
    await seedDefaultTwistsIfNeeded();
    await seedDefaultAchievementsIfNeeded();

    const session = await getSession();
    const isPrivileged = session && (session.role === 'FOUNDER' || (session as any).role === 'ADMIN' || (session as any).role === 'JUDGE');

    const events = await db.skillLeagueEvent.findMany({
      orderBy: { event_date: 'asc' },
      include: {
        _count: {
          select: {
            registrations: true,
            teams: true,
            rounds: true,
          },
        },
      },
    });

    // Mask internal_challenge_type if unrevealed and caller is not Founder/Judge/Admin
    const sanitizedEvents = events.map((ev) => {
      const isRevealed = !!ev.challenge_revealed_at;
      return {
        id: ev.id,
        public_event_name: ev.public_event_name,
        // Mystery Rule: student must not see the actual challenge before official reveal
        internal_challenge_type: (isPrivileged || isRevealed) ? ev.internal_challenge_type : 'MYSTERY_CHALLENGE (Hidden until Event Day)',
        actual_challenge_revealed: isRevealed,
        challenge_revealed_at: ev.challenge_revealed_at,
        description: ev.description,
        registration_open_time: ev.registration_open_time,
        registration_close_time: ev.registration_close_time,
        event_date: ev.event_date,
        event_location: ev.event_location,
        participant_limit: ev.participant_limit,
        team_based: ev.team_based,
        team_size: ev.team_size,
        credits_reward: ev.credits_reward,
        status: ev.status,
        registration_count: ev._count.registrations,
        team_count: ev._count.teams,
        round_count: ev._count.rounds,
        created_at: ev.created_at,
      };
    });

    return NextResponse.json({ events: sanitizedEvents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const actorId = session?.id || 'founder-system';
    const actorRole = session?.role || 'FOUNDER';

    const body = await req.json();
    const {
      public_event_name,
      internal_challenge_type,
      description,
      registration_open_time,
      registration_close_time,
      event_date,
      event_location,
      participant_limit,
      team_based,
      team_size,
      credits_reward,
      status,
    } = body;

    if (!public_event_name || !internal_challenge_type || !description) {
      return NextResponse.json({ error: 'Missing required event parameters' }, { status: 400 });
    }

    const newEvent = await db.skillLeagueEvent.create({
      data: {
        public_event_name,
        internal_challenge_type: internal_challenge_type.toUpperCase(),
        description,
        registration_open_time: registration_open_time ? new Date(registration_open_time) : new Date(),
        registration_close_time: registration_close_time ? new Date(registration_close_time) : new Date(Date.now() + 86400000 * 3),
        event_date: event_date ? new Date(event_date) : new Date(Date.now() + 86400000 * 5),
        event_location: event_location || 'Main Digital Arena',
        participant_limit: participant_limit || 100,
        team_based: team_based !== undefined ? team_based : true,
        team_size: team_size || 4,
        credits_reward: credits_reward || 50,
        status: status || 'REGISTRATION_OPEN',
        created_by: actorId,
      },
    });

    await createAuditLog({
      actorId,
      actorRole,
      action: 'EVENT_CREATED',
      entity: 'EVENT',
      entityId: newEvent.id,
      newValue: {
        public_event_name,
        internal_challenge_type,
        status: newEvent.status,
      },
      reason: 'Founder created new Skill League Mystery Event',
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
  }
}
