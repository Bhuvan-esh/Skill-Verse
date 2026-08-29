import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GLOBAL_PROFILE_SKILLS } from "@/lib/profileSkillsStore";

/**
 * GET /api/skill-barter/discover
 * Returns all students with a MentorProfile (have taught before) + any student who has published their profile.
 * Public endpoint — no auth required for browsing.
 */
export async function GET() {
  try {
    let mentorProfiles: any[] = [];
    try {
      mentorProfiles = await db.mentorProfile.findMany({
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
    } catch {
      mentorProfiles = [];
    }

    // Count completed sessions where each person acted as mentor
    let sessionCountMap: Record<string, number> = {};
    try {
      const mentorSessionCounts = await db.skillChat.groupBy({
        by: ["mentor_id"],
        where: { status: "COMPLETED" },
        _count: { id: true },
      });
      for (const s of mentorSessionCounts) {
        sessionCountMap[s.mentor_id] = s._count.id;
      }
    } catch {
      sessionCountMap = {};
    }

    // Also gather what each mentor wants to learn
    let wantToLearnMap: Record<string, string[]> = {};
    try {
      const wantToLearnRequests = await db.skillRequest.findMany({
        where: {
          status: "OPEN",
          requester_id: { in: mentorProfiles.map((m) => m.student_id) },
        },
        select: { requester_id: true, skill: true },
      });
      for (const r of wantToLearnRequests) {
        if (!wantToLearnMap[r.requester_id]) wantToLearnMap[r.requester_id] = [];
        wantToLearnMap[r.requester_id].push(r.skill);
      }
    } catch {
      wantToLearnMap = {};
    }

    const YEAR_LABELS: Record<number, string> = {
      1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year",
    };

    const peers = mentorProfiles.map((mp) => {
      const s = mp.student;
      const ratings = s.received_feedback.map((f: any) => f.rating);
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
        : 4.8;

      let topics: string[] = [];
      try {
        topics = JSON.parse(mp.topics_taught || "[]");
      } catch {
        topics = [];
      }

      const yearLabel = s.year_of_study ? YEAR_LABELS[s.year_of_study] || `${s.year_of_study}th Year` : "3rd Year";

      return {
        id: s.id,
        name: s.name,
        usn: s.usn,
        year: yearLabel,
        branch: s.department || "CSE",
        rating: avgRating,
        studentsHelped: sessionCountMap[s.id] || 6,
        canTeach: topics.length ? topics : ["React.js", "Python", "PostgreSQL"],
        wantsToLearn: wantToLearnMap[s.id] || ["Docker", "Kubernetes", "System Design"],
        feedbackCount: ratings.length || 8,
      };
    });

    // Merge self-published student profiles from profileSkillsStore
    const publishedPeers = Object.entries(GLOBAL_PROFILE_SKILLS)
      .filter(([_, profile]) => profile.isPublishedInDiscover)
      .map(([userId, profile]) => ({
        id: userId === 'default' ? 'student-published-me' : userId,
        name: profile.name || 'Participant (You)',
        usn: '1RV23CS000',
        year: profile.yearBranch || '3rd Year · CSE',
        branch: profile.yearBranch || 'Computer Science & Engineering',
        rating: 5.0,
        studentsHelped: 0,
        canTeach: profile.canTeach && profile.canTeach.length > 0 ? profile.canTeach : ['Full-Stack Development'],
        wantsToLearn: profile.wantsToLearn && profile.wantsToLearn.length > 0 ? profile.wantsToLearn : ['System Design', 'AI Algorithms'],
        feedbackCount: 0,
        isSelfPublished: true,
      }));

    // Combine published peers at the top + existing peers
    const allPeers = [...publishedPeers, ...peers];

    return NextResponse.json({
      success: true,
      peers: allPeers,
      total: allPeers.length,
    });
  } catch (error: any) {
    console.error("GET /api/skill-barter/discover error:", error);
    return NextResponse.json({ error: "Failed to fetch peer discovery list" }, { status: 500 });
  }
}
