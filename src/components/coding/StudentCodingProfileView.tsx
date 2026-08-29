'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  BookOpen,
  Cpu,
  Award,
  Star,
  CheckCircle2,
  Zap,
  Lock,
  Check,
  Sparkles,
  XCircle,
  GitPullRequest,
  Trophy,
  Terminal,
  ShieldCheck,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Info,
  Calendar as CalendarIcon,
  Compass,
  ArrowRight,
  Users,
  MapPin,
  Crown,
  Edit3,
  X,
  Save,
  CheckCheck
} from 'lucide-react';
import {
  evaluateCodingAchievements,
  CodingActivityMetrics,
  EvaluatedCodingBadge,
  CODING_CHALLENGE_BADGE_DEFINITIONS,
} from '@/lib/codingChallengeAchievementEngine';
import {
  evaluateGitHubAchievements,
  EvaluatedGitHubBadge,
} from '@/lib/skillBarterAchievementEngine';

interface StudentCodingProfileViewProps {
  user: any;
  onRefresh?: () => void;
  onNavigateToWorkspace?: () => void;
}

// Scheduled Arena Events with Round Dates for the Calendar
const REGISTERED_ARENA_ROUNDS = [
  {
    day: 15,
    month: 1, // Feb (0-indexed) or current month
    year: 2026,
    eventId: 'event-live-1',
    eventTitle: 'Algorithmic Sprint 2026',
    roundName: 'Round 1 · Live Concurrency Sprint',
    roundNumber: 1,
    roundType: 'LIVE_SPRINT',
    time: '02:00 PM – 04:30 PM',
    status: 'ACTIVE_TODAY',
    teamName: 'Team #1 — Algorithmic Titans',
    role: 'Lead Algorithmic Architect (Slot #1)',
    pointsReward: '+150 Pts',
    creditsReward: '+100 Credits',
    tags: ['Team Challenge', '4 Members', 'Twist Constraints'],
    description: 'High-throughput stream processing, memory-bounded graph partitioning, and live stress testing.',
  },
  {
    day: 20,
    month: 1,
    year: 2026,
    eventId: 'event-hack-2',
    eventTitle: 'Hackathon CodeSprint: AI & Web Systems',
    roundName: 'Round 2 · Microservices Architecture',
    roundNumber: 2,
    roundType: 'HACKATHON_ROUND',
    time: '10:00 AM – 06:00 PM',
    status: 'UPCOMING_ROUND',
    teamName: 'Team #1 — Algorithmic Titans',
    role: 'Full-Stack Logic Lead',
    pointsReward: '+200 Pts',
    creditsReward: '+150 Credits',
    tags: ['Distributed Systems', 'FastAPI & Next.js'],
    description: 'Full-stack AI predictive pipeline and concurrent microservices deployment.',
  },
  {
    day: 28,
    month: 1,
    year: 2026,
    eventId: 'event-hack-2',
    eventTitle: 'Hackathon CodeSprint: AI & Web Systems',
    roundName: 'Round 3 · Final Build & Demo Presentation',
    roundNumber: 3,
    roundType: 'DEMO_FINALE',
    time: '03:00 PM – 05:30 PM',
    status: 'GRAND_FINALE',
    teamName: 'Team #1 — Algorithmic Titans',
    role: 'Live Presenter',
    pointsReward: '+300 Pts',
    creditsReward: '+250 Credits',
    tags: ['Jury Review', 'Visual Architects Evaluation'],
    description: 'Construct a working prototype and present a live working demo to student club mentors & Visual Architects.',
  },
];

export default function StudentCodingProfileView({
  user,
  onRefresh,
  onNavigateToWorkspace,
}: StudentCodingProfileViewProps) {
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedCodingBadge | null>(null);
  const [selectedGhBadgeDetail, setSelectedGhBadgeDetail] = useState<EvaluatedGitHubBadge | null>(null);
  const [profileBadgeFilter, setProfileBadgeFilter] = useState<'all' | 'coding' | 'github'>('all');

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(15);

  // Editable Profile Header Information State (Clean baseline for newly created accounts)
  const [profileName, setProfileName] = useState<string>(user?.name || '');
  const [profileYearBranch, setProfileYearBranch] = useState<string>('');
  const [profileBio, setProfileBio] = useState<string>('');
  const [isProfileInfoModalOpen, setIsProfileInfoModalOpen] = useState(false);

  // Edit Buffer States
  const [editName, setEditName] = useState('');
  const [editYearBranch, setEditYearBranch] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Dynamic Metrics & Stats
  const creditsDisplay = user?.credits?.total !== undefined
    ? `${user.credits.total} Pts`
    : typeof user?.credits === 'number'
    ? `${user.credits} Pts`
    : '0 Pts';

  // Load profile details from backend API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/skill-barter/profile?userId=${encodeURIComponent(user?.id || 'default')}`);
        const data = await res.json();
        if (res.ok && data.profile) {
          if (data.profile.name) setProfileName(data.profile.name);
          if (data.profile.yearBranch) setProfileYearBranch(data.profile.yearBranch);
          if (data.profile.bio) setProfileBio(data.profile.bio);
        }
      } catch {
        // Keep initial clean baseline
      }
    };
    fetchProfile();
  }, [user?.id]);

  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractFromSkillBarter = async () => {
    try {
      setIsExtracting(true);
      const res = await fetch(`/api/skill-barter/profile?userId=${encodeURIComponent(user?.id || 'default')}`);
      const data = await res.json();
      
      const rawName = data?.profile?.name;
      const rawYearBranch = data?.profile?.yearBranch;
      const rawBio = data?.profile?.bio;

      const extractedName = rawName && rawName.trim() ? rawName.trim() : 'Name not added yet';
      const extractedYearBranch = rawYearBranch && rawYearBranch.trim() ? rawYearBranch.trim() : 'Branch & Year not added yet';
      const extractedBio = rawBio && rawBio.trim() ? rawBio.trim() : 'Bio not added yet';

      setProfileName(extractedName);
      setProfileYearBranch(extractedYearBranch);
      setProfileBio(extractedBio);
      setEditName(extractedName);
      setEditYearBranch(extractedYearBranch);
      setEditBio(extractedBio);

      // Auto-persist synced data to backend
      await fetch('/api/skill-barter/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'default',
          name: extractedName,
          yearBranch: extractedYearBranch,
          bio: extractedBio,
        }),
      });

      const isPartiallyEmpty = !rawName || !rawYearBranch || !rawBio;
      if (isPartiallyEmpty) {
        setFeedbackMsg("ℹ️ Extracted from Skill Barter: Fields not given in Skill Barter are marked as 'Not added yet'.");
      } else {
        setFeedbackMsg("✓ Successfully extracted and synchronized profile details from Skill Barter!");
      }
      setTimeout(() => setFeedbackMsg(null), 4500);
      if (onRefresh) onRefresh();
    } catch (e: any) {
      setFeedbackMsg('Error extracting profile: ' + (e.message || 'Network error'));
      setTimeout(() => setFeedbackMsg(null), 4000);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleOpenProfileInfoModal = () => {
    setEditName(profileName || user?.name || '');
    setEditYearBranch(profileYearBranch || '');
    setEditBio(profileBio || '');
    setIsProfileInfoModalOpen(true);
  };

  const handleSaveProfileInfo = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/skill-barter/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'default',
          name: editName,
          yearBranch: editYearBranch,
          bio: editBio,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileName(editName);
        setProfileYearBranch(editYearBranch);
        setProfileBio(editBio);
        setIsProfileInfoModalOpen(false);
        setFeedbackMsg('✓ Profile information updated successfully!');
        setTimeout(() => setFeedbackMsg(null), 4000);
        if (onRefresh) onRefresh();
      } else {
        throw new Error(data.error || 'Failed to update profile info');
      }
    } catch (e: any) {
      setFeedbackMsg(e.message || 'Error updating profile info');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Coding Arena Milestones (20 Badges) — Open / 1 Unlocked (#1 Code Starter) & All others locked!
  const codingMetrics: CodingActivityMetrics = {
    challengesCompleted: 1,
    bugsFound: 0,
    bugsSolved: 0,
    logicChallengesCompleted: 0,
    timedChallengesCompleted: 0,
    precisionCorrectCount: 0,
    distinctDifficultyLevels: 0,
    hardBugsSolved: 0,
    top10CompetitionsCount: 0,
    top3BugHuntsCount: 0,
    multiCompetitionScore: 0,
  };

  const earnedTimestamps: Record<string, string> = {
    'cc-badge-1': 'Earned 12 Aug 2026',
  };

  const codingEvaluation = evaluateCodingAchievements(codingMetrics, earnedTimestamps);

  // 2. Grand Master Prestige Badges (12) — Earned for something big, ALL locked except ONE!
  const ghStats = {
    prsMerged: 2, // Pull Shark Tier 1 unlocked
    fastResponses: 0,
    acceptedSolutions: 0,
    pairSessions: 0,
    starsReceived: 0,
    flawlessDeploys: 0,
    vaultContributions: 0,
    kudosGiven: 0,
    nightSessions: 0,
    streakWeeks: 0,
    branchesMentored: 0,
    securityAudits: 0,
  };

  const ghUnlockedDatesMap = {
    'gh-pull-shark': 'Earned 14 Aug 2026',
  };

  const ghEvaluation = evaluateGitHubAchievements(ghStats, ghUnlockedDatesMap);

  const evaluatedCodingBadges = codingEvaluation.badges;
  const evaluatedGhBadges = ghEvaluation.badges;

  // Exact 2 Earned (1 Milestone + 1 Grand Master) & 30 Locked = 32 total badges
  const totalBadgesCount = 32;
  const unlockedCount = evaluatedCodingBadges.filter((b) => b.isUnlocked).length + evaluatedGhBadges.filter((b) => b.isUnlocked).length;
  const lockedCount = totalBadgesCount - unlockedCount;
  const unlockedPercent = Math.round((unlockedCount / totalBadgesCount) * 100);

  // Month navigation
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Days in month calculation
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const activeRoundForSelectedDay = REGISTERED_ARENA_ROUNDS.find(
    (r) => r.day === selectedCalendarDay
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 font-sans">

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-md">
          <span className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. CODER PROFILE HEADER CARD                                       */}
      {/* =================================================================== */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0d0e1a] overflow-hidden shadow-2xl">
        <div className="h-28 bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-slate-900" />
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-5xl shadow-2xl ring-4 ring-[#080910]">
              👩‍💻
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExtractFromSkillBarter}
                disabled={isExtracting}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-emerald-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                title="Extract name, year/branch, and bio from Skill Barter Profile"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isExtracting ? 'Extracting...' : 'Extract from Skill Barter'}</span>
              </button>

              <button
                onClick={handleOpenProfileInfoModal}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile Info</span>
              </button>
            </div>
          </div>

          {/* Header Texts (Defaulting to 'Not added yet' if missing) */}
          <div className="group relative">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-white tracking-tight font-heading">
                {profileName || 'Name not added yet'}
              </h2>
              <button
                onClick={handleOpenProfileInfoModal}
                className="p-1 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-white/5 transition-colors cursor-pointer"
                title="Edit name, branch and bio"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {profileYearBranch || (
                <span className="text-slate-500 italic">Branch & Year not added yet</span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-light max-w-2xl leading-relaxed">
              {profileBio || (
                <span className="text-slate-500 italic">Bio not added yet</span>
              )}
            </p>
          </div>

          {/* Stats Grid (Clean zero baselines for new accounts) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Credits Earned', value: creditsDisplay, color: 'text-purple-400' },
              { label: 'Peers Helped', value: '0 Students', color: 'text-emerald-400' },
              { label: 'Sessions Done', value: '0 Sessions', color: 'text-cyan-400' },
              { label: 'Average Rating', value: '0.0 ★', color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className={`text-base font-bold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 font-mono">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. INTERACTIVE CODING ARENA CALENDAR & ROUND MARKERS               */}
      {/* =================================================================== */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#0d0e1a] p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                Arena Schedule & Sprint Timeline
              </p>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              <span>Coding Arena Event Calendar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Registered competition dates, live sprint rounds, and demo deadlines are highlighted on your calendar.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-2xl text-xs font-mono">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-white">
              {monthNames[calendarMonth]} {calendarYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid + Details Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calendar Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-slate-400 uppercase font-bold">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 text-xs font-mono">
              {/* Empty slots for first day offset */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 rounded-2xl bg-white/[0.01] border border-transparent" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const roundMatch = REGISTERED_ARENA_ROUNDS.find((r) => r.day === dayNum);
                const isSelected = selectedCalendarDay === dayNum;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedCalendarDay(dayNum)}
                    className={`h-14 p-1 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-500/40 shadow-lg'
                        : roundMatch
                        ? 'bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 border-purple-500/50 hover:border-purple-300 shadow-md'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${
                        isSelected ? 'text-white' : roundMatch ? 'text-purple-300 font-extrabold' : 'text-slate-400'
                      }`}>
                        {dayNum}
                      </span>
                      {roundMatch && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>

                    {roundMatch ? (
                      <div className="text-[8px] font-bold px-1 py-0.5 rounded bg-purple-500/30 text-purple-200 truncate border border-purple-400/30">
                        ⚡ R{roundMatch.roundNumber} Live
                      </div>
                    ) : (
                      <div className="h-3" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>🟣 Registered Sprint Round</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>⚡ Live Challenge Day</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>🏆 Demo & Finale</span>
              </span>
            </div>
          </div>

          {/* Selected Date Round Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {activeRoundForSelectedDay ? (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/40 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ROUND MARKED & REGISTERED</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {activeRoundForSelectedDay.pointsReward}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold block">
                    {activeRoundForSelectedDay.eventTitle}
                  </span>
                  <h4 className="text-base font-bold text-white font-heading mt-0.5">
                    {activeRoundForSelectedDay.roundName}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed">
                    {activeRoundForSelectedDay.description}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 text-[10px] uppercase">Sprint Window:</span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{activeRoundForSelectedDay.time}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 text-[10px] uppercase">Assigned Squad:</span>
                    <span className="text-purple-300 font-bold">{activeRoundForSelectedDay.teamName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 text-[10px] uppercase">Role in Squad:</span>
                    <span className="text-white">{activeRoundForSelectedDay.role}</span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToWorkspace}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Enter Live Code Workspace →</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-2 flex flex-col items-center justify-center h-full">
                <CalendarIcon className="w-8 h-8 text-slate-600" />
                <h4 className="text-xs font-bold text-white font-mono">
                  Day {selectedCalendarDay || 'Selected'} · No Active Round
                </h4>
                <p className="text-[11px] text-slate-400 font-sans max-w-xs">
                  Tap on highlighted calendar dates (Day 15, 20, 28) to inspect your marked competition rounds.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. ACHIEVEMENT & GRAND MASTER PRESTIGE BADGES (PURE LOGOS)          */}
      {/* =================================================================== */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0d0e1a] p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                Coding Arena Achievement Ladder
              </p>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
              <span>All Achievement Badges</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300">
                {totalBadgesCount} Badges
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Badges unlock progressively for high-impact coding achievements, Grand Master victories, and precision milestones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/[0.03] border border-white/[0.06] p-3 rounded-2xl">
            <div className="text-center px-2">
              <p className="text-xl font-bold text-emerald-400 font-mono">{unlockedCount}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Earned</p>
            </div>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="text-center px-2">
              <p className="text-xl font-bold text-slate-500 font-mono">{lockedCount}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase">Locked</p>
            </div>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="text-center px-2">
              <p className="text-xl font-bold text-amber-400 font-mono">{unlockedPercent}%</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Unlocked</p>
            </div>
          </div>
        </div>

        {/* Filter Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <button
            onClick={() => setProfileBadgeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              profileBadgeFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({totalBadgesCount})
          </button>

          <button
            onClick={() => setProfileBadgeFilter('github')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              profileBadgeFilter === 'github'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Grand Master Prestige (12)</span>
          </button>

          <button
            onClick={() => setProfileBadgeFilter('coding')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              profileBadgeFilter === 'coding'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-300" />
            <span>Coding Arena Milestones</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* A. GRAND MASTER PRESTIGE BADGES (12) (EARNED FOR SOMETHING BIG)   */}
        {/* =================================================================== */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'github') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Grand Master Prestige Badges (12)</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">Tiers: Bronze • Silver • Gold • Diamond • High-Stakes Arena Breakthroughs</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {evaluatedGhBadges.map((badge) => {
                const isEarned = badge.isUnlocked;
                const multiplier = badge.currentLevel || 1;

                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedGhBadgeDetail(badge)}
                    title={`Tap to view: ${badge.name}`}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center group ${
                      isEarned
                        ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/40 hover:border-cyan-300 hover:scale-110 shadow-lg ring-1 ring-cyan-500/20'
                        : 'bg-white/[0.02] border-white/[0.05] opacity-45 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    {/* Top Multiplier / Lock Status Tag */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        isEarned ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isEarned ? `x${multiplier}` : '🔒'}
                      </span>
                    </div>

                    {/* Pure Logo Token */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl my-2 shadow-inner group-hover:scale-115 transition-transform ${
                      isEarned ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.03] border border-white/[0.05] grayscale'
                    }`}>
                      {badge.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* B. CODING ARENA MILESTONES (OPEN & ALL LOCKED EXCEPT ONE)          */}
        {/* =================================================================== */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'coding') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Coding Arena Milestones</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">Levels 1 to 20 • Progressive Sprint & Accuracy Milestone Ladder</span>
            </div>

            {/* Pure Logo Grid (Only Badge #, Status Pill & Big Logo Icon) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
              {evaluatedCodingBadges.map((badge) => {
                const isEarned = badge.isUnlocked;

                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadgeDetail(badge)}
                    title={`Tap to view: Badge #${badge.badgeNumber} - ${badge.name}`}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center group ${
                      isEarned
                        ? 'bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 border-purple-500/40 hover:border-purple-300 hover:scale-110 shadow-lg ring-1 ring-purple-500/20'
                        : 'bg-white/[0.02] border-white/[0.05] opacity-45 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    {/* Top Tag with Level / Lock */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-mono font-bold text-purple-300">
                        #{badge.badgeNumber}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        isEarned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isEarned ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>

                    {/* Pure Big Logo Visual */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl my-2 shadow-inner group-hover:scale-115 transition-transform ${
                      isEarned ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white/[0.03] border border-white/[0.05] grayscale'
                    }`}>
                      {badge.icon}
                    </div>

                    {/* Title */}
                    <p className={`text-xs font-bold truncate max-w-[120px] font-heading ${
                      isEarned ? 'text-white' : 'text-slate-500'
                    }`}>
                      {badge.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL: EDIT PROFILE INFO (NAME, BRANCH, BIO)                        */}
      {/* =================================================================== */}
      {isProfileInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d0e1a] border border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Edit Profile Info</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExtractFromSkillBarter}
                  disabled={isExtracting}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Auto-fill form from your Skill Barter profile"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{isExtracting ? 'Extracting...' : 'Auto-Fill from Skill Barter'}</span>
                </button>
                <button onClick={() => setIsProfileInfoModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Year & Branch</label>
                <input
                  type="text"
                  value={editYearBranch}
                  onChange={(e) => setEditYearBranch(e.target.value)}
                  placeholder="e.g. 3rd Year · Computer Science & Engineering (CSE)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Bio / About Me</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your technical focus, passion projects, and coding interests..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsProfileInfoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfileInfo}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Info'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* BADGE INSPECT DETAIL MODALS (CODING + GRAND MASTER)                 */}
      {/* =================================================================== */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0d0e1a] border border-purple-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-purple-300">
                Badge #{selectedBadgeDetail.badgeNumber} · {selectedBadgeDetail.category}
              </span>
              <button onClick={() => setSelectedBadgeDetail(null)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center space-y-3 py-2">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-5xl shadow-lg">
                {selectedBadgeDetail.icon}
              </div>
              <h3 className="text-lg font-bold text-white font-heading">{selectedBadgeDetail.name}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedBadgeDetail.description}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unlock Requirement:</span>
                <span className="text-purple-300 font-bold">{selectedBadgeDetail.requirement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={selectedBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedBadgeDetail.isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                </span>
              </div>
              {selectedBadgeDetail.unlockedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Earned Date:</span>
                  <span className="text-amber-300 font-bold">{selectedBadgeDetail.unlockedAt}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedBadgeDetail(null)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedGhBadgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0d0e1a] border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300">
                Grand Master Prestige Badge
              </span>
              <button onClick={() => setSelectedGhBadgeDetail(null)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center space-y-3 py-2">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-5xl shadow-lg">
                {selectedGhBadgeDetail.icon}
              </div>
              <h3 className="text-lg font-bold text-white font-heading">{selectedGhBadgeDetail.name}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedGhBadgeDetail.description}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Level:</span>
                <span className="text-cyan-300 font-bold">x{selectedGhBadgeDetail.currentLevel || 1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={selectedGhBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedGhBadgeDetail.isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                </span>
              </div>
              {selectedGhBadgeDetail.unlockedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Earned Date:</span>
                  <span className="text-amber-300 font-bold">{selectedGhBadgeDetail.unlockedAt}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedGhBadgeDetail(null)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
