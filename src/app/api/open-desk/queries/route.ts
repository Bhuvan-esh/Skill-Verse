import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export interface OpenDeskQuery {
  id: string;
  student_id: string;
  student_name: string;
  student_usn?: string;
  category: string;
  topic: string;
  query: string;
  created_at: string;
  status: 'PENDING' | 'ANSWERED';
  is_public: boolean;
  reply?: string;
  replied_by?: string;
  replied_at?: string;
}

// In-memory persistent query store with realistic data
let QUERIES_STORE: OpenDeskQuery[] = [
  {
    id: 'query-1',
    student_id: 'std-rahul',
    student_name: 'Rahul Sharma',
    student_usn: '1MS21CS089',
    category: 'Architecture & Credits',
    topic: 'How are SkillBarter credits counted towards Domain 4 accreditation?',
    query: 'If I complete 5 peer mentoring sessions in PostgreSQL and backend, does that automatically sync with my Domain 4 credits on the main dashboard, or do I need manual founder approval?',
    created_at: '2026-08-24T10:15:00Z',
    status: 'ANSWERED',
    is_public: true,
    reply: 'SkillBarter sessions automatically increment your Activity Credits immediately upon session completion. The Credit Engine computes and credits Domain 4 points in real-time, requiring no manual sign-off.',
    replied_by: 'Visual Architect (Founder Lead)',
    replied_at: '2026-08-24T14:30:00Z',
  },
  {
    id: 'query-2',
    student_id: 'std-meera',
    student_name: 'Meera K',
    student_usn: '1MS22AI045',
    category: 'Session Guidelines',
    topic: 'Can 2nd year students request 1:1 barter sessions with final year project leads?',
    query: 'Are there any restrictions on cross-year peer requests for advanced machine learning topics like PyTorch neural architectures?',
    created_at: '2026-08-24T12:00:00Z',
    status: 'ANSWERED',
    is_public: true,
    reply: 'All year tiers have open access to peer exchange across all domains. You can discover and request sessions with any verified student builder on the platform without restriction.',
    replied_by: 'Visual Architect (System Design)',
    replied_at: '2026-08-24T16:45:00Z',
  },
  {
    id: 'query-3',
    student_id: 'std-anusha',
    student_name: 'Anusha A',
    student_usn: '1MS22CS034',
    category: 'Reputation Marks',
    topic: 'How to obtain the Verified Builder shield mark on student profile?',
    query: 'I have completed 8 sessions and helped 6 peers. When will the Verified Builder mark update on the public leaderboard and profile card?',
    created_at: '2026-08-25T08:00:00Z',
    status: 'ANSWERED',
    is_public: true,
    reply: 'The achievement engine checks your metrics in real-time. Since you have exceeded 6 helped peers and maintained a 4.9 rating, the Verified Builder mark is active across your profile and top app bar.',
    replied_by: 'Visual Architect (Founder Lead)',
    replied_at: '2026-08-25T09:30:00Z',
  },
];

export async function GET(req: Request) {
  try {
    let session: any = null;
    try {
      session = await requireAuth(['STUDENT', 'FOUNDER', 'VOLUNTEER']);
    } catch {
      session = null;
    }

    const isVisualArchitect =
      session &&
      (session.role === 'FOUNDER' ||
        (session.name && (session.name.toUpperCase().includes('ARCHITECT') || session.name.toUpperCase().includes('FOUNDER'))));

    // If Visual Architect: see all queries (both pending and answered)
    if (isVisualArchitect) {
      return NextResponse.json({
        isVisualArchitect: true,
        queries: QUERIES_STORE,
      });
    }

    // For Participants/Students:
    // 1. All ANSWERED queries (publicly visible)
    // 2. Their OWN PENDING queries (private to them)
    const visibleQueries = QUERIES_STORE.filter(
      (q) => q.is_public || (session && (q.student_id === session.id || q.student_name === session.name))
    );

    return NextResponse.json({
      isVisualArchitect: false,
      queries: visibleQueries,
    });
  } catch (error: any) {
    return NextResponse.json({
      isVisualArchitect: false,
      queries: QUERIES_STORE.filter((q) => q.is_public),
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER', 'VOLUNTEER']);
    const body = await req.json();
    const isVisualArchitect =
      session.role === 'FOUNDER' ||
      (session.name && (session.name.toUpperCase().includes('ARCHITECT') || session.name.toUpperCase().includes('FOUNDER')));

    // Action 1: Visual Architect replying to a query
    if (body.action === 'REPLY') {
      if (!isVisualArchitect) {
        return NextResponse.json(
          { error: 'Forbidden: Only Visual Architects can reply to student queries.' },
          { status: 403 }
        );
      }

      const { queryId, replyText } = body;
      if (!queryId || !replyText?.trim()) {
        return NextResponse.json({ error: 'Query ID and reply text are required.' }, { status: 400 });
      }

      const queryIdx = QUERIES_STORE.findIndex((q) => q.id === queryId);
      if (queryIdx === -1) {
        return NextResponse.json({ error: 'Query not found.' }, { status: 404 });
      }

      QUERIES_STORE[queryIdx] = {
        ...QUERIES_STORE[queryIdx],
        reply: replyText.trim(),
        replied_by: session.name || 'Visual Architect',
        replied_at: new Date().toISOString(),
        status: 'ANSWERED',
        is_public: true, // Becomes visible to all participants
      };

      return NextResponse.json({
        success: true,
        message: 'Query answered and published to all participants.',
        query: QUERIES_STORE[queryIdx],
      });
    }

    // Action 2: Participant submitting a new query
    const { category, topic, query } = body;
    if (!category || !topic?.trim() || !query?.trim()) {
      return NextResponse.json({ error: 'Category, topic, and query text are required.' }, { status: 400 });
    }

    const newQuery: OpenDeskQuery = {
      id: `query-${Date.now()}`,
      student_id: session.id,
      student_name: session.name || 'Participant',
      student_usn: session.usn || undefined,
      category: category.trim(),
      topic: topic.trim(),
      query: query.trim(),
      created_at: new Date().toISOString(),
      status: 'PENDING',
      is_public: false, // Visible only to Visual Architect and the submitting student until answered
    };

    QUERIES_STORE.unshift(newQuery);

    return NextResponse.json({
      success: true,
      message: 'Your query has been sent to the Visual Architects. Guaranteed reply within 24 hours.',
      query: newQuery,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
