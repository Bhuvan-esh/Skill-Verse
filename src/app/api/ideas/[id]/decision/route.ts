import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const DecisionSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['FOUNDER']);
    const ideaId = params.id;

    const body = await req.json();
    const { decision, reason } = DecisionSchema.parse(body);

    if (decision === 'REJECT' && (!reason || reason.trim().length === 0)) {
      return NextResponse.json({ error: 'A mandatory reason must be provided when rejecting an idea.' }, { status: 400 });
    }

    const idea = await db.idea.findUnique({
      where: { id: ideaId },
      include: { student: true },
    });

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // 1. Record founder approval/rejection entry
    await db.ideaApproval.create({
      data: {
        idea_id: ideaId,
        founder_id: session.id,
        decision,
        reason: reason || null,
      },
    });

    // 2. Update Idea status (Single founder approval moves it to APPROVED)
    const newStatus = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const updatedIdea = await db.idea.update({
      where: { id: ideaId },
      data: { status: newStatus },
    });

    // 3. Post notification/message into the student's private channel
    const studentChannel = await db.ideaChannel.findUnique({
      where: { student_id: idea.student_id },
    });

    if (studentChannel) {
      const messageText = decision === 'APPROVE'
        ? `🎉 Congratulations! Your idea "${idea.title}" has been APPROVED by founder ${session.name}. It is now eligible to be launched as an official club competition!`
        : `Your idea "${idea.title}" was reviewed and REJECTED. Reason: ${reason}`;

      await db.ideaMessage.create({
        data: {
          channel_id: studentChannel.id,
          sender_id: session.id,
          text: messageText,
        },
      });
    }

    return NextResponse.json({
      message: `Idea status updated to ${newStatus}.`,
      idea: updatedIdea,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
