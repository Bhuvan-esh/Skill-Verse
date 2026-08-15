import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth(['VOLUNTEER', 'FOUNDER']);

    // Find all competitions with volunteer_access = OPEN
    const openCompetitions = await db.competition.findMany({
      where: { volunteer_access: 'OPEN' },
      select: { id: true },
    });

    const openCompIds = openCompetitions.map((c) => c.id);

    // If closed or no open competitions, volunteer sees blank list
    if (openCompIds.length === 0 && session.role === 'VOLUNTEER') {
      return NextResponse.json({ tasks: [], volunteer_access: 'CLOSED' });
    }

    const tasks = await db.task.findMany({
      where: {
        competition_id: { in: openCompIds },
        status: 'OPEN',
      },
      include: {
        competition: { select: { name: true, domain: true } },
      },
      orderBy: { competition_id: 'asc' },
    });

    return NextResponse.json({ tasks, volunteer_access: 'OPEN' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
