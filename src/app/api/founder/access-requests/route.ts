import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const pendingRequests = await db.user.findMany({
      where: { approval_status: 'PENDING' },
      select: {
        id: true,
        name: true,
        college_email: true,
        usn: true,
        role: true,
        approval_status: true,
        approval_requested_at: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch access requests' }, { status: 500 });
  }
}
