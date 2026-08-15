import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth';

const VolunteerRequestSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = VolunteerRequestSchema.parse(body);

    const user = await db.user.findUnique({ where: { college_email: email } });
    if (!user || user.role !== 'VOLUNTEER' || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid volunteer credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid volunteer credentials.' }, { status: 401 });
    }

    // Auto-expire older untouched requests (> 10 mins old)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    await db.loginRequest.updateMany({
      where: {
        volunteer_id: user.id,
        status: 'PENDING',
        requested_at: { lt: tenMinsAgo },
      },
      data: { status: 'EXPIRED' },
    });

    // Create a new pending login request
    const loginReq = await db.loginRequest.create({
      data: {
        volunteer_id: user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Volunteer credentials verified. Pending founder approval.',
      request_id: loginReq.id,
      volunteer_name: user.name,
      status: 'PENDING',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login request failed' }, { status: 400 });
  }
}
