import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const filterYear = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : null;
    const filterStatus = searchParams.get('status') || undefined;

    const registrations = await db.skillLeagueRegistration.findMany({
      where: {
        event_id: params.id,
        year: filterYear || undefined,
        status: filterStatus,
      },
      orderBy: [{ year: 'asc' }, { student_name: 'asc' }],
      include: {
        team_memberships: {
          include: {
            team: {
              select: { id: true, team_name: true, status: true },
            },
          },
        },
      },
    });

    // Group by Year: 1st Year, 2nd Year, 3rd Year, 4th Year
    const yearWiseGroup: Record<number, typeof registrations> = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    for (const r of registrations) {
      const y = r.year in yearWiseGroup ? r.year : 1;
      yearWiseGroup[y].push(r);
    }

    const summary = {
      total: registrations.length,
      year1Count: yearWiseGroup[1].length,
      year2Count: yearWiseGroup[2].length,
      year3Count: yearWiseGroup[3].length,
      year4Count: yearWiseGroup[4].length,
    };

    return NextResponse.json({
      eventId: params.id,
      summary,
      yearWiseGroup,
      participants: registrations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch participants' }, { status: 500 });
  }
}
