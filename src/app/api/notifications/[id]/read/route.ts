import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const notifId = params.id;

    await db.notification.updateMany({
      where: { id: notifId, user_id: session.id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notification marked as read.' });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
