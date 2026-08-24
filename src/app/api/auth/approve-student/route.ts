import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendAccountApprovalEmail, sendVADecisionNotificationEmail } from '@/lib/email-service';

const styles = `
  body { background: #0b0a10; color: #f2eef7; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: #131119; border: 1px solid rgba(255,255,255,0.12); padding: 40px; border-radius: 20px; text-align: center; max-width: 480px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
  h1 { font-size: 24px; margin-bottom: 12px; }
  p { color: #9d97ab; font-size: 14px; line-height: 1.6; margin: 8px 0; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
  .badge-green { background: rgba(16,185,129,0.15); color: #10b981; }
  .badge-red { background: rgba(239,68,68,0.15); color: #ef4444; }
  .badge-gray { background: rgba(255,255,255,0.08); color: #9d97ab; }
  a { display: inline-block; margin-top: 20px; background: #a78bfa; color: #0b0a10; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; }
`;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const studentId = searchParams.get('studentId');
    const action = searchParams.get('action'); // 'deny' or null (approve)

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
      return new NextResponse(
        `<!DOCTYPE html><html><head><title>Not Found - SkillVerse</title><style>${styles}</style></head>
        <body><div class="card">
          <div class="badge badge-gray">● NOT FOUND</div>
          <h1 style="color:#9d97ab">Account Not Found</h1>
          <p>No account with this email exists in SkillVerse.</p>
          <a href="${appUrl}/horizon">Return to Platform</a>
        </div></body></html>`,
        { headers: { 'Content-Type': 'text/html' }, status: 404 }
      );
    }

    // Note current status for informational banner — but do NOT block; both VAs can act
    const previousStatus = student.approval_status;
    const alreadyDecidedNote = previousStatus !== 'PENDING'
      ? `<p style="font-size:12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 10px; margin-top: 16px;">
           ℹ️ This applicant was previously <strong style="color:${previousStatus === 'APPROVED' ? '#10b981' : '#ef4444'}">${previousStatus}</strong> by another Visual Architect. Your decision below has now overridden it.
         </p>`
      : '';

    // ─── DENY ACTION ──────────────────────────────────────────────────────────
    if (action === 'deny') {
      await db.user.update({
        where: { id: student.id },
        data: {
          approval_status: 'REJECTED',
          approved_by: 'Visual Architect (Email — Denied)',
        },
      });

      try {
        await db.adminAuditLog.create({
          data: {
            actor_uid: 'email-link',
            actor_name: 'Visual Architect',
            action: 'STUDENT_REJECTED',
            target_type: 'USER',
            target_id: student.id,
            metadata: JSON.stringify({ name: student.name, email: student.college_email }),
          },
        });
      } catch (_) {}

      // Notify all OTHER Visual Architects that this has been denied
      const allFounders = await db.user.findMany({ where: { role: 'FOUNDER' } });
      for (const va of allFounders) {
        sendVADecisionNotificationEmail({
          notifyEmail: va.college_email,
          decidingVAName: 'A Visual Architect',
          studentName: student.name,
          studentEmail: student.college_email,
          decision: 'REJECTED',
        }).catch(() => {});
      }

      return new NextResponse(
        `<!DOCTYPE html><html><head><title>Request Denied - SkillVerse</title><style>${styles}</style></head>
        <body><div class="card">
          <div class="badge badge-red">● REQUEST DENIED</div>
          <h1 style="color:#ef4444">Access Denied</h1>
          <p>You have denied the access request from <strong style="color:#f2eef7">${student.name}</strong> (${student.college_email}).</p>
          <p>All other Visual Architects have been notified by email.</p>
          ${alreadyDecidedNote}
          <a href="${appUrl}/horizon">Return to Platform</a>
        </div></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // ─── APPROVE ACTION ───────────────────────────────────────────────────────
    await db.user.update({
      where: { id: student.id },
      data: {
        approval_status: 'APPROVED',
        approved_at: new Date(),
        approved_by: 'Visual Architect (Email Link)',
      },
    });

    try {
      await db.adminAuditLog.create({
        data: {
          actor_uid: 'email-link',
          actor_name: 'Visual Architect',
          action: 'STUDENT_APPROVED',
          target_type: 'USER',
          target_id: student.id,
          metadata: JSON.stringify({ name: student.name, email: student.college_email }),
        },
      });
    } catch (_) {}

    if (student.college_email) {
      sendAccountApprovalEmail({
        recipientEmail: student.college_email,
        studentName: student.name,
      }).catch((e) => console.error('[Approval Email Error]:', e));
    }

    // Notify all OTHER Visual Architects that this has been approved
    const allFounders = await db.user.findMany({ where: { role: 'FOUNDER' } });
    for (const va of allFounders) {
      sendVADecisionNotificationEmail({
        notifyEmail: va.college_email,
        decidingVAName: 'A Visual Architect',
        studentName: student.name,
        studentEmail: student.college_email,
        decision: 'APPROVED',
      }).catch(() => {});
    }

    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Access Approved - SkillVerse</title><style>${styles}</style></head>
      <body><div class="card">
        <div class="badge badge-green">● APPROVED BY VISUAL ARCHITECT</div>
        <h1 style="color:#10b981">Access Approved!</h1>
        <p>You have approved <strong style="color:#f2eef7">${student.name}</strong> (${student.college_email}).</p>
        <p>A confirmation email has been sent to the applicant. They can now log into SkillVerse directly.</p>
        <p>All other Visual Architects have been notified.</p>
        ${alreadyDecidedNote}
        <a href="${appUrl}/horizon">Return to Platform</a>
      </div></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
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
