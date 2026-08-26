import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, verifyPassword, hashPassword } from '@/lib/auth';
import { sendAdminAccessRequestEmail, sendLoginSecurityEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, email: inputEmail, name: inputName, usn: inputUsn, firebase_uid, password: inputPassword } = body;

    // ─── Role normalisation ──────────────────────────────────────────────────
    // DB role field: STUDENT | VOLUNTEER | MENTOR | FOUNDER
    // "MENTOR" is now its own distinct role, not conflated with VOLUNTEER.
    type DBRole = 'STUDENT' | 'VOLUNTEER' | 'MENTOR' | 'FOUNDER';
    let targetRole: DBRole = 'STUDENT';
    let defaultEmail = inputEmail || 'participant@club.edu';
    let defaultName  = inputName ? inputName.trim() : '';

    const normalizedRole = (role || '').toLowerCase();
    const isDefaultArchitectEmail = ['b.11.08.bandana@gmail.com'].includes((defaultEmail || '').toLowerCase());

    if (normalizedRole.includes('founder') || normalizedRole.includes('visual')) {
      if (!isDefaultArchitectEmail) {
        return NextResponse.json(
          { error: 'Visual Architect access is restricted. Only b.11.08.bandana@gmail.com can sign in under Visual Architects.' },
          { status: 403 }
        );
      }
      targetRole   = 'FOUNDER';
      defaultEmail = inputEmail || 'b.11.08.bandana@gmail.com';
      defaultName  = inputName ? inputName.trim() : '';
    } else if (isDefaultArchitectEmail) {
      targetRole   = 'FOUNDER';
      defaultEmail = inputEmail || 'b.11.08.bandana@gmail.com';
      defaultName  = inputName ? inputName.trim() : '';
    } else if (normalizedRole.includes('architect') || normalizedRole.includes('ambassador')) {
      targetRole   = 'VOLUNTEER';
      defaultEmail = inputEmail || 'ambassador@club.edu';
      defaultName  = inputName ? inputName.trim() : '';
    } else if (normalizedRole.includes('mentor')) {
      targetRole   = 'MENTOR';
      defaultEmail = inputEmail || 'mentor@club.edu';
      defaultName  = inputName ? inputName.trim() : '';
    } else {
      targetRole   = 'STUDENT';
      defaultEmail = inputEmail || 'participant@club.edu';
      defaultName  = inputName ? inputName.trim() : '';
    }

    // ─── Find or create user ─────────────────────────────────────────────────
    let user = await db.user.findUnique({
      where: { college_email: defaultEmail },
    });

    const isFirstTime = !user;

    if (user && user.password_hash && inputPassword) {
      const isValid = await verifyPassword(inputPassword, user.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: 'Incorrect password for this account.' }, { status: 401 });
      }
    }

    if (user && isDefaultArchitectEmail && (user.role !== 'FOUNDER' || user.approval_status !== 'APPROVED')) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          role: 'FOUNDER',
          approval_status: 'APPROVED',
          approved_at: new Date(),
        },
      });
    }

    if (!user) {
      // First-time signup: FOUNDER (and default architect) is auto-approved; everyone else starts PENDING
      const initialApproval = (targetRole === 'FOUNDER' || isDefaultArchitectEmail) ? 'APPROVED' : 'PENDING';
      const passwordHash = inputPassword ? await hashPassword(inputPassword) : null;

      user = await db.user.create({
        data: {
          name: defaultName,
          college_email: defaultEmail,
          firebase_uid: firebase_uid || null,
          role: targetRole,
          usn: inputUsn || null,
          password_hash: passwordHash,
          approval_status: initialApproval,
          approval_requested_at: new Date(),
          approved_at: initialApproval === 'APPROVED' ? new Date() : null,
          last_login_at: new Date(),
        },
      });


      await db.studentCredit.upsert({
        where: { student_id: user.id },
        create: { student_id: user.id },
        update: {},
      });

      if (initialApproval === 'PENDING') {
        const founders = await db.user.findMany({ where: { role: 'FOUNDER' } });
        const founderEmails = Array.from(new Set([
          ...founders.map(f => f.college_email),
          'b.11.08.bandana@gmail.com'
        ]));

        for (const adminEmail of founderEmails) {
          sendAdminAccessRequestEmail({
            adminEmail,
            studentName: user.name,
            studentEmail: user.college_email,
            usn: user.usn,
            role: targetRole,
          }).catch((e) => console.error('[Admin Alert Error]:', e));
        }
      }
    }

    // ─── Also fire admin email when an EXISTING PENDING user logs in ─────────
    if (user && user.approval_status === 'PENDING' && !isFirstTime) {
      const founders = await db.user.findMany({ where: { role: 'FOUNDER' } });
      const founderEmails = Array.from(new Set([
        ...founders.map(f => f.college_email),
        'founder1@club.edu',
        'architect@club.edu'
      ]));

      for (const adminEmail of founderEmails) {
        sendAdminAccessRequestEmail({
          adminEmail,
          studentName: user.name,
          studentEmail: user.college_email,
          usn: user.usn,
          role: user.role,
        }).catch((e) => console.error('[Admin Reminder Error]:', e));
      }
    }

    // ─── Blocked check ───────────────────────────────────────────────────────
    if (user.approval_status === 'BLOCKED') {
      return NextResponse.json(
        { error: 'Your account has been blocked by the administrator.' },
        { status: 403 }
      );
    }

    // Update user's name if a specific full name was provided
    const sessionName = inputName && inputName.trim() !== '' ? inputName.trim() : user.name;

    // ─── Record login ────────────────────────────────────────────────────────
    await db.user.update({
      where: { id: user.id },
      data: {
        name: sessionName,
        last_login_at: new Date(),
      },
    });

    const token = signToken({
      id: user.id,
      name: sessionName,
      role: user.role as any,          // use the stored role, not targetRole
      usn: user.usn,
      college_email: user.college_email,
    });

    // Send login security email ONLY for approved users
    if (user.approval_status === 'APPROVED' && user.college_email) {
      sendLoginSecurityEmail({
        recipientEmail: user.college_email,
        studentName: sessionName,
      }).catch((e) => console.error('[Login Security Email Error]:', e));
    }

    const response = NextResponse.json({
      message: `Session established as ${user.role}`,
      // ← always return the DB truth; frontend decides the route
      approval_status: user.approval_status,
      isFirstTime,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        college_email: user.college_email,
        approval_status: user.approval_status,
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
