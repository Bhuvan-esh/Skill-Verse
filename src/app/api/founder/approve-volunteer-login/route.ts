import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const DecideLoginSchema = z.object({
  request_id: z.string(),
  decision: z.enum(['APPROVED', 'DENIED']),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { request_id, decision } = DecideLoginSchema.parse(body);

    const loginReq = await db.loginRequest.findUnique({ where: { id: request_id } });
    if (!loginReq) {
      return NextResponse.json({ error: 'Login request not found' }, { status: 404 });
    }

    const updated = await db.loginRequest.update({
      where: { id: request_id },
      data: {
        status: decision,
        approved_by: session.id,
        decided_at: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: session.id,
        action: `VOLUNTEER_LOGIN_${decision}`,
        target: loginReq.volunteer_id,
        details: JSON.stringify({ request_id }),
      },
    });

    return NextResponse.json({ message: `Volunteer login request ${decision}.`, request: updated });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
