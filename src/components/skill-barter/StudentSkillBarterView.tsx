'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, XCircle, User, BookOpen, Layers,
  GraduationCap, CheckCircle2, ShieldAlert, MessageSquare,
  Search, Award, Star, Send, ShieldCheck,
  ArrowRight, Code2, Cpu, ChevronRight, Filter,
  Zap, Lock, Users, Sparkles, Trophy, Check, Flame, Bell,
  GitPullRequest, Compass, HelpCircle,
} from 'lucide-react';
import {
  SKILLBARTER_BADGE_DEFINITIONS,
  evaluateStudentAchievements,
  EvaluatedBadge,
  StudentActivityMetrics,
  GITHUB_BADGE_DEFINITIONS,
  evaluateGitHubAchievements,
  EvaluatedGitHubBadge,
  GitHubBadgeTierInfo,
} from '@/lib/skillBarterAchievementEngine';

interface SkilloraProps {
  user: any;
  onRefresh: () => void;
  initialTab?: 'requests' | 'sessions' | 'discover' | 'achievements' | 'profile';
}

interface BarterSession {
  id: string; name: string; avatar: string; lastMessage: string;
  timestamp: string; skill: string; type: 'TEACHING' | 'LEARNING';
  status: 'ACTIVE' | 'COMPLETED'; autoDeleteOnEnd: boolean;
  messages: Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>;
}

interface PeerProfile {
  id: string; name: string; year: string; branch: string;
  avatar: string; rating: number; studentsHelped: number;
  canTeach: string[]; wantsToLearn: string[]; reputationMark: string;
}

const SEED_SESSIONS: BarterSession[] = [
  {
    id: 's-1', name: 'Rahul Sharma', avatar: '',
    lastMessage: 'Let\'s meet on Google Meet to review PostgreSQL indexing.',
    timestamp: '10:42 AM', skill: 'PostgreSQL & SQL', type: 'LEARNING',
    status: 'ACTIVE', autoDeleteOnEnd: true,
    messages: [
      { id: 'm-1', sender: 'them', text: 'Hey Anusha! Saw your request for database index tuning.', time: '10:30 AM' },
      { id: 'm-2', sender: 'me', text: 'Hi Rahul! Yes, need some quick pointers on EXPLAIN ANALYZE.', time: '10:35 AM' },
      { id: 'm-3', sender: 'them', text: 'Let\'s meet on Google Meet to review PostgreSQL indexing.', time: '10:42 AM' },
    ],
  },
  {
    id: 's-2', name: 'Meera K', avatar: '',
    lastMessage: 'I reviewed the Figma design tokens you shared! Looks great.',
    timestamp: 'Yesterday', skill: 'UI/UX & Figma', type: 'TEACHING',
    status: 'ACTIVE', autoDeleteOnEnd: false,
    messages: [
      { id: 'm-4', sender: 'them', text: 'Could you walk me through responsive auto-layout in Figma?', time: 'Yesterday' },
      { id: 'm-5', sender: 'me', text: 'Sure! Sent you a Figma link with the component system.', time: 'Yesterday' },
      { id: 'm-6', sender: 'them', text: 'I reviewed the Figma design tokens you shared! Looks great.', time: 'Yesterday' },
    ],
  },
  {
    id: 's-3', name: 'Sanjay V', avatar: '⚡',
    lastMessage: 'Session completed. Thanks for the Docker walkthrough!',
    timestamp: '24 Aug', skill: 'Docker & DevOps', type: 'TEACHING',
    status: 'COMPLETED', autoDeleteOnEnd: true,
    messages: [
      { id: 'm-7', sender: 'them', text: 'Thanks for walking me through docker compose up!', time: '24 Aug' },
      { id: 'm-8', sender: 'me', text: 'Anytime! Don\'t forget to claim your credits.', time: '24 Aug' },
    ],
  },
];

const DISCOVER_PEERS: PeerProfile[] = [
  { id: 'p-1', name: 'Rahul Sharma', year: '4th Year', branch: 'CSE', avatar: '', rating: 4.9, studentsHelped: 18, canTeach: ['PostgreSQL', 'SQL', 'FastAPI'], wantsToLearn: ['Next.js', 'Tailwind'], reputationMark: '👑' },
  { id: 'p-2', name: 'Meera K', year: '3rd Year', branch: 'AI & DS', avatar: '', rating: 4.8, studentsHelped: 12, canTeach: ['Figma', 'UI/UX', 'Python'], wantsToLearn: ['Docker', 'DevOps'], reputationMark: '🌟' },
  { id: 'p-3', name: 'Sanjay V', year: '3rd Year', branch: 'ISE', avatar: '⚡', rating: 4.9, studentsHelped: 15, canTeach: ['Docker', 'Kubernetes', 'Linux'], wantsToLearn: ['React Native', 'GraphQL'], reputationMark: '' },
  { id: 'p-4', name: 'Priya N', year: '2nd Year', branch: 'CSE', avatar: '', rating: 4.7, studentsHelped: 8, canTeach: ['React.js', 'JavaScript', 'CSS'], wantsToLearn: ['Machine Learning', 'PyTorch'], reputationMark: '' },
];

const DOMAIN_CHIP: Record<string, string> = {
  'Web Development': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Artificial Intelligence & ML': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Cloud DevOps': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Database Systems': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

type ActiveTab = 'requests' | 'sessions' | 'discover' | 'achievements';

export default function StudentSkillBarterView({ user, onRefresh, initialTab = 'requests' }: SkilloraProps) {
  const isParticipant = user?.role === 'STUDENT' || user?.role === 'FOUNDER';

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    initialTab === 'profile' ? 'requests' : (initialTab as ActiveTab)
  );

  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };

  const TABS = [
    { id: 'requests' as const, label: 'Peer Requests', icon: BookOpen },
    { id: 'sessions' as const, label: 'My Sessions', icon: MessageSquare },
    { id: 'discover' as const, label: 'Discover Peers', icon: Search },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  /* ──— Requests state ————————————————————————————————————————————————————── */
  const [postSessionRequests, setPostSessionRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [year, setYear] = useState('3rd Year');
  const [branch, setBranch] = useState('CSE');
  const [domain, setDomain] = useState('Web Development');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [offerLoadingId, setOfferLoadingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      const res = await fetch('/api/skill-barter/requests');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load requests');
      setPostSessionRequests(data.requests || []);
    } catch (e: any) {
      setRequestsError(e.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !message) { setErr('Skill topic and message are required'); return; }
    setErr('');
    try {
      const res = await fetch('/api/skill-barter/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: topic, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post request');
      setShowPostModal(false);
      setTopic(''); setMessage('');
      setMsg('Your peer session request has been published!');
      fetchRequests();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const handleOfferMentoring = async (requestId: string) => {
    try {
      setOfferLoadingId(requestId);
      const res = await fetch(`/api/skill-barter/requests/${requestId}/respond`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send offer');
      setMsg('✓ Mentor offer sent! The requester will be notified.');
      setSelectedRequest(null);
      fetchRequests();
    } catch (e: any) {
      setMsg(` ${e.message}`);
    } finally {
      setOfferLoadingId(null);
    }
  };

  /*  Sessions & Chat state  */
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [completingSession, setCompletingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const res = await fetch('/api/skill-barter/chats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load sessions');
      setSessions(data.chats || []);
      if (data.chats && data.chats.length > 0 && !activeSessionId) {
        setActiveSessionId(data.chats[0].id);
      }
    } catch (e: any) {
      console.error('Sessions fetch error:', e.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      setChatLoading(true);
      const res = await fetch(`/api/skill-barter/chats/${chatId}/messages`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load messages');
      setChatMessages(data.messages || []);
    } catch (e: any) {
      console.error('Chat messages fetch error:', e.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeSession) return;
    try {
      setSendingMsg(true);
      const res = await fetch(`/api/skill-barter/chats/${activeSession.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chatInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setChatInput('');
      fetchChatMessages(activeSession.id);
    } catch (e: any) {
      console.error('Send message error:', e.message);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleCompleteSession = async (chatId: string) => {
    try {
      setCompletingSession(true);
      const res = await fetch(`/api/skill-barter/chats/${chatId}/complete`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete session');
      setMsg('✓ Session marked complete! Founders have been notified.');
      fetchSessions();
    } catch (e: any) {
      setMsg(` ${e.message}`);
    } finally {
      setCompletingSession(false);
    }
  };

  useEffect(() => {
    if (activeSession?.id) {
      fetchChatMessages(activeSession.id);
    }
  }, [activeSessionId]);

  /*  Discover state  */
  const [discoverPeers, setDiscoverPeers] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchDiscoverPeers = async () => {
    try {
      setDiscoverLoading(true);
      const res = await fetch('/api/skill-barter/discover');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load peers');
      setDiscoverPeers(data.peers || []);
    } catch (e: any) {
      console.error('Discover peers error:', e.message);
    } finally {
      setDiscoverLoading(false);
    }
  };

  const filteredPeers = discoverPeers.filter((p) => {
    const q = searchQuery.toLowerCase();
    const match = p.name.toLowerCase().includes(q)
      || (p.canTeach || []).some((t: string) => t.toLowerCase().includes(q))
      || (p.wantsToLearn || []).some((w: string) => w.toLowerCase().includes(q))
      || (p.branch || '').toLowerCase().includes(q);
    return selectedFilter === 'ALL' ? match : match && (p.canTeach || []).some((t: string) => t.toUpperCase().includes(selectedFilter));
  });

  /*  Achievements state  */
  const [achievementsData, setAchievementsData] = useState<any | null>(null);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  const [metricsForEngine, setMetricsForEngine] = useState<StudentActivityMetrics>({
    totalSessionsCompleted: 8,
    studentsHelped: 6,
    teachingSessionsCompleted: 6,
    distinctSkillsTaught: 4,
    currentRating: 4.9,
    consecutiveTeachingWeeks: 4,
  });

  const [evaluation, setEvaluation] = useState(evaluateStudentAchievements(metricsForEngine, {
    'sb-badge-1': 'Earned 12 Aug 2026',
    'sb-badge-2': 'Earned 15 Aug 2026',
    'sb-badge-3': 'Earned 18 Aug 2026',
    'sb-badge-4': 'Earned 20 Aug 2026',
    'sb-badge-5': 'Earned 22 Aug 2026',
    'sb-badge-6': 'Earned 24 Aug 2026',
    'sb-badge-8': 'Earned 24 Aug 2026',
    'sb-badge-9': 'Earned 25 Aug 2026',
  }));

  const fetchAchievements = async () => {
    try {
      setAchievementsLoading(true);
      const res = await fetch('/api/skill-barter/achievements');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load achievements');
      setAchievementsData(data);
      if (data.metrics) {
        const newMetrics: StudentActivityMetrics = {
          totalSessionsCompleted: data.metrics.totalSessionsCompleted || 0,
          studentsHelped: data.metrics.studentsHelped || 0,
          teachingSessionsCompleted: data.metrics.teachingSessionsCompleted || 0,
          distinctSkillsTaught: data.metrics.distinctSkillsTaught || 0,
          currentRating: data.metrics.currentRating || 4.5,
          consecutiveTeachingWeeks: data.metrics.consecutiveTeachingWeeks || 0,
        };
        setMetricsForEngine(newMetrics);
        setEvaluation(evaluateStudentAchievements(newMetrics, data.unlockedDatesMap || {}));
      }
    } catch (e: any) {
      console.error('Achievements fetch error:', e.message);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const [evaluatedBadges, setEvaluatedBadges] = useState<EvaluatedBadge[]>(evaluation.badges);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<EvaluatedBadge | null>(null);

  // Update evaluated badges when evaluation changes
  useEffect(() => {
    setEvaluatedBadges(evaluation.badges);
  }, [evaluation]);

  // GitHub-style achievements (static engine  no API needed)
  const ghEvaluation = evaluateGitHubAchievements();
  const [evaluatedGhBadges] = useState<EvaluatedGitHubBadge[]>(ghEvaluation.badges);
  const [selectedGhBadgeDetail, setSelectedGhBadgeDetail] = useState<EvaluatedGitHubBadge | null>(null);
  const [achievementSubTab, setAchievementSubTab] = useState<'all' | 'skillbarter' | 'github'>('all');

  /*  Notifications state  */
  const [isSbNotifsOpen, setIsSbNotifsOpen] = useState(false);
  const [sbNotifs, setSbNotifs] = useState([
    { id: 'sb-notif-1', title: ' Barter Request Accepted', desc: "Rahul Sharma accepted your session on 'PostgreSQL Query Optimization'.", time: '15m ago', read: false, tab: 'sessions' as ActiveTab },
    { id: 'sb-notif-2', title: ' New Exchange Message', desc: "Meera K sent a message in UI Design & Figma barter chat.", time: '45m ago', read: false, tab: 'sessions' as ActiveTab },
    { id: 'sb-notif-3', title: '  Achievement Unlocked', desc: "You automatically earned the 'Trusted Guide' badge!", time: '2h ago', read: false, tab: 'achievements' as ActiveTab },
    { id: 'sb-notif-4', title: '⚡ +15 Credits Awarded', desc: "Session completed with Sanjay V. 15 points added to Domain 4.", time: '6h ago', read: true, tab: 'sessions' as ActiveTab },
  ]);

  /*  Tab-based data loading  */
  useEffect(() => {
    fetchRequests();
    fetchSessions();
    fetchDiscoverPeers();
  }, []);

  useEffect(() => {
    if (activeTab === 'achievements') {
      fetchAchievements();
    }
  }, [activeTab]);

  const handleToggleAutoDelete = (sessionId: string) => {
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, autoDeleteOnEnd: !s.autoDeleteOnEnd } : s));
  };

  const unreadSbNotifsCount = sbNotifs.filter((n) => !n.read).length;
  const unlockedCount = evaluation.unlockedCount;
  const totalBadgesCount = evaluation.totalCount;
  const highestBadge = evaluation.highestBadge;
  const earnedReputationMark = highestBadge ? highestBadge.icon : '';

  /* ====================================================================== */

  return (
    <div className="min-h-screen bg-[#080910] text-white font-sans">

      {/*  STICKY APP BAR  */}
      <div className="sticky top-0 z-30 bg-[#080910]/96 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="px-4 sm:px-6">

          {/* Top row */}
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">Skillora</span>
                <span className="hidden sm:inline text-[10px] font-mono text-violet-400/70 uppercase tracking-widest border-l border-white/10 pl-2">Peer Exchange</span>
              </div>
            </div>

            {/* Stat pills */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {sessions.filter(s => s.status === 'ACTIVE').length} active
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-slate-400">
                <Award className="w-2.5 h-2.5 text-amber-400" />
                {unlockedCount + ghEvaluation.unlockedCount}/{totalBadgesCount + ghEvaluation.totalCount} badges
              </div>
              <div className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-300 flex items-center gap-1.5">
                <span>{earnedReputationMark}</span>
                <span>{highestBadge ? `${highestBadge.name} Mentor` : 'Verified Builder'}</span>
              </div>
            </div>

            {/* CTA & SkillBarter Notifications */}
            <div className="flex items-center gap-2 relative">
              {/* SkillBarter Notification Button */}
              <div className="relative">
                <button
                  onClick={() => setIsSbNotifsOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="SkillBarter Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  {unreadSbNotifsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold font-mono">
                      {unreadSbNotifsCount}
                    </span>
                  )}
                </button>

                {/* SkillBarter Notifications Dropdown */}
                {isSbNotifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e0f1e] border border-white/[0.1] shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-violet-400" />
                        <h4 className="text-xs font-bold text-white">SkillBarter Notifications</h4>
                      </div>
                      <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">
                        {unreadSbNotifsCount} New
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {sbNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setSbNotifs((prev) =>
                              prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                            );
                            handleTabChange(notif.tab);
                            setIsSbNotifsOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                            notif.read
                              ? 'bg-white/[0.02] border-white/[0.04] opacity-70 hover:opacity-100'
                              : 'bg-violet-600/10 border-violet-500/30 hover:bg-violet-600/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{notif.title}</span>
                            <span className="text-[9px] font-mono text-slate-500">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">{notif.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSbNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
                        }}
                        className="text-[10px] font-mono text-violet-400 hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                      <button
                        onClick={() => setIsSbNotifsOpen(false)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isParticipant && (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors shadow-lg shadow-violet-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Request</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            {TABS.map(({ id, label, icon: TabIcon }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => handleTabChange(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    active ? 'border-violet-500 text-white font-bold' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}>
                  <TabIcon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : 'text-slate-500'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/*  ALERTS / FLASH  */}
      {msg && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{msg}</span>
            </div>
            <button onClick={() => setMsg('')} className="text-violet-400 hover:text-white cursor-pointer"><XCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/*  TAB CONTENT  */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* ============================================================ */}
        {/* TAB 1  PEER REQUESTS                                        */}
        {/* ============================================================ */}
        {activeTab === 'requests' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Peer Session Requests</h2>
                <p className="text-xs text-slate-600 mt-0.5">{postSessionRequests.length} open requests from the community</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-slate-500 cursor-default">
                <Filter className="w-3 h-3" /><span>All Domains</span>
              </div>
            </div>

            {postSessionRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No learning requests yet</p>
                  <p className="text-xs text-slate-600 mt-1">Be the first to ask the community for peer mentorship.</p>
                </div>
                <button onClick={() => setShowPostModal(true)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer transition-colors">
                  Create Request
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {postSessionRequests.map((req) => {
                const reqTopic = req.topic || req.skill || 'Skill Discussion';
                const reqName = req.name || req.requester?.name || 'Student';
                const reqDomain = req.domain || 'Web Development';
                const reqYear = req.year || (req.requester?.year_of_study ? `${req.requester.year_of_study}th Year` : 'Student');
                return (
                  <button key={req.id} onClick={() => setSelectedRequest(req)}
                    className="text-left p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/20 transition-all group cursor-pointer flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${DOMAIN_CHIP[reqDomain] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {reqDomain}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">{reqYear}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-violet-300 transition-colors leading-snug">{reqTopic}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{req.message}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          {reqName.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-400">{reqName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-violet-400 font-semibold">
                        <span>Offer Help</span><ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* TAB 2 — MY SESSIONS & CHAT                                   */}
        {/* ============================================================ */}
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: '520px' }}>

            {/* Conversation list */}
            <div className="lg:col-span-4 flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Conversations</span>
                <span className="text-[10px] font-mono text-slate-700">{sessions.length} chats</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                {sessions.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <MessageSquare className="w-6 h-6 mx-auto text-slate-600 opacity-40" />
                    <p>No active sessions yet.</p>
                    <p className="text-[10px] text-slate-600">Connect with a peer in Peer Requests or Discover Peers to start chatting.</p>
                  </div>
                )}
                {sessions.map((sess) => {
                  const selected = sess.id === activeSession?.id;
                  const done = sess.status === 'COMPLETED';
                  const sessName = sess.name || sess.partner?.name || 'Peer';
                  const sessAvatar = sess.avatar || '🧑‍💻';
                  const sessTime = sess.timestamp || (sess.lastMessageAt ? new Date(sess.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
                  return (
                    <button key={sess.id} onClick={() => setActiveSessionId(sess.id)}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all cursor-pointer ${selected ? 'bg-violet-500/8 border-r-2 border-violet-500' : 'hover:bg-white/[0.03]'} ${done ? 'opacity-40' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl ${selected ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20' : 'bg-white/[0.06]'}`}>
                        {sessAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-slate-100 truncate">{sessName}</span>
                          <span className="text-[10px] font-mono text-slate-600 shrink-0 ml-1">{sessTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mb-1.5">{sess.lastMessage}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${sess.type === 'TEACHING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15'}`}>
                            {sess.type}
                          </span>
                          <span className="text-[9px] font-mono text-slate-600 truncate">{sess.skill}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat pane */}
            {activeSession ? (
              <div className="lg:col-span-8 flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between shrink-0 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-base shadow-md shadow-violet-500/20">
                      {activeSession.avatar || '🧑‍💻'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{activeSession.name || activeSession.partner?.name || 'Peer'}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${activeSession.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                          {activeSession.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600">{activeSession.skill}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeSession.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCompleteSession(activeSession.id)}
                        disabled={completingSession}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{completingSession ? 'Completing...' : 'Mark Complete'}</span>
                      </button>
                    )}
                    <button onClick={() => handleToggleAutoDelete(activeSession.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors border cursor-pointer ${
                        activeSession.autoDeleteOnEnd
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-600 hover:text-slate-400'
                      }`}>
                      <ShieldAlert className="w-3 h-3" />
                      <span>Auto-delete: {activeSession.autoDeleteOnEnd ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  {chatLoading && (
                    <div className="text-center py-4 text-xs font-mono text-slate-500">Loading conversation...</div>
                  )}
                  {(chatMessages.length > 0 ? chatMessages : (activeSession.messages || [])).map((m: any, idx: number) => {
                    const isMe = m.sender === 'me' || (m.sender_id && user?.id && m.sender_id === user.id) || m.sender?.id === user?.id;
                    const timeStr = m.time || (m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
                    return (
                      <div key={m.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-violet-600 text-white rounded-tr-none shadow-md shadow-violet-500/15'
                            : 'bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 mt-1 px-1">{timeStr}</span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.05] flex items-center gap-2 bg-white/[0.01]">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Message ${activeSession.name || activeSession.partner?.name || 'Peer'}...`}
                    disabled={sendingMsg}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/30 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-md shadow-violet-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-600 opacity-40" />
                <p className="text-sm font-semibold text-slate-300">Select a conversation</p>
                <p className="text-xs text-slate-500">Pick a session from the left to view messages and exchange knowledge.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3 — DISCOVER PEERS                                       */}
        {/* ============================================================ */}
        {activeTab === 'discover' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or branch…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/30 text-xs text-white placeholder-slate-700 focus:outline-none transition-all" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', 'PYTHON', 'REACT', 'FIGMA', 'AI'].map((f) => (
                  <button key={f} onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      selectedFilter === f
                        ? 'bg-violet-600 text-white border border-violet-500 shadow-md shadow-violet-500/15'
                        : 'bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:text-slate-200'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredPeers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                <Search className="w-8 h-8 text-slate-700" />
                <p className="text-sm font-semibold text-slate-500">No peers found</p>
                <p className="text-xs text-slate-700">Try a different skill or clear the filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredPeers.map((peer) => (
                  <div key={peer.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all flex flex-col overflow-hidden">
                    {/* Card header */}
                    <div className="px-5 pt-5 pb-4 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-700/70 to-indigo-700/70 flex items-center justify-center text-xl shrink-0">
                        {peer.avatar || '🧑‍💻'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-100 truncate">{peer.name}</span>
                          <span>{peer.reputationMark || (peer.rating >= 4.8 ? '👑' : '🌟')}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono">{peer.year} · {peer.branch}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-mono font-bold text-amber-300">{peer.rating}</span>
                          <span className="text-[10px] text-slate-600">· {peer.studentsHelped} helped</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 space-y-3 pb-4 flex-1">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest block mb-1.5">Can Teach</span>
                        <div className="flex flex-wrap gap-1">
                          {(peer.canTeach && peer.canTeach.length > 0 ? peer.canTeach : ['General Programming']).map((s: string) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/8 border border-emerald-500/15 text-[10px] font-mono text-emerald-300">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest block mb-1.5">Wants to Learn</span>
                        <div className="flex flex-wrap gap-1">
                          {(peer.wantsToLearn && peer.wantsToLearn.length > 0 ? peer.wantsToLearn : ['Advanced Topics']).map((s: string) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-500/8 border border-cyan-500/15 text-[10px] font-mono text-cyan-300">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4 — ACHIEVEMENTS (SkillBarter + GitHub-Style Badges)     */}
        {/* ============================================================ */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* Section header card */}
            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-r from-violet-950/40 via-indigo-950/25 to-[#0a0b16] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Automatic Activity & GitHub Engine</p>
                </div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Achievement Badge System</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300">
                    {totalBadgesCount + ghEvaluation.totalCount} Total Badges
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Badges unlock automatically as you teach sessions, merge PRs, maintain streaks, and mentor peers.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-white/[0.03] border border-white/[0.06] p-3 rounded-2xl">
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-emerald-400 font-mono">
                    {unlockedCount + ghEvaluation.unlockedCount}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Earned</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-slate-500 font-mono">
                    {(totalBadgesCount + ghEvaluation.totalCount) - (unlockedCount + ghEvaluation.unlockedCount)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Locked</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-amber-400 font-mono">
                    {Math.round(((unlockedCount + ghEvaluation.unlockedCount) / (totalBadgesCount + ghEvaluation.totalCount)) * 100)}%
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Progress</p>
                </div>
              </div>
            </div>

            {/* Segmented Filter Bar for Achievement Categories */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setAchievementSubTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    achievementSubTab === 'all'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Badges ({totalBadgesCount + ghEvaluation.totalCount})</span>
                </button>

                <button
                  onClick={() => setAchievementSubTab('skillbarter')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    achievementSubTab === 'skillbarter'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span> SkillBarter Milestones ({totalBadgesCount})</span>
                </button>

                <button
                  onClick={() => setAchievementSubTab('github')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    achievementSubTab === 'github'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub-Style Developer Badges ({ghEvaluation.totalCount})</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 px-3">
                <span>Bronze: {ghEvaluation.tierCounts.Bronze}</span>
                <span>·</span>
                <span>Silver: {ghEvaluation.tierCounts.Silver}</span>
                <span>·</span>
                <span>Gold: {ghEvaluation.tierCounts.Gold}</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 1. GITHUB-STYLE DEVELOPER ACHIEVEMENTS SECTION            */}
            {/* ======================================================== */}
            {(achievementSubTab === 'all' || achievementSubTab === 'github') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      GitHub-Style Developer Badges & Tier Levels
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Tier Levels: x1, x2, x3, x4
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#090b17]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                    {evaluatedGhBadges.map((badge) => {
                      const isUnlocked = badge.isUnlocked;
                      const level = badge.currentLevel;

                      return (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedGhBadgeDetail(badge)}
                          title={`${badge.name}  ${badge.category} (Tap to inspect)`}
                          className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                            isUnlocked
                              ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-cyan-400 shadow-lg'
                              : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                          }`}
                          style={isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.accentColor}` } : undefined}
                        >
                          {/* Badge Icon Emblem Only */}
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 relative ${
                              isUnlocked
                                ? 'bg-gradient-to-br from-slate-900 to-slate-950 ring-1 ring-white/10'
                                : 'bg-white/[0.02] text-slate-600'
                            }`}
                            style={isUnlocked ? { borderColor: badge.accentColor } : undefined}
                          >
                            {isUnlocked ? (
                              <>
                                <span className="drop-shadow-lg select-none">{badge.icon}</span>
                                {/* Level multiplication indicator (e.g. x1, x2, x3, x4) */}
                                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[9px] font-mono font-bold text-white shadow-md">
                                  x{level}
                                </span>
                              </>
                            ) : (
                              <div className="relative flex items-center justify-center">
                                <span className="opacity-25 grayscale text-2xl select-none">{badge.icon}</span>
                                <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. 20-SLOT SKILLBARTER MILESTONE ACHIEVEMENTS SECTION    */}
            {/* ======================================================== */}
            {(achievementSubTab === 'all' || achievementSubTab === 'skillbarter') && (
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      SkillBarter Milestones & Reputation Marks (20 Slots)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                    20 Configured Badges
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#090b17]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                    {evaluatedBadges.map((badge) => {
                      return (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadgeDetail(badge)}
                          title={`#${badge.badgeNumber} ${badge.name}  ${badge.category} (Tap to inspect)`}
                          className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                            badge.isUnlocked
                              ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-violet-400 shadow-lg'
                              : badge.isNextAchievable
                              ? 'bg-amber-500/[0.05] border-amber-400/40 ring-1 ring-amber-400/20 shadow-md hover:border-amber-400'
                              : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                          }`}
                          style={badge.isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.glowColor}` } : undefined}
                        >
                          {/* Badge Icon Emblem Only */}
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 relative ${
                              badge.isUnlocked
                                ? `bg-gradient-to-br ${badge.color} ring-1 ring-white/15 shadow-md`
                                : badge.isNextAchievable
                                ? 'bg-white/[0.06] border border-amber-400/30 text-slate-300'
                                : 'bg-white/[0.02] text-slate-600'
                            }`}
                          >
                            {badge.isUnlocked ? (
                              <>
                                <span className="drop-shadow-lg select-none">{badge.icon}</span>
                                {/* Small Slot # pill */}
                                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[9px] font-mono font-bold text-white shadow-md">
                                  #{badge.badgeNumber}
                                </span>
                              </>
                            ) : (
                              <div className="relative flex items-center justify-center">
                                <span className="opacity-25 grayscale text-2xl select-none">{badge.icon}</span>
                                <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/*  GITHUB BADGE DETAIL INSPECTION MODAL  */}
            {selectedGhBadgeDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#0d0f22] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>GitHub-Style Achievement · {selectedGhBadgeDetail.category}</span>
                    </span>
                    <button onClick={() => setSelectedGhBadgeDetail(null)} className="text-slate-500 hover:text-white cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center gap-3 py-2">
                    <div
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative ${
                        selectedGhBadgeDetail.isUnlocked
                          ? 'bg-gradient-to-br from-slate-900 to-slate-950 ring-4 ring-cyan-400/20 border-2'
                          : 'bg-white/[0.05] border border-white/[0.08]'
                      }`}
                      style={selectedGhBadgeDetail.isUnlocked ? { borderColor: selectedGhBadgeDetail.accentColor } : undefined}
                    >
                      {selectedGhBadgeDetail.isUnlocked ? (
                        <>
                          <span className="drop-shadow-xl">{selectedGhBadgeDetail.icon}</span>
                          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-white/20 text-[10px] font-mono font-bold text-white shadow-lg">
                            x{selectedGhBadgeDetail.currentLevel}
                          </span>
                        </>
                      ) : (
                        <div className="relative">
                          <span className="opacity-30 grayscale">{selectedGhBadgeDetail.icon}</span>
                          <Lock className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                        <span>{selectedGhBadgeDetail.name}</span>
                        {selectedGhBadgeDetail.isUnlocked && selectedGhBadgeDetail.currentTier && (
                          <span className="text-xs px-2 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                            {selectedGhBadgeDetail.currentTier.tierName}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-cyan-200/90 font-mono mt-1">&ldquo;{selectedGhBadgeDetail.tagline}&rdquo;</p>
                      <p className="text-xs text-slate-400 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                        {selectedGhBadgeDetail.description}
                      </p>
                    </div>
                  </div>

                  {/* Tier Level Progression Ladder */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
                    <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      Badge Tier Ladder
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedGhBadgeDetail.tiers.map((t) => {
                        const isTierUnlocked = selectedGhBadgeDetail.currentValue >= t.reqValue;
                        return (
                          <div
                            key={t.level}
                            className={`p-2.5 rounded-xl text-center border space-y-1 ${
                              isTierUnlocked
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                                : 'bg-white/[0.02] border-white/[0.04] text-slate-600 opacity-60'
                            }`}
                          >
                            <span className="text-[10px] font-bold block">{t.tierName}</span>
                            <span className="text-[9px] font-mono block text-slate-400">
                              {t.reqValue} {selectedGhBadgeDetail.unit}
                            </span>
                            <span className="text-[9px] font-mono font-bold block text-cyan-300">
                              {isTierUnlocked ? '✓ x' + t.level : 'LOCKED'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Current Activity Score</span>
                        <span className="text-cyan-300 font-bold">
                          {selectedGhBadgeDetail.currentValue} {selectedGhBadgeDetail.unit}
                        </span>
                      </div>
                      {selectedGhBadgeDetail.isUnlocked && selectedGhBadgeDetail.unlockedAt && (
                        <p className="text-[10px] text-emerald-400 font-mono text-center pt-1">
                          ✓ {selectedGhBadgeDetail.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedGhBadgeDetail(null)}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/*  SKILLBARTER BADGE DETAIL INSPECTION MODAL  */}
            {selectedBadgeDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
                <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-[#0d0e1c] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Badge #{selectedBadgeDetail.badgeNumber} · {selectedBadgeDetail.category}
                    </span>
                    <button onClick={() => setSelectedBadgeDetail(null)} className="text-slate-500 hover:text-white cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center gap-3 py-2">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl ${
                        selectedBadgeDetail.isUnlocked
                          ? `bg-gradient-to-br ${selectedBadgeDetail.color} ring-4 ring-white/[0.1]`
                          : 'bg-white/[0.05] border border-white/[0.08]'
                      }`}
                      style={selectedBadgeDetail.isUnlocked ? { boxShadow: `0 0 45px -8px ${selectedBadgeDetail.glowColor}` } : undefined}
                    >
                      {selectedBadgeDetail.isUnlocked ? (
                        selectedBadgeDetail.icon
                      ) : (
                        <div className="relative">
                          <span className="opacity-30 grayscale">{selectedBadgeDetail.icon}</span>
                          <Lock className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-base font-bold text-white">{selectedBadgeDetail.name}</h3>
                        {selectedBadgeDetail.isUnlocked && <span>{selectedBadgeDetail.reputationMark}</span>}
                      </div>
                      <p className="text-xs text-amber-300 font-mono mt-1">&ldquo;{selectedBadgeDetail.requirement}&rdquo;</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Activity Progress</span>
                      <span className={selectedBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {selectedBadgeDetail.currentProgress} / {selectedBadgeDetail.requirementValue} {selectedBadgeDetail.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedBadgeDetail.isUnlocked
                            ? `bg-gradient-to-r ${selectedBadgeDetail.color}`
                            : 'bg-white/[0.25]'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round((selectedBadgeDetail.currentProgress / selectedBadgeDetail.requirementValue) * 100))}%`,
                        }}
                      />
                    </div>
                    {selectedBadgeDetail.isUnlocked && selectedBadgeDetail.unlockedAt && (
                      <p className="text-[10px] text-emerald-400 font-mono text-center pt-1">
                        ✓ {selectedBadgeDetail.unlockedAt}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedBadgeDetail(null)}
                      className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/*  PREMIUM ACHIEVEMENT UNLOCK CELEBRATION MODAL  */}
            {celebrationBadge && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-md rounded-3xl border border-amber-400/40 bg-[#0d0e1c] p-6 text-center shadow-2xl shadow-amber-500/15 relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>✨ ACHIEVEMENT UNLOCKED ✨</span>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  </div>

                  <div
                    className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${celebrationBadge.color} flex items-center justify-center text-5xl shadow-2xl ring-4 ring-amber-400/30 animate-bounce`}
                  >
                    {celebrationBadge.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">{celebrationBadge.name.toUpperCase()}</h3>
                    <p className="text-xs text-amber-300/90 font-mono font-semibold mt-1">
                      &ldquo;{celebrationBadge.requirement}&rdquo;
                    </p>
                    <p className="text-xs text-slate-400 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                      You completed your SkillBarter activity and automatically earned this achievement!
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setSelectedBadgeDetail(celebrationBadge);
                        setCelebrationBadge(null);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      VIEW BADGE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* â”€â”€ REQUEST DETAIL MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#0d0e1a] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white">Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-700 hover:text-slate-300 cursor-pointer"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-md">
                  {(selectedRequest.name || selectedRequest.requester?.name || 'S').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedRequest.name || selectedRequest.requester?.name || 'Student'}</p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    {selectedRequest.year || (selectedRequest.requester?.year_of_study ? `${selectedRequest.requester.year_of_study}th Year` : 'Student')} Â· {selectedRequest.branch || selectedRequest.requester?.department || 'Engineering'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold ${DOMAIN_CHIP[selectedRequest.domain] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {selectedRequest.domain || 'Peer Mentorship'}
              </span>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <p className="text-[10px] font-mono text-slate-600 uppercase">Topic</p>
                <p className="text-sm font-semibold text-white">{selectedRequest.topic || selectedRequest.skill}</p>
                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-white/[0.05]">{selectedRequest.message}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => handleOfferMentoring(selectedRequest.id)}
                disabled={offerLoadingId === selectedRequest.id}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{offerLoadingId === selectedRequest.id ? 'Sending Offer...' : 'Offer Mentoring Assistance'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  NEW REQUEST MODAL  */}
      {showPostModal && isParticipant && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#0d0e1a] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white">Post Session Request</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-700 hover:text-slate-300 cursor-pointer"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePostRequest} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Your Name', val: name, set: setName, ph: 'Your Name', type: 'text' },
                ].map(({ label, val, set, ph, type }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-600 uppercase">{label}</label>
                    <input type={type} required value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-violet-500/40" />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-600 uppercase">Year</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white focus:outline-none focus:border-violet-500/40">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-600 uppercase">Branch</label>
                  <input type="text" required value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. CSE / ISE"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-violet-500/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-600 uppercase">Domain</label>
                  <select value={domain} onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white focus:outline-none focus:border-violet-500/40">
                    {['Web Development', 'Artificial Intelligence & ML', 'Cloud DevOps', 'Database Systems'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-600 uppercase">Topic</label>
                <input type="text" required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. React Hooks & State Management"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-violet-500/40" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-600 uppercase">Message</label>
                <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe what help or session you need..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-violet-500/40 resize-none" />
              </div>
              {err && <p className="text-xs text-rose-400">{err}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors cursor-pointer">
                Publish Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
