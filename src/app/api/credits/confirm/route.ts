import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { awardCredits } from '@/lib/credit-engine';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const founderId = session?.id || 'founder-system';
    const founderName = session?.name || 'Visual Architect';

    const body = await req.json();
    const { studentId, domain, activityId, activityName, creditAmount, registrationId, idempotencyKey } = body;

    if (!studentId || !domain || !activityId || !activityName || !creditAmount) {
      return NextResponse.json(
        { error: 'studentId, domain, activityId, activityName, and creditAmount are required' },
        { status: 400 }
      );
    }

    const result = await awardCredits({
      studentId,
      domain,
      activityId,
      activityName,
      creditAmount: Number(creditAmount),
      approvingFounderUid: founderId,
      approvingFounderName: founderName,
      registrationId,
      idempotencyKey,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Credit confirmation failed' }, { status: 500 });
  }
}
