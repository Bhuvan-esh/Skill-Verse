import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const eventId = params.id;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "Student requested cancellation";

    const event = await db.codingEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registration = await db.codingEventRegistration.findUnique({
      where: {
        student_id_event_id: {
          student_id: user.id,
          event_id: eventId,
        },
      },
    });

    if (!registration || registration.status !== 'REGISTERED') {
      return NextResponse.json({ error: "You do not have an active registration for this event" }, { status: 400 });
    }

    const now = new Date();
    if (event.cancellation_deadline && now > event.cancellation_deadline) {
      return NextResponse.json({
        error: "Cancellation deadline has passed for this competition. Contact founder support for manual review.",
      }, { status: 400 });
    }

    await db.codingEventRegistration.update({
      where: { id: registration.id },
      data: {
        status: 'CANCELLED',
        cancelled_at: now,
      },
    });

    if (registration.team_id) {
      await db.codingTeamMember.deleteMany({
        where: {
          team_id: registration.team_id,
          student_id: user.id,
        },
      });
    }

    await db.notification.create({
      data: {
        user_id: user.id,
        type: 'REGISTRATION_CANCELLED',
        title: 'Registration Cancelled',
        message: `Your registration for "${event.title}" has been cancelled.`,
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: user.id,
        action: 'STUDENT_CANCELLED_CODING_EVENT',
        target: eventId,
        details: JSON.stringify({ title: event.title, reason }),
      },
    });

    return NextResponse.json({
      message: "Your registration has been successfully cancelled.",
    });
  } catch (error: any) {
    console.error("POST /api/coding/events/[id]/cancel error:", error);
    return NextResponse.json({ error: "Failed to process cancellation" }, { status: 500 });
  }
}
