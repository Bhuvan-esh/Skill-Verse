import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { sendLoginSecurityEmail, sendAdminAccessRequestEmail, getVAEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    const parts = idToken.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    const email = payload.email?.toLowerCase();
    const firebaseUid = payload.user_id || payload.sub;

    if (!email) {
      return NextResponse.json({ error: 'No email in token' }, { status: 400 });
    }

    const vaEmail = (process.env.VISUAL_ARCHITECT_EMAIL || 'b.11.08.bandana@gmail.com').toLowerCase().trim();
    const isVA = email === vaEmail;

    // Find or create user in Prisma DB
    let user = await db.user.findFirst({
      where: {
        OR: [{ college_email: email }, firebaseUid ? { firebase_uid: firebaseUid } : undefined].filter(
          Boolean
        ) as any,
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: payload.name || email.split('@')[0],
          college_email: email,
          firebase_uid: firebaseUid || `fb_${Date.now()}`,
          role: isVA ? 'FOUNDER' : 'STUDENT',
          approval_status: isVA ? 'APPROVED' : 'PENDING',
          approval_requested_at: new Date(),
          approved_at: isVA ? new Date() : null,
          last_login_at: new Date(),
        },
      });

      await db.studentCredit.upsert({
        where: { student_id: user.id },
        create: { student_id: user.id },
        update: {},
      });

      // If new applicant is pending approval, notify Visual Architect
      if (user.approval_status === 'PENDING') {
        sendAdminAccessRequestEmail({
          adminEmail: getVAEmail(),
          studentName: user.name,
          studentEmail: user.college_email,
          usn: user.usn,
          role: user.role,
        }).catch((e) => console.error('[Admin Alert Error]:', e));
      }
    } else {
      if (isVA && (user.role !== 'FOUNDER' || user.approval_status !== 'APPROVED')) {
        user = await db.user.update({
          where: { id: user.id },
          data: {
            role: 'FOUNDER',
            approval_status: 'APPROVED',
            approved_at: new Date(),
            last_login_at: new Date(),
            firebase_uid: firebaseUid || user.firebase_uid,
          },
        });
      } else {
        user = await db.user.update({
          where: { id: user.id },
          data: {
            last_login_at: new Date(),
            firebase_uid: firebaseUid || user.firebase_uid,
          },
        });
      }
    }

    // Send login security email: "New Sign-In to Student Club. If this was not you, verify/secure your account"
    if (user.college_email) {
      const userAgent = req.headers.get('user-agent') || 'Web Browser';
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';

      sendLoginSecurityEmail({
        recipientEmail: user.college_email,
        studentName: user.name,
        device: userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Computer',
        browser: userAgent.includes('Chrome')
          ? 'Google Chrome'
          : userAgent.includes('Safari')
          ? 'Safari'
          : userAgent.includes('Firefox')
          ? 'Firefox'
          : 'Web Browser',
        ip,
      }).catch((e) => console.error('[Login Security Email Error]:', e));
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      role: user.role as any,
      usn: user.usn,
      college_email: user.college_email,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        approval_status: user.approval_status,
      },
    });

    res.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400,
    });

    return res;
  } catch (e: any) {
    console.error('[Firebase Session Sync Error]:', e);
    return NextResponse.json({ error: e.message || 'Session sync failed' }, { status: 500 });
  }
}
