import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['FOUNDER']);

    const studentId = params.id;
    const student = await db.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, usn: true, college_email: true, role: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    let credits = await db.studentCredit.findUnique({
      where: { student_id: studentId },
    });

    if (!credits) {
      credits = await db.studentCredit.create({
        data: { student_id: studentId, domain_1: 0, domain_2: 0, domain_3: 0, domain_4: 0 },
      });
    }

    return NextResponse.json({
      student,
      credits: {
        domain_1: credits.domain_1,
        domain_2: credits.domain_2,
        domain_3: credits.domain_3,
        domain_4: credits.domain_4,
        total: credits.domain_1 + credits.domain_2 + credits.domain_3 + credits.domain_4,
      },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
