import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export interface VideoReview {
  id: string;
  reviewer_name: string;
  rating: number; // 1 to 5
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  feedback_text: string;
  created_at: string;
  credit_impact: number;
}

export interface LearningVideo {
  id: string;
  student_name: string;
  google_email: string;
  phone_number: string;
  title: string;
  topic: string;
  domain: string;
  video_url: string;
  video_filename?: string;
  video_size?: string;
  thumbnail_url?: string;
  description: string;
  creator_credits: number;
  leaderboard_points: number;
  average_rating: number;
  views: number;
  created_at: string;
  reviews: VideoReview[];
}

// In-memory backing store for PeerVault learning videos
const GLOBAL_PEERVAULT_VIDEOS: LearningVideo[] = [
  {
    id: 'vid-1',
    student_name: 'Rahul Sharma',
    google_email: 'rahul.sharma.cse@rvce.edu.in',
    phone_number: '+91 98450 78901',
    title: 'PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified',
    topic: 'Database Systems & Performance Tuning',
    domain: 'Database Systems',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_filename: 'postgres_indexing_breakdown.mp4',
    video_size: '14.2 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Self-recorded walkthrough demonstrating how PostgreSQL evaluates execution plans, builds B-Tree index scans, and eliminates sequential table scans.',
    creator_credits: 185,
    leaderboard_points: 340,
    average_rating: 4.9,
    views: 128,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    reviews: [
      {
        id: 'rev-1',
        reviewer_name: 'Anusha A',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Super clear self-made video walkthrough! Solved my query latency issue in seconds.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        credit_impact: 15,
      },
      {
        id: 'rev-2',
        reviewer_name: 'Meera K',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Loved the live terminal demo of heap pointers and buffer caches. Deserves top spot on the leaderboard!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        credit_impact: 15,
      },
    ],
  },
  {
    id: 'vid-2',
    student_name: 'Meera K',
    google_email: 'meera.k.aiml@rvce.edu.in',
    phone_number: '+91 98450 65432',
    title: 'Next.js 14 App Router, Server Actions & Streaming SSR',
    topic: 'Modern Full-Stack React Architecture',
    domain: 'Web Development',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_filename: 'nextjs14_app_router_demo.mp4',
    video_size: '18.6 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description: 'Recorded code session showing production Next.js 14 nested layouts, zero-API Server Actions, Suspense streaming, and optimistic mutations.',
    creator_credits: 160,
    leaderboard_points: 295,
    average_rating: 4.8,
    views: 94,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    reviews: [
      {
        id: 'rev-3',
        reviewer_name: 'Sanjay V',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Awesome live coding recording on parallel routes and streaming SSR components. Great job!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        credit_impact: 15,
      },
    ],
  },
  {
    id: 'vid-3',
    student_name: 'Sanjay V',
    google_email: 'sanjay.v.aids@rvce.edu.in',
    phone_number: '+91 98450 32109',
    title: 'Docker Multi-Stage Builds & Kubernetes Pod Orchestration',
    topic: 'Containerization & Microservices DevOps',
    domain: 'Cloud DevOps',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    video_filename: 'docker_multistage_microservices.mp4',
    video_size: '12.8 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
    description: 'Direct recording demonstrating how to shrink Docker image sizes using Alpine multi-stage builds and configure local Minikube cluster pods.',
    creator_credits: 140,
    leaderboard_points: 260,
    average_rating: 4.9,
    views: 82,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reviews: [
      {
        id: 'rev-4',
        reviewer_name: 'Rahul Sharma',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Shrunk our container image from 1.2GB down to 68MB. Phenomenal video guide!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        credit_impact: 15,
      },
    ],
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase();
    const domain = searchParams.get('domain') || 'ALL';

    let filtered = [...GLOBAL_PEERVAULT_VIDEOS];

    if (domain !== 'ALL') {
      filtered = filtered.filter(v => v.domain.toLowerCase() === domain.toLowerCase());
    }

    if (query) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.topic.toLowerCase().includes(query) ||
        v.student_name.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.domain.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      videos: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch PeerVault videos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let session: any = null;
    try {
      session = await requireAuth(['STUDENT', 'FOUNDER', 'VOLUNTEER']);
    } catch {
      session = null;
    }

    const body = await req.json();
    const {
      student_name,
      google_email,
      phone_number,
      title,
      topic,
      domain,
      video_url,
      video_filename,
      video_size,
      description,
    } = body;

    if (!student_name || !google_email || !phone_number || !title || !topic || !video_url) {
      return NextResponse.json(
        { error: 'Please provide Name, Google Email, Phone Number, Title, Topic and upload a valid video file.' },
        { status: 400 }
      );
    }

    const newVideo: LearningVideo = {
      id: `vid-${Date.now()}`,
      student_name: student_name.trim(),
      google_email: google_email.trim(),
      phone_number: phone_number.trim(),
      title: title.trim(),
      topic: topic.trim(),
      domain: domain || 'Web Development',
      video_url: video_url.trim(),
      video_filename: video_filename || 'peer_recorded_walkthrough.mp4',
      video_size: video_size || 'Video File',
      description: description?.trim() || 'Student-created learning video walkthrough.',
      creator_credits: 50, // Initial publishing credit boost
      leaderboard_points: 100,
      average_rating: 5.0,
      views: 1,
      created_at: new Date().toISOString(),
      reviews: [],
    };

    GLOBAL_PEERVAULT_VIDEOS.unshift(newVideo);

    return NextResponse.json({
      success: true,
      video: newVideo,
      message: '✓ Peer video successfully uploaded to PeerVault! +50 Credits & +100 Leaderboard points awarded.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to upload video to PeerVault' }, { status: 500 });
  }
}
