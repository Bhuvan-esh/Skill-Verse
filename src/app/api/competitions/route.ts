import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { emailQueue } from '@/lib/queue';

const CreateCompetitionSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  domain: z.enum(['DOMAIN_1', 'DOMAIN_2', 'DOMAIN_3', 'DOMAIN_4']),
  credit_value: z.number().int().min(0),
  type: z.enum(['SCORED', 'DISPLAY_ONLY']).default('SCORED'),
  volunteer_access: z.enum(['CLOSED', 'OPEN']).default('CLOSED'),
  source: z.enum(['FOUNDERS', 'IDEA_HUB']).default('FOUNDERS'),
  origin_idea_id: z.string().nullable().optional(),
  event_date: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const data = CreateCompetitionSchema.parse(body);

    let originatingStudent = null;
    if (data.source === 'IDEA_HUB') {
      if (!data.origin_idea_id) {
        return NextResponse.json({ error: 'Originating idea required when source is IDEA_HUB.' }, { status: 400 });
      }

      const idea = await db.idea.findUnique({
        where: { id: data.origin_idea_id },
        include: { student: true },
      });

      if (!idea) {
        return NextResponse.json({ error: 'Originating idea not found.' }, { status: 400 });
      }

      originatingStudent = idea.student;
    }

    const comp = await db.competition.create({
      data: {
        name: data.name,
        description: data.description,
        domain: data.domain,
        credit_value: data.credit_value,
        type: data.type,
        volunteer_access: data.volunteer_access,
        source: data.source,
        origin_idea_id: data.source === 'IDEA_HUB' ? data.origin_idea_id : null,
        event_date: new Date(data.event_date),
        status: 'UPCOMING',
      },
      include: {
        origin_idea: { include: { student: true } },
      },
    });

    // Triggers automatic appreciation notification to originating student if sourced from Idea Hub
    if (data.source === 'IDEA_HUB' && originatingStudent) {
      const title = `Your idea "${comp.origin_idea?.title || comp.name}" just went live as a competition! 🎉`;
      const html = `<p>Hello ${originatingStudent.name},</p><p>Great news! Your idea has been officially launched as a club competition: <strong>${comp.name}</strong>.</p><p>Thank you for contributing to the Club Idea Hub!</p>`;

      emailQueue.enqueue({
        to: originatingStudent.college_email,
        subject: title,
        html,
        type: 'IDEA_LAUNCH',
        userId: originatingStudent.id,
      });
    }

    await db.auditLog.create({
      data: {
        actor_id: session.id,
        action: 'CREATE_COMPETITION',
        target: comp.id,
        details: JSON.stringify({ name: comp.name, source: comp.source }),
      },
    });

    return NextResponse.json({ message: 'Competition launched successfully.', competition: comp });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function GET() {
  try {
    const competitions = await db.competition.findMany({
      include: {
        origin_idea: {
          include: { student: { select: { id: true, name: true, usn: true } } },
        },
        registrations: { select: { id: true, student_id: true } },
        _count: { select: { registrations: true, tasks: true } },
      },
      orderBy: { event_date: 'asc' },
    });

    return NextResponse.json({ competitions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch competitions' }, { status: 500 });
  }
}
