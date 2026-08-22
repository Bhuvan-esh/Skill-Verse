import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { sendAdminAccessRequestEmail, sendLoginSecurityEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, firebase_uid, usn, role = 'STUDENT', device, browser, ip } = body;

    if (!email) {
      return NextResponse.json({ error: 'Google email is required' }, { status: 400 });
    }

    // Check if user already exists
    let user = await db.user.findFirst({
      where: {
        OR: [
          { college_email: email },
          firebase_uid ? { firebase_uid } : undefined,
        ].filter(Boolean) as any,
      },
    });

    const isFirstTime = !user;

    if (!user) {
      // First-time signup: Layer 2 requires founder approval
      const isFounder = email.toLowerCase().includes('founder') || email.toLowerCase().includes('architect') || ['anushabhat2762@gmail.com', 'bhuvanj06@gmail.com'].includes(email.toLowerCase());
      const initialApproval = isFounder ? 'APPROVED' : 'PENDING';
      const initialRole = isFounder ? 'FOUNDER' : (role as any) || 'STUDENT';

      user = await db.user.create({
        data: {
          name: name || 'Student Member',
          college_email: email,
          firebase_uid: firebase_uid || `fb_${Date.now()}`,
          usn: usn || null,
          role: initialRole,
          approval_status: initialApproval,
          approval_requested_at: new Date(),
          approved_at: initialApproval === 'APPROVED' ? new Date() : null,
          last_login_at: new Date(),
          last_login_device: device,
          last_login_ip: ip,
        },
      });

      // Initialize credit record
      await db.studentCredit.upsert({
        where: { student_id: user.id },
        create: { student_id: user.id },
        update: {},
      });

      // Alert Founder about new access request
      if (initialApproval === 'PENDING') {
        const founder = await db.user.findFirst({ where: { role: 'FOUNDER' } });
        const founderEmail = founder?.college_email || 'founder@club.edu';

        sendAdminAccessRequestEmail({
          adminEmail: founderEmail,
          studentName: user.name,
          studentEmail: user.college_email,
          usn: user.usn,
          role: initialRole,
        }).catch((e) => console.error('[Admin Alert Error]:', e));
      }
    }

    // Layer 2: Approval Status Check
    if (user.approval_status === 'BLOCKED') {
      return NextResponse.json(
        { error: 'Your account has been blocked by the Student Club administrator.' },
        { status: 403 }
      );
    }

    // Record login timestamp and device metadata
    await db.user.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
        last_login_device: device || user.last_login_device,
        last_login_ip: ip || user.last_login_ip,
        firebase_uid: firebase_uid || user.firebase_uid,
      },
    });

    const token = signToken({
      id: user.id,
      name: user.name,
      role: user.role as any,
      usn: user.usn,
      college_email: user.college_email,
    });

    // Send login security email for students
    if (user.college_email) {
      sendLoginSecurityEmail({
        recipientEmail: user.college_email,
        studentName: user.name,
        device: device || 'Web Client',
        browser: browser || 'Chrome',
        ip: ip || '127.0.0.1',
      }).catch((e) => console.error('[Login Security Email Error]:', e));
    }

    const response = NextResponse.json({
      success: true,
      approval_status: user.approval_status,
      isFirstTime,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        usn: user.usn,
        college_email: user.college_email,
        approval_status: user.approval_status,
      },
      redirect: user.approval_status === 'APPROVED' ? '/horizon' : '/pending-approval',
    });

    response.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Google authentication failed' }, { status: 500 });
  }
}
