import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();

    let entries = await db.codingLeaderboard.findMany({
      orderBy: { points: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            usn: true,
            college_email: true,
          },
        },
      },
    });

    if (entries.length === 0) {
      const students = await db.user.findMany({
        where: { role: 'STUDENT' },
        take: 5,
      });

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        await db.codingLeaderboard.create({
          data: {
            student_id: s.id,
            points: (5 - i) * 250 + 100,
            rank: i + 1,
            prev_rank: i + 1,
            wins: 5 - i,
            competitions_count: (5 - i) + 2,
            credits: (5 - i) * 125,
          },
        });
      }

      entries = await db.codingLeaderboard.findMany({
        orderBy: { points: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              usn: true,
              college_email: true,
            },
          },
        },
      });
    }

    const SEED_SPRINT_DATA = [
      { name: 'Alex Johnson', usn: '1RV23CS001', s1: 45, s2: 38, s3: 50, s4: 60, total: 193 },
      { name: 'Rahul Sharma', usn: '1RV23CS042', s1: 40, s2: 35, s3: 45, s4: 55, total: 175 },
      { name: 'Meera K', usn: '1RV23AI018', s1: 38, s2: 42, s3: 40, s4: 50, total: 170 },
      { name: 'Sanjay V', usn: '1RV23IS089', s1: 30, s2: 30, s3: 35, s4: 45, total: 140 },
      { name: 'Priya S', usn: '1RV23AI055', s1: 25, s2: 32, s3: 38, s4: 40, total: 135 },
    ];

    const formatted = entries.map((entry: any, index: number) => {
      const currentRank = index + 1;
      const rankDiff = (entry.prev_rank || currentRank) - currentRank;
      const seed = SEED_SPRINT_DATA[index] || {
        s1: Math.max(10, Math.round(entry.points * 0.22)),
        s2: Math.max(10, Math.round(entry.points * 0.2)),
        s3: Math.max(15, Math.round(entry.points * 0.26)),
        s4: Math.max(20, Math.round(entry.points * 0.32)),
        total: entry.points || 100,
      };

      return {
        ...entry,
        rank: currentRank,
        name: entry.student?.name || seed.name,
        usn: entry.student?.usn || seed.usn,
        s1: seed.s1,
        s2: seed.s2,
        s3: seed.s3,
        s4: seed.s4,
        total: seed.total || entry.points,
        rankDiff,
        isCurrentUser: user ? entry.student_id === user.id : false,
      };
    });

    const myEntry = formatted.find((f: any) => f.isCurrentUser) || formatted[0] || {
      rank: 1,
      name: user?.name || 'Alex Johnson',
      usn: user?.usn || '1RV23CS001',
      s1: 45,
      s2: 38,
      s3: 50,
      s4: 60,
      total: 193,
    };

    const codingMetrics = {
      problemsSolved: 18,
      testCasesPassed: 142,
      sprintsAttended: 12,
      codeReviews: 5,
    };

    return NextResponse.json({
      leaderboard: formatted.length > 0 ? formatted : SEED_SPRINT_DATA.map((d, i) => ({ ...d, rank: i + 1, isCurrentUser: i === 0 })),
      userScorecard: {
        rank: myEntry.rank,
        s1: myEntry.s1,
        s2: myEntry.s2,
        s3: myEntry.s3,
        s4: myEntry.s4,
        total: myEntry.total,
        credits: myEntry.total,
      },
      codingMetrics,
      currentUserId: user?.id,
    });
  } catch (error: any) {
    console.error("GET /api/coding/leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch coding leaderboard" }, { status: 500 });
  }
}
