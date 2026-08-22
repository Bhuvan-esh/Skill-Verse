import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const achievements = await db.skillLeagueStudentAchievement.findMany({
      where: { student_id: params.studentId },
      orderBy: { awarded_at: 'desc' },
      include: {
        achievement: true,
      },
    });

    return NextResponse.json({
      studentId: params.studentId,
      achievementCount: achievements.length,
      achievements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch student achievements' }, { status: 500 });
  }
}
