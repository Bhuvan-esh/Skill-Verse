import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createClubEvent } from '@/lib/club-events';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    const status = searchParams.get('status');

    const events = await db.clubEvent.findMany({
      where: {
        domain: domain ? (domain.toUpperCase() as any) : undefined,
        status: status ? (status.toUpperCase() as any) : undefined,
      },
      include: {
        _count: {
          select: {
            registrations: true,
            volunteers: true,
          },
        },
      },
      orderBy: { event_date: 'asc' },
    });

    return NextResponse.json({ success: true, count: events.length, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const createdBy = session?.id || 'founder-system';

    const body = await req.json();
    const event = await createClubEvent({
      ...body,
      createdBy,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 400 });
  }
}
