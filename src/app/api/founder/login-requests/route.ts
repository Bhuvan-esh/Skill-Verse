import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['FOUNDER']);

    // Auto-expire requests older than 10 mins
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    await db.loginRequest.updateMany({
      where: { status: 'PENDING', requested_at: { lt: tenMinsAgo } },
      data: { status: 'EXPIRED' },
    });

    const requests = await db.loginRequest.findMany({
      include: { volunteer: { select: { id: true, name: true, college_email: true } } },
      orderBy: { requested_at: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
