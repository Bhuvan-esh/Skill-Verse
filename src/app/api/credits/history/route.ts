import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStudentCreditProfile, getVerifiedClubLeaderboard } from '@/lib/credit-engine';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || session?.id;

    if (searchParams.get('leaderboard') === 'true') {
      const leaderboard = await getVerifiedClubLeaderboard();
      return NextResponse.json({ success: true, leaderboard });
    }

    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }

    const profile = await getStudentCreditProfile(studentId);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch credit history' }, { status: 500 });
  }
}
