import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, hashPassword } from '@/lib/auth';

const CreateVolunteerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['FOUNDER']);

    const body = await req.json();
    const { name, email, password } = CreateVolunteerSchema.parse(body);

    const existing = await db.user.findUnique({ where: { college_email: email } });
    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const volunteer = await db.user.create({
      data: {
        name,
        role: 'VOLUNTEER',
        college_email: email,
        password_hash: passwordHash,
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: session.id,
        action: 'CREATE_VOLUNTEER',
        target: volunteer.id,
        details: JSON.stringify({ name, email }),
      },
    });

    return NextResponse.json({
      message: 'Volunteer account created successfully.',
      volunteer: { id: volunteer.id, name: volunteer.name, email: volunteer.college_email },
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
