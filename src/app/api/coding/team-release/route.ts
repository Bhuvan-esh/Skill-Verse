import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/coding/team-release
 * Returns the release status of teams for the active coding event.
 * Accessible by FOUNDER, VOLUNTEER (Visual Architects).
 */
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!["FOUNDER", "VOLUNTEER"].includes(user.role)) {
      return NextResponse.json({ error: "Only Visual Architects (Founder/Volunteer) can access this." }, { status: 403 });
    }

    // Get all team-based coding events
    const events = await db.codingEvent.findMany({
      where: { is_team: true },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        is_team: true,
        team_release_status: true,
        team_release_time: true,
        team_department: true,
        _count: { select: { teams: true, registrations: true } },
      },
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error("GET /api/coding/team-release error:", error);
    return NextResponse.json({ error: "Failed to fetch team release info" }, { status: 500 });
  }
}

/**
 * POST /api/coding/team-release
 * Visual Architects release or revoke team visibility for students.
 *
 * Body: {
 *   eventId: string
 *   action: "RELEASE" | "REVOKE" | "GENERATE"
 *   releaseTime?: string  (ISO datetime — optional, defaults to now())
 *   department?: string   (e.g. "AIDS_AIML" or "ALL")
 * }
 */
export async function POST(req: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!["FOUNDER", "VOLUNTEER"].includes(user.role)) {
      return NextResponse.json({ error: "Only Visual Architects (Founder/Volunteer) can perform this action." }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, action, releaseTime, department } = body;

    if (!eventId || !action) {
      return NextResponse.json({ error: "eventId and action are required." }, { status: 400 });
    }

    const event = await db.codingEvent.findUnique({
      where: { id: eventId },
      include: {
        registrations: { where: { status: "REGISTERED" }, include: { student: true } },
        teams: { include: { members: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Coding event not found." }, { status: 404 });
    }

    // GENERATE — AI-style team generation: auto-balance registrations across teams
    if (action === "GENERATE") {
      const registrations = event.registrations;

      if (registrations.length === 0) {
        return NextResponse.json({ error: "No registered students to generate teams from." }, { status: 400 });
      }

      // Delete existing teams (reset)
      await db.codingTeamMember.deleteMany({
        where: { team: { event_id: eventId } },
      });
      await db.codingTeam.deleteMany({ where: { event_id: eventId } });

      // Shuffle students randomly (simulates AI multi-year balancing)
      const shuffled = [...registrations].sort(() => Math.random() - 0.5);
      const teamSize = event.team_size || 4;
      const teamCount = Math.ceil(shuffled.length / teamSize);
      const teamNames = [
        "Algorithmic Titans", "Binary Architects", "Data Pioneers",
        "Quantum Debuggers", "Neural Sprinters", "Logic Builders",
      ];

      for (let t = 0; t < teamCount; t++) {
        const teamStudents = shuffled.slice(t * teamSize, (t + 1) * teamSize);
        const teamName = teamNames[t % teamNames.length] || `Team #${t + 1}`;

        const newTeam = await db.codingTeam.create({
          data: {
            event_id: eventId,
            team_name: teamName,
            team_number: t + 1,
          },
        });

        for (const reg of teamStudents) {
          await db.codingTeamMember.create({
            data: {
              team_id: newTeam.id,
              student_id: reg.student_id,
            },
          });

          // Update registration with team assignment
          await db.codingEventRegistration.update({
            where: { id: reg.id },
            data: { team_id: newTeam.id },
          });
        }
      }

      // Audit log
      await db.auditLog.create({
        data: {
          actor_id: user.id,
          action: "VISUAL_ARCHITECT_GENERATED_TEAMS",
          target: eventId,
          details: JSON.stringify({ teamCount, totalStudents: shuffled.length }),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Generated ${teamCount} team(s) from ${shuffled.length} registered students.`,
        teamCount,
      });
    }

    // RELEASE — make teams visible to students
    if (action === "RELEASE") {
      const resolvedTime = releaseTime ? new Date(releaseTime) : new Date();

      await db.codingEvent.update({
        where: { id: eventId },
        data: {
          team_release_status: "RELEASED",
          team_release_time: resolvedTime,
          ...(department ? { team_department: department } : {}),
        },
      });

      await db.auditLog.create({
        data: {
          actor_id: user.id,
          action: "VISUAL_ARCHITECT_RELEASED_TEAMS",
          target: eventId,
          details: JSON.stringify({ releaseTime: resolvedTime, department }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Teams have been released! Students can now view their team details.",
        team_release_status: "RELEASED",
        team_release_time: resolvedTime,
      });
    }

    // REVOKE — hide teams from students again
    if (action === "REVOKE") {
      await db.codingEvent.update({
        where: { id: eventId },
        data: {
          team_release_status: "PENDING",
          team_release_time: null,
        },
      });

      await db.auditLog.create({
        data: {
          actor_id: user.id,
          action: "VISUAL_ARCHITECT_REVOKED_TEAMS",
          target: eventId,
          details: JSON.stringify({ revokedAt: new Date() }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Team release has been revoked. Teams are now hidden from students.",
        team_release_status: "PENDING",
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/coding/team-release error:", error);
    return NextResponse.json({ error: error.message || "Failed to update team release status" }, { status: 500 });
  }
}
