import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    let targetRole: 'STUDENT' | 'VOLUNTEER' | 'FOUNDER' = 'STUDENT';
    let defaultEmail = 'participant@club.edu';
    let defaultName = 'Student Participant';

    const normalizedRole = (role || '').toLowerCase();

    if (normalizedRole.includes('founder') || normalizedRole.includes('visual')) {
      targetRole = 'FOUNDER';
      defaultEmail = 'architect@club.edu';
      defaultName = 'Visual Architect';
    } else if (normalizedRole.includes('architect') || normalizedRole.includes('ambassador')) {
      targetRole = 'VOLUNTEER';
      defaultEmail = 'ambassador@club.edu';
      defaultName = 'Community Ambassador';
    } else if (normalizedRole.includes('mentor')) {
      targetRole = 'VOLUNTEER';
      defaultEmail = 'mentor@club.edu';
      defaultName = 'Club Mentor';
    } else if (normalizedRole.includes('participant') || normalizedRole.includes('student')) {
      targetRole = 'STUDENT';
      defaultEmail = 'participant@club.edu';
      defaultName = 'Student Participant';
    } else {
      targetRole = 'STUDENT';
      defaultEmail = 'participant@club.edu';
      defaultName = 'Student Participant';
    }

    // Find or create default user in database
    let user = await db.user.findUnique({
      where: { college_email: defaultEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: defaultName,
          college_email: defaultEmail,
          role: targetRole,
          usn: targetRole === 'STUDENT' ? '1RV23CS001' : null,
        },
      });
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      role: targetRole,
      usn: user.usn,
      college_email: user.college_email,
    });

    const response = NextResponse.json({
      message: `Access granted as ${targetRole}`,
      user: {
        id: user.id,
        name: user.name,
        role: targetRole,
        college_email: user.college_email,
      },
    });

    response.cookies.set('hub_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to select role' }, { status: 400 });
  }
}
