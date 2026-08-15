import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['VOLUNTEER', 'FOUNDER']);
    const taskId = params.id;

    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (session.role === 'VOLUNTEER' && task.claimed_by !== session.id) {
      return NextResponse.json({ error: 'Only the volunteer who claimed this task can complete it.' }, { status: 403 });
    }

    const updated = await db.task.update({
      where: { id: taskId },
      data: { status: 'DONE' },
    });

    return NextResponse.json({ message: 'Task marked as DONE.', task: updated });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
