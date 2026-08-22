import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { signToken } from '@/lib/auth';

const VerifyOTPSchema = z.object({
  usn: z.string().min(3).transform((v) => v.trim().toUpperCase()),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usn, code } = VerifyOTPSchema.parse(body);

    // 1. Find active unverified OTP
    const otp = await db.oTP.findFirst({
      where: {
        usn,
        code,
        verified: false,
        expires_at: { gte: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!otp) {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    // Mark OTP as verified
    await db.oTP.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // 2. Fetch or create Student user
    const preloaded = await db.preloadedUSN.findUnique({ where: { usn } });
    if (!preloaded) {
      return NextResponse.json({ error: 'USN not found in preloaded whitelist.' }, { status: 400 });
    }

    let user = await db.user.findUnique({ where: { college_email: preloaded.college_email } });

    if (!user) {
      user = await db.user.create({
        data: {
          name: preloaded.student_name,
          role: 'STUDENT',
          usn: preloaded.usn,
          college_email: preloaded.college_email,
          is_preloaded: true,
        },
      });

      // Initialize Student Credit record & Mentor Profile
      await db.studentCredit.upsert({
        where: { student_id: user.id },
        create: { student_id: user.id },
        update: {},
      });

      await db.mentorProfile.create({
        data: { student_id: user.id, domain: 'DOMAIN_1' },
      });

      // Create private Idea Channel
      await db.ideaChannel.create({
        data: { student_id: user.id },
      });

      // Mark USN used
      await db.preloadedUSN.update({
        where: { usn },
        data: { used: true },
      });
    }

    // Check blocked status
    if (user.approval_status === 'BLOCKED') {
      return NextResponse.json(
        { error: 'Your account has been blocked by the administrator.' },
        { status: 403 }
      );
    }

    // Record login timestamp
    await db.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // 3. Issue Session JWT Token & Cookie
    const token = signToken({
      id: user.id,
      name: user.name,
      role: 'STUDENT',
      usn: user.usn,
      college_email: user.college_email,
    });

    // Send login security email for approved students
    if (user.approval_status === 'APPROVED' && user.college_email) {
      const { sendLoginSecurityEmail } = await import('@/lib/email-service');
      sendLoginSecurityEmail({
        recipientEmail: user.college_email,
        studentName: user.name,
      }).catch((e) => console.error('[Login Security Email Error]:', e));
    }

    const response = NextResponse.json({
      message: 'Student login successful.',
      approval_status: user.approval_status,
      user: {
        id: user.id,
        name: user.name,
        role: 'STUDENT',
        usn: user.usn,
        college_email: user.college_email,
        approval_status: user.approval_status,
      },
    });

    response.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 400 });
  }
}
