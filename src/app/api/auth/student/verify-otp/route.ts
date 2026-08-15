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
      await db.studentCredit.create({
        data: { student_id: user.id },
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

    // 3. Issue Session JWT Token & Cookie
    const token = signToken({
      id: user.id,
      name: user.name,
      role: 'STUDENT',
      usn: user.usn,
      college_email: user.college_email,
    });

    const response = NextResponse.json({
      message: 'Student login successful.',
      user: { id: user.id, name: user.name, role: 'STUDENT', usn: user.usn },
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
