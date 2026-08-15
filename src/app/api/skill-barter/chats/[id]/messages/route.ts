import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const PostChatMessageSchema = z.object({
  text: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'VOLUNTEER', 'FOUNDER']);
    const chatId = params.id;

    const chat = await db.skillChat.findUnique({
      where: { id: chatId },
      include: {
        requester: { select: { id: true, name: true } },
        mentor: { select: { id: true, name: true } },
        request: { select: { skill: true } },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // STRICT ACCESS GUARD: Only requester + selected mentor (or emergency override)
    const isParticipant = chat.requester_id === session.id || chat.mentor_id === session.id;
    const isEmergencyFounder = session.role === 'FOUNDER' && session.isEmergencyAccess;

    if (!isParticipant && !isEmergencyFounder) {
      return NextResponse.json(
        { error: 'Forbidden. Private 1:1 mentor chat is strictly restricted to participants.' },
        { status: 403 }
      );
    }

    const messages = await db.chatMessage.findMany({
      where: { chat_id: chatId },
      include: { sender: { select: { id: true, name: true, role: true } } },
      orderBy: { sent_at: 'asc' },
    });

    return NextResponse.json({ chat, messages });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'VOLUNTEER', 'FOUNDER']);
    const chatId = params.id;

    const chat = await db.skillChat.findUnique({ where: { id: chatId } });
    if (!chat) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    const isParticipant = chat.requester_id === session.id || chat.mentor_id === session.id;
    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden. Only participants can send messages.' }, { status: 403 });
    }

    const body = await req.json();
    const { text } = PostChatMessageSchema.parse(body);

    const message = await db.chatMessage.create({
      data: {
        chat_id: chatId,
        sender_id: session.id,
        text,
      },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
