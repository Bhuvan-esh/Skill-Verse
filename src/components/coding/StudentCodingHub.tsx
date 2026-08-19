'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Code,
  Calendar,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Play,
  FileCode,
  Send,
  XCircle,
  TrendingUp,
  Search,
  ChevronRight,
  Zap,
  Check,
  AlertTriangle,
  History,
  Medal,
  RefreshCw,
  UserCheck,
  Flame,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import PillarCodingDashboard from './PillarCodingDashboard';

interface StudentCodingHubProps {
  user: any;
  onRefresh: () => void;
  subTab?: string;
  setSubTab?: (subTab: string) => void;
}

export default function StudentCodingHub({ user, onRefresh, subTab, setSubTab }: StudentCodingHubProps) {
  const [internalTab, setInternalTab] = useState<'events' | 'workspace' | 'team' | 'leaderboard' | 'history'>('events');
  
  const activeTab = (subTab as 'events' | 'workspace' | 'team' | 'leaderboard' | 'history') || internalTab;
  const setActiveTab = (tab: 'events' | 'workspace' | 'team' | 'leaderboard' | 'history') => {
    setInternalTab(tab);
    if (setSubTab) setSubTab(tab);
  };
  const [filterChip, setFilterChip] = useState<'all' | 'live' | 'upcoming' | 'past' | 'practice'>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDetail, setEventDetail] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);

  // Solution Code Editor state
  const [solutionCode, setSolutionCode] = useState<string>(
`# Write your solution below
def solve():
    # Read inputs and print result
    pass

if __name__ == "__main__":
    solve()`
  );
  const [selectedLanguage, setSelectedLanguage] = useState('PYTHON');
  const [submitting, setSubmitting] = useState(false);

  // Status banners
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');

  // Cancellation Modal
  const [cancelModalEvent, setCancelModalEvent] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Student history state
  const [studentHistory, setStudentHistory] = useState<any | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coding/events');
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        if (data.events?.length > 0 && !selectedEventId) {
          setSelectedEventId(data.events[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch coding events", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/coding/events/${id}`);
      const data = await res.json();
      if (res.ok) {
        setEventDetail(data);
        if (data.event?.challenges?.length > 0) {
          setSelectedChallenge(data.event.challenges[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch event detail", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/coding/leaderboard');
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  const fetchStudentHistory = async () => {
    try {
      const res = await fetch('/api/coding/my-history');
      const data = await res.json();
      if (res.ok) {
        setStudentHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch student history", e);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchLeaderboard();
    fetchStudentHistory();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventDetail(selectedEventId);
    }
  }, [selectedEventId]);

  const handleRegister = async (eventId: string) => {
    setActionMsg('');
    setActionErr('');
    try {
      const res = await fetch(`/api/coding/events/${eventId}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg(data.message || 'Successfully registered for competition!');
      fetchEvents();
      if (selectedEventId) fetchEventDetail(selectedEventId);
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message);
    }
  };

  const handleCancelRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalEvent) return;
    setActionMsg('');
    setActionErr('');
    try {
      const res = await fetch(`/api/coding/events/${cancelModalEvent.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg(data.message);
      setCancelModalEvent(null);
      setCancelReason('');
      fetchEvents();
      if (selectedEventId) fetchEventDetail(selectedEventId);
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message);
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedEventId || !selectedChallenge) return;
    setActionMsg('');
    setActionErr('');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/coding/events/${selectedEventId}/challenges/${selectedChallenge.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: solutionCode,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg(`${data.message} (+${data.scoreAwarded} Points | +${data.creditsEarned} Domain Credits)`);
      if (selectedEventId) fetchEventDetail(selectedEventId);
      fetchLeaderboard();
      fetchStudentHistory();
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter events based on filter chips
  const filteredEvents = events.filter((evt) => {
    if (filterChip === 'live') return evt.status === 'LIVE';
    if (filterChip === 'upcoming') return evt.status === 'REGISTRATION_OPEN' || evt.status === 'READY';
    if (filterChip === 'past') return evt.status === 'COMPLETED';
    if (filterChip === 'practice') return evt.difficulty === 'EASY' || evt.difficulty === 'MEDIUM';
    return true;
  });

  const liveEvent = events.find((evt) => evt.status === 'LIVE');
  const upcomingEvent = events.find((evt) => evt.status === 'REGISTRATION_OPEN');

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.student?.usn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myLeaderboardEntry = leaderboard.find((e) => e.student_id === user?.id);
  const myTeamSize = eventDetail?.userTeam?.members?.length || 1;

  return (
    <div className="space-y-6 font-sans">

      {/* Quick Stats Widget Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-900/60 border border-purple-500/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Domain Credits Earned</span>
            <span className="text-base font-extrabold text-white font-mono">+{myLeaderboardEntry?.credits || 150} Credits</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-900/60 border border-purple-500/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Clock className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Upcoming Deadline</span>
            <span className="text-base font-extrabold text-teal-300 font-mono">In 2 Days (Hackathon)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-900/60 border border-purple-500/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Last Solution Submission</span>
            <span className="text-base font-extrabold text-emerald-300 font-mono">PASSED (+150 Pts)</span>
          </div>
        </div>
      </div>

      {/* Global Action Alerts */}
      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-emerald-400 hover:text-white"><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {actionErr && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{actionErr}</span>
          </div>
          <button onClick={() => setActionErr('')} className="text-rose-400 hover:text-white"><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {/* TAB 1: COMPETITIONS ARENA & 7 PILLARS */}
      {activeTab === 'events' && (
        <div className="space-y-10">

          {/* 7-Pillars Dashboard (Pillar Cards, Twist Alerts, Team Status, Recognition & Demos) */}
          <PillarCodingDashboard user={user} onRefresh={onRefresh} />

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-purple-500/20">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Filter className="w-4 h-4 text-purple-400" />
              <span className="font-bold">Filter Contests:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Contests' },
                { id: 'live', label: '⚡ Live Now' },
                { id: 'upcoming', label: '📅 Upcoming' },
                { id: 'past', label: '🏆 Past / Completed' },
                { id: 'practice', label: '💻 Practice Problems' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilterChip(chip.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    filterChip === chip.id
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live / Upcoming Countdown Feature Card */}
          {(liveEvent || upcomingEvent) && filterChip === 'all' && (
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-purple-950/60 via-slate-950 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase animate-pulse flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Live Contest Featured</span>
                  </span>
                  <span className="text-xs font-mono text-amber-300">
                    +{liveEvent?.credits_reward || 100} Reward Credits
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white font-heading">
                  {liveEvent?.title || upcomingEvent?.title || "Algorithmic Sprint 2026"}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {liveEvent?.description || upcomingEvent?.description}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2 min-w-[200px]">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Contest Ends In</span>
                <span className="text-2xl font-extrabold text-amber-300 font-mono tracking-wider">02d 04h 31m</span>
                <button
                  onClick={() => {
                    setSelectedEventId(liveEvent?.id || upcomingEvent?.id);
                    setActiveTab('workspace');
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-md shadow-purple-600/30"
                >
                  Enter Live Arena →
                </button>
              </div>
            </div>
          )}

          {/* Skeleton Loader during fetch */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="h-12 bg-white/5 rounded w-full" />
                  <div className="h-10 bg-white/10 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Rich Empty State Container */
            <div className="glass-card p-10 rounded-3xl border border-purple-500/30 text-center max-w-2xl mx-auto space-y-5 bg-slate-950/60 shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-heading">
                  No Coding Competitions Found in Arena
                </h3>
                <p className="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
                  No competitions match your current filter. Check back soon for upcoming algorithmic speed-codes or explore practice problems to sharpen your skills!
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setFilterChip('practice')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
                >
                  Browse Practice Problems
                </button>
                <button
                  onClick={() => setFilterChip('all')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs transition-all"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            /* Competitions Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => {
                const isRegistered = evt.registrations?.some((r: any) => r.student_id === user?.id && r.status === 'REGISTERED');
                const isLive = evt.status === 'LIVE';
                const isCompleted = evt.status === 'COMPLETED';

                return (
                  <div
                    key={evt.id}
                    className={`glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4 border transition-all ${
                      selectedEventId === evt.id ? 'border-purple-500/60 shadow-lg shadow-purple-500/10' : 'border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    <div>
                      {/* Status Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isLive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' :
                          isCompleted ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {evt.status}
                        </span>

                        <span className="text-xs font-extrabold text-amber-400 flex items-center space-x-1 font-mono">
                          <Award className="w-3.5 h-3.5" />
                          <span>+{evt.credits_reward} Credits</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1.5 font-heading">{evt.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans line-clamp-2">{evt.description}</p>

                      {/* Event Meta Metadata */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 mb-4">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Format</span>
                          <span className="font-bold text-purple-300">{evt.is_team ? `Team (${evt.team_size} members)` : 'Individual'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Difficulty</span>
                          <span className="font-bold text-amber-300">{evt.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Date</span>
                          <span>{new Date(evt.event_date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Participants</span>
                          <span>{evt._count?.registrations || 0} / {evt.max_participants}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                      {isRegistered ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Registered</span>
                          </span>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedEventId(evt.id);
                                setActiveTab('workspace');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold"
                            >
                              Enter Workspace →
                            </button>
                            <button
                              onClick={() => setCancelModalEvent(evt)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/30"
                              title="Cancel Registration"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : isCompleted ? (
                        <button
                          onClick={() => {
                            setSelectedEventId(evt.id);
                            setActiveTab('workspace');
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold"
                        >
                          View Results & Winners
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(evt.id)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-90 text-white font-bold text-xs font-mono shadow-md shadow-purple-500/20"
                        >
                          Register for Competition
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Student Performance Stats Strip */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
              Student Arena Performance Stats
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Current Rank</span>
                <span className="text-xl font-extrabold text-amber-300 font-mono">#{myLeaderboardEntry?.rank || 12}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Problems Solved</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{studentHistory?.submissions?.length || 18} Solved</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Current Streak</span>
                <span className="text-xl font-extrabold text-purple-300 font-mono flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>5 Days</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Rating & Points</span>
                <span className="text-xl font-extrabold text-teal-300 font-mono">{myLeaderboardEntry?.points || 1250} Pts</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: LIVE CODE WORKSPACE */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Challenge Details & Released Problem */}
          <div className="lg:col-span-5 space-y-4">
            {eventDetail?.event ? (
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                      {eventDetail.event.category} • {eventDetail.event.difficulty}
                    </span>
                    <h3 className="text-lg font-extrabold text-white font-heading">{eventDetail.event.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    +{eventDetail.event.credits_reward} Credits
                  </span>
                </div>

                {/* Challenge List Selector */}
                {eventDetail.event.challenges?.length > 0 ? (
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-2">Released Problems</label>
                    <div className="space-y-2">
                      {eventDetail.event.challenges.map((chal: any) => (
                        <button
                          key={chal.id}
                          onClick={() => setSelectedChallenge(chal)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                            selectedChallenge?.id === chal.id
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{chal.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">{chal.difficulty} • Time Limit: {chal.time_limit}m</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300">+{chal.points} pts</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                    Problem statements will be released when the competition goes Live!
                  </div>
                )}

                {/* Active Problem Statement */}
                {selectedChallenge && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-sm font-bold text-white font-heading">{selectedChallenge.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{selectedChallenge.points} Points</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{selectedChallenge.problem_statement}</p>

                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Input Format</span>
                        <span className="text-slate-200">{selectedChallenge.input_info}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Output Format</span>
                        <span className="text-slate-200">{selectedChallenge.output_info}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Constraints</span>
                        <span className="text-amber-300">{selectedChallenge.constraints}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-6 rounded-3xl text-center text-xs text-slate-400 font-mono">
                Select a competition from the Events tab to view challenges.
              </div>
            )}
          </div>

          {/* Right Column: Code Editor & Submission Console */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white font-heading">Solution Console</h3>
                </div>

                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-purple-300 border border-white/10 text-xs font-mono font-bold focus:outline-none"
                >
                  <option value="PYTHON">Python 3.11</option>
                  <option value="JAVASCRIPT">JavaScript (Node.js)</option>
                  <option value="CPP">C++20 (GCC)</option>
                  <option value="JAVA">Java 17</option>
                </select>
              </div>

              {/* Textarea Code Editor */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30">
                <textarea
                  rows={12}
                  value={solutionCode}
                  onChange={(e) => setSolutionCode(e.target.value)}
                  placeholder="Type your solution implementation code here..."
                  className="w-full p-4 bg-slate-950 text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-purple-500 selection:text-white"
                />
              </div>

              {/* Submit Runner */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Target: {selectedChallenge ? selectedChallenge.title : 'Select a problem'}
                </span>

                <button
                  onClick={handleSubmitSolution}
                  disabled={submitting || !selectedChallenge}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
                >
                  {submitting ? (
                    <span>Evaluating Test Cases...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MY TEAM */}
      {activeTab === 'team' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white font-heading">Team Allocation & Roster</h3>
              <p className="text-xs text-slate-400 font-sans">View your assigned team members for team-format competitions.</p>
            </div>
            {eventDetail?.userTeam && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono font-bold text-xs">
                {eventDetail.userTeam.team_name}
              </span>
            )}
          </div>

          {eventDetail?.userTeam ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {eventDetail.userTeam.members.map((m: any, idx: number) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-300 text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.student?.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{m.student?.usn || 'Club Member'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs font-mono">
              Register for a Team Competition to be assigned to an algorithmic team!
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-white/10">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student by name or USN..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none"
              />
            </div>
            <button onClick={fetchLeaderboard} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center space-x-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Leaderboard Table */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase">
              <span>Rank & Student</span>
              <span>Points & Credits</span>
            </div>

            <div className="divide-y divide-white/5">
              {filteredLeaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-4 flex items-center justify-between transition-all ${
                    entry.isCurrentUser ? 'bg-purple-600/20 border-l-4 border-purple-500' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-extrabold text-xs ${
                      idx === 0 ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30' :
                      idx === 1 ? 'bg-slate-300 text-black' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      #{idx + 1}
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                        <span>{entry.student?.name}</span>
                        {entry.isCurrentUser && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200">
                            YOU
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{entry.student?.usn || 'Student Participant'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-right font-mono">
                    <div>
                      <span className="text-xs font-extrabold text-purple-300 block">{entry.points} pts</span>
                      <span className="text-[10px] text-slate-400">{entry.competitions_count} competitions</span>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                      +{entry.credits} Credits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MY HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">My Participation & Credit Audit History</h3>

            {studentHistory?.registrations?.length > 0 ? (
              <div className="space-y-3">
                {studentHistory.registrations.map((reg: any) => (
                  <div key={reg.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{reg.event?.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Registered: {new Date(reg.registered_at).toLocaleDateString()} • Format: {reg.event?.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">
                No past competition history recorded. Register for your first contest above!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalEvent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Cancel Competition Registration</h3>
              <button onClick={() => setCancelModalEvent(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to cancel your spot in <strong>{cancelModalEvent.title}</strong>?
            </p>

            <form onSubmit={handleCancelRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Reason for Cancellation</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Provide reason for cancellation..."
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setCancelModalEvent(null)} className="w-1/2 py-2.5 rounded-xl bg-white/10 text-slate-300 text-xs font-mono">
                  Keep Registration
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold">
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
