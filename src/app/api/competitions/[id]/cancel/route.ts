import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const CancelSchema = z.object({
  reason: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'VOLUNTEER', 'FOUNDER']);
    const compId = params.id;

    const registration = await db.registration.findUnique({
      where: {
        student_id_competition_id: {
          student_id: session.id,
          competition_id: compId,
        },
      },
      include: { competition: true },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    const eventTime = new Date(registration.competition.event_date).getTime();
    const now = Date.now();
    const hoursRemaining = (eventTime - now) / (1000 * 60 * 60);

    // Case 1: > 24 hours before start -> Instant, free cancellation
    if (hoursRemaining >= 24) {
      await db.registration.delete({
        where: { id: registration.id },
      });

      await db.cancellationRequest.create({
        data: {
          student_id: session.id,
          competition_id: compId,
          reason: 'Canceled >24h prior to event.',
          status: 'AUTO',
          credit_penalty: false,
          decided_at: new Date(),
        },
      });

      return NextResponse.json({
        type: 'AUTO',
        message: 'Registration canceled instantly with no penalty (>24h prior).',
      });
    }

    // Case 2: Within 24 hours -> Pending request for founder review
    const body = await req.json();
    const { reason } = CancelSchema.parse(body);

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Reason required for cancellation within 24 hours.' }, { status: 400 });
    }

    const cancelReq = await db.cancellationRequest.create({
      data: {
        student_id: session.id,
        competition_id: compId,
        reason,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      type: 'PENDING',
      message: 'Cancellation request submitted to founders for review (within 24h of event).',
      cancellation_request: cancelReq,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
