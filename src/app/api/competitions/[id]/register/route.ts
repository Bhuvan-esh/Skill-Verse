import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { emailQueue } from '@/lib/queue';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'VOLUNTEER', 'FOUNDER']);
    const compId = params.id;

    const comp = await db.competition.findUnique({ where: { id: compId } });
    if (!comp) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    // Check duplicate registration
    const existing = await db.registration.findUnique({
      where: {
        student_id_competition_id: {
          student_id: session.id,
          competition_id: compId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already registered for this competition.' }, { status: 400 });
    }

    const reg = await db.registration.create({
      data: {
        student_id: session.id,
        competition_id: compId,
      },
    });

    // Enqueue confirmation email
    emailQueue.enqueue({
      to: session.college_email,
      subject: `Registration Confirmed: ${comp.name}`,
      html: `<p>Hello ${session.name},</p><p>You have successfully registered for <strong>${comp.name}</strong>.</p><p>Event Date: ${new Date(comp.event_date).toLocaleString()}</p>`,
      type: 'REGISTRATION',
      userId: session.id,
    });

    return NextResponse.json({ message: 'Registered successfully.', registration: reg });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
