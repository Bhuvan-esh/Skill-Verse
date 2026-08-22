import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rounds = await db.skillLeagueRound.findMany({
      where: { event_id: params.id },
      orderBy: { round_number: 'asc' },
      include: {
        scores: true,
      },
    });

    return NextResponse.json({ rounds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch rounds' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const actorId = session?.id || 'founder-system';
    const actorRole = session?.role || 'FOUNDER';

    const body = await req.json();
    const { round_number, round_name, challenge_type, time_limit, rules, twist_description, status } = body;

    const round = await db.skillLeagueRound.create({
      data: {
        event_id: params.id,
        round_number: round_number || 1,
        round_name: round_name || `Round ${round_number || 1}`,
        challenge_type: challenge_type || 'DEBATE_BATTLE',
        time_limit: time_limit || 60,
        rules: rules || 'Standard stage guidelines apply.',
        twist_description: twist_description || null,
        status: status || 'LIVE',
        start_time: new Date(),
      },
    });

    await db.skillLeagueEvent.update({
      where: { id: params.id },
      data: { status: 'IN_PROGRESS' },
    });

    await createAuditLog({
      actorId,
      actorRole,
      action: 'ROUND_CREATED',
      entity: 'ROUND',
      entityId: round.id,
      newValue: { roundName: round.round_name, challengeType: round.challenge_type },
      reason: `Launched ${round.round_name} for event ${params.id}`,
    });

    return NextResponse.json({ round }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create round' }, { status: 500 });
  }
}
