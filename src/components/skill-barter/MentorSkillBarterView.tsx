'use client';

import React, { useState, useEffect } from 'react';
import {
  Award, Sparkles, Users, Video, Star, ThumbsUp, ThumbsDown,
  TrendingUp, BookOpen, Clock, ShieldCheck, Filter, Search,
  RefreshCw, Layers, CheckCircle2, AlertTriangle, MessageSquare,
  ArrowUpRight, Eye, ChevronRight, Trophy, Zap, Download,
  Repeat, ArrowRight, CheckCheck, HelpCircle, ShieldAlert, UserX
} from 'lucide-react';

interface ViewProps {
  user: any;
  onRefresh: () => void;
}

export default function MentorSkillBarterView({ user, onRefresh }: ViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'exchanges' | 'peervault' | 'leaderboard' | 'weak_performers' | 'feedback'>('overview');
  const [feedbackCategory, setFeedbackCategory] = useState<'all' | 'positive' | 'negative'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/skill-barter/mentor-analytics');
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.warn('Using local fallback for mentor analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fallback demo dataset if API is loading or empty
  const overview = analyticsData?.overview || {
    totalParticipantsExchangedSkills: 94,
    mentoringGivenCount: 76,
    mentoringGivenHours: '58.5 Hrs',
    classesLearntCount: 66,
    classesLearntHours: '38.0 Hrs',
    totalClassesConducted: 142,
    totalStudentsLearnt: 111,
    totalCreditsExchanged: 2573,
    averageEcosystemRating: 4.88,
    activePeerVaultVideos: 14,
    totalHoursMentored: '96.5 Hrs',
    satisfactionRate: '98.2%',
  };

  const exchangeActivity = analyticsData?.exchangeActivity || [
    {
      id: 'ex-1',
      mentor_name: 'Rahul Sharma',
      mentor_usn: '1RV23CS001',
      mentor_dept: 'CSE • 3rd Year',
      learner_name: 'Anusha A',
      learner_usn: '1MS23AI042',
      learner_dept: 'AIML • 3rd Year',
      taught_skill: 'PostgreSQL Index Tuning & EXPLAIN ANALYZE',
      received_skill: 'Next.js 14 Server Actions & Parallel Routing',
      duration: '45 mins',
      mode: 'Live 1:1 Lab Session',
      credits_transferred: 15,
      status: 'COMPLETED_&_VERIFIED',
      rating: 5.0,
      timestamp: 'Today at 03:30 PM',
    },
    {
      id: 'ex-2',
      mentor_name: 'Alex Johnson',
      mentor_usn: '1MS21CS001',
      mentor_dept: 'CSE • 4th Year',
      learner_name: 'Meera K',
      learner_usn: '1RV23AI018',
      learner_dept: 'AIML • 3rd Year',
      taught_skill: 'PyTorch Deep Learning CNN Architecture',
      received_skill: 'Figma UI/UX Design System Tokens',
      duration: '60 mins',
      mode: 'Peer Circle Mentoring',
      credits_transferred: 15,
      status: 'COMPLETED_&_VERIFIED',
      rating: 5.0,
      timestamp: 'Today at 11:15 AM',
    },
    {
      id: 'ex-3',
      mentor_name: 'Meera K',
      mentor_usn: '1RV23AI018',
      mentor_dept: 'AIML • 3rd Year',
      learner_name: 'Sanjay V',
      learner_usn: '1RV23IS089',
      learner_dept: 'ISE • 2nd Year',
      taught_skill: 'Next.js 14 App Router & Streaming SSR',
      received_skill: 'Docker Multi-Stage Builds & Minikube',
      duration: '50 mins',
      mode: 'Live Code Pairing',
      credits_transferred: 15,
      status: 'COMPLETED_&_VERIFIED',
      rating: 4.9,
      timestamp: 'Yesterday at 04:45 PM',
    },
    {
      id: 'ex-4',
      mentor_name: 'Priya S',
      mentor_usn: '1RV23AI055',
      mentor_dept: 'AIML • 2nd Year',
      learner_name: 'Kavya Sharma',
      learner_usn: '1MS23AI042',
      learner_dept: 'AIML • 3rd Year',
      taught_skill: 'Figma Design Tokens & Typography Scale',
      received_skill: 'Public Speaking & Debate Pacing',
      duration: '40 mins',
      mode: 'Design Review & Workshop',
      credits_transferred: 15,
      status: 'COMPLETED_&_VERIFIED',
      rating: 4.8,
      timestamp: 'Yesterday at 01:20 PM',
    },
    {
      id: 'ex-5',
      mentor_name: 'Sanjay V',
      mentor_usn: '1RV23IS089',
      mentor_dept: 'ISE • 2nd Year',
      learner_name: 'Rohan Deshmukh',
      learner_usn: '1RV23CS099',
      learner_dept: 'CSE • 2nd Year',
      taught_skill: 'Docker Container Networking & Security',
      received_skill: 'FastAPI Backend Endpoints & JWT Auth',
      duration: '45 mins',
      mode: 'Technical Pairing',
      credits_transferred: 15,
      status: 'COMPLETED_&_VERIFIED',
      rating: 4.7,
      timestamp: '2 days ago',
    },
  ];

  const peerVault = analyticsData?.peerVault || [
    {
      id: 'pv-1',
      title: 'PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified',
      topic: 'Database Systems & Query Tuning',
      student_author: 'Rahul Sharma',
      department: 'CSE (3rd Year)',
      views: 148,
      learners_count: 36,
      rating: 4.9,
      video_size: '14.2 MB',
      duration: '18:40',
      credits_awarded: 185,
      status: 'VERIFIED_MASTERCLASS',
      tags: ['PostgreSQL', 'SQL', 'Indexing'],
    },
    {
      id: 'pv-2',
      title: 'Next.js 14 App Router, Server Actions & Streaming SSR',
      topic: 'Modern Full-Stack React Architecture',
      student_author: 'Meera K',
      department: 'AIML (3rd Year)',
      views: 112,
      learners_count: 29,
      rating: 4.8,
      video_size: '18.6 MB',
      duration: '22:15',
      credits_awarded: 160,
      status: 'VERIFIED_MASTERCLASS',
      tags: ['Next.js', 'React', 'Server Actions'],
    },
    {
      id: 'pv-3',
      title: 'Docker Multi-Stage Builds & Kubernetes Pod Orchestration',
      topic: 'Containerization & Microservices DevOps',
      student_author: 'Sanjay V',
      department: 'AIDS (2nd Year)',
      views: 96,
      learners_count: 24,
      rating: 4.7,
      video_size: '12.8 MB',
      duration: '15:50',
      credits_awarded: 140,
      status: 'VERIFIED_MASTERCLASS',
      tags: ['Docker', 'Kubernetes', 'DevOps'],
    },
    {
      id: 'pv-4',
      title: 'PyTorch Deep Learning CNNs & Transfer Learning Blueprint',
      topic: 'Computer Vision & Convolutional Networks',
      student_author: 'Alex Johnson',
      department: 'CSE (4th Year)',
      views: 184,
      learners_count: 48,
      rating: 5.0,
      video_size: '21.4 MB',
      duration: '26:30',
      credits_awarded: 210,
      status: 'VERIFIED_MASTERCLASS',
      tags: ['PyTorch', 'Deep Learning', 'Computer Vision'],
    },
    {
      id: 'pv-5',
      title: 'Figma Design Systems, Micro-Interactions & Token Sync',
      topic: 'UI/UX Design Systems & High-Fidelity Prototyping',
      student_author: 'Priya S',
      department: 'AIML (2nd Year)',
      views: 82,
      learners_count: 21,
      rating: 4.8,
      video_size: '16.1 MB',
      duration: '19:10',
      credits_awarded: 135,
      status: 'VERIFIED_MASTERCLASS',
      tags: ['Figma', 'UI/UX', 'Design Tokens'],
    },
  ];

  const topPerformers = analyticsData?.topPerformers || [
    {
      rank: 1,
      name: 'Alex Johnson',
      usn: '1MS21CS001',
      department: 'Computer Science & Engineering',
      year: '4th Year',
      sessions_conducted: 32,
      mentoring_given: 18,
      classes_learnt: 14,
      students_mentored: 28,
      rating: 4.98,
      credits_earned: 480,
      skills: ['PyTorch', 'Data Structures', 'Distributed Systems'],
      badge: '👑 Master Educator',
      tier: 'Diamond',
    },
    {
      rank: 2,
      name: 'Rahul Sharma',
      usn: '1RV23CS001',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      sessions_conducted: 26,
      mentoring_given: 16,
      classes_learnt: 10,
      students_mentored: 22,
      rating: 4.92,
      credits_earned: 390,
      skills: ['PostgreSQL', 'SQL Optimization', 'Node.js'],
      badge: '🦈 Pull Shark',
      tier: 'Gold',
    },
    {
      rank: 3,
      name: 'Meera K',
      usn: '1RV23AI018',
      department: 'Artificial Intelligence & ML',
      year: '3rd Year',
      sessions_conducted: 21,
      mentoring_given: 12,
      classes_learnt: 9,
      students_mentored: 19,
      rating: 4.86,
      credits_earned: 315,
      skills: ['Next.js', 'React 19', 'Tailwind CSS'],
      badge: '🌟 Consistent Helper',
      tier: 'Gold',
    },
    {
      rank: 4,
      name: 'Sanjay V',
      usn: '1RV23IS089',
      department: 'Information Science & Engg',
      year: '2nd Year',
      sessions_conducted: 18,
      mentoring_given: 10,
      classes_learnt: 8,
      students_mentored: 15,
      rating: 4.78,
      credits_earned: 270,
      skills: ['Docker', 'Kubernetes', 'Linux Kernels'],
      badge: '⚡ Speed Mentor',
      tier: 'Silver',
    },
    {
      rank: 5,
      name: 'Priya S',
      usn: '1RV23AI055',
      department: 'Artificial Intelligence & ML',
      year: '2nd Year',
      sessions_conducted: 14,
      mentoring_given: 8,
      classes_learnt: 6,
      students_mentored: 12,
      rating: 4.82,
      credits_earned: 210,
      skills: ['Figma', 'Product Design', 'User Research'],
      badge: '🎨 Design Luminary',
      tier: 'Silver',
    },
  ];

  const weakPerformers = analyticsData?.weakPerformers || [
    {
      id: 'weak-1',
      name: 'Vikram Singh',
      usn: '1RV23CS099',
      department: 'Computer Science & Engineering',
      year: '1st Year',
      sessions_conducted: 3,
      sessions_cancelled: 5,
      mentoring_given: 2,
      classes_learnt: 1,
      students_mentored: 3,
      rating: 2.9,
      credits_earned: 35,
      deficiency_area: 'High Cancellation Rate & Late Arrival',
      mentor_notes: 'Cancelled 5 booked peer sessions within 15 minutes of start. Peers reported lack of code samples.',
      remediation_action: 'Pair with Top Mentor (Rahul Sharma) for lesson outline review. Restrict new session creation until 2 mock practice circles are completed.',
      badge: '⚠️ High Cancellation Rate',
      severity: 'CRITICAL',
    },
    {
      id: 'weak-2',
      name: 'Aditya Rao',
      usn: '1RV23EC012',
      department: 'Electronics & Communication',
      year: '2nd Year',
      sessions_conducted: 4,
      sessions_cancelled: 3,
      mentoring_given: 2,
      classes_learnt: 2,
      students_mentored: 4,
      rating: 3.2,
      credits_earned: 45,
      deficiency_area: 'Audio Reverberation & Unprepared Exercises',
      mentor_notes: 'Peer reviews cite severe audio echo and unprepared terminal environment during C++ pointers session.',
      remediation_action: 'Perform audio hardware check & provide standardized Google Meet template with markdown slides before teaching.',
      badge: '⚠️ Needs Peer Coaching',
      severity: 'MODERATE',
    },
    {
      id: 'weak-3',
      name: 'Rohan Deshmukh',
      usn: '1RV23IS044',
      department: 'Information Science & Engg',
      year: '3rd Year',
      sessions_conducted: 5,
      sessions_cancelled: 2,
      mentoring_given: 3,
      classes_learnt: 2,
      students_mentored: 5,
      rating: 3.4,
      credits_earned: 55,
      deficiency_area: 'Fast Pacing & Unanswered Learner Questions',
      mentor_notes: 'Learners felt pacing was overly rushed through React useEffect race condition topics without Q&A pauses.',
      remediation_action: 'Introduce mandatory 10-minute Q&A checkpoints at midpoint and end of each 45-minute barter circle.',
      badge: '⚠️ Pacing Remediation',
      severity: 'LOW',
    },
  ];

  const positiveFeedbacks = analyticsData?.feedback?.positive || [
    {
      id: 'pos-1',
      reviewer_name: 'Anusha A',
      reviewer_dept: 'CSE • 3rd Year',
      mentor_name: 'Rahul Sharma',
      topic: 'PostgreSQL B-Tree Indexing Walkthrough',
      rating: 5,
      timestamp: 'Today at 02:40 PM',
      comment: 'Super clear self-made video walkthrough! Solved my query latency bottleneck from 450ms down to 1.2ms using composite B-Tree indexes. Unbelievable explanation of heap buffer caches.',
      credit_reward: '+15 Credits',
      tag: '🚀 EXCELLENT PERFORMANCE',
    },
    {
      id: 'pos-2',
      reviewer_name: 'Meera K',
      reviewer_dept: 'AIML • 3rd Year',
      mentor_name: 'Alex Johnson',
      topic: 'PyTorch Deep Learning CNN Architecture',
      rating: 5,
      timestamp: 'Yesterday at 05:15 PM',
      comment: 'Loved the live terminal debugging of PyTorch tensor gradients and matrix transformations. Deserves top spot on the collegiate leaderboard! Extremely patient and articulate.',
      credit_reward: '+15 Credits',
      tag: '🏆 MASTER LEVEL TUTOR',
    },
    {
      id: 'pos-3',
      reviewer_name: 'Sanjay V',
      reviewer_dept: 'AIDS • 2nd Year',
      mentor_name: 'Meera K',
      topic: 'Next.js 14 Server Actions & Parallel Routes',
      rating: 5,
      timestamp: '2 days ago',
      comment: 'Awesome live coding recording on parallel routes and streaming SSR components. The optimistic mutation code snippet saved my hackathon project.',
      credit_reward: '+15 Credits',
      tag: '💡 INSPIRING EXPLANATION',
    },
    {
      id: 'pos-4',
      reviewer_name: 'Kavya Sharma',
      reviewer_dept: 'AIML • 3rd Year',
      mentor_name: 'Priya S',
      topic: 'Figma Design Tokens & Typography Systems',
      rating: 4,
      timestamp: '3 days ago',
      comment: 'Great breakdown of auto-layout nested frames and color variables in Figma. Very helpful for beginners building full design tokens.',
      credit_reward: '+10 Credits',
      tag: '✨ CLEAR & ENGAGING',
    },
  ];

  const negativeFeedbacks = analyticsData?.feedback?.negative || [
    {
      id: 'neg-1',
      reviewer_name: 'Aditya Rao',
      reviewer_dept: 'ECE • 2nd Year',
      mentor_name: 'Sanjay V',
      topic: 'Docker Multi-Stage Builds Masterclass',
      rating: 3,
      timestamp: 'Yesterday at 11:20 AM',
      comment: 'The containerization concepts were good, but the audio in the middle section had slight background echo and the terminal font size was a bit small on mobile screens.',
      recommendation: 'Recommend re-recording audio with noise suppression and zooming terminal font to 18px.',
      severity: 'LOW_NEEDS_IMPROVEMENT',
      tag: '⚠️ AUDIO & VISUAL CLARITY',
    },
    {
      id: 'neg-2',
      reviewer_name: 'Rohan Deshmukh',
      reviewer_dept: 'ISE • 3rd Year',
      mentor_name: 'Meera K',
      topic: 'Advanced React Suspense Transitions',
      rating: 3,
      timestamp: '3 days ago',
      comment: 'Pacing was quite fast during the useEffect race condition cleanup section. Had to pause the recording 5 times to catch the code snippet.',
      recommendation: 'Recommend adding chapter timestamps and providing the GitHub repo link in video description.',
      severity: 'MODERATE_PACING_ISSUE',
      tag: '⏳ PACING ADJUSTMENT',
    },
    {
      id: 'neg-3',
      reviewer_name: 'Vikram Singh',
      reviewer_dept: 'CSE • 1st Year',
      mentor_name: 'Peer Teaching Squad #4',
      topic: 'Python Asynchronous AsyncIO Event Loops',
      rating: 2,
      timestamp: '4 days ago',
      comment: 'Session started 10 minutes late due to meeting link confusion. The explanation of thread pool executors needed more diagrammatic slides.',
      recommendation: 'Ensure calendar meeting invites are dispatched 15 minutes in advance and include architectural slides.',
      severity: 'ATTENDANCE_&_SLIDES',
      tag: '⚠️ SCHEDULE & DIAGRAMS',
    },
  ];

  // Filtering
  const filteredPeerVault = peerVault.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student_author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTopPerformers = topPerformers.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWeakPerformers = weakPerformers.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.deficiency_area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExchanges = exchangeActivity.filter((e: any) =>
    e.mentor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.learner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.taught_skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.received_skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Mentor Header Console */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Mentor Intelligence Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Participant SkillBarter & PeerVault Oversight
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Live mentorship analytics, top mentor standings, weak performer diagnostics, and separated review streams.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                fetchAnalytics();
                onRefresh();
              }}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-blue-200 border border-blue-500/30 text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Ecosystem 🔄'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-6 mt-4 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>📊 Overall Analytics</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exchanges')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'exchanges'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-cyan-300" />
            <span>🤝 Skill Exchanges ({exchangeActivity.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('peervault')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'peervault'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🗄️ PeerVault Repositories ({peerVault.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>🏆 Top Performers ({topPerformers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('weak_performers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'weak_performers'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-rose-300 hover:text-white hover:bg-rose-950/30 border border-rose-500/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>⚠️ Weak & Needs Attention ({weakPerformers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('feedback')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>💬 Feedback & Reviews ({positiveFeedbacks.length + negativeFeedbacks.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW ANALYTICS TAB                                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 7 Highlight Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            
            {/* Card 1: Participants Exchanged Skills */}
            <div className="glass-panel p-4.5 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 to-slate-900 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold block">Exchanged Skills</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-heading">{overview.totalParticipantsExchangedSkills}</p>
              <span className="text-[10px] text-cyan-200/80 font-mono block">Participants Traded</span>
            </div>

            {/* Card 2: Mentoring Given */}
            <div className="glass-panel p-4.5 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 to-slate-900 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block">Mentoring Given</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-heading">{overview.mentoringGivenCount}</p>
              <span className="text-[10px] text-emerald-200/80 font-mono block">{overview.mentoringGivenHours} Given</span>
            </div>

            {/* Card 3: Classes Learnt */}
            <div className="glass-panel p-4.5 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-950/30 to-slate-900 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">Classes Learnt</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-heading">{overview.classesLearntCount}</p>
              <span className="text-[10px] text-purple-200/80 font-mono block">{overview.classesLearntHours} Consumed</span>
            </div>

            {/* Card 4: Total Classes Conducted */}
            <div className="glass-panel p-4.5 rounded-2xl border border-blue-500/30 bg-slate-900/60 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-blue-300 font-bold block">Total Sessions</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{overview.totalClassesConducted}</p>
              <span className="text-[10px] text-blue-200/80 font-mono block">Peer Circles Done</span>
            </div>

            {/* Card 5: Learnt Students */}
            <div className="glass-panel p-4.5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-indigo-300 font-bold block">Learnt Students</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-heading">{overview.totalStudentsLearnt}</p>
              <span className="text-[10px] text-indigo-200/80 font-mono block">Peers Helped</span>
            </div>

            {/* Card 6: Credits Traded */}
            <div className="glass-panel p-4.5 rounded-2xl border border-amber-500/30 bg-slate-900/60 shadow-lg space-y-1 text-center">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">Credits Traded</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-heading">{overview.totalCreditsExchanged}</p>
              <span className="text-[10px] text-amber-200/80 font-mono block">Domain 3 Pts</span>
            </div>

            {/* Card 7: Average Rating */}
            <div className="glass-panel p-4.5 rounded-2xl border border-pink-500/30 bg-slate-900/60 shadow-lg space-y-1 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono text-pink-300 font-bold block">Ecosystem Rating</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-pink-300 font-heading">{overview.averageEcosystemRating} ★</p>
              <span className="text-[10px] text-pink-200/80 font-mono block">{overview.satisfactionRate} Positive</span>
            </div>

          </div>

          {/* Quick 2-Column Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Mentors Standings Preview */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Top Student Mentors</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('leaderboard')}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Full Leaderboard ({topPerformers.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {topPerformers.slice(0, 3).map((p: any) => (
                  <div key={p.rank} className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono text-xs flex items-center justify-center">
                        #{p.rank}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{p.department}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 font-mono block">+{p.credits_earned} Credits</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.mentoring_given} Given • {p.classes_learnt} Learnt</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak / Needs Attention Performers Preview */}
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-rose-300 font-heading flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Mentors Requiring Intervention</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('weak_performers')}
                  className="text-xs font-mono text-rose-300 hover:text-rose-200 transition-colors"
                >
                  View Diagnostics ({weakPerformers.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {weakPerformers.slice(0, 2).map((w: any) => (
                  <div key={w.id} className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">{w.name}</span>
                        <span className="text-[10px] text-rose-300 font-mono">{w.department} • {w.rating} ★</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                        {w.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans line-clamp-1">
                      ⚠️ {w.deficiency_area}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 2-WAY SKILL EXCHANGES LOG TAB                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'exchanges' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <Repeat className="w-5 h-5 text-cyan-400" />
                <span>2-Way Peer Skill Exchange Matrix & Log</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Detailed record of cross-participant mentoring given, classes learnt, and mutual credit settlement.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exchanges, skills, or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Mentor (Taught)</th>
                  <th className="py-3 px-3">Learner (Received)</th>
                  <th className="py-3 px-3">Taught Skill</th>
                  <th className="py-3 px-3">Received Skill</th>
                  <th className="py-3 px-3">Mode & Duration</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3 text-right">Credit Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredExchanges.map((ex: any) => (
                  <tr key={ex.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-emerald-400 block">{ex.mentor_name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{ex.mentor_dept}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-purple-400 block">{ex.learner_name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{ex.learner_dept}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-white font-medium block">{ex.taught_skill}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-cyan-300 font-medium block">{ex.received_skill}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span>{ex.mode}</span>
                      <span className="text-slate-400 text-[10px] block">⏱️ {ex.duration}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-amber-400 font-bold">★ {ex.rating}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                        +{ex.credits_transferred} Credits
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PEERVAULT REPOSITORY TAB                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'peervault' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PeerVault masterclasses or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredPeerVault.length} PeerVault Masterclasses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeerVault.map((item: any) => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold uppercase">
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-amber-400 font-bold font-mono text-xs flex items-center space-x-1">
                      <span>★</span>
                      <span>{item.rating}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white font-heading leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-blue-300 font-mono mt-1">
                      {item.topic}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Creator:</span>
                      <span className="text-white font-semibold">{item.student_author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span>{item.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration & Size:</span>
                      <span>{item.duration} ({item.video_size})</span>
                    </div>
                  </div>

                  {item.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                    <span>👁️ {item.views}</span>
                    <span>👥 {item.learners_count}</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                    +{item.credits_awarded} Credits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TOP PERFORMERS LEADERBOARD TAB                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'leaderboard' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Collegiate Top Mentors & Barter Performers</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Real-time performance ranking based on mentoring given, classes learnt, and verified peer ratings.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Student Mentor</th>
                  <th className="py-3 px-3">Mentoring Given</th>
                  <th className="py-3 px-3">Classes Learnt</th>
                  <th className="py-3 px-3">Total Sessions</th>
                  <th className="py-3 px-3">Average Rating</th>
                  <th className="py-3 px-3">Prestige Badge</th>
                  <th className="py-3 px-3 text-right">Domain Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTopPerformers.map((mentor: any) => (
                  <tr key={mentor.rank} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                        mentor.rank === 1 ? 'bg-amber-500 text-black font-extrabold' :
                        mentor.rank === 2 ? 'bg-slate-300 text-black font-bold' :
                        mentor.rank === 3 ? 'bg-amber-700 text-white font-bold' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        #{mentor.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-white block">{mentor.name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{mentor.usn} • {mentor.department}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-400">
                      {mentor.mentoring_given} Given
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-purple-400">
                      {mentor.classes_learnt} Learnt
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-blue-300">
                      {mentor.sessions_conducted} Sessions
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-amber-400 font-bold">★ {mentor.rating}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                        {mentor.badge}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-300 font-bold">
                        +{mentor.credits_earned} Pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. WEAK & NEEDS ATTENTION PERFORMERS TAB                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'weak_performers' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-slate-950/60 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Weak & Needs Attention Mentors (Intervention Station)</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Participants with &lt;3.5★ peer ratings, elevated session cancellations, or unprepared lesson outlines.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold">
              ⚠️ Needs Intervention ({weakPerformers.length})
            </span>
          </div>

          <div className="space-y-4">
            {filteredWeakPerformers.map((w: any) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{w.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                        {w.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {w.usn} • {w.department} ({w.year})
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-amber-400 font-bold">
                      ★ {w.rating} Avg Rating
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold">
                      {w.sessions_cancelled} Cancelled
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Sessions Completed:</span>
                    <span className="text-white font-bold">{w.sessions_conducted} Sessions ({w.mentoring_given} Given / {w.classes_learnt} Learnt)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Credits Earned:</span>
                    <span className="text-amber-400 font-bold">+{w.credits_earned} Pts</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Primary Deficiency:</span>
                    <span className="text-rose-300 font-bold">{w.deficiency_area}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-white/5 text-xs font-mono text-slate-300 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Peer Audit & Mentor Failure Log:</span>
                  <p className="text-rose-200 font-sans italic">&quot;{w.mentor_notes}&quot;</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/20 text-xs font-mono text-amber-200 space-y-1">
                  <span className="text-amber-400 font-bold uppercase text-[10px] flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Actionable Mentorship Remediation Plan:</span>
                  </span>
                  <p className="text-slate-300 font-sans">{w.remediation_action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FEEDBACK & REVIEWS STATION (SEPARATED POSITIVE & NEGATIVE)              */}
      {/* ========================================================================= */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white font-heading">
                Peer Reviews & Feedback Station
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Review verified student submissions, commendations, and constructive feedback.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFeedbackCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  feedbackCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                All Feedback ({positiveFeedbacks.length + negativeFeedbacks.length})
              </button>

              <button
                onClick={() => setFeedbackCategory('positive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  feedbackCategory === 'positive'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-300" />
                <span>Positive Commendations ({positiveFeedbacks.length})</span>
              </button>

              <button
                onClick={() => setFeedbackCategory('negative')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  feedbackCategory === 'negative'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5 text-amber-300" />
                <span>Needs Improvement ({negativeFeedbacks.length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(feedbackCategory === 'all' || feedbackCategory === 'positive') && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 px-1">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-emerald-300 font-heading uppercase tracking-wide">
                    👍 Positive Praise & Highlights ({positiveFeedbacks.length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {positiveFeedbacks.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          {item.tag}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs font-mono">
                          <span>★ {item.rating}.0</span>
                          <span className="text-slate-400 text-[10px] font-normal ml-2">{item.timestamp}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white block">{item.topic}</span>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                          Reviewer: <strong className="text-white">{item.reviewer_name}</strong> ({item.reviewer_dept}) ➔ Mentor: <strong className="text-emerald-300">{item.mentor_name}</strong>
                        </p>
                      </div>

                      <p className="text-xs text-slate-200 font-sans italic bg-slate-950/60 p-3 rounded-xl border border-white/5">
                        &quot;{item.comment}&quot;
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 pt-1">
                        <span className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Verified Learner Review</span>
                        </span>
                        <span className="font-bold">{item.credit_reward} Deposited</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(feedbackCategory === 'all' || feedbackCategory === 'negative') && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 px-1">
                  <ThumbsDown className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-300 font-heading uppercase tracking-wide">
                    ⚠️ Critical / Needs Improvement ({negativeFeedbacks.length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {negativeFeedbacks.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                          {item.tag}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs font-mono">
                          <span>★ {item.rating}.0</span>
                          <span className="text-slate-400 text-[10px] font-normal ml-2">{item.timestamp}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white block">{item.topic}</span>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                          Reviewer: <strong className="text-white">{item.reviewer_name}</strong> ({item.reviewer_dept}) ➔ Mentor: <strong className="text-amber-300">{item.mentor_name}</strong>
                        </p>
                      </div>

                      <p className="text-xs text-slate-200 font-sans italic bg-slate-950/60 p-3 rounded-xl border border-white/5">
                        &quot;{item.comment}&quot;
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-[11px] font-mono text-amber-200 space-y-1">
                        <span className="text-[10px] text-amber-400 font-bold uppercase block flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Mentor Guidance Recommendation:</span>
                        </span>
                        <p className="text-slate-300 font-sans">{item.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
