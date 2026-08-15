import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { emailQueue } from '@/lib/queue';

const RequestOTPSchema = z.object({
  usn: z.string().min(3).transform((v) => v.trim().toUpperCase()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usn } = RequestOTPSchema.parse(body);

    // 1. Check if USN exists in Preloaded USN Whitelist
    const preloaded = await db.preloadedUSN.findUnique({
      where: { usn },
    });

    if (!preloaded) {
      return NextResponse.json(
        { error: 'USN not registered in club whitelist. Contact Founders.' },
        { status: 400 }
      );
    }

    // 2. Anti-brute force rate limiting (max 5 requests per 10 mins)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await db.oTP.count({
      where: {
        usn,
        created_at: { gte: tenMinsAgo },
      },
    });

    if (recentOtps >= 5) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 10 minutes.' },
        { status: 429 }
      );
    }

    // 3. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiration

    await db.oTP.create({
      data: {
        usn,
        college_email: preloaded.college_email,
        code,
        expires_at: expiresAt,
      },
    });

    // 4. Enqueue email notification
    emailQueue.enqueue({
      to: preloaded.college_email,
      subject: 'Your Club Idea Hub Verification Code',
      html: `<p>Hello ${preloaded.student_name},</p><p>Your 6-digit login verification code is: <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
      type: 'REGISTRATION',
    });

    return NextResponse.json({
      message: 'OTP sent to college email on file.',
      email: preloaded.college_email,
      // For development ease, include code in response
      dev_otp: code,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
