import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { verifyPassword, signToken } from '@/lib/auth';

const FounderLoginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = FounderLoginSchema.parse(body);

    const user = await db.user.findUnique({ where: { college_email: email } });
    if (!user || user.role !== 'FOUNDER' || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid founder credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid founder credentials.' }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      role: 'FOUNDER',
      college_email: user.college_email,
    });

    const response = NextResponse.json({
      message: 'Founder login successful.',
      user: { id: user.id, name: user.name, role: 'FOUNDER' },
    });

    response.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Founder login failed' }, { status: 400 });
  }
}
