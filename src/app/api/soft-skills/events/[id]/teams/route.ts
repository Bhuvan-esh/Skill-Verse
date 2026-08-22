import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teams = await db.skillLeagueTeam.findMany({
      where: { event_id: params.id },
      orderBy: { team_number: 'asc' },
      include: {
        members: {
          include: { registration: true },
        },
      },
    });

    const enrichedTeams = teams.map((t) => {
      const yearDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      for (const m of t.members) {
        yearDist[m.year] = (yearDist[m.year] || 0) + 1;
      }
      return {
        ...t,
        yearDistribution: yearDist,
      };
    });

    return NextResponse.json({ teams: enrichedTeams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch teams' }, { status: 500 });
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
    const action = body.action || 'APPROVE'; // APPROVE, LOCK

    if (action === 'APPROVE') {
      // Founder approves AI-generated teams
      await db.skillLeagueTeam.updateMany({
        where: { event_id: params.id },
        data: {
          status: 'FOUNDER_APPROVED',
          approved_by: actorId,
          approved_at: new Date(),
        },
      });

      await db.skillLeagueEvent.update({
        where: { id: params.id },
        data: { status: 'TEAMS_APPROVED' },
      });

      await createAuditLog({
        actorId,
        actorRole,
        action: 'TEAMS_APPROVED',
        entity: 'EVENT',
        entityId: params.id,
        newValue: { status: 'TEAMS_APPROVED' },
        reason: 'Founder officially approved AI-generated mixed-year squads.',
      });

      return NextResponse.json({
        message: 'Teams successfully approved by Founder. Status updated to FOUNDER_APPROVED.',
      });
    } else if (action === 'LOCK') {
      await db.skillLeagueTeam.updateMany({
        where: { event_id: params.id },
        data: { status: 'LOCKED' },
      });

      await createAuditLog({
        actorId,
        actorRole,
        action: 'TEAMS_LOCKED',
        entity: 'EVENT',
        entityId: params.id,
        newValue: { status: 'LOCKED' },
        reason: 'Teams locked before competition start.',
      });

      return NextResponse.json({
        message: 'Teams successfully locked for competition.',
      });
    }

    return NextResponse.json({ error: 'Invalid team action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update teams' }, { status: 500 });
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
    const { action, memberId, fromTeamId, toTeamId, newTeamName } = body;

    if (action === 'MOVE_MEMBER') {
      if (!memberId || !toTeamId) {
        return NextResponse.json({ error: 'Missing memberId or toTeamId' }, { status: 400 });
      }

      const member = await db.skillLeagueTeamMember.findUnique({
        where: { id: memberId },
      });

      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      await db.skillLeagueTeamMember.update({
        where: { id: memberId },
        data: { team_id: toTeamId },
      });

      await createAuditLog({
        actorId,
        actorRole,
        action: 'TEAM_MEMBER_MOVED',
        entity: 'TEAM_MEMBER',
        entityId: memberId,
        oldValue: { teamId: fromTeamId },
        newValue: { teamId: toTeamId },
        reason: 'Founder manually adjusted team roster',
      });

      return NextResponse.json({ message: 'Team member successfully moved' });
    }

    if (action === 'CREATE_TEAM') {
      const count = await db.skillLeagueTeam.count({ where: { event_id: params.id } });
      const created = await db.skillLeagueTeam.create({
        data: {
          event_id: params.id,
          team_name: newTeamName || `Team #${count + 1}`,
          team_number: count + 1,
          status: 'DRAFT',
          generation_reasoning: 'Manually configured by Founder',
        },
      });

      return NextResponse.json({ team: created }, { status: 201 });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to edit teams' }, { status: 500 });
  }
}
