'use client';

import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Paperclip, MoreVertical, Film, Star, ThumbsUp, CheckCheck, BookOpen, Users, Sparkles } from 'lucide-react';

interface BizLinkMentorshipTrackerProps {
  user?: any;
}

export default function BizLinkMentorshipTracker({ user }: BizLinkMentorshipTrackerProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const displayName = user?.name || 'Anusha A';
  const displayInitials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AA';

  const q = searchQuery.trim().toLowerCase();

  // Column 1: Mentoring already delivered (from My Sessions teaching & PeerVault published walkthroughs)
  const [col1Cards, setCol1Cards] = useState([
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
  ]);

  // Column 2: Classes learnt so far (from My Sessions learning & PeerVault study tracks)
  const [col2Cards, setCol2Cards] = useState([
    {
      id: 'c2-1',
      avatar: 'AA',
      avatarBg: '#E8B84B',
      avatarColor: '#1A1204',
      name: displayName,
      role: 'Learning: PostgreSQL & SQL Performance',
      text: 'Practiced B-Tree index scan diagrams and query plan optimization with Rahul Sharma in My Sessions.',
      progressText: 'No. of classes learnt: 4 / 5',
      progressPct: 80,
      date: '📅 28 Aug',
      comments: 2,
      attachments: 2,
      search: `${displayName.toLowerCase()} learning postgresql sql performance btree index query plan optimization rahul`,
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
  ]);

  // Column 3: Feedback exchanged (What OTHER participants have given to THIS participant)
  const [col3Cards, setCol3Cards] = useState([
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
  ]);

  // Column 4: Feedback given to other participants (What THIS participant has given to others)
  const [col4Cards, setCol4Cards] = useState([
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
  ]);

  // Fetch live progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/skill-barter/progress?name=${encodeURIComponent(displayName)}`);
        const data = await res.json();
        if (res.ok) {
          if (data.col1) setCol1Cards(data.col1);
          if (data.col2) setCol2Cards(data.col2);
          if (data.col3) setCol3Cards(data.col3);
          if (data.col4) setCol4Cards(data.col4);
        }
      } catch (e) {
        console.warn('Progress fetch fallback to synchronized seed data');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [displayName]);

  const matchFilter = (item: any) => {
    if (!q) return true;
    const textToSearch = `${item.name || ''} ${item.role || ''} ${item.text || ''} ${item.heading || ''} ${item.subheading || ''} ${item.search || ''}`.toLowerCase();
    return textToSearch.includes(q);
  };

  const filteredCol1 = col1Cards.filter(matchFilter);
  const filteredCol2 = col2Cards.filter(matchFilter);
  const filteredCol3 = col3Cards.filter(matchFilter);
  const filteredCol4 = col4Cards.filter(matchFilter);

  const totalVisible = filteredCol1.length + filteredCol2.length + filteredCol3.length + filteredCol4.length;

  return (
    <div
      className="bizlink-root min-h-screen text-[#F1EFE6] font-sans rounded-3xl overflow-hidden shadow-2xl border border-[#2E3241]"
      style={{
        background: '#12141C',
        color: '#F1EFE6',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* External Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Embedded Custom CSS Rules & Theme Tokens */}
      <style>{`
        .bizlink-serif { fontFamily: 'Fraunces', serif; }
        .bizlink-mono { fontFamily: 'JetBrains Mono', monospace; }

        .hatched-bar {
          background: repeating-linear-gradient(
            45deg,
            #2E3241 0,
            #2E3241 1.5px,
            transparent 1.5px,
            transparent 5px
          );
        }
        .gold-bar {
          background: linear-gradient(180deg, #E8B84B 0%, #B9862E 100%);
        }
      `}</style>

      {/* 1. Header (Sticky) */}
      <header
        className="sticky top-0 z-40 px-8 py-5 border-b border-[#22252F] flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'rgba(18, 20, 28, 0.92)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center font-bold text-sm shadow-md"
            style={{
              background: 'linear-gradient(155deg, #E8B84B 0%, #B9862E 100%)',
              color: '#1A1204',
              fontFamily: "'Fraunces', serif",
            }}
          >
            B
          </div>
          <div>
            <div className="text-[18px] font-semibold text-[#F1EFE6] bizlink-serif leading-tight">
              SkillBarter Progress Hub
            </div>
            <div className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#6E6E77] leading-none">
              Sessions & PeerVault Live Tracker
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-[400px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9A9AE]" />
          <input
            id="searchInput"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, mentor, peer, or feedback..."
            className="w-full bg-[#1A1D28] border border-[#2E3241] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F1EFE6] placeholder-[#6E6E77] focus:outline-none focus:border-[#E8B84B] transition-colors"
          />
        </div>

        {/* User Chip */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#1A1D28] border border-[#2E3241]">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#9E92F0', color: '#16122C' }}
          >
            {displayInitials}
          </div>
          <span className="text-xs font-semibold text-[#F1EFE6]">{displayName}</span>
        </div>
      </header>

      {/* Main Inner Container */}
      <div className="p-6 lg:p-8 space-y-8">
        
        {/* 2. Weekly progress stats row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-[#22252F]">
          
          {/* Col 1: Bar Chart */}
          <div className="md:col-span-5 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-[#F1EFE6] bizlink-serif">
                Weekly growth
              </h2>
              <p className="text-xs text-[#A9A9AE]">My Sessions & PeerVault activity per day</p>
            </div>

            <div className="mt-6 flex items-end space-x-4 h-32 pt-4">
              <div className="flex flex-col justify-between h-full text-[10px] text-[#6E6E77] bizlink-mono pr-1">
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>

              <div className="flex-1 flex items-end justify-between h-full border-b border-[#2E3241] pb-1 px-2">
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[55%] hatched-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Mon</span>
                </div>
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[85%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Tue</span>
                </div>
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[75%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Wed</span>
                </div>
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[35%] hatched-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Thu</span>
                </div>
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[90%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Fri</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Dashed Circular Gauge */}
          <div className="md:col-span-3 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#272B38]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeWidth="3.5"
                  stroke="#E8B84B"
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-[#F1EFE6] bizlink-mono">
                80%
              </span>
            </div>
            <span className="text-xs text-[#A9A9AE]">Sessions & Videos Completed</span>
          </div>

          {/* Col 3: Stat Block 1 */}
          <div className="md:col-span-2 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-3xl font-extrabold text-[#F1EFE6] bizlink-mono">
              3
            </div>
            <div className="text-xs text-[#A9A9AE] hover:text-[#E8B84B] cursor-pointer transition-colors pt-4 flex items-center gap-1">
              <span>Classes in progress</span>
              <span>→</span>
            </div>
          </div>

          {/* Col 4: Stat Block 2 */}
          <div className="md:col-span-2 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-3xl font-extrabold text-[#F1EFE6] bizlink-mono flex items-center gap-1">
              <span>+45</span>
              <span className="text-xl">💎</span>
            </div>
            <div className="text-xs text-[#A9A9AE] hover:text-[#E8B84B] cursor-pointer transition-colors pt-4 flex items-center gap-1">
              <span>Credits earned this week</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Showing Search Active Note */}
        {q && (
          <div className="text-xs text-[#E8B84B] bizlink-mono">
            Showing results for &quot;{searchQuery}&quot;
          </div>
        )}

        {/* 3. Four-column Board */}
        {totalVisible === 0 ? (
          <div id="noResults" className="py-16 text-center text-[#A9A9AE] bizlink-serif text-lg">
            No cards match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            
            {/* ============================================================ */}
            {/* COLUMN 1: Mentoring already delivered                       */}
            {/* ============================================================ */}
            {filteredCol1.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1 flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#E8B84B]" />
                  <span>Mentoring already delivered</span>
                </div>
                {filteredCol1.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className="card bg-[#1A1D28] border border-[#2E3241] rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md hover:border-[#E8B84B]/50 transition-all"
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight font-sans">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#6E6E77] font-mono">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <p className="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                      {c.text}
                    </p>

                    {/* Tags */}
                    {c.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-[#20242F] border border-[#2E3241] text-[10px] text-[#E8B84B] bizlink-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono text-[10px]">
                        {c.date}
                      </span>
                      <div className="flex items-center space-x-3 text-[#6E6E77] bizlink-mono text-[10px]">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {c.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" /> {c.attachments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* COLUMN 2: Classes learnt so far                             */}
            {/* ============================================================ */}
            {filteredCol2.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#4FD1C5]" />
                  <span>Classes learnt so far</span>
                </div>
                {filteredCol2.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className="card bg-[#1A1D28] border border-[#2E3241] rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md hover:border-[#4FD1C5]/50 transition-all"
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight font-sans">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#4FD1C5] font-mono">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <p className="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                      {c.text}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10.5px] text-[#A9A9AE] bizlink-mono flex items-center justify-between">
                        <span>{c.progressText}</span>
                        <span className="text-[#4FD1C5] font-bold">{c.progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#20242F] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] rounded-full"
                          style={{ width: `${c.progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono text-[10px]">
                        {c.date}
                      </span>
                      <div className="flex items-center space-x-3 text-[#6E6E77] bizlink-mono text-[10px]">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {c.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" /> {c.attachments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* COLUMN 3: Feedback exchanged (Other Peers gave You)          */}
            {/* ============================================================ */}
            {filteredCol3.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#E8B84B] fill-[#E8B84B]" />
                  <span>Feedback exchanged</span>
                </div>
                {filteredCol3.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className={`card rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md transition-all ${
                      c.isHighlight
                        ? 'border border-[#8A6B2B]'
                        : 'bg-[#1A1D28] border border-[#2E3241] hover:border-[#E8B84B]/50'
                    }`}
                    style={
                      c.isHighlight
                        ? { background: 'linear-gradient(150deg, #2A2417 0%, #20242F 100%)' }
                        : {}
                    }
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight font-sans">
                            {c.heading}
                          </div>
                          <div className="text-[11px] text-[#A9A9AE] font-mono">{c.subheading}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <div className="space-y-2">
                      {c.feedbacks?.map((f: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-[#12141C]/70 p-2.5 rounded-lg border border-[#2E3241]/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] text-[#E8B84B] font-bold font-mono">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3 text-[#E8B84B]" />
                              <span>{f.label}</span>
                            </span>
                            <span className="text-[#E8B84B]">{f.rating}</span>
                          </div>
                          <p className="text-[11.5px] text-slate-200 leading-relaxed font-sans">
                            &quot;{f.text}&quot;
                          </p>
                          {f.credits && (
                            <div className="text-[9.5px] font-mono text-emerald-400 font-bold pt-0.5">
                              {f.credits}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {c.date && (
                      <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                        <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono text-[10px]">
                          {c.date}
                        </span>
                        <div className="flex items-center space-x-3 text-[#6E6E77] bizlink-mono text-[10px]">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {c.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> {c.attachments}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* COLUMN 4: Feedback given to other participants              */}
            {/* ============================================================ */}
            {filteredCol4.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1 flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-[#9E92F0]" />
                  <span>Feedback given to other participants</span>
                </div>
                {filteredCol4.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className="card bg-[#1A1D28] border border-[#2E3241] rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md hover:border-[#9E92F0]/50 transition-all"
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight font-sans">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#9E92F0] font-mono">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <div className="bg-[#12141C]/70 p-2.5 rounded-lg border border-[#2E3241]/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold font-mono">
                        <span>Feedback Given by You</span>
                        <span>{c.rating}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-200 leading-relaxed font-sans">
                        {c.text}
                      </p>
                      {c.creditImpact && (
                        <div className="text-[9.5px] font-mono text-purple-400 font-bold pt-0.5">
                          {c.creditImpact}
                        </div>
                      )}
                    </div>

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono text-[10px]">
                        {c.date}
                      </span>
                      <div className="flex items-center space-x-3 text-[#6E6E77] bizlink-mono text-[10px]">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {c.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" /> {c.attachments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
