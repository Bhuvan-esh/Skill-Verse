import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const founderId = session?.id || 'founder-system';
    const founderName = session?.name || 'Visual Architect';

    const { studentId, studentEmail, reason } = await req.json();

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
        approval_status: 'BLOCKED',
        blocked_at: new Date(),
        blocked_by: founderId,
      },
    });

    await db.adminAuditLog.create({
      data: {
        actor_uid: founderId,
        actor_name: founderName,
        action: 'STUDENT_BLOCKED',
        target_type: 'USER',
        target_id: student.id,
        metadata: JSON.stringify({ name: student.name, email: student.college_email, reason }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Student ${student.name} has been blocked.`,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.college_email,
        approval_status: updated.approval_status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Block failed' }, { status: 500 });
  }
}
