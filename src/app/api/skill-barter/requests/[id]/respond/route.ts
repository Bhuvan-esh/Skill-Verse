import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const requestId = params.id;

    const skillReq = await db.skillRequest.findUnique({ where: { id: requestId } });
    if (!skillReq) {
      return NextResponse.json({ error: 'Skill request not found' }, { status: 404 });
    }

    if (skillReq.requester_id === session.id) {
      return NextResponse.json({ error: 'You cannot respond to your own request.' }, { status: 400 });
    }

    const existing = await db.skillResponse.findFirst({
      where: { request_id: requestId, responder_id: session.id },
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already responded to this request.' }, { status: 400 });
    }

    const response = await db.skillResponse.create({
      data: {
        request_id: requestId,
        responder_id: session.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'Offer to mentor posted successfully.', response });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
