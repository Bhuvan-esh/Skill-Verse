'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, XCircle, User, BookOpen, Layers,
  GraduationCap, CheckCircle2, ShieldAlert, MessageSquare,
  Search, Award, Star, Send, ShieldCheck,
  ArrowRight, Code2, Cpu, ChevronRight, Filter,
  Zap, Lock, Users, Sparkles, Trophy, Check, Flame, Bell,
} from 'lucide-react';
import {
  SKILLBARTER_BADGE_DEFINITIONS,
  evaluateStudentAchievements,
  EvaluatedBadge,
  StudentActivityMetrics,
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

const INITIAL_SESSIONS: BarterSession[] = [
  {
    id: 'sess-1', name: 'Rahul Sharma', avatar: '👨‍💻',
    lastMessage: "Let's continue with Pandas indexing and dataframes tomorrow.",
    timestamp: '10:42 AM', skill: 'PYTHON', type: 'TEACHING', status: 'ACTIVE', autoDeleteOnEnd: false,
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey! Thanks for accepting my barter request.', time: '10:30 AM' },
      { id: 'm2', sender: 'me', text: 'Glad to help! Do you want to start with NumPy or jump straight to Pandas?', time: '10:35 AM' },
      { id: 'm3', sender: 'them', text: "Let's continue with Pandas indexing and dataframes tomorrow.", time: '10:42 AM' },
    ],
  },
  {
    id: 'sess-2', name: 'Meera K', avatar: '👩‍🎨',
    lastMessage: 'I reviewed the Figma design tokens you shared! Looks great.',
    timestamp: 'Yesterday', skill: 'UI DESIGN', type: 'LEARNING', status: 'ACTIVE', autoDeleteOnEnd: false,
    messages: [
      { id: 'm1', sender: 'me', text: 'Can you check my color hierarchy in Figma?', time: 'Yesterday' },
      { id: 'm2', sender: 'them', text: 'I reviewed the Figma design tokens you shared! Looks great.', time: 'Yesterday' },
    ],
  },
  {
    id: 'sess-3', name: 'Sanjay V', avatar: '👨‍🔧',
    lastMessage: 'Session completed! Thanks for explaining Docker Compose networks.',
    timestamp: 'Aug 22', skill: 'DOCKER & DEVOPS', type: 'TEACHING', status: 'COMPLETED', autoDeleteOnEnd: true,
    messages: [
      { id: 'm1', sender: 'them', text: 'How do I bridge the Postgres container with the Node backend?', time: 'Aug 22' },
      { id: 'm2', sender: 'me', text: 'You place both under the same docker-compose custom network bridge.', time: 'Aug 22' },
      { id: 'm3', sender: 'them', text: 'Session completed! Thanks for explaining Docker Compose networks.', time: 'Aug 22' },
    ],
  },
];

interface DiscoverPeer {
  id: string; name: string; year: string; branch: string; avatar: string;
  rating: number; studentsHelped: number; canTeach: string[]; wantsToLearn: string[]; reputationMark: string;
}

const DISCOVER_PEERS: DiscoverPeer[] = [
  { id: 'p-1', name: 'Rohan Gupta', year: '3rd Year', branch: 'CSE', avatar: '👨‍💻', rating: 4.9, studentsHelped: 11, canTeach: ['React', 'Next.js', 'Tailwind CSS'], wantsToLearn: ['Rust', 'Smart Contracts'], reputationMark: '⚡' },
  { id: 'p-2', name: 'Divya Nair', year: '4th Year', branch: 'AI & DS', avatar: '👩‍🔬', rating: 5.0, studentsHelped: 16, canTeach: ['PyTorch', 'Computer Vision', 'Python'], wantsToLearn: ['System Design', 'Kubernetes'], reputationMark: '💎' },
  { id: 'p-3', name: 'Aditya Verma', year: '2nd Year', branch: 'ISE', avatar: '👨‍🎓', rating: 4.7, studentsHelped: 6, canTeach: ['Data Structures', 'C++', 'Algorithms'], wantsToLearn: ['Fullstack MERN', 'TypeScript'], reputationMark: '🛡️' },
  { id: 'p-4', name: 'Kavya Pillai', year: '3rd Year', branch: 'ECE', avatar: '👩‍🎨', rating: 4.9, studentsHelped: 8, canTeach: ['Figma', 'UI/UX Wireframing', 'Design Systems'], wantsToLearn: ['Flutter', 'Mobile Dev'], reputationMark: '🌟' },
];

type ActiveTab = 'requests' | 'sessions' | 'discover' | 'achievements';

const TABS: { id: ActiveTab; label: string; emoji: string }[] = [
  { id: 'requests', label: 'Peer Requests', emoji: '📌' },
  { id: 'sessions', label: 'My Sessions', emoji: '💬' },
  { id: 'discover', label: 'Discover', emoji: '🔍' },
  { id: 'achievements', label: 'Achievements', emoji: '🏆' },
];

const DOMAIN_CHIP: Record<string, string> = {
  'Database Systems & Backend': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'Python & Web Frameworks': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'DevOps & Containerization': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  'Web Development': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  'Artificial Intelligence & ML': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'Cloud DevOps': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'Database Systems': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
};

export default function StudentSkillBarterView({ user, onRefresh, initialTab }: SkilloraProps) {
  const isParticipant = !user?.role || user?.role?.toUpperCase() === 'STUDENT' || user?.role?.toUpperCase() === 'PARTICIPANT';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'requests');
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: ActiveTab) => {
    setIsLoadingTab(true);
    setActiveTab(tab);
    setTimeout(() => setIsLoadingTab(false), 160);
  };

  /* ── Requests state ─────────────────────────────────────────────────────── */
  const [postSessionRequests, setPostSessionRequests] = useState([
    { id: 'req-1', name: 'Rahul Sharma', branch: 'Computer Science & Engineering (CSE)', year: '4th Year', domain: 'Database Systems & Backend', topic: 'PostgreSQL Query Optimization & Indexing Walkthrough', message: 'Need an interactive 1:1 session explaining indexing strategies and EXPLAIN ANALYZE on complex SQL joins.' },
    { id: 'req-2', name: 'Meera K', branch: 'Artificial Intelligence & Data Science', year: '3rd Year', domain: 'Python & Web Frameworks', topic: 'Django REST Framework & JWT Authentication Setup', message: 'Looking for a mentor to guide through setting up nested serializers and CORS handling in Django.' },
    { id: 'req-3', name: 'Sanjay V', branch: 'Information Science & Engineering (ISE)', year: '3rd Year', domain: 'DevOps & Containerization', topic: 'Docker Compose & Multi-Container App Deployment', message: 'Seeking hands-on assistance containerizing a React frontend and Node.js backend with PostgreSQL.' },
  ]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [domain, setDomain] = useState('Web Development');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErr('');
    if (!isParticipant) { setErr('Only registered Participants can publish session requests.'); return; }
    if (!topic || !message) { setErr('Please fill in all required fields.'); return; }
    setPostSessionRequests([{ id: `req-${Date.now()}`, name: name || user?.name || 'Student Participant', branch, year, domain, topic, message }, ...postSessionRequests]);
    setMsg('Request published successfully!'); setTopic(''); setMessage(''); setShowPostModal(false); onRefresh();
  };

  /* ── Sessions & chat state ──────────────────────────────────────────────── */
  const [sessions, setSessions] = useState<BarterSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(INITIAL_SESSIONS[0].id);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeSession.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { id: `msg-${Date.now()}`, sender: 'me' as const, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setSessions((prev) => prev.map((s) => s.id === activeSession.id ? { ...s, lastMessage: chatInput.trim(), timestamp: 'Just now', messages: [...s.messages, newMsg] } : s));
    setChatInput('');
  };

  const handleToggleAutoDelete = (sessionId: string) => {
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, autoDeleteOnEnd: !s.autoDeleteOnEnd } : s));
  };

  /* ── Discover state ─────────────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const filteredPeers = DISCOVER_PEERS.filter((p) => {
    const q = searchQuery.toLowerCase();
    const match = p.name.toLowerCase().includes(q) || p.canTeach.some((t) => t.toLowerCase().includes(q)) || p.wantsToLearn.some((w) => w.toLowerCase().includes(q)) || p.branch.toLowerCase().includes(q);
    return selectedFilter === 'ALL' ? match : match && p.canTeach.some((t) => t.toUpperCase().includes(selectedFilter));
  });

  /* ── Achievements state (Real Backend Evaluation Engine - 20 Slots) ── */
  const [metrics] = useState<StudentActivityMetrics>({
    totalSessionsCompleted: 8,
    studentsHelped: 6,
    teachingSessionsCompleted: 6,
    distinctSkillsTaught: 4,
    currentRating: 4.9,
    consecutiveTeachingWeeks: 4,
  });

  const evaluation = evaluateStudentAchievements(metrics, {
    'sb-badge-1': 'Earned 12 Aug 2026',
    'sb-badge-2': 'Earned 15 Aug 2026',
    'sb-badge-3': 'Earned 18 Aug 2026',
    'sb-badge-4': 'Earned 20 Aug 2026',
    'sb-badge-5': 'Earned 22 Aug 2026',
    'sb-badge-6': 'Earned 24 Aug 2026',
    'sb-badge-8': 'Earned 24 Aug 2026',
    'sb-badge-9': 'Earned 25 Aug 2026',
  });

  const [evaluatedBadges] = useState<EvaluatedBadge[]>(evaluation.badges);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<EvaluatedBadge | null>(null);
  const [isSbNotifsOpen, setIsSbNotifsOpen] = useState(false);
  const [sbNotifs, setSbNotifs] = useState([
    {
      id: 'sb-notif-1',
      title: '🤝 Barter Request Accepted',
      desc: "Rahul Sharma accepted your session on 'PostgreSQL Query Optimization'.",
      time: '15m ago',
      read: false,
      tab: 'sessions' as ActiveTab,
    },
    {
      id: 'sb-notif-2',
      title: '💬 New Exchange Message',
      desc: "Meera K sent a message in UI Design & Figma barter chat.",
      time: '45m ago',
      read: false,
      tab: 'sessions' as ActiveTab,
    },
    {
      id: 'sb-notif-3',
      title: '🏆 Achievement Unlocked',
      desc: "You automatically earned the 'Trusted Guide' badge!",
      time: '2h ago',
      read: false,
      tab: 'achievements' as ActiveTab,
    },
    {
      id: 'sb-notif-4',
      title: '⚡ +15 Credits Awarded',
      desc: "Session completed with Sanjay V. 15 points added to Domain 4.",
      time: '6h ago',
      read: true,
      tab: 'sessions' as ActiveTab,
    },
  ]);

  const unreadSbNotifsCount = sbNotifs.filter((n) => !n.read).length;
  const unlockedCount = evaluation.unlockedCount;
  const totalBadgesCount = evaluation.totalCount;
  const highestBadge = evaluation.highestBadge;
  const earnedReputationMark = highestBadge ? highestBadge.icon : '🧑‍🏫';

  /* ====================================================================== */
  return (
    <div className="min-h-screen bg-[#080910] text-white font-sans">

      {/* ── STICKY APP BAR ──────────────────────────────────────────────── */}
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
                {unlockedCount}/{totalBadgesCount} badges
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
            {TABS.map(({ id, label, emoji }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => handleTabChange(id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    active ? 'border-violet-500 text-white' : 'border-transparent text-slate-600 hover:text-slate-300 hover:border-slate-700'
                  }`}>
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ALERTS ──────────────────────────────────────────────────────── */}
      {(msg || err) && (
        <div className="px-4 sm:px-6 pt-4 space-y-2">
          {msg && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{msg}</span>
              <button onClick={() => setMsg('')} className="ml-auto cursor-pointer"><XCircle className="w-4 h-4 text-emerald-500/50 hover:text-emerald-300" /></button>
            </div>
          )}
          {err && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/8 border border-rose-500/15 text-rose-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" /><span>{err}</span>
              <button onClick={() => setErr('')} className="ml-auto cursor-pointer"><XCircle className="w-4 h-4 text-rose-500/50 hover:text-rose-300" /></button>
            </div>
          )}
        </div>
      )}

      {/* ── SKELETON ────────────────────────────────────────────────────── */}
      {isLoadingTab && (
        <div className="px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.05] p-5 space-y-3">
                <div className="h-3 w-1/3 bg-white/[0.07] rounded-md" />
                <div className="h-5 w-3/4 bg-white/[0.07] rounded-md" />
                <div className="h-14 w-full bg-white/[0.04] rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ────────────────────────────────────────────────── */}
      {!isLoadingTab && (
        <div className="px-4 sm:px-6 py-6">

          {/* ============================================================ */}
          {/* TAB 1 — PEER REQUESTS                                        */}
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
                {postSessionRequests.map((req) => (
                  <button key={req.id} onClick={() => setSelectedRequest(req)}
                    className="text-left p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/20 transition-all group cursor-pointer flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${DOMAIN_CHIP[req.domain] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {req.domain}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">{req.year}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-violet-300 transition-colors leading-snug">{req.topic}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{req.message}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          {req.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-400">{req.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-violet-400 font-semibold">
                        <span>Offer Help</span><ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  {sessions.map((sess) => {
                    const selected = sess.id === activeSession.id;
                    const done = sess.status === 'COMPLETED';
                    return (
                      <button key={sess.id} onClick={() => setActiveSessionId(sess.id)}
                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all cursor-pointer ${selected ? 'bg-violet-500/8 border-r-2 border-violet-500' : 'hover:bg-white/[0.03]'} ${done ? 'opacity-40' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl ${selected ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20' : 'bg-white/[0.06]'}`}>
                          {sess.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold text-slate-100 truncate">{sess.name}</span>
                            <span className="text-[10px] font-mono text-slate-600 shrink-0 ml-1">{sess.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mb-1.5">{sess.lastMessage}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${sess.type === 'TEACHING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15'}`}>
                              {sess.type}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600">{sess.skill}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat pane */}
              <div className="lg:col-span-8 flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between shrink-0 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-base shadow-md shadow-violet-500/20">
                      {activeSession.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{activeSession.name}</span>
                        {activeSession.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <span className={`text-[10px] font-mono uppercase ${activeSession.type === 'TEACHING' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                        {activeSession.type} · {activeSession.skill}
                      </span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[10px] text-slate-600 font-mono hidden sm:block">Auto-delete on end</span>
                    <div
                      onClick={() => handleToggleAutoDelete(activeSession.id)}
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${activeSession.autoDeleteOnEnd ? 'bg-violet-600' : 'bg-white/[0.08]'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${activeSession.autoDeleteOnEnd ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                  </label>
                </div>

                {/* Session banner */}
                <div className="mx-4 mt-4 px-4 py-2.5 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/15 flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-[11px] text-indigo-300/80">&ldquo;How you conduct the session is up to both of you.&rdquo;</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {activeSession.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        m.sender === 'me'
                          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm'
                          : 'bg-white/[0.06] border border-white/[0.07] text-slate-200 rounded-bl-sm'
                      }`}>
                        <p>{m.text}</p>
                        <span className={`block text-[9px] mt-1.5 ${m.sender === 'me' ? 'text-violet-200/70 text-right' : 'text-slate-600'}`}>{m.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="px-4 py-3.5 border-t border-white/[0.05] flex items-center gap-2.5 shrink-0">
                  <input
                    type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Message ${activeSession.name.split(' ')[0]}…`}
                    className="flex-1 bg-white/[0.04] border border-white/[0.07] focus:border-violet-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none transition-all"
                  />
                  <button type="submit" disabled={!chatInput.trim()}
                    className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
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
                          {peer.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-100 truncate">{peer.name}</span>
                            <span>{peer.reputationMark}</span>
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
                            {peer.canTeach.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/8 border border-emerald-500/15 text-[10px] font-mono text-emerald-300">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest block mb-1.5">Wants to Learn</span>
                          <div className="flex flex-wrap gap-1">
                            {peer.wantsToLearn.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-500/8 border border-cyan-500/15 text-[10px] font-mono text-cyan-300">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-5 pb-5">
                        <button onClick={() => setMsg(`Barter request sent to ${peer.name}!`)}
                          className="w-full py-2 rounded-xl bg-violet-600/15 hover:bg-violet-600 border border-violet-500/20 hover:border-violet-500 text-violet-300 hover:text-white text-xs font-bold transition-all cursor-pointer">
                          🤝 Connect & Barter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4 — ACHIEVEMENTS (20 Automatic SkillBarter Slots)       */}
          {/* ============================================================ */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Section header card */}
              <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-r from-violet-950/40 via-indigo-950/25 to-[#0a0b16] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Automatic Activity Engine</p>
                  </div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>SkillBarter Achievements</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300">
                      20 Slots
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Badges unlock automatically as you teach sessions, exchange skills, and mentor students.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-white/[0.03] border border-white/[0.06] p-3 rounded-2xl">
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-emerald-400 font-mono">{unlockedCount}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Earned</p>
                  </div>
                  <div className="w-px h-8 bg-white/[0.08]" />
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-slate-500 font-mono">{totalBadgesCount - unlockedCount}</p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Locked</p>
                  </div>
                  <div className="w-px h-8 bg-white/[0.08]" />
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-amber-400 font-mono">
                      {Math.round((unlockedCount / totalBadgesCount) * 100)}%
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Progress</p>
                  </div>
                </div>
              </div>

              {/* 20-Badge Responsive Grid (Desktop: 4-5/row, Tablet: 3/row, Mobile: 2/row) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {evaluatedBadges.map((badge) => {
                  const pct = Math.min(100, Math.round((badge.currentProgress / badge.requirementValue) * 100));

                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedBadgeDetail(badge)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                        badge.isUnlocked
                          ? 'border-white/[0.09] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05] shadow-lg'
                          : badge.isNextAchievable
                          ? 'border-amber-400/40 bg-amber-500/[0.03] ring-1 ring-amber-400/20 shadow-lg shadow-amber-500/5'
                          : 'border-white/[0.04] bg-white/[0.01] opacity-65 hover:opacity-85'
                      }`}
                      style={badge.isUnlocked ? { boxShadow: `0 0 30px -10px ${badge.glowColor}` } : undefined}
                    >
                      {badge.isUnlocked && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-[0.05] pointer-events-none`} />
                      )}

                      {/* Card Header: Slot Number & Status */}
                      <div className="flex items-start justify-between gap-1 relative">
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          #{badge.badgeNumber}
                        </span>

                        {badge.isUnlocked ? (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>EARNED</span>
                          </span>
                        ) : badge.isNextAchievable ? (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>NEXT UP</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-slate-500 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>

                      {/* Badge Icon & Artwork */}
                      <div className="flex flex-col items-center justify-center text-center py-2 relative">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-105 ${
                            badge.isUnlocked
                              ? `bg-gradient-to-br ${badge.color} shadow-lg ring-2 ring-white/[0.1]`
                              : badge.isNextAchievable
                              ? 'bg-white/[0.06] border border-amber-400/30 text-slate-300'
                              : 'bg-white/[0.04] border border-white/[0.06] text-slate-600'
                          }`}
                        >
                          {badge.isUnlocked ? (
                            badge.icon
                          ) : (
                            <div className="relative">
                              <span className="opacity-30 grayscale">{badge.icon}</span>
                              <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                            </div>
                          )}
                        </div>

                        <div className="mt-2.5 space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-violet-300 transition-colors leading-snug">
                            {badge.name}
                          </h4>
                          <span className="text-[9px] text-slate-500 font-mono block">
                            {badge.category}
                          </span>
                        </div>
                      </div>

                      {/* Requirement & Real Progress */}
                      <div className="space-y-2 pt-2 border-t border-white/[0.05] relative">
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 min-h-[24px]">
                          &ldquo;{badge.requirement}&rdquo;
                        </p>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-slate-500">Progress</span>
                            <span className={badge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              {badge.currentProgress}/{badge.requirementValue} {badge.unit}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                badge.isUnlocked
                                  ? `bg-gradient-to-r ${badge.color}`
                                  : badge.isNextAchievable
                                  ? 'bg-amber-400'
                                  : 'bg-white/[0.2]'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {badge.isUnlocked && badge.unlockedAt && (
                          <span className="text-[9px] font-mono text-emerald-400/80 block text-right">
                            {badge.unlockedAt}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── BADGE DETAIL INSPECTION MODAL ───────────────────────── */}
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

              {/* ── PREMIUM ACHIEVEMENT UNLOCK CELEBRATION MODAL ─────────── */}
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
      )}

      {/* ── REQUEST DETAIL MODAL ────────────────────────────────────────── */}
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
                  {selectedRequest.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedRequest.name}</p>
                  <p className="text-[11px] text-slate-600 font-mono">{selectedRequest.year} · {selectedRequest.branch}</p>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold ${DOMAIN_CHIP[selectedRequest.domain] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {selectedRequest.domain}
              </span>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <p className="text-[10px] font-mono text-slate-600 uppercase">Topic</p>
                <p className="text-sm font-semibold text-white">{selectedRequest.topic}</p>
                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-white/[0.05]">{selectedRequest.message}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => { setMsg(`Offered mentoring assistance to ${selectedRequest.name} for "${selectedRequest.topic}"!`); setSelectedRequest(null); }}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <span>Offer Mentoring Assistance</span><ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW REQUEST MODAL ────────────────────────────────────────────── */}
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
                <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe what help or session you need…"
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
