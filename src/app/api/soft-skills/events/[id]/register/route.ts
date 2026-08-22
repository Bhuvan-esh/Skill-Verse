import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/soft-skills/audit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.skillLeagueEvent.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Validation 1: Event Status
    if (event.status !== 'REGISTRATION_OPEN') {
      return NextResponse.json(
        { error: `Registration is not open for this event (Current Status: ${event.status})` },
        { status: 400 }
      );
    }

    // Validation 2: Deadline Check
    const now = new Date();
    if (now > new Date(event.registration_close_time)) {
      return NextResponse.json(
        { error: 'Registration deadline has passed for this event' },
        { status: 400 }
      );
    }

    // Validation 3: Participant Limit
    if (event._count.registrations >= event.participant_limit) {
      return NextResponse.json(
        { error: 'Event has reached maximum participant capacity' },
        { status: 400 }
      );
    }

    const session = await getSession();
    const body = await req.json();

    const studentId = body.student_id || session?.id || `student-${Date.now()}`;
    const studentName = body.student_name || session?.name || 'Skill League Student';
    const usn = (body.usn || session?.usn || `1MS23CS${Math.floor(100 + Math.random() * 900)}`).toUpperCase();
    const email = body.email || session?.college_email || `${usn.toLowerCase()}@college.edu`;
    const year = Number(body.year) || 1;
    const branch = body.branch || 'Computer Science';
    const section = body.section || 'A';

    if (year < 1 || year > 4) {
      return NextResponse.json(
        { error: 'Academic year must be an integer between 1 and 4' },
        { status: 400 }
      );
    }

    // Validation 4: Duplicate Registration
    const existingRegistration = await db.skillLeagueRegistration.findFirst({
      where: {
        event_id: params.id,
        OR: [{ student_id: studentId }, { usn: usn }],
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this Skill League mystery challenge.' },
        { status: 409 }
      );
    }

    const registration = await db.skillLeagueRegistration.create({
      data: {
        event_id: params.id,
        student_id: studentId,
        student_name: studentName,
        usn,
        email,
        year,
        branch,
        section,
        status: 'REGISTERED',
      },
    });

    await createAuditLog({
      actorId: studentId,
      actorRole: 'STUDENT',
      action: 'REGISTERED',
      entity: 'REGISTRATION',
      entityId: registration.id,
      newValue: {
        eventId: params.id,
        eventName: event.public_event_name,
        usn,
        year,
        branch,
      },
      reason: 'Student registered for Mystery Skill League challenge',
    });

    return NextResponse.json(
      {
        message: 'Successfully registered for Skill League Mystery Challenge!',
        registration: {
          id: registration.id,
          eventId: registration.event_id,
          eventName: event.public_event_name,
          studentName: registration.student_name,
          usn: registration.usn,
          year: registration.year,
          branch: registration.branch,
          status: registration.status,
          registeredAt: registration.registered_at,
          // CRITICAL: Challenge type is hidden
          challengeRevealed: !!event.challenge_revealed_at,
          notice: 'The exact challenge type and your mixed-year squad will be revealed on event day.',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
