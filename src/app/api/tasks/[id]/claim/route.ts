import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['VOLUNTEER', 'FOUNDER']);
    const taskId = params.id;

    // ATOMIC TRANSACTION: Check status and claim in one operation to prevent race conditions
    const claimedTask = await db.$transaction(async (tx) => {
      const existingTask = await tx.task.findUnique({
        where: { id: taskId },
        include: { competition: true },
      });

      if (!existingTask) {
        throw new Error('TASK_NOT_FOUND');
      }

      if (existingTask.competition.volunteer_access !== 'OPEN') {
        throw new Error('VOLUNTEER_ACCESS_CLOSED');
      }

      if (existingTask.status !== 'OPEN') {
        throw new Error('TASK_ALREADY_CLAIMED');
      }

      return tx.task.update({
        where: { id: taskId },
        data: {
          status: 'CLAIMED',
          claimed_by: session.id,
          claimed_at: new Date(),
        },
        include: {
          competition: { select: { name: true } },
          claimer: { select: { id: true, name: true } },
        },
      });
    });

    return NextResponse.json({
      message: 'Task claimed successfully.',
      task: claimedTask,
    });
  } catch (error: any) {
    if (error.message === 'TASK_ALREADY_CLAIMED') {
      return NextResponse.json({ error: 'This task was just claimed by another volunteer!' }, { status: 409 });
    }
    if (error.message === 'VOLUNTEER_ACCESS_CLOSED') {
      return NextResponse.json({ error: 'Volunteer access for this competition is closed.' }, { status: 403 });
    }
    if (error.message === 'TASK_NOT_FOUND') {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
