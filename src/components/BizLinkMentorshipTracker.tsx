'use client';

import React, { useState } from 'react';
import { Search, MessageSquare, Paperclip, MoreVertical } from 'lucide-react';

export default function BizLinkMentorshipTracker() {
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.trim().toLowerCase();

  // Cards data
  const col1Cards = [
    {
      id: 'c1-1',
      avatar: 'RH',
      avatarBg: '#E8B84B',
      avatarColor: '#1A1204',
      name: 'Rahul',
      role: '4th yr · CSE',
      text: 'Ran a live walkthrough on SQL queries for two students this weekend',
      tags: ['Mentor', 'SQL', 'PostgreSQL'],
      date: '📅 18 Apr',
      comments: 2,
      attachments: 1,
      search: 'rahul 4th yr cse mentor sql postgresql walkthrough queries',
    },
    {
      id: 'c1-2',
      avatar: 'MK',
      avatarBg: '#4FD1C5',
      avatarColor: '#0C1E1B',
      name: 'Meera K',
      role: '3rd yr · AI & DS',
      text: 'Helped set up a first Django project end to end',
      tags: ['Mentor', 'Python', 'Django'],
      date: '📅 21 Mar',
      comments: 1,
      attachments: 3,
      search: 'meera k 3rd yr ai ds mentor python django setup project',
    },
    {
      id: 'c1-3',
      avatar: 'SV',
      avatarBg: '#9E92F0',
      avatarColor: '#16122C',
      name: 'Sanjay V',
      role: '3rd yr · ISE',
      text: 'Walked a student through Docker basics and containerizing a small app',
      tags: ['Mentor', 'Docker', 'DevOps'],
      date: '📅 No due date',
      comments: 4,
      attachments: 7,
      search: 'sanjay v 3rd yr ise mentor docker devops containerizing app',
    },
  ];

  const col2Cards = [
    {
      id: 'c2-1',
      avatar: 'PS',
      avatarBg: '#4FD1C5',
      avatarColor: '#0C1E1B',
      name: 'Priya S',
      role: 'Learning: GenAI',
      text: 'Working through transformers & attention for her GenAI project',
      progressText: 'No. of classes learnt: 6 / 10',
      progressPct: 60,
      date: '📅 09 Mar',
      comments: 4,
      attachments: 1,
      search: 'priya s learning genai transformers attention project classes',
    },
    {
      id: 'c2-2',
      avatar: 'DK',
      avatarBg: '#F2665A',
      avatarColor: '#1F0B09',
      name: 'Deepak K',
      role: 'Learning: HTML & CSS',
      text: 'Cleaning up portfolio layout and flex structure',
      progressText: 'No. of classes learnt: 2 / 8',
      progressPct: 25,
      date: '📅 No due date',
      comments: 7,
      attachments: 2,
      search: 'deepak k learning html css portfolio layout flex structure',
    },
    {
      id: 'c2-3',
      avatar: 'AA',
      avatarBg: '#E8B84B',
      avatarColor: '#1A1204',
      name: 'Anusha A',
      role: 'Learning: Kubernetes',
      text: 'Onboarding onto open-source contribution workflow',
      progressText: 'No. of classes learnt: 0 / 5',
      progressPct: 0,
      date: '📅 23 Apr',
      comments: 2,
      attachments: 5,
      search: 'anusha a learning kubernetes onboarding open source contribution workflow',
    },
  ];

  const col3Cards = [
    {
      id: 'c3-1',
      avatar: 'RH',
      avatarBg: '#E8B84B',
      avatarColor: '#1A1204',
      heading: 'Rahul → Sanjay',
      subheading: 'Session: SQL basics',
      isHighlight: false,
      feedbacks: [
        { label: 'Mentor feedback', text: 'Picks things up fast, just needs more practice explaining concepts out loud.', rating: '★★★★☆' },
        { label: 'Student feedback', text: 'Explained everything clearly and answered every question patiently.', rating: '★★★★★' },
      ],
      date: '📅 10 Mar',
      comments: 1,
      attachments: 3,
      search: 'rahul sanjay session sql basics picks things up fast practice explaining clearly answered patiently',
    },
    {
      id: 'c3-2',
      avatar: 'MK',
      avatarBg: '#4FD1C5',
      avatarColor: '#0C1E1B',
      heading: 'Meera → Deepak',
      subheading: 'Session: Django setup',
      isHighlight: true,
      feedbacks: [
        { label: 'Mentor feedback', text: 'Confident and well prepared, ready to mentor others in this topic soon.', rating: '★★★★★' },
      ],
      date: '📅 16 Apr',
      comments: 1,
      attachments: 1,
      search: 'meera deepak session django setup confident well prepared mentor topic soon',
    },
    {
      id: 'c3-3',
      avatar: 'SV',
      avatarBg: '#9E92F0',
      avatarColor: '#16122C',
      heading: 'Sanjay → Priya',
      subheading: 'Session: Docker basics',
      isHighlight: false,
      awaitingText: 'Awaiting feedback from both mentor and student',
      date: '',
      comments: 0,
      attachments: 0,
      search: 'sanjay priya session docker basics awaiting feedback mentor student',
    },
  ];

  const col4Cards = [
    {
      id: 'c4-1',
      avatar: 'PS',
      avatarBg: '#4FD1C5',
      avatarColor: '#0C1E1B',
      name: 'Priya S',
      role: 'ML mentoring · closed',
      text: 'Completed 4-session mentoring track on machine learning fundamentals',
      date: '📅 24 Mar',
      comments: 2,
      attachments: 1,
      search: 'priya s ml mentoring closed completed 4-session track machine learning fundamentals',
    },
    {
      id: 'c4-2',
      avatar: 'RH',
      avatarBg: '#E8B84B',
      avatarColor: '#1A1204',
      name: 'Rahul',
      role: 'Git mentoring · closed',
      text: 'Completed a focused session on Git branching and workflows',
      date: '📅 05 Apr',
      comments: 1,
      attachments: 3,
      search: 'rahul git mentoring closed completed focused session git branching workflows',
    },
    {
      id: 'c4-3',
      avatar: 'MK',
      avatarBg: '#4FD1C5',
      avatarColor: '#0C1E1B',
      name: 'Meera K',
      role: 'UI design mentoring · closed',
      text: 'Completed a UI design walkthrough session with Sanjay',
      date: '📅 30 Mar',
      comments: 4,
      attachments: 7,
      search: 'meera k ui design mentoring closed completed ui design walkthrough session sanjay',
    },
  ];

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
              BizLink
            </div>
            <div className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#6E6E77] leading-none">
              Mentorship Tracker
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
            placeholder="Search by name, mentor, topic, or feedback..."
            className="w-full bg-[#1A1D28] border border-[#2E3241] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F1EFE6] placeholder-[#6E6E77] focus:outline-none focus:border-[#E8B84B] transition-colors"
          />
        </div>

        {/* User Chip */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#1A1D28] border border-[#2E3241]">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#9E92F0', color: '#16122C' }}
          >
            IR
          </div>
          <span className="text-xs font-semibold text-[#F1EFE6]">Iona Rollins</span>
        </div>
      </header>

      {/* Main Inner Container */}
      <div className="p-6 lg:p-8 space-y-8">
        
        {/* 2. Weekly progress stats row (4-column grid: 1.4fr 1.05fr 0.6fr 0.9fr) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-[#22252F]">
          
          {/* Col 1: Bar Chart (1.4fr equivalent ~ col-span-5) */}
          <div className="md:col-span-5 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-[#F1EFE6] bizlink-serif">
                Weekly growth
              </h2>
              <p className="text-xs text-[#A9A9AE]">Mentoring sessions run per day</p>
            </div>

            <div className="mt-6 flex items-end space-x-4 h-32 pt-4">
              {/* Y-axis */}
              <div className="flex flex-col justify-between h-full text-[10px] text-[#6E6E77] bizlink-mono pr-1">
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end justify-between h-full border-b border-[#2E3241] pb-1 px-2">
                {/* Mon */}
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[55%] hatched-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Mon</span>
                </div>
                {/* Tue */}
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[85%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Tue</span>
                </div>
                {/* Wed */}
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[75%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Wed</span>
                </div>
                {/* Thu */}
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[35%] hatched-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Thu</span>
                </div>
                {/* Fri */}
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full max-w-[28px] h-[78%] gold-bar rounded-t-md" />
                  <span className="text-[10px] text-[#6E6E77] bizlink-mono">Fri</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Dashed Circular Gauge (1.05fr ~ col-span-3) */}
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
                68%
              </span>
            </div>
            <span className="text-xs text-[#A9A9AE]">Sessions completed</span>
          </div>

          {/* Col 3: Stat Block 1 (0.6fr ~ col-span-2) */}
          <div className="md:col-span-2 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-3xl font-extrabold text-[#F1EFE6] bizlink-mono">
              53
            </div>
            <div className="text-xs text-[#A9A9AE] hover:text-[#E8B84B] cursor-pointer transition-colors pt-4 flex items-center gap-1">
              <span>Classes in progress</span>
              <span>→</span>
            </div>
          </div>

          {/* Col 4: Stat Block 2 (0.9fr ~ col-span-2) */}
          <div className="md:col-span-2 bg-[#1A1D28] border border-[#2E3241] rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-3xl font-extrabold text-[#F1EFE6] bizlink-mono flex items-center gap-1">
              <span>32</span>
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

        {/* 3. Four-column Board (grid-template-columns: repeat(4, 1fr)) */}
        {totalVisible === 0 ? (
          <div id="noResults" className="py-16 text-center text-[#A9A9AE] bizlink-serif text-lg">
            No cards match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            
            {/* COLUMN 1 */}
            {filteredCol1.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1">
                  Mentoring already delivered
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
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#6E6E77]">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <p className="text-[12.5px] text-[#6E6E77] bizlink-serif leading-relaxed">
                      {c.text}
                    </p>

                    {/* Tags */}
                    {c.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-[#20242F] border border-[#2E3241] text-[10px] text-[#A9A9AE] bizlink-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono">
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

            {/* COLUMN 2 */}
            {filteredCol2.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1">
                  Classes learnt so far
                </div>
                {filteredCol2.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className="card bg-[#1A1D28] border border-[#2E3241] rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md hover:border-[#E8B84B]/50 transition-all"
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#6E6E77]">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <p className="text-[12.5px] text-[#6E6E77] bizlink-serif leading-relaxed">
                      {c.text}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10.5px] text-[#A9A9AE] bizlink-mono">
                        {c.progressText}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#20242F] overflow-hidden">
                        <div
                          className="h-full gold-bar rounded-full"
                          style={{ width: `${c.progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono">
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

            {/* COLUMN 3 */}
            {filteredCol3.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1">
                  Feedback exchanged
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
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight">
                            {c.heading}
                          </div>
                          <div className="text-[11px] text-[#6E6E77]">{c.subheading}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    {c.awaitingText ? (
                      <p className="text-[12.5px] text-[#6E6E77] bizlink-serif leading-relaxed italic">
                        {c.awaitingText}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {c.feedbacks?.map((f, idx) => (
                          <div
                            key={idx}
                            className="bg-[#12141C]/60 p-2.5 rounded-lg border border-[#2E3241]/60 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#E8B84B] font-bold">
                              <span>{f.label}</span>
                              <span className="bizlink-mono text-[#E8B84B]">{f.rating}</span>
                            </div>
                            <p className="text-[11.5px] text-[#A9A9AE] bizlink-serif leading-relaxed">
                              &quot;{f.text}&quot;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {c.date && (
                      <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                        <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono">
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

            {/* COLUMN 4 */}
            {filteredCol4.length > 0 && (
              <div className="space-y-4">
                <div className="text-base font-semibold text-[#F1EFE6] bizlink-serif pb-1">
                  Mentorship completed
                </div>
                {filteredCol4.map((c) => (
                  <div
                    key={c.id}
                    data-search={c.search}
                    className="card bg-[#1A1D28] border border-[#2E3241] rounded-[14px] p-[15px_16px_13px] space-y-3 shadow-md hover:border-[#E8B84B]/50 transition-all"
                  >
                    <div className="card-top flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: c.avatarBg, color: c.avatarColor }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#F1EFE6] leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#6E6E77]">{c.role}</div>
                        </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-[#6E6E77] cursor-pointer" />
                    </div>

                    <p className="text-[12.5px] text-[#6E6E77] bizlink-serif leading-relaxed">
                      {c.text}
                    </p>

                    <div className="card-meta flex items-center justify-between pt-2 border-t border-[#22252F] text-[11px] text-[#A9A9AE]">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#272B38] border border-[#2E3241] bizlink-mono">
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
