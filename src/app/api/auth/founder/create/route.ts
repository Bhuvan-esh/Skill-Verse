import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, hashPassword } from '@/lib/auth';

const CreateFounderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { name, email, password } = CreateFounderSchema.parse(body);

    const existing = await db.user.findUnique({ where: { college_email: email } });
    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const newFounder = await db.user.create({
      data: {
        name,
        role: 'FOUNDER',
        college_email: email,
        password_hash: passwordHash,
        is_preloaded: true,
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: session.id,
        action: 'CREATE_FOUNDER',
        target: newFounder.id,
        details: JSON.stringify({ name, email }),
      },
    });

    return NextResponse.json({
      message: 'New founder account created successfully.',
      founder: { id: newFounder.id, name: newFounder.name, email: newFounder.college_email },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message || 'Failed to create founder account' }, { status });
  }
}
