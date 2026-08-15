import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const chatId = params.id;

    const chat = await db.skillChat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    if (chat.requester_id !== session.id) {
      return NextResponse.json({ error: 'Only the mentee can leave feedback for the mentor.' }, { status: 403 });
    }

    const body = await req.json();
    const { rating, comment } = FeedbackSchema.parse(body);

    const feedback = await db.mentorFeedback.create({
      data: {
        chat_id: chatId,
        mentor_id: chat.mentor_id,
        mentee_id: session.id,
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json({
      message: 'Feedback submitted successfully. Mentor profile stats updated.',
      feedback,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
