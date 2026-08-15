import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { executeCodeChallenge } from '@/lib/runner';

const RunCodeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['python', 'javascript', 'cpp']).default('javascript'),
  test_cases: z.array(
    z.object({
      input: z.string(),
      expected_output: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    await requireAuth(['STUDENT', 'VOLUNTEER', 'FOUNDER']);

    const body = await req.json();
    const data = RunCodeSchema.parse(body);

    const result = await executeCodeChallenge(data);

    return NextResponse.json({ result });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
