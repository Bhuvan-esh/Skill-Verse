import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export type NotificationCategory = 'CODING_CHALLENGE' | 'SKILL_BARTER' | 'SOFT_SKILLS' | 'GENERAL';

export interface ParticipantNotification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  category: NotificationCategory;
  link?: string;
  actionTab?: string;
  actionSubTab?: string;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

const CODING_CHALLENGE_NOTIFICATIONS: ParticipantNotification[] = [
  {
    id: 'notif-coding-team-roster',
    title: '🏛️ Visual Architects Team Roster Released',
    message: "Visual Architects have officially validated your AI Multi-Year Balanced team roster for 'Team #1 — Algorithmic Titans'. Verified participant USNs and contact slots are now released!",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=team',
    actionTab: 'competitions',
    actionSubTab: 'team',
    priority: 'HIGH',
  },
  {
    id: 'notif-coding-sprint-live',
    title: '⚡ Algorithmic Sprint 2026 is Live!',
    message: 'Visual Architects have started the competition timer for Algorithmic Sprint 2026. Option 1: Problem Research & Architecture track is currently active.',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    read: false,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=workspace',
    actionTab: 'competitions',
    actionSubTab: 'workspace',
    priority: 'HIGH',
  },
  {
    id: 'notif-coding-submission-locked',
    title: '🔒 Solution Submitted to Visual Architects',
    message: 'Your challenge solution has been locked and transferred to the Visual Architects Board for official test case assertions and scoring.',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=workspace',
    actionTab: 'competitions',
    actionSubTab: 'workspace',
  },
  {
    id: 'notif-coding-deadline-warning',
    title: '⚠️ Sprint Deadline Warning (10 Mins Remaining)',
    message: '10 minutes remaining on the Visual Architects countdown clock! Prepare to finalize your code patch to avoid timeout rejection.',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    read: false,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=workspace',
    actionTab: 'competitions',
    actionSubTab: 'workspace',
    priority: 'HIGH',
  },
  {
    id: 'notif-coding-rank-1',
    title: '🏆 Rank #1 Achieved on Algorithmic Leaderboard',
    message: 'Congratulations! You climbed to Rank #1 on the Algorithmic Standings with 193 Total Credits (+150 Pts reward).',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=leaderboard',
    actionTab: 'competitions',
    actionSubTab: 'leaderboard',
  },
  {
    id: 'notif-coding-bug-hunt-feed',
    title: '🐛 Visual Architects Bug Hunt Feed Synchronized',
    message: 'Visual Architects have published the defect notice and test assertions for the Binary Search Subarray logic fault.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=workspace',
    actionTab: 'competitions',
    actionSubTab: 'workspace',
  },
  {
    id: 'notif-coding-badge-unlocked',
    title: '🎖️ Achievement Badge Unlocked: Code Starter (#1)',
    message: "You completed your first challenge and earned the 'Code Starter' Novice Bronze badge. Check your badge ladder in Profile!",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: true,
    category: 'CODING_CHALLENGE',
    link: '/dashboard?tab=competitions&subTab=history',
    actionTab: 'competitions',
    actionSubTab: 'history',
  },
];

const SKILL_BARTER_NOTIFICATIONS: ParticipantNotification[] = [
  {
    id: 'notif-sb-match-approved',
    title: '🤝 Skill Barter Match Approved',
    message: "Rahul Sharma accepted your barter exchange proposal: 'Next.js & Tailwind CSS' ↔ 'Python & Machine Learning'. Ready to schedule peer session!",
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    read: false,
    category: 'SKILL_BARTER',
    link: '/dashboard?tab=skillbarter',
    actionTab: 'skillbarter',
    priority: 'HIGH',
  },
  {
    id: 'notif-sb-chat-message',
    title: '💬 New Skill Barter Message',
    message: "Priya S: 'Hey! Let us schedule our 45-min peer mentoring circle for today at 4:30 PM in the CSE library lab.'",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    category: 'SKILL_BARTER',
    link: '/dashboard?tab=skillbarter',
    actionTab: 'skillbarter',
  },
  {
    id: 'notif-sb-credits-deposited',
    title: '💰 SkillBarter Credits Deposited (+15 Pts)',
    message: 'You received +15 Credits for completing a peer teaching exchange session on PostgreSQL Query Tuning. Current balance: 85 Pts.',
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    read: true,
    category: 'SKILL_BARTER',
    link: '/dashboard?tab=skillbarter',
    actionTab: 'skillbarter',
  },
  {
    id: 'notif-sb-reputation-upgrade',
    title: '🌟 Reputation Tier Upgraded: Consistent Helper',
    message: 'Your student helper rating reached 4.9★ across 8 sessions. Badge and verified builder status are now active on your public profile!',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    read: true,
    category: 'SKILL_BARTER',
    link: '/dashboard?tab=skillbarter',
    actionTab: 'skillbarter',
  },
  {
    id: 'notif-sb-proposal-received',
    title: '🔄 New Barter Exchange Request Received',
    message: 'Sanjay V requested a peer skill exchange: Offering Docker & Kubernetes foundations in exchange for React state management.',
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    read: true,
    category: 'SKILL_BARTER',
    link: '/dashboard?tab=skillbarter',
    actionTab: 'skillbarter',
  },
];

const SOFT_SKILLS_NOTIFICATIONS: ParticipantNotification[] = [
  {
    id: 'notif-ss-stage-approved',
    title: '🏆 Live Stage Keynote Selection Approved (+100 Pts)',
    message: "Visual Architects approved your weekly reflection report: 'Strategic Pacing & The Elimination of Verbal Crutches'. Scheduled for March 20, 2026 at Main Horizon Stage!",
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    read: false,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
    priority: 'HIGH',
  },
  {
    id: 'notif-ss-video-published',
    title: '🎬 New Mentor Masterclass Video Published',
    message: "Visual Architects Lead shared 'Mastering Stage Presence & Pitching Under Pressure'. Guidance note: Focus on diaphragmatic breathing and deliberate silence.",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
  {
    id: 'notif-ss-debate-booked',
    title: '⚡ Algorithmic Sprint & Debate Battle Booked',
    message: "You are marked and registered for Round 1: Live Concurrency Sprint & Live Debate Qualifiers (Team #1 — Algorithmic Titans) on August 15, 2026.",
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    read: false,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
    priority: 'HIGH',
  },
  {
    id: 'notif-ss-milestone-unlocked',
    title: '💎 Soft Skill Milestone Unlocked (#1 First Voice)',
    message: "You completed your first speaking activity and unlocked the 'First Voice' milestone (+25 Credits). Ready to level up to #2 Conversation Starter!",
    created_at: new Date(Date.now() - 1000 * 60 * 295).toISOString(),
    read: true,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
  {
    id: 'notif-ss-feedback-received',
    title: '💬 Visual Architect Feedback & Review Received',
    message: "Reviewer Feedback: 'Outstanding synthesis of Chris Voss tactical empathy in technical keynotes. +100 Credits deposited to your domain balance.'",
    created_at: new Date(Date.now() - 1000 * 60 * 460).toISOString(),
    read: true,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
  {
    id: 'notif-ss-mystery-announced',
    title: '⚔️ Mystery Challenge #001 Announced',
    message: "Visual Architects revealed the mystery topic: Live Stage Debate Battle & Technical Rhetoric Qualifiers. Form your squad now!",
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    read: true,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
  {
    id: 'notif-ss-certificate-issued',
    title: '📜 Soft Skills Certificate of Excellence Issued',
    message: "Dean of Academics & Skill League Jury awarded you the 'Advanced Negotiator & Communicator' credential (+50 Domain 4 Credits).",
    created_at: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    read: true,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
  {
    id: 'notif-ss-leaderboard-standing',
    title: '🏅 Inter-Department Soft Skills Rank #1 Standing',
    message: 'Your cumulative communication, Learn Quest reflection reports, and sprint points placed you at Rank #1 on the Soft Skills Leaderboard (+193 Pts).',
    created_at: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
    read: true,
    category: 'SOFT_SKILLS',
    link: '/soft-skills',
    actionTab: 'soft-skills',
  },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    const { searchParams } = new URL(request.url);
    const filterCategory = searchParams.get('category'); // 'coding' | 'skillbarter' | 'softskills' | null

    let dbNotifications: any[] = [];
    if (user?.id) {
      try {
        dbNotifications = await db.notification.findMany({
          where: { user_id: user.id },
          orderBy: { created_at: 'desc' },
          take: 30,
        });
      } catch (dbErr) {
        // Table might not have all columns or be offline in tests
        console.warn('DB notification query fallback', dbErr);
      }
    }

    const defaultFeeds: ParticipantNotification[] = [
      ...CODING_CHALLENGE_NOTIFICATIONS,
      ...SKILL_BARTER_NOTIFICATIONS,
      ...SOFT_SKILLS_NOTIFICATIONS,
    ];

    // Combine custom db entries if any, formatted with fallback category
    const formattedDbNotifs: ParticipantNotification[] = dbNotifications.map((dbN: any) => ({
      id: dbN.id,
      title: dbN.title || 'Campus Notification',
      message: dbN.message || dbN.content || '',
      created_at: dbN.created_at ? new Date(dbN.created_at).toISOString() : new Date().toISOString(),
      read: !!dbN.is_read || !!dbN.read,
      category: (dbN.type === 'CODING' ? 'CODING_CHALLENGE' : dbN.type === 'SOFT_SKILLS' ? 'SOFT_SKILLS' : dbN.type === 'SKILL_BARTER' ? 'SKILL_BARTER' : 'GENERAL'),
      link: dbN.link || '/dashboard',
    }));

    let allNotifs = [...defaultFeeds, ...formattedDbNotifs];

    // Apply category filter if requested
    if (filterCategory) {
      const lower = filterCategory.toLowerCase();
      if (lower === 'coding' || lower === 'coding_challenge') {
        allNotifs = allNotifs.filter((n) => n.category === 'CODING_CHALLENGE');
      } else if (lower === 'skillbarter' || lower === 'skill_barter') {
        allNotifs = allNotifs.filter((n) => n.category === 'SKILL_BARTER');
      } else if (lower === 'softskills' || lower === 'soft_skills') {
        allNotifs = allNotifs.filter((n) => n.category === 'SOFT_SKILLS');
      }
    }

    // Sort newest first
    allNotifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const unreadCount = allNotifs.filter((n) => !n.read).length;
    const codingUnread = defaultFeeds.filter((n) => n.category === 'CODING_CHALLENGE' && !n.read).length;
    const skillBarterUnread = defaultFeeds.filter((n) => n.category === 'SKILL_BARTER' && !n.read).length;
    const softSkillsUnread = defaultFeeds.filter((n) => n.category === 'SOFT_SKILLS' && !n.read).length;

    return NextResponse.json({
      notifications: allNotifs,
      unreadCount,
      categoryCounts: {
        coding: {
          total: allNotifs.filter((n) => n.category === 'CODING_CHALLENGE').length,
          unread: codingUnread,
        },
        skillBarter: {
          total: allNotifs.filter((n) => n.category === 'SKILL_BARTER').length,
          unread: skillBarterUnread,
        },
        softSkills: {
          total: allNotifs.filter((n) => n.category === 'SOFT_SKILLS').length,
          unread: softSkillsUnread,
        },
      },
    });
  } catch (error: any) {
    console.error('GET /api/notifications error:', error);
    const fallback = [
      ...CODING_CHALLENGE_NOTIFICATIONS,
      ...SKILL_BARTER_NOTIFICATIONS,
      ...SOFT_SKILLS_NOTIFICATIONS,
    ];
    return NextResponse.json({
      notifications: fallback,
      unreadCount: fallback.filter((n) => !n.read).length,
    });
  }
}
