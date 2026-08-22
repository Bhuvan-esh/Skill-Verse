import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { registerForClubEvent } from '@/lib/club-events';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const studentId = session?.id || body.studentId;
    const { eventId } = body;

    if (!eventId || !studentId) {
      return NextResponse.json({ error: 'eventId and studentId required' }, { status: 400 });
    }

    const result = await registerForClubEvent(eventId, studentId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
