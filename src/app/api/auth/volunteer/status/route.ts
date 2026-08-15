import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get('request_id');

  if (!requestId) {
    return NextResponse.json({ error: 'Missing request_id parameter' }, { status: 400 });
  }

  const loginReq = await db.loginRequest.findUnique({
    where: { id: requestId },
    include: { volunteer: true },
  });

  if (!loginReq) {
    return NextResponse.json({ error: 'Login request not found' }, { status: 404 });
  }

  // Check 10 min auto-expiration
  const isExpired = Date.now() - new Date(loginReq.requested_at).getTime() > 10 * 60 * 1000;
  if (loginReq.status === 'PENDING' && isExpired) {
    await db.loginRequest.update({
      where: { id: requestId },
      data: { status: 'EXPIRED' },
    });
    return NextResponse.json({ status: 'EXPIRED', message: 'Login request expired after 10 minutes.' });
  }

  if (loginReq.status === 'APPROVED') {
    const token = signToken({
      id: loginReq.volunteer.id,
      name: loginReq.volunteer.name,
      role: 'VOLUNTEER',
      college_email: loginReq.volunteer.college_email,
    });

    const response = NextResponse.json({
      status: 'APPROVED',
      user: { id: loginReq.volunteer.id, name: loginReq.volunteer.name, role: 'VOLUNTEER' },
    });

    response.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400,
    });

    return response;
  }

  return NextResponse.json({ status: loginReq.status });
}
