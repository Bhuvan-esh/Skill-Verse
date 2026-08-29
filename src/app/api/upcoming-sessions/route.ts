import { NextResponse } from 'next/server';

export interface ClubSession {
  id: string;
  title: string;
  speaker: string;
  domain: string;
  date: string;
  description: string;
  accepted?: boolean;
}

// Initial Upcoming Club Sessions
const GLOBAL_SESSIONS: ClubSession[] = [
  {
    id: 'sess-1',
    title: 'AI Code Review & Automated Agent Hackathon',
    speaker: 'Alex Johnson',
    domain: 'Skill League · CS-Lec-4',
    date: '📅 Tomorrow, 4:00 PM',
    description: 'A contest where students build dynamic prompts and agents to perform automated security audits.',
  },
  {
    id: 'sess-2',
    title: 'Full-Stack Next.js 14 & Prisma Bootcamp',
    speaker: 'Priya Sharma',
    domain: 'Web Architecture · CS-Lec-2',
    date: '📅 20 Apr, 2:30 PM',
    description: 'Hands-on session building server actions, database schemas, and authenticated REST endpoints.',
  },
  {
    id: 'sess-3',
    title: 'Docker Containerization & Kubernetes Workflow',
    speaker: 'Sanjay V',
    domain: 'Cloud DevOps · CS-Lec-3',
    date: '📅 22 Apr, 5:00 PM',
    description: 'Walkthrough covering Dockerfiles, multi-stage builds, container networking, and cluster orchestration.',
  },
];

// User accepted sessions store (userId -> Set of session IDs)
const USER_ACCEPTED_SESSIONS: Record<string, string[]> = {
  default: [],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default';
    const acceptedIds = USER_ACCEPTED_SESSIONS[userId] || USER_ACCEPTED_SESSIONS['default'] || [];

    const sessionsWithStatus = GLOBAL_SESSIONS.map((s) => ({
      ...s,
      accepted: acceptedIds.includes(s.id),
    }));

    return NextResponse.json({
      success: true,
      sessions: sessionsWithStatus,
      totalAttended: acceptedIds.length + 12, // Baseline attendance + accepted sessions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, userId = 'default' } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = GLOBAL_SESSIONS.find((s) => s.id === sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!USER_ACCEPTED_SESSIONS[userId]) {
      USER_ACCEPTED_SESSIONS[userId] = [];
    }

    if (!USER_ACCEPTED_SESSIONS[userId].includes(sessionId)) {
      USER_ACCEPTED_SESSIONS[userId].push(sessionId);
    }

    const acceptedIds = USER_ACCEPTED_SESSIONS[userId];
    const updatedSessions = GLOBAL_SESSIONS.map((s) => ({
      ...s,
      accepted: acceptedIds.includes(s.id),
    }));

    return NextResponse.json({
      success: true,
      sessionId,
      message: `✓ Attendance confirmed for "${session.title}" (+15 Attendance Credits)!`,
      sessions: updatedSessions,
      totalAttended: acceptedIds.length + 12,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to accept session' }, { status: 500 });
  }
}
