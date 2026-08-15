import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const FeatureSchema = z.object({
  status: z.enum(['FEATURED', 'BUILT', 'APPROVED']),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['FOUNDER']);
    const ideaId = params.id;

    const body = await req.json();
    const { status } = FeatureSchema.parse(body);

    if (status === 'FEATURED') {
      // Un-feature previous Idea of the Day
      await db.idea.updateMany({
        where: { status: 'FEATURED' },
        data: { status: 'APPROVED' },
      });
    }

    const updated = await db.idea.update({
      where: { id: ideaId },
      data: { status },
      include: { student: true },
    });

    return NextResponse.json({ message: `Idea status updated to ${status}.`, idea: updated });
  } catch (error: any) {
    const httpStatus = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status: httpStatus });
  }
}
