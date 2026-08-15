import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, signToken } from '@/lib/auth';

const EmergencyAccessSchema = z.object({
  usn: z.string().min(3).transform((v) => v.trim().toUpperCase()),
  reason: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const founderSession = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { usn, reason } = EmergencyAccessSchema.parse(body);

    const preloaded = await db.preloadedUSN.findUnique({ where: { usn } });
    if (!preloaded) {
      return NextResponse.json({ error: 'USN not found in preloaded whitelist' }, { status: 404 });
    }

    let student = await db.user.findUnique({ where: { college_email: preloaded.college_email } });
    if (!student) {
      student = await db.user.create({
        data: {
          name: preloaded.student_name,
          role: 'STUDENT',
          usn: preloaded.usn,
          college_email: preloaded.college_email,
          is_preloaded: true,
        },
      });

      await db.studentCredit.create({ data: { student_id: student.id } });
      await db.mentorProfile.create({ data: { student_id: student.id, domain: 'DOMAIN_1' } });
      await db.ideaChannel.create({ data: { student_id: student.id } });
    }

    // Log Emergency Access
    await db.emergencyAccessLog.create({
      data: {
        granted_by: founderSession.id,
        student_id: student.id,
        reason,
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: founderSession.id,
        action: 'EMERGENCY_STUDENT_ACCESS',
        target: student.id,
        details: JSON.stringify({ usn, reason }),
      },
    });

    // Create session token for student
    const token = signToken({
      id: student.id,
      name: student.name,
      role: 'STUDENT',
      usn: student.usn,
      college_email: student.college_email,
      isEmergencyAccess: true,
    });

    return NextResponse.json({
      message: `Emergency access granted for ${student.name} (${usn}).`,
      token,
      student: { id: student.id, name: student.name, usn: student.usn, email: student.college_email },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
