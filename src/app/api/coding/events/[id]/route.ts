import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession();
    const eventId = params.id;

    const event = await db.codingEvent.findUnique({
      where: { id: eventId },
      include: {
        challenges: {
          where: { status: 'RELEASED' },
          orderBy: { points: 'asc' },
        },
        winners: {
          include: {
            student: { select: { id: true, name: true, usn: true } },
            team: {
              include: {
                members: {
                  include: {
                    student: { select: { name: true, usn: true } },
                  },
                },
              },
            },
          },
        },
        teams: {
          include: {
            members: {
              include: {
                student: { select: { id: true, name: true, usn: true } },
              },
            },
          },
        },
        registrations: {
          select: {
            id: true,
            student_id: true,
            status: true,
            team_id: true,
            registered_at: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Coding event not found" }, { status: 404 });
    }

    let userRegistration = null;
    let userTeam = null;
    let userSubmissions: any[] = [];

    if (user) {
      userRegistration = event.registrations.find((r: any) => r.student_id === user.id);

      if (event.is_team) {
        userTeam = event.teams.find((t: any) =>
          t.members.some((m: any) => m.student_id === user.id)
        );
      }

      userSubmissions = await db.codingSubmission.findMany({
        where: {
          event_id: eventId,
          student_id: user.id,
        },
        include: {
          challenge: { select: { title: true, points: true } },
        },
        orderBy: { submitted_at: 'desc' },
      });
    }

    return NextResponse.json({
      event,
      userRegistration,
      userTeam,
      userSubmissions,
    });
  } catch (error: any) {
    console.error("GET /api/coding/events/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch competition details" }, { status: 500 });
  }
}
