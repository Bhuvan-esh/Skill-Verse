import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateMixedYearTeams } from '@/lib/soft-skills/teamFormationService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // AI team generation is a Visual Architect (FOUNDER) privilege only
    const session = await requireAuth(['FOUNDER']);
    const actorId = session.id;
    const actorRole = session.role;

    let customTeamSize: number | undefined = undefined;
    try {
      const body = await req.json();
      if (body.team_size) customTeamSize = parseInt(body.team_size, 10);
    } catch (_) {}

    const result = await generateMixedYearTeams(params.id, actorId, actorRole, customTeamSize);

    return NextResponse.json({
      message: 'AI Mixed-Year Teams successfully generated (Status: AI_GENERATED, Awaiting Founder Approval)',
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Team generation failed' }, { status: 500 });
  }
}
