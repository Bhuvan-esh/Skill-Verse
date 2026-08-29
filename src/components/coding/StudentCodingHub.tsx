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
  Filter,
  Plus,
  BookOpen,
  Phone,
  GraduationCap,
  Bot,
  ShieldCheck,
  Layers,
  Info
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

  // Student Profile & Innovation Hub Leaderboard state
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [conceptTitle, setConceptTitle] = useState('');
  const [conceptDescription, setConceptDescription] = useState('');
  const [conceptCategory, setCategory] = useState('Coding Challenge');
  const [conceptLectureId, setLectureId] = useState('CS-Lec-1');
  const [conceptSubmitError, setConceptSubmitError] = useState('');
  const [conceptSubmitSuccess, setConceptSubmitSuccess] = useState('');

  // Lecture Headcount Tallies & Activity Metrics state
  const [tallies, setTallies] = useState({
    submissions: 5,
    sessionAttended: 12,
    sessionConducted: 3,
  });

  // Embedded Active Leaderboard Standings Table Data
  const [profileLeaderboardData] = useState([
    { rank: 1, name: 'Alex Johnson', usn: '1RV23CS001', s1: 45, s2: 38, s3: 50, s4: 60, total: 193 },
    { rank: 2, name: 'Rahul Sharma', usn: '1RV23CS042', s1: 40, s2: 35, s3: 45, s4: 55, total: 175 },
    { rank: 3, name: 'Meera K', usn: '1RV23AI018', s1: 38, s2: 42, s3: 40, s4: 50, total: 170 },
    { rank: 4, name: 'Sanjay V', usn: '1RV23IS089', s1: 30, s2: 30, s3: 35, s4: 45, total: 140 },
    { rank: 5, name: 'Priya S', usn: '1RV23AI055', s1: 25, s2: 32, s3: 38, s4: 40, total: 135 },
  ]);

  // Student history state
  const [studentHistory, setStudentHistory] = useState<any | null>(null);

  // Live Visual Architect Clock & Team API State (AIDS & AIML Exclusive)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [teamData, setTeamData] = useState<any | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const releaseScheduleTime = '02:00:00 PM IST';


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

    const updateLiveClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateLiveClock();
    const interval = setInterval(updateLiveClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real team data from API when My Team tab is active
  const fetchMyTeam = async () => {
    try {
      setTeamLoading(true);
      setTeamError(null);
      const res = await fetch('/api/coding/my-team');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load team');
      setTeamData(data);
    } catch (e: any) {
      setTeamError(e.message || 'Could not load team data');
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'team') {
      fetchMyTeam();
    }
  }, [activeTab]);

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

  const handleSubmitConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    setConceptSubmitError('');
    setConceptSubmitSuccess('');
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: conceptTitle,
          description: conceptDescription,
          category: conceptCategory || 'Coding Challenge',
          lecture_id: conceptLectureId || 'CS-Lec-1',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConceptSubmitSuccess('Concept submitted successfully!');
      setConceptTitle('');
      setConceptDescription('');
      setTallies((prev) => ({ ...prev, submissions: prev.submissions + 1 }));
      onRefresh();
      setTimeout(() => setShowConceptModal(false), 1500);
    } catch (err: any) {
      setConceptSubmitError(err.message);
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
                { id: 'live', label: 'âš¡ Live Now' },
                { id: 'upcoming', label: 'ðŸ“… Upcoming' },
                { id: 'past', label: 'ðŸ† Past / Completed' },
                { id: 'practice', label: 'ðŸ’» Practice Problems' },
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
                  Enter Live Arena â†’
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
                              Enter Workspace â†’
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
                      {eventDetail.event.category} â€¢ {eventDetail.event.difficulty}
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
                            <span className="text-[10px] font-mono text-slate-400">{chal.difficulty} â€¢ Time Limit: {chal.time_limit}m</span>
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
        <div className="space-y-6 font-sans">

          {/* Real-time Clock & Visual Architect Release Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-black/60 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Visual Architects Live Release Clock</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-amber-300 font-mono tracking-wider">
                    â° {currentTime || '12:00:00 PM'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Timing Synced
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                ðŸŽ“ AIDS &amp; AIML Department Track
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Release Slot: {teamData?.event?.releaseTime
                  ? new Date(teamData.event.releaseTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                  : releaseScheduleTime}
              </span>
              <button
                onClick={fetchMyTeam}
                disabled={teamLoading}
                className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all font-mono text-[10px] flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${teamLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {teamLoading && (
            <div className="glass-panel p-12 rounded-3xl border border-white/10 bg-slate-950/60 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-slate-400 font-mono text-sm">Syncing with Visual Architects...</p>
            </div>
          )}

          {/* Error State */}
          {!teamLoading && teamError && (
            <div className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-950/20 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-semibold text-sm font-heading">Team data could not be loaded</p>
                <p className="text-red-400/70 text-xs font-mono mt-1">{teamError}</p>
                <button onClick={fetchMyTeam} className="mt-3 px-4 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-500/30 transition-all">
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* PENDING STATE â€” Team Not Yet Released */}
          {!teamLoading && !teamError && teamData && !teamData.released && (
            <div className="space-y-4">
              {/* Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 shadow-xl">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Team Synthesis &amp; Architect Verification</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-heading">Team Allocation &amp; Roster</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl">
                    Teams are generated by AI to balance students across 1st, 2nd, 3rd, and 4th years, then reviewed and released by Visual Architects.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono font-bold text-xs tracking-wide">
                    â³ Awaiting Release
                  </span>
                </div>
              </div>

              {/* Pending info card */}
              <div className="glass-card p-8 rounded-3xl border border-amber-500/20 bg-amber-950/10 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-amber-200 font-heading">
                    Visual Architects Are Reviewing Your Team
                  </h3>
                  <p className="text-sm text-slate-400 font-sans max-w-lg leading-relaxed">
                    {teamData.message || 'Your team has been generated by the AI balancing system. Visual Architects will validate and release your team credentials shortly.'}
                  </p>
                  {teamData.releaseTime && (
                    <div className="mt-3 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 inline-flex items-center space-x-2 text-amber-300 font-mono text-sm">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>
                        Scheduled Release:{' '}
                        {new Date(teamData.releaseTime).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ðŸ¤– AI Multi-Year Balanced Formation
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    ðŸŽ“ AIDS &amp; AIML Department Exclusive
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RELEASED STATE â€” Show Real Team Roster */}
          {!teamLoading && !teamError && teamData && teamData.released && (
            <div className="space-y-6">

              {/* Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 shadow-xl">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Team Synthesis &amp; Architect Verification</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-heading flex flex-wrap items-center gap-3">
                    <span>Team Allocation &amp; Roster</span>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Visual Architects Release Approved</span>
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl">
                    Teams are generated by AI to balance students across 1st, 2nd, 3rd, and 4th years, then reviewed and released by Visual Architects.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-200 font-mono font-bold text-xs tracking-wide">
                    {teamData.team?.name ? `Team #${teamData.team.team_number} â€” ${teamData.team.name}` : 'Team #1 â€” Algorithmic Titans'}
                  </span>
                </div>
              </div>

              {/* Approved + Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-2 shadow-lg">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs font-mono uppercase">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span>AI Multi-Year Balanced Formation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Our AI algorithm automatically balances students across <strong>1st, 2nd, 3rd, and 4th year cohorts</strong> exclusively for <strong>AIDS &amp; AIML departments</strong>, blending algorithmic problem solving, machine learning model logic, and competitive coding efficiency.
                  </p>
                </div>
                <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 shadow-lg">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs font-mono uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Visual Architects Release Approved</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong>You have got your team!</strong> Visual Architects have officially validated your team roster and released participant credentials. Connect with your team members using their verified USN and contact numbers below.
                  </p>
                </div>
              </div>

              {/* Verified Team Roster Grid */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Verified Team Roster</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Registered Credentials (Name, USN, Phone Number, Year)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(teamData.team?.members || []).map((m: any, idx: number) => (
                    <div
                      key={m.id || idx}
                      className={`glass-card p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                        m.isCurrentUser
                          ? 'border-purple-500/60 bg-purple-950/30 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
                          : 'border-white/10 hover:border-purple-500/30 bg-slate-950/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-mono font-extrabold text-xs text-purple-300">
                            #{m.slot || idx + 1}
                          </span>
                          {m.isCurrentUser ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-mono font-bold">YOU</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">Verified Member</span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white font-heading leading-tight mb-1">{m.name}</h4>
                        <p className="text-[11px] text-purple-300 font-mono mb-3">{m.role_title}</p>

                        <div className="space-y-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase block">USN</span>
                            <span className="text-white font-bold">{m.usn}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase block">Contact Number</span>
                            <span className="text-amber-300 font-bold flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>{m.phone !== 'N/A' ? m.phone : 'Not provided'}</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase block">Academic Cohort</span>
                            <span className="text-teal-300 font-bold flex items-center space-x-1">
                              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                              <span>{m.cohort}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready for Sprint</span>
                        </span>
                        <span>Slot #{m.slot || idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Strip */}
              <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Squad Diversity: <strong>1st, 2nd, 3rd &amp; 4th Year Balanced</strong></span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400">Approved by: <strong className="text-purple-300">Visual Architects</strong></span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">âœ“ Team Synchronized</span>
                </div>
              </div>
            </div>
          )}

          {/* No team data yet (first load / not registered) */}
          {!teamLoading && !teamError && !teamData && (
            <div className="glass-panel p-12 rounded-3xl border border-white/10 bg-slate-950/60 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-slate-300 font-semibold font-heading">Your team info will appear here</p>
              <p className="text-slate-500 text-xs font-mono">Register for a team coding event to be assigned a team by Visual Architects.</p>
            </div>
          )}

        </div>
      )}
      {/* TAB 4: LEADERBOARD (Student Profile & Innovation Hub) */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-8 font-sans">

          {/* Profile & Innovation Hub Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Student Profile & Innovation Hub</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Profile â€” {user?.name || 'demo L'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                {user?.usn ? `USN: ${user.usn} | ` : ''}View earned credits, attendance metrics, and upcoming club sessions.
              </p>
            </div>

            <button
              onClick={() => setShowConceptModal(true)}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Concept</span>
            </button>
          </div>

          {/* Your Leaderboard Credit Scorecard */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Award className="w-4 h-4" />
                <span>Your Leaderboard Credit Scorecard</span>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Rank #1 Active Standings
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="glass-card p-3.5 rounded-2xl border border-purple-500/20 text-center">
                <span className="text-xs text-purple-400 font-semibold block mb-1 font-mono">Session 1</span>
                <span className="text-2xl font-extrabold text-white font-mono">45</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">pts</span>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-xs text-indigo-400 font-semibold block mb-1 font-mono">Session 2</span>
                <span className="text-2xl font-extrabold text-white font-mono">38</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">pts</span>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-teal-500/20 text-center">
                <span className="text-xs text-teal-400 font-semibold block mb-1 font-mono">Session 3</span>
                <span className="text-2xl font-extrabold text-white font-mono">50</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">pts</span>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-emerald-500/20 text-center">
                <span className="text-xs text-emerald-400 font-semibold block mb-1 font-mono">Session 4</span>
                <span className="text-2xl font-extrabold text-white font-mono">60</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">pts</span>
              </div>

              <div className="col-span-2 sm:col-span-1 glass-card p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-center">
                <span className="text-xs text-amber-300 font-bold block mb-1 font-mono">Total Score</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">193</span>
                <span className="text-[10px] text-amber-200 block mt-0.5 font-mono">Overall Credits</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Standings Table */}
          <div className="glass-panel rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl space-y-3 p-5 bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Leaderboard Standings Table</span>
              </h3>
              <span className="text-xs text-amber-300 font-bold font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Transferred from Leaderboard Section
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4 font-sans">Student Name</th>
                    <th className="py-3 px-4">USN</th>
                    <th className="py-3 px-4 text-center">Session 1</th>
                    <th className="py-3 px-4 text-center">Session 2</th>
                    <th className="py-3 px-4 text-center">Session 3</th>
                    <th className="py-3 px-4 text-center">Session 4</th>
                    <th className="py-3 px-4 text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200 font-medium">
                  {profileLeaderboardData.map((row) => (
                    <tr key={row.rank} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-4 font-bold">
                        {row.rank === 1 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ðŸ¥‡ #1
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30">
                            ðŸ¥ˆ #2
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30">
                            ðŸ¥‰ #3
                          </span>
                        ) : (
                          <span className="text-slate-400">#{row.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-xs font-sans">{row.name}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{row.usn}</td>
                      <td className="py-3 px-4 text-center font-semibold text-purple-400">{row.s1}</td>
                      <td className="py-3 px-4 text-center font-semibold text-indigo-400">{row.s2}</td>
                      <td className="py-3 px-4 text-center font-semibold text-teal-400">{row.s3}</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-400">{row.s4}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-amber-400 text-xs font-heading">
                        {row.total} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lecture Headcount Tallies & Activity Metrics */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 bg-slate-950/60 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Lecture Headcount Tallies & Activity Metrics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Submissions */}
              <div className="glass-card p-5 rounded-2xl border border-purple-500/30 text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-semibold block uppercase font-mono">Submissions</span>
                <div className="text-3xl font-extrabold text-purple-400 font-mono">
                  {tallies.submissions}
                </div>
                <span className="text-[11px] text-slate-400 block font-sans">Total ideas & tasks submitted</span>
              </div>

              {/* Session Attended */}
              <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-semibold block uppercase font-mono">Session Attended</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {tallies.sessionAttended}
                </div>
                <span className="text-[11px] text-slate-400 block font-sans">Live workshops & lectures attended</span>
              </div>

              {/* Session Conducted */}
              <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-semibold block uppercase font-mono">Session Conducted</span>
                <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                  {tallies.sessionConducted}
                </div>
                <span className="text-[11px] text-slate-400 block font-sans">Mentoring walkthroughs run</span>
              </div>
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
                        Registered: {new Date(reg.registered_at).toLocaleDateString()} â€¢ Format: {reg.event?.category}
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

      {/* Submit Concept Modal */}
      {showConceptModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Submit New Concept</h3>
              <button onClick={() => setShowConceptModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {conceptSubmitError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">{conceptSubmitError}</div>}
            {conceptSubmitSuccess && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">{conceptSubmitSuccess}</div>}

            <form onSubmit={handleSubmitConcept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">Concept Title</label>
                <input
                  type="text"
                  required
                  value={conceptTitle}
                  onChange={(e) => setConceptTitle(e.target.value)}
                  placeholder="e.g. Algorithmic Optimization Pipeline"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">Description & Objectives</label>
                <textarea
                  required
                  rows={3}
                  value={conceptDescription}
                  onChange={(e) => setConceptDescription(e.target.value)}
                  placeholder="Describe your coding challenge concept, test cases, and problem specs..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono transition-all shadow-lg shadow-purple-600/30"
              >
                Submit Concept
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
