import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || 'OVERALL';

    const cacheKey = `leaderboard_${domain}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return NextResponse.json({ leaderboard: cachedData, cached: true });
    }

    const creditsList = await db.studentCredit.findMany({
      include: {
        student: { select: { id: true, name: true, usn: true } },
      },
    });

    let leaderboard = creditsList.map((c) => {
      const total = c.domain_1 + c.domain_2 + c.domain_3 + c.domain_4;
      return {
        student_id: c.student_id,
        name: c.student.name,
        usn: c.student.usn,
        domain_1: c.domain_1,
        domain_2: c.domain_2,
        domain_3: c.domain_3,
        domain_4: c.domain_4,
        total,
        score:
          domain === 'DOMAIN_1'
            ? c.domain_1
            : domain === 'DOMAIN_2'
            ? c.domain_2
            : domain === 'DOMAIN_3'
            ? c.domain_3
            : domain === 'DOMAIN_4'
            ? c.domain_4
            : total,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    // Assign rank
    leaderboard = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    setCached(cacheKey, leaderboard, 300); // 5 min cache TTL

    return NextResponse.json({ leaderboard, cached: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
