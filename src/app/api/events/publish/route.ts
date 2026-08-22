import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { publishClubEvent } from '@/lib/club-events';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const founderId = session?.id || 'founder-system';
    const founderName = session?.name || 'Visual Architect';

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    const result = await publishClubEvent(eventId, founderId, founderName);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to publish event' }, { status: 500 });
  }
}
