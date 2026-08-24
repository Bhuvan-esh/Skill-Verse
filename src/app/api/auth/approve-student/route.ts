import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendAccountApprovalEmail } from '@/lib/email-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const studentId = searchParams.get('studentId');

    if (!email && !studentId) {
      return new NextResponse('Missing email or studentId parameter', { status: 400 });
    }

    const student = await db.user.findFirst({
      where: {
        OR: [
          email ? { college_email: email } : undefined,
          studentId ? { id: studentId } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!student) {
      return new NextResponse('Student account not found', { status: 404 });
    }

    await db.user.update({
      where: { id: student.id },
      data: {
        approval_status: 'APPROVED',
        approved_at: new Date(),
        approved_by: 'Visual Architect (Email Link)',
      },
    });

    if (student.college_email) {
      sendAccountApprovalEmail({
        recipientEmail: student.college_email,
        studentName: student.name,
      }).catch((e) => console.error('[Approval Email Error]:', e));
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Access Approved - SkillVerse</title>
          <style>
            body { background: #0b0a10; color: #f2eef7; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
            .card { background: #131119; border: 1px solid rgba(255,255,255,0.12); padding: 40px; border-radius: 20px; text-align: center; max-width: 440px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            h1 { color: #a78bfa; font-size: 24px; margin-bottom: 12px; }
            p { color: #9d97ab; font-size: 14px; line-height: 1.6; }
            .badge { display: inline-block; background: rgba(94,212,200,0.15); color: #5ed4c8; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
            a { display: inline-block; margin-top: 20px; background: #a78bfa; color: #0b0a10; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">● APPROVED BY VISUAL ARCHITECT</div>
            <h1>Access Approved!</h1>
            <p>You have successfully approved access for <strong>${student.name}</strong> (${student.college_email}).</p>
            <p>An automated confirmation email has been sent to the applicant. They can now log in directly to SkillVerse.</p>
            <a href="http://localhost:3000/horizon">Return to Platform</a>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error: any) {
    return new NextResponse(`Approval Error: ${error.message}`, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    // Allow founder or admin access
    const founderId = session?.id || 'founder-system';
    const founderName = session?.name || 'Visual Architect';

    const { studentId, studentEmail } = await req.json();

    if (!studentId && !studentEmail) {
      return NextResponse.json({ error: 'studentId or studentEmail required' }, { status: 400 });
    }

    const student = await db.user.findFirst({
      where: {
        OR: [
          studentId ? { id: studentId } : undefined,
          studentEmail ? { college_email: studentEmail } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: student.id },
      data: {
        approval_status: 'APPROVED',
        approved_at: new Date(),
        approved_by: founderId,
      },
    });

    // Record in AdminAuditLog
    await db.adminAuditLog.create({
      data: {
        actor_uid: founderId,
        actor_name: founderName,
        action: 'STUDENT_APPROVED',
        target_type: 'USER',
        target_id: student.id,
        metadata: JSON.stringify({ name: student.name, email: student.college_email }),
      },
    });

    // Send personalized approval email to that student ONLY
    if (student.college_email) {
      sendAccountApprovalEmail({
        recipientEmail: student.college_email,
        studentName: student.name,
      }).catch((e) => console.error('[Approval Email Error]:', e));
    }

    return NextResponse.json({
      success: true,
      message: `Student ${student.name} approved successfully.`,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.college_email,
        approval_status: updated.approval_status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Approval failed' }, { status: 500 });
  }
}
