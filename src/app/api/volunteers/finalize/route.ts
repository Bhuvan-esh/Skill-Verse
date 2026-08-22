import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { finalizeVolunteerList } from '@/lib/club-volunteers';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const founderId = session?.id || 'founder-system';
    const founderName = session?.name || 'Visual Architect';

    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ error: 'eventId required' }, { status: 400 });
    }

    const result = await finalizeVolunteerList(eventId, founderId, founderName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to finalize volunteer list' }, { status: 500 });
  }
}
