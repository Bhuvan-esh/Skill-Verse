import { NextResponse } from 'next/server';
import { getSession, requireAuth } from '@/lib/auth';

export interface VideoQueryRequest {
  id: string;
  video_id: string;
  video_title: string;
  topic: string;
  author_name: string;
  author_email: string;
  author_phone?: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  query_message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
  accepted_at?: string;
  session_id?: string;
}

// In-memory store for video query requests
const GLOBAL_VIDEO_QUERIES: VideoQueryRequest[] = [
  {
    id: 'vq-seed-1',
    video_id: 'vid-1',
    video_title: 'PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified',
    topic: 'Database Systems & Performance Tuning',
    author_name: 'Rahul Sharma',
    author_email: 'rahul.sharma.cse@rvce.edu.in',
    author_phone: '+91 98450 78901',
    requester_name: 'Anusha A',
    requester_email: 'anusha.student@rvce.edu.in',
    requester_phone: '+91 98450 99887',
    query_message: 'Watched your video on B-Tree index scan. Wanted to resolve queries on composite index ordering vs filter selectivity.',
    status: 'ACCEPTED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    accepted_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    session_id: 's-1',
  },
  {
    id: 'vq-seed-2',
    video_id: 'vid-2',
    video_title: 'Next.js 14 App Router, Server Actions & Streaming SSR',
    topic: 'Modern Full-Stack React Architecture',
    author_name: 'Meera K',
    author_email: 'meera.k.aiml@rvce.edu.in',
    author_phone: '+91 98450 65432',
    requester_name: 'demo L',
    requester_email: 'demo.student@rvce.edu.in',
    requester_phone: '+91 98450 12345',
    query_message: 'Hi Meera! I watched your PeerVault video on Next.js 14. I have queries regarding server action revalidation with optimistic UI.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    // Must be authenticated — Founders see all, students/mentors see their own
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const author_email = searchParams.get('author_email');
    const requester_email = searchParams.get('requester_email');

    let queries = [...GLOBAL_VIDEO_QUERIES];

    // Founders (Visual Architects) see everything — no filter applied
    if (session.role !== 'FOUNDER') {
      if (author_email) {
        queries = queries.filter(q => q.author_email.toLowerCase() === author_email.toLowerCase());
      } else if (requester_email) {
        queries = queries.filter(q => q.requester_email.toLowerCase() === requester_email.toLowerCase());
      } else {
        // Non-founders without a filter only see their own queries
        queries = queries.filter(q =>
          q.author_email.toLowerCase() === session.college_email.toLowerCase() ||
          q.requester_email.toLowerCase() === session.college_email.toLowerCase()
        );
      }
    }

    return NextResponse.json({
      success: true,
      queries,
      total: queries.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch video queries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Must be authenticated to send a video query
    const session = await requireAuth(['STUDENT', 'FOUNDER', 'VOLUNTEER']);

    const body = await req.json();
    const {
      video_id,
      video_title,
      topic,
      author_name,
      author_email,
      author_phone,
      requester_name,
      requester_email,
      requester_phone,
      query_message,
    } = body;

    if (!video_id || !author_name || !requester_name || !query_message) {
      return NextResponse.json(
        { error: 'Missing required video or requester details' },
        { status: 400 }
      );
    }

    // Prevent excessively long payloads
    if (query_message.trim().length > 1000) {
      return NextResponse.json({ error: 'Query message too long (max 1000 characters).' }, { status: 400 });
    }

    const newQuery: VideoQueryRequest = {
      id: `vq-${Date.now()}`,
      video_id,
      video_title: video_title || 'PeerVault Walkthrough',
      topic: topic || 'Peer Learning',
      author_name,
      author_email: author_email || 'author@rvce.edu.in',
      author_phone,
      requester_name: session.name || requester_name,
      requester_email: session.college_email || requester_email || 'requester@rvce.edu.in',
      requester_phone,
      query_message: query_message.trim(),
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    GLOBAL_VIDEO_QUERIES.unshift(newQuery);

    return NextResponse.json({
      success: true,
      query: newQuery,
      message: `✓ Request sent to ${author_name}'s account! Communication will unlock once ${author_name} accepts your request.`,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message || 'Failed to send query request' }, { status });
  }
}
