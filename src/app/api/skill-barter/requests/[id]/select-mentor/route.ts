import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const SelectMentorSchema = z.object({
  mentor_id: z.string(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const requestId = params.id;

    const skillReq = await db.skillRequest.findUnique({ where: { id: requestId } });
    if (!skillReq) {
      return NextResponse.json({ error: 'Skill request not found' }, { status: 404 });
    }

    if (skillReq.requester_id !== session.id) {
      return NextResponse.json({ error: 'Only the original requester can choose a mentor.' }, { status: 403 });
    }

    const body = await req.json();
    const { mentor_id } = SelectMentorSchema.parse(body);

    const responseOffer = await db.skillResponse.findFirst({
      where: { request_id: requestId, responder_id: mentor_id },
    });

    if (!responseOffer) {
      return NextResponse.json({ error: 'Selected mentor has not offered to help on this request.' }, { status: 400 });
    }

    // Accept selected mentor and decline others
    await db.skillResponse.updateMany({
      where: { request_id: requestId },
      data: { status: 'DECLINED' },
    });

    await db.skillResponse.update({
      where: { id: responseOffer.id },
      data: { status: 'ACCEPTED' },
    });

    await db.skillRequest.update({
      where: { id: requestId },
      data: { status: 'MATCHED' },
    });

    // Auto-create private 1:1 chat between requester and selected mentor
    const chat = await db.skillChat.create({
      data: {
        request_id: requestId,
        requester_id: session.id,
        mentor_id,
        status: 'ACTIVE',
      },
    });

    // Create initial system message in chat
    await db.chatMessage.create({
      data: {
        chat_id: chat.id,
        sender_id: session.id,
        text: `Mentor match confirmed! Coordinate your session online, offline, or hybrid here.`,
      },
    });

    return NextResponse.json({
      message: 'Mentor selected! Private 1:1 chat created.',
      chat_id: chat.id,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
