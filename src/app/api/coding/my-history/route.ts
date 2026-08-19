import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const registrations = await db.codingEventRegistration.findMany({
      where: { student_id: user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            event_date: true,
            credits_reward: true,
            status: true,
          },
        },
        team: {
          include: {
            members: {
              include: {
                student: { select: { name: true, usn: true } },
              },
            },
          },
        },
      },
      orderBy: { registered_at: 'desc' },
    });

    const submissions = await db.codingSubmission.findMany({
      where: { student_id: user.id },
      include: {
        event: { select: { title: true } },
        challenge: { select: { title: true, points: true } },
      },
      orderBy: { submitted_at: 'desc' },
    });

    const creditTransactions = await db.codingCreditTransaction.findMany({
      where: { student_id: user.id },
      orderBy: { timestamp: 'desc' },
    });

    const leaderboardEntry = await db.codingLeaderboard.findUnique({
      where: { student_id: user.id },
    });

    return NextResponse.json({
      registrations,
      submissions,
      creditTransactions,
      leaderboardEntry,
    });
  } catch (error: any) {
    console.error("GET /api/coding/my-history error:", error);
    return NextResponse.json({ error: "Failed to fetch student coding history" }, { status: 500 });
  }
}
