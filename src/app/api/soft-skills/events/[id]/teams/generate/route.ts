import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateMixedYearTeams } from '@/lib/soft-skills/teamFormationService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const actorId = session?.id || 'founder-system';
    const actorRole = session?.role || 'FOUNDER';

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
