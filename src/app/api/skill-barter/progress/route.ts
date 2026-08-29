import { NextResponse } from 'next/server';
import { GLOBAL_SESSION_FEEDBACKS } from '@/lib/sessionFeedbackStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get('name') || 'Anusha A';

    // 1. Mentoring already delivered (From My Sessions teaching & PeerVault published videos)
    const col1Cards = [
      {
        id: 'c1-1',
        avatar: 'RH',
        avatarBg: '#E8B84B',
        avatarColor: '#1A1204',
        name: 'Rahul Sharma',
        role: 'Mentor · Database Systems',
        text: 'Published PeerVault walkthrough on PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE scan evaluation.',
        tags: ['PeerVault', 'PostgreSQL', 'My Sessions'],
        date: '📅 27 Aug',
        comments: 3,
        attachments: 2,
        search: 'rahul sharma database systems postgresql btree indexing peervault walkthrough sessions',
      },
      {
        id: 'c1-2',
        avatar: 'MK',
        avatarBg: '#4FD1C5',
        avatarColor: '#0C1E1B',
        name: 'Meera K',
        role: 'Mentor · Web Architecture',
        text: 'Conducted 1:1 live session and PeerVault walkthrough on Next.js 14 Server Actions & streaming SSR.',
        tags: ['PeerVault', 'Next.js 14', 'React'],
        date: '📅 26 Aug',
        comments: 2,
        attachments: 3,
        search: 'meera k web architecture nextjs server actions streaming ssr react peervault',
      },
      {
        id: 'c1-3',
        avatar: 'SV',
        avatarBg: '#9E92F0',
        avatarColor: '#16122C',
        name: 'Sanjay V',
        role: 'Mentor · Cloud DevOps',
        text: 'Delivered hands-on containerization walkthrough on Docker Multi-Stage Builds & Kubernetes Pod Orchestration.',
        tags: ['PeerVault', 'Docker', 'Kubernetes'],
        date: '📅 25 Aug',
        comments: 4,
        attachments: 4,
        search: 'sanjay v cloud devops docker multistage builds kubernetes pod orchestration devops',
      },
    ];

    // 2. Classes learnt so far (From My Sessions learning & PeerVault study tracks)
    const col2Cards = [
      {
        id: 'c2-1',
        avatar: 'AA',
        avatarBg: '#E8B84B',
        avatarColor: '#1A1204',
        name: userName,
        role: 'Learning: PostgreSQL & SQL Performance',
        text: 'Practiced B-Tree index scan diagrams and query plan optimization with Rahul Sharma in My Sessions.',
        progressText: 'No. of classes learnt: 4 / 5',
        progressPct: 80,
        date: '📅 28 Aug',
        comments: 2,
        attachments: 2,
        search: `${userName.toLowerCase()} learning postgresql sql performance btree index query plan optimization rahul`,
      },
      {
        id: 'c2-2',
        avatar: 'MK',
        avatarBg: '#4FD1C5',
        avatarColor: '#0C1E1B',
        name: 'Meera K',
        role: 'Learning: Docker & Containerization',
        text: 'Learned multi-stage Alpine Dockerfile optimization and Minikube pod deployment from Sanjay V.',
        progressText: 'No. of classes learnt: 3 / 4',
        progressPct: 75,
        date: '📅 26 Aug',
        comments: 3,
        attachments: 1,
        search: 'meera k learning docker containerization multistage alpine dockerfile minikube sanjay',
      },
      {
        id: 'c2-3',
        avatar: 'SV',
        avatarBg: '#9E92F0',
        avatarColor: '#16122C',
        name: 'Sanjay V',
        role: 'Learning: Next.js 14 Full-Stack',
        text: 'Studied Next.js 14 App Router layout hierarchies and Suspense boundaries from Meera K.',
        progressText: 'No. of classes learnt: 2 / 3',
        progressPct: 67,
        date: '📅 24 Aug',
        comments: 1,
        attachments: 2,
        search: 'sanjay v learning nextjs 14 fullstack app router layouts suspense meera',
      },
    ];

    // 3. Feedback exchanged (What OTHER participants have given to THIS participant)
    const baseCol3Cards = [
      {
        id: 'c3-1',
        avatar: 'RH',
        avatarBg: '#E8B84B',
        avatarColor: '#1A1204',
        heading: 'Rahul Sharma → You',
        subheading: 'Peer Feedback on: PostgreSQL Index Optimization',
        isHighlight: true,
        feedbacks: [
          {
            label: 'Peer Feedback Received',
            text: 'Super clear self-made video walkthrough! Solved my query latency issue in seconds.',
            rating: '★★★★★',
            sentiment: 'POSITIVE',
            credits: '+15 Credits Received',
          },
        ],
        date: '📅 Today',
        comments: 2,
        attachments: 1,
        search: 'rahul sharma feedback received postgresql index optimization super clear video latency credits',
      },
      {
        id: 'c3-2',
        avatar: 'MK',
        avatarBg: '#4FD1C5',
        avatarColor: '#0C1E1B',
        heading: 'Meera K → You',
        subheading: 'Peer Feedback on: 1:1 UI/UX Design System Session',
        isHighlight: false,
        feedbacks: [
          {
            label: 'Mentee Feedback Received',
            text: 'Loved the live auto-layout demo and component token system in Figma. Deserves top leaderboard rank!',
            rating: '★★★★★',
            sentiment: 'POSITIVE',
            credits: '+15 Credits Received',
          },
        ],
        date: '📅 Yesterday',
        comments: 1,
        attachments: 2,
        search: 'meera k feedback received ui ux design system figma auto layout leaderboard',
      },
      {
        id: 'c3-3',
        avatar: 'SV',
        avatarBg: '#9E92F0',
        avatarColor: '#16122C',
        heading: 'Sanjay V → You',
        subheading: 'Peer Feedback on: Docker Compose Walkthrough',
        isHighlight: false,
        feedbacks: [
          {
            label: 'Peer Review Received',
            text: 'Shrunk our container image from 1.2GB down to 68MB. Phenomenal video guide!',
            rating: '★★★★★',
            sentiment: 'POSITIVE',
            credits: '+15 Credits Received',
          },
        ],
        date: '📅 25 Aug',
        comments: 3,
        attachments: 1,
        search: 'sanjay v feedback received docker compose walkthrough container image shrunk',
      },
    ];

    // 4. Feedback given to other participants (What THIS participant has given to others)
    const baseCol4Cards = [
      {
        id: 'c4-1',
        avatar: 'RH',
        avatarBg: '#E8B84B',
        avatarColor: '#1A1204',
        name: 'Rahul Sharma',
        role: 'Feedback given for: PostgreSQL B-Tree Walkthrough',
        text: 'You gave: "Super clear self-made video walkthrough! Solved my query latency issue in seconds."',
        rating: '★★★★★',
        creditImpact: '+15 Credits Awarded to Rahul',
        date: '📅 28 Aug',
        comments: 2,
        attachments: 1,
        search: 'rahul sharma feedback given postgresql btree walkthrough query latency credits',
      },
      {
        id: 'c4-2',
        avatar: 'MK',
        avatarBg: '#4FD1C5',
        avatarColor: '#0C1E1B',
        name: 'Meera K',
        role: 'Feedback given for: Next.js 14 App Router Walkthrough',
        text: 'You gave: "Awesome live coding recording on parallel routes and streaming SSR components. Great job!"',
        rating: '★★★★★',
        creditImpact: '+15 Credits Awarded to Meera',
        date: '📅 27 Aug',
        comments: 1,
        attachments: 2,
        search: 'meera k feedback given nextjs app router parallel routes streaming ssr credits',
      },
      {
        id: 'c4-3',
        avatar: 'SV',
        avatarBg: '#9E92F0',
        avatarColor: '#16122C',
        name: 'Sanjay V',
        role: 'Feedback given for: Docker Multi-Stage Builds',
        text: 'You gave: "Shrunk our container image from 1.2GB down to 68MB. Phenomenal video guide!"',
        rating: '★★★★★',
        creditImpact: '+15 Credits Awarded to Sanjay',
        date: '📅 25 Aug',
        comments: 3,
        attachments: 1,
        search: 'sanjay v feedback given docker multistage builds container size guide credits',
      },
    ];

    // Live Dynamic Feedbacks from End Session
    const dynamicReceived = (GLOBAL_SESSION_FEEDBACKS || [])
      .filter((f) => f.receiverName.toLowerCase() === userName.toLowerCase() || userName === 'Anusha A')
      .map((f) => ({
        id: f.id,
        avatar: f.giverName.substring(0, 2).toUpperCase(),
        avatarBg: '#E8B84B',
        avatarColor: '#1A1204',
        heading: `${f.giverName} → You`,
        subheading: `Session Feedback: ${f.skill}`,
        isHighlight: true,
        feedbacks: [
          {
            label: 'Session Feedback Received',
            text: f.feedbackText,
            rating: '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating),
            sentiment: f.sentiment,
            credits: `+${f.creditImpact} Credits Received`,
          },
        ],
        date: '📅 Today',
        comments: 1,
        attachments: 1,
        search: `${f.giverName} ${f.skill} ${f.feedbackText}`.toLowerCase(),
      }));

    const dynamicGiven = (GLOBAL_SESSION_FEEDBACKS || [])
      .filter((f) => f.giverName.toLowerCase() === userName.toLowerCase() || userName === 'Anusha A')
      .map((f) => ({
        id: f.id,
        avatar: f.receiverName.substring(0, 2).toUpperCase(),
        avatarBg: '#9E92F0',
        avatarColor: '#16122C',
        name: f.receiverName,
        role: `Feedback given for: ${f.skill}`,
        text: `You gave: "${f.feedbackText}"`,
        rating: '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating),
        creditImpact: `+${f.creditImpact} Credits Awarded to ${f.receiverName}`,
        date: '📅 Today',
        comments: 1,
        attachments: 1,
        search: `${f.receiverName} ${f.skill} ${f.feedbackText}`.toLowerCase(),
      }));

    const col3Cards = [...dynamicReceived, ...baseCol3Cards];
    const col4Cards = [...dynamicGiven, ...baseCol4Cards];

    return NextResponse.json({
      success: true,
      col1: col1Cards,
      col2: col2Cards,
      col3: col3Cards,
      col4: col4Cards,
      stats: {
        sessionsCompletedPct: 85,
        classesInProgress: 3,
        creditsEarnedThisWeek: 60,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch progress' }, { status: 500 });
  }
}
