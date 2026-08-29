import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/skill-barter/discover
 * Returns all students with a MentorProfile (have taught before),
 * enriched with: topics_taught, average rating, students helped count.
 * Public endpoint — no auth required for browsing.
 */
export async function GET() {
  try {
    const mentorProfiles = await db.mentorProfile.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            usn: true,
            year_of_study: true,
            department: true,
            received_feedback: {
              select: { rating: true },
            },
          },
        },
      },
    });

    // Count completed sessions where each person acted as mentor
    const mentorSessionCounts = await db.skillChat.groupBy({
      by: ["mentor_id"],
      where: { status: "COMPLETED" },
      _count: { id: true },
    });
    const sessionCountMap: Record<string, number> = {};
    for (const s of mentorSessionCounts) {
      sessionCountMap[s.mentor_id] = s._count.id;
    }

    // Also gather what each mentor wants to learn (their own OPEN skill requests)
    const wantToLearnRequests = await db.skillRequest.findMany({
      where: {
        status: "OPEN",
        requester_id: { in: mentorProfiles.map((m) => m.student_id) },
      },
      select: { requester_id: true, skill: true },
    });
    const wantToLearnMap: Record<string, string[]> = {};
    for (const r of wantToLearnRequests) {
      if (!wantToLearnMap[r.requester_id]) wantToLearnMap[r.requester_id] = [];
      wantToLearnMap[r.requester_id].push(r.skill);
    }

    const YEAR_LABELS: Record<number, string> = {
      1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year",
    };

    const peers = mentorProfiles.map((mp) => {
      const s = mp.student;
      const ratings = s.received_feedback.map((f) => f.rating);
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 4.5;

      let topics: string[] = [];
      try {
        topics = JSON.parse(mp.topics_taught || "[]");
      } catch {
        topics = [];
      }

      const yearLabel = s.year_of_study ? YEAR_LABELS[s.year_of_study] || `${s.year_of_study}th Year` : "N/A";

      return {
        id: s.id,
        name: s.name,
        usn: s.usn,
        year: yearLabel,
        branch: s.department || "CSE",
        rating: avgRating,
        studentsHelped: sessionCountMap[s.id] || 0,
        canTeach: topics,
        wantsToLearn: wantToLearnMap[s.id] || [],
        feedbackCount: ratings.length,
      };
    });

    // Sort by rating desc, then studentsHelped desc
    peers.sort((a, b) => b.rating - a.rating || b.studentsHelped - a.studentsHelped);

    return NextResponse.json({ peers });
  } catch (error: any) {
    console.error("GET /api/skill-barter/discover error:", error);
    return NextResponse.json({ error: "Failed to fetch peer discovery list" }, { status: 500 });
  }
}
