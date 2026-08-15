import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();

    const notifications = await db.notification.findMany({
      where: { user_id: session.id },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    const unreadCount = await db.notification.count({
      where: { user_id: session.id, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
