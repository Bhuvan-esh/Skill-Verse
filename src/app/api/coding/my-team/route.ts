import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/coding/my-team
 *
 * Returns the current student"s coding challenge team,
 * gated by the Visual Architects team_release_status on the CodingEvent.
 *
 * Response when NOT released:
 *   { released: false, releaseTime: string|null, department: string, message: string }
 *
 * Response when RELEASED:
 *   { released: true, team: { ... with all member credentials } }
 */
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Find the student"s active registration (most recent REGISTERED status)
    const registration = await db.codingEventRegistration.findFirst({
      where: {
        student_id: user.id,
        status: "REGISTERED",
      },
      orderBy: { registered_at: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            is_team: true,
            team_release_status: true,
            team_release_time: true,
            team_department: true,
          },
        },
        team: {
          include: {
            members: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    usn: true,
                    phone: true,
                    year_of_study: true,
                    department: true,
                    college_email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Student has no active registration
    if (!registration) {
      return NextResponse.json({
        released: false,
        noRegistration: true,
        message: "You are not registered for any active coding challenge.",
        releaseTime: null,
        department: "AIDS_AIML",
      });
    }

    const event = registration.event;

    // Team not yet released by Visual Architects
    if (event.team_release_status !== "RELEASED") {
      return NextResponse.json({
        released: false,
        noRegistration: false,
        releaseTime: event.team_release_time
          ? event.team_release_time.toISOString()
          : null,
        department: event.team_department,
        eventTitle: event.title,
        message: "Your team has been formed but is awaiting Visual Architects release. Stay tuned!",
      });
    }

    // Team is released — find the team the student belongs to
    const teamMembership = await db.codingTeamMember.findFirst({
      where: { student_id: user.id },
      include: {
        team: {
          include: {
            members: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    usn: true,
                    phone: true,
                    year_of_study: true,
                    department: true,
                    college_email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!teamMembership) {
      return NextResponse.json({
        released: true,
        noTeam: true,
        message: "Team released but you have not been assigned to a team yet. Contact Visual Architects.",
        department: event.team_department,
        eventTitle: event.title,
      });
    }

    const team = teamMembership.team;

    // Build the enriched member list
    const YEAR_LABELS: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

    const members = team.members.map((m: any, idx: number) => {
      const s = m.student;
      const isCurrentUser = s.id === user.id;
      const yearLabel = s.year_of_study ? (YEAR_LABELS[s.year_of_study] || `${s.year_of_study}th Year`) : null;
      const cohort = yearLabel && s.department ? `${yearLabel} (${s.department})` : yearLabel || s.department || "N/A";
      return {
        id: m.id,
        student_id: s.id,
        isCurrentUser,
        name: s.name,
        usn: s.usn || "N/A",
        phone: s.phone || "N/A",
        cohort,
        email: isCurrentUser ? s.college_email : undefined,
        role_title: getRoleTitle(idx, isCurrentUser),
        slot: idx + 1,
      };
    });

    return NextResponse.json({
      released: true,
      noTeam: false,
      team: {
        id: team.id,
        name: team.team_name,
        team_number: team.team_number,
        members,
      },
      event: {
        id: event.id,
        title: event.title,
        department: event.team_department,
        releaseTime: event.team_release_time,
      },
    });
  } catch (error: any) {
    console.error("GET /api/coding/my-team error:", error);
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}

function getRoleTitle(index: number, isCurrentUser: boolean): string {
  if (isCurrentUser) return "Lead Algorithmic Architect";
  const titles = [
    "Core Logic & Data Engineer",
    "Debugging & Edge-Case Specialist",
    "Junior Systems Modeler",
    "Algorithm Optimization Analyst",
  ];
  return titles[index % titles.length] || "Team Member";
}
