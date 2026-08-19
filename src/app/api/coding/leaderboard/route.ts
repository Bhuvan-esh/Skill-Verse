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

    const formatted = entries.map((entry: any, index: number) => {
      const currentRank = index + 1;
      const rankDiff = entry.prev_rank - currentRank;
      return {
        ...entry,
        rank: currentRank,
        rankDiff,
        isCurrentUser: user ? entry.student_id === user.id : false,
      };
    });

    return NextResponse.json({
      leaderboard: formatted,
      currentUserId: user?.id,
    });
  } catch (error: any) {
    console.error("GET /api/coding/leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch coding leaderboard" }, { status: 500 });
  }
}
