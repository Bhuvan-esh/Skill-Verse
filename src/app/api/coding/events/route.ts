import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getSession();

    // Check if any coding events exist; if not, seed initial high-quality coding competitions
    let events = await db.codingEvent.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        registrations: {
          select: {
            student_id: true,
            status: true,
            registered_at: true,
          },
        },
        challenges: true,
        winners: {
          include: {
            student: {
              select: { name: true, usn: true },
            },
            team: {
              select: { team_name: true },
            },
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (events.length === 0) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Seed 1: Live Individual Algorithmic Showdown
      const liveEvent = await db.codingEvent.create({
        data: {
          title: "Algorithmic Sprint 2026",
          description: "Time-critical coding challenge testing data structures, dynamic programming, and graph optimization algorithms.",
          category: "ALGORITHMS",
          difficulty: "HARD",
          is_team: false,
          team_size: 1,
          max_participants: 150,
          status: "LIVE",
          event_date: now,
          registration_deadline: nextWeek,
          cancellation_deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          credits_reward: 100,
          rules: "1. All solutions must pass within 2.0s time limit.\n2. No external library imports outside standard built-ins.\n3. Independent individual submissions.",
          eligibility: "Open to all registered student club members.",
          winner_count: 3,
          support_contact: "coding-sprint@studentclub.edu",
        },
      });

      // Seed Challenges for Live Event
      await db.codingChallenge.createMany({
        data: [
          {
            event_id: liveEvent.id,
            title: "Subarray Sum Matrix Optimization",
            description: "Find the maximum sum contiguous submatrix in an N x M grid with negative weights.",
            problem_statement: "Given a 2D integer matrix of size N x M (-1000 <= A[i][j] <= 1000), compute the maximum submatrix sum in O(N^3) time complexity.",
            difficulty: "MEDIUM",
            points: 100,
            time_limit: 45,
            input_info: "Line 1: N, M. Next N lines contain M space-separated integers.",
            output_info: "Single integer representing maximum contiguous submatrix sum.",
            constraints: "1 <= N, M <= 300",
            status: "RELEASED",
          },
          {
            event_id: liveEvent.id,
            title: "Shortest Path with K Energy Teleports",
            description: "Graph traversal problem with limited teleportation charges.",
            problem_statement: "Given a weighted directed graph with V vertices and E edges, calculate the shortest path from Source to Target allowing up to K edge weight overrides to 0.",
            difficulty: "HARD",
            points: 150,
            time_limit: 60,
            input_info: "Line 1: V, E, K, Source, Target. Next E lines contain u v w.",
            output_info: "Minimum path cost after utilizing at most K teleports.",
            constraints: "1 <= V <= 1000, 1 <= E <= 5000, 0 <= K <= 5",
            status: "RELEASED",
          },
        ],
      });

      // Seed 2: Upcoming Team Hackathon Competition
      await db.codingEvent.create({
        data: {
          title: "Hackathon CodeSprint: AI & Web Systems",
          description: "Full-stack hackathon & algorithmic team challenge building high-concurrency microservices and smart predictive pipelines.",
          category: "SYSTEMS",
          difficulty: "MEDIUM",
          is_team: true,
          team_size: 3,
          max_participants: 60,
          status: "REGISTRATION_OPEN",
          event_date: nextWeek,
          registration_deadline: nextWeek,
          cancellation_deadline: new Date(nextWeek.getTime() - 24 * 60 * 60 * 1000),
          credits_reward: 150,
          rules: "1. Teams must consist of 3 members assigned by random skill balance.\n2. Both members share team score and credit rewards.",
          eligibility: "Open to all registered student club members.",
          winner_count: 3,
          support_contact: "hackathon@studentclub.edu",
        },
      });

      // Seed 3: Completed Competition with Podium Winners
      await db.codingEvent.create({
        data: {
          title: "Winter SpeedCode Championship",
          description: "Annual speed-coding tournament focused on rapid syntax, recursion, and string manipulation.",
          category: "SPEEDCODE",
          difficulty: "EASY",
          is_team: false,
          team_size: 1,
          max_participants: 100,
          status: "COMPLETED",
          event_date: pastWeek,
          registration_deadline: pastWeek,
          cancellation_deadline: pastWeek,
          credits_reward: 80,
          rules: "Fastest clean submission wins.",
          eligibility: "All club members",
          winner_count: 3,
          support_contact: "wintercode@studentclub.edu",
        },
      });

      // Re-fetch formatted events list
      events = await db.codingEvent.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          registrations: {
            select: {
              student_id: true,
              status: true,
              registered_at: true,
            },
          },
          challenges: true,
          winners: {
            include: {
              student: {
                select: { name: true, usn: true },
              },
              team: {
                select: { team_name: true },
              },
            },
          },
          _count: {
            select: { registrations: true },
          },
        },
      });
    }

    return NextResponse.json({ events, currentUserId: user?.id });
  } catch (error: any) {
    console.error("GET /api/coding/events error:", error);
    const fallbackDemoEvents = [
      {
        id: "demo-event-1",
        title: "Algorithmic Sprint 2026: Concurrency & Graph Partitioning",
        description: "Time-critical coding challenge testing data structures, dynamic programming, streaming telemetry pipelines, and graph optimization algorithms.",
        category: "ALGORITHMS",
        difficulty: "HARD",
        is_team: true,
        team_size: 4,
        max_participants: 150,
        status: "LIVE",
        credits_reward: 150,
        rules: "1. All solutions must pass within 2.0s time limit.\n2. Sub-16MB memory bound constraint.\n3. Squad members collaborate on multi-tier tasks.",
        eligibility: "Open to all registered student club members.",
        winner_count: 3,
        registrations: [],
        challenges: [
          {
            id: "chal-1",
            title: "Subarray Sum Matrix Optimization",
            description: "Find the maximum sum contiguous submatrix in an N x M grid with negative weights in O(N^3) time.",
            difficulty: "MEDIUM",
            points: 100,
            time_limit: 45,
            status: "RELEASED",
          },
          {
            id: "chal-2",
            title: "Shortest Path with K Energy Teleports",
            description: "Graph traversal algorithm allowing up to K edge weight overrides to 0.",
            difficulty: "HARD",
            points: 150,
            time_limit: 60,
            status: "RELEASED",
          },
        ],
      },
      {
        id: "demo-event-2",
        title: "Hackathon CodeSprint: AI & Web Microservices",
        description: "Full-stack hackathon & algorithmic team challenge building high-concurrency microservices and smart predictive pipelines.",
        category: "SYSTEMS & AI",
        difficulty: "MEDIUM",
        is_team: true,
        team_size: 3,
        max_participants: 60,
        status: "REGISTRATION_OPEN",
        credits_reward: 200,
        rules: "1. Teams must consist of 3 members assigned by random skill balance.\n2. All members share team score and credit rewards.",
        eligibility: "Open to all registered student club members.",
        winner_count: 3,
        registrations: [],
        challenges: [],
      },
      {
        id: "demo-event-3",
        title: "SpeedCode Arena: Bit Manipulation & Graph Traversal",
        description: "Rapid-fire solo algorithmic sprint testing bitwise masks, fast modular exponentiation, and topological DAG sorts.",
        category: "SPEEDCODE",
        difficulty: "MEDIUM",
        is_team: false,
        team_size: 1,
        max_participants: 100,
        status: "REGISTRATION_OPEN",
        credits_reward: 100,
        rules: "Fastest clean submission wins.",
        eligibility: "All club members",
        winner_count: 3,
        registrations: [],
        challenges: [],
      },
    ];
    return NextResponse.json({ events: fallbackDemoEvents, currentUserId: null });
  }
}
