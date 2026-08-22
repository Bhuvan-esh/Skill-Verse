import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { seedDefaultTwistsIfNeeded } from '@/lib/soft-skills/twistService';

export async function GET(req: NextRequest) {
  try {
    await seedDefaultTwistsIfNeeded();
    const twists = await db.skillLeagueTwist.findMany({
      orderBy: { created_at: 'asc' },
    });
    return NextResponse.json({ twists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch twists' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role !== 'FOUNDER' && (session as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const created = await db.skillLeagueTwist.create({
      data: {
        title,
        description,
        category: category || 'GENERAL',
        is_active: true,
      },
    });

    return NextResponse.json({ twist: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create twist' }, { status: 500 });
  }
}
