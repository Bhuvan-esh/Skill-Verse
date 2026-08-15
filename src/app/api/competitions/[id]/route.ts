import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const compId = params.id;
    const competition = await db.competition.findUnique({
      where: { id: compId },
      include: {
        origin_idea: {
          include: { student: { select: { id: true, name: true, usn: true } } },
        },
        registrations: {
          include: { student: { select: { id: true, name: true, usn: true, college_email: true } } },
        },
        tasks: {
          include: { claimer: { select: { id: true, name: true } } },
        },
      },
    });

    if (!competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    return NextResponse.json({ competition });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['FOUNDER']);
    const compId = params.id;
    const body = await req.json();

    const updated = await db.competition.update({
      where: { id: compId },
      data: {
        volunteer_access: body.volunteer_access,
        status: body.status,
      },
    });

    return NextResponse.json({ message: 'Competition updated successfully.', competition: updated });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
