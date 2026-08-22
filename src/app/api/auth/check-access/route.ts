import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, usn, firebase_uid } = await req.json();

    if (!email && !usn && !firebase_uid) {
      return NextResponse.json({ error: 'Email, USN, or Firebase UID required' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          email ? { college_email: email } : undefined,
          usn ? { usn: usn.toUpperCase() } : undefined,
          firebase_uid ? { firebase_uid } : undefined,
        ].filter(Boolean) as any,
      },
      select: {
        id: true,
        name: true,
        role: true,
        usn: true,
        college_email: true,
        approval_status: true,
        approval_requested_at: true,
        approved_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        approval_status: 'UNKNOWN',
        message: 'Account not found in system.',
      });
    }

    return NextResponse.json({
      exists: true,
      approval_status: user.approval_status,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Check access failed' }, { status: 500 });
  }
}
