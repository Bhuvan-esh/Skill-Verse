import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);

    if (session.role === 'STUDENT') {
      let channel = await db.ideaChannel.findUnique({
        where: { student_id: session.id },
      });

      if (!channel) {
        channel = await db.ideaChannel.create({
          data: { student_id: session.id },
        });
      }

      return NextResponse.json({ channel });
    }

    // Founders can list channels or request specific student channel
    const channels = await db.ideaChannel.findMany({
      include: {
        student: { select: { id: true, name: true, usn: true, college_email: true } },
        messages: {
          take: 1,
          orderBy: { sent_at: 'desc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ channels });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
