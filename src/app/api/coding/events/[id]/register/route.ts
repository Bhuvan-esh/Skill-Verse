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
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    if (body.name || body.usn) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            ...(body.name ? { name: body.name } : {}),
            ...(body.usn ? { usn: body.usn } : {}),
          },
        });
      } catch (e) {
        // user fields updated gracefully
      }
    }

    const event = await db.codingEvent.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
        teams: { include: { members: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status === 'COMPLETED' || event.status === 'REGISTRATION_CLOSED') {
      return NextResponse.json({ error: "Registration is closed for this competition" }, { status: 400 });
    }

    // Check duplicate registration
    const existing = event.registrations.find((r: any) => r.student_id === user.id);
    if (existing && existing.status === 'REGISTERED') {
      return NextResponse.json({ error: "You are already registered for this competition" }, { status: 400 });
    }

    // Check max capacity
    const activeCount = event.registrations.filter((r: any) => r.status === 'REGISTERED').length;
    if (activeCount >= event.max_participants) {
      return NextResponse.json({ error: "Maximum participant capacity reached" }, { status: 400 });
    }

    let teamId: string | undefined = undefined;

    // If Team Competition, assign or create a team
    if (event.is_team) {
      let openTeam = event.teams.find((t: any) => t.members.length < event.team_size);

      if (!openTeam) {
        const teamCount = event.teams.length + 1;
        openTeam = await db.codingTeam.create({
          data: {
            event_id: eventId,
            team_name: `Team Delta ${teamCount}`,
            team_number: teamCount,
          },
          include: { members: true },
        });
      }

      await db.codingTeamMember.create({
        data: {
          team_id: openTeam.id,
          student_id: user.id,
        },
      });

      teamId = openTeam.id;
    }

    // Upsert registration
    const registration = await db.codingEventRegistration.upsert({
      where: {
        student_id_event_id: {
          student_id: user.id,
          event_id: eventId,
        },
      },
      update: {
        status: 'REGISTERED',
        team_id: teamId,
        registered_at: new Date(),
        cancelled_at: null,
      },
      create: {
        student_id: user.id,
        event_id: eventId,
        status: 'REGISTERED',
        team_id: teamId,
      },
    });

    // Create Notification record for student
    await db.notification.create({
      data: {
        user_id: user.id,
        type: 'REGISTRATION_CONFIRMED',
        title: 'Coding Challenge Registration Confirmed 🚀',
        message: `You have successfully registered for "${event.title}". Prepare your algorithm strategy!`,
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        actor_id: user.id,
        action: 'STUDENT_REGISTERED_CODING_EVENT',
        target: eventId,
        details: JSON.stringify({ title: event.title, isTeam: event.is_team, teamId }),
      },
    });

    return NextResponse.json({
      message: "Registration successful! You are now locked in for the Coding Challenge.",
      registration,
    });
  } catch (error: any) {
    console.error("POST /api/coding/events/[id]/register error:", error);
    return NextResponse.json({ error: error.message || "Failed to register for event" }, { status: 500 });
  }
}
