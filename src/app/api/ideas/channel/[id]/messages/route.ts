import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const PostMessageSchema = z.object({
  text: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const channelId = params.id;

    const channel = await db.ideaChannel.findUnique({
      where: { id: channelId },
      include: { student: true },
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Access guard: Student can only open their OWN channel. Founders can open any channel.
    if (session.role === 'STUDENT' && channel.student_id !== session.id) {
      return NextResponse.json({ error: 'Forbidden. Access restricted to channel owner.' }, { status: 403 });
    }

    const messages = await db.ideaMessage.findMany({
      where: { channel_id: channelId },
      include: { sender: { select: { id: true, name: true, role: true } } },
      orderBy: { sent_at: 'asc' },
    });

    return NextResponse.json({ channel, messages });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const channelId = params.id;

    const channel = await db.ideaChannel.findUnique({ where: { id: channelId } });
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    if (session.role === 'STUDENT' && channel.student_id !== session.id) {
      return NextResponse.json({ error: 'Forbidden. Access restricted to channel owner.' }, { status: 403 });
    }

    const body = await req.json();
    const { text } = PostMessageSchema.parse(body);

    const message = await db.ideaMessage.create({
      data: {
        channel_id: channelId,
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
