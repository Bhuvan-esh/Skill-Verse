import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const CreateTaskSchema = z.object({
  competition_id: z.string(),
  description: z.string().min(3),
});

export async function GET() {
  try {
    await requireAuth(['FOUNDER']);

    const tasks = await db.task.findMany({
      include: {
        competition: { select: { name: true, volunteer_access: true } },
        claimer: { select: { id: true, name: true, college_email: true } },
      },
      orderBy: { competition_id: 'asc' },
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { competition_id, description } = CreateTaskSchema.parse(body);

    const task = await db.task.create({
      data: {
        competition_id,
        description,
        status: 'OPEN',
      },
      include: { competition: { select: { name: true } } },
    });

    await db.auditLog.create({
      data: {
        actor_id: session.id,
        action: 'CREATE_TASK',
        target: task.id,
        details: JSON.stringify({ competition_id, description }),
      },
    });

    return NextResponse.json({ message: 'Task pre-added under competition.', task });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
