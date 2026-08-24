import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, usn, firebase_uid, simulate_approval, action } = body;

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
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        approval_status: 'UNKNOWN',
        message: 'Account not found in system.',
      });
    }

    // Allow demo/test approval simulation
    if (action === 'approve_demo' || simulate_approval === true) {
      const updated = await db.user.update({
        where: { id: user.id },
        data: {
          approval_status: 'APPROVED',
          approved_at: new Date(),
          approved_by: 'Visual Architect (Simulated)',
        },
      });
      return NextResponse.json({
        exists: true,
        approval_status: updated.approval_status,
        user: updated,
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
