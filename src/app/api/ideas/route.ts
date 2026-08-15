import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, getSession } from '@/lib/auth';

const CreateIdeaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  lecture_id: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);

    const body = await req.json();
    const { title, description, category, lecture_id } = CreateIdeaSchema.parse(body);

    const idea = await db.idea.create({
      data: {
        student_id: session.id,
        title,
        description,
        category,
        lecture_id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'Idea submitted successfully.', idea });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function GET() {
  try {
    const ideas = await db.idea.findMany({
      include: {
        student: { select: { id: true, name: true, usn: true } },
        approvals: { include: { founder: { select: { name: true } } } },
      },
      orderBy: { created_at: 'desc' },
    });

    // Tally headcounts per lecture (headcount only, not ranked between lectures)
    const lectureHeadcounts: Record<string, number> = {};
    ideas.forEach((idea) => {
      lectureHeadcounts[idea.lecture_id] = (lectureHeadcounts[idea.lecture_id] || 0) + 1;
    });

    // Find Idea of the Day / Featured / Built
    const ideaOfTheDay = ideas.find((i) => i.status === 'FEATURED') || null;
    const builtIdeas = ideas.filter((i) => i.status === 'BUILT');

    return NextResponse.json({
      ideas,
      lectureHeadcounts,
      ideaOfTheDay,
      builtIdeas,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch ideas' }, { status: 500 });
  }
}
