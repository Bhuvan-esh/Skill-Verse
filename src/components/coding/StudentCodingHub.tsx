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
  Info,
  Terminal,
  Cpu,
  Star,
  MessageSquare,
  Mail,
  User,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';
import CodingWorkspaceView from './CodingWorkspaceView';
import StudentCodingProfileView from './StudentCodingProfileView';

interface StudentCodingHubProps {
  user: any;
  onRefresh: () => void;
  subTab?: string;
  setSubTab?: (subTab: string) => void;
}

// Past Competitions Retrospective Data
const PAST_COMPETITIONS_DATA = [
  {
    id: 'past-comp-1',
    title: 'Algorithmic Titans Sprint 2026 (Edition I)',
    category: 'ALGORITHMS & CONCURRENCY',
    conductedDate: 'February 15, 2026',
    theme: 'High-Throughput Stream Processing & Microservices Concurrency',
    overview: 'A high-intensity 90-minute competitive sprint where AI-balanced student squads tackled live streaming telemetry pipelines, memory-bounded graph partitioning, and dynamic concurrency limits.',
    rating: 4.9,
    reviewCount: 48,
    tags: ['AIDS & AIML Exclusive', 'AI-Balanced Squads', 'Twist Constraints'],
    bannerGradient: 'from-purple-950/80 via-slate-900 to-indigo-950/80',
    participantReviews: [
      {
        author: 'Ananya R.',
        cohort: '3rd Year · AIML',
        rating: '5.0',
        quote: 'The mid-challenge twist constraint forcing us to operate in sub-16MB memory pushed our algorithms to the edge. Best team coding experience of the semester!',
        highlight: 'Exceptional real-time problem complexity',
      },
      {
        author: 'Vikram S.',
        cohort: '4th Year · AIDS',
        rating: '5.0',
        quote: 'Visual Architects did an amazing job balancing our squad. Having 1st and 2nd years handle modular unit testing while senior teammates tackled concurrency synchronization worked like a charm.',
        highlight: 'Balanced 1st-4th year synergy',
      },
      {
        author: 'Rohan K.',
        cohort: '2nd Year · CSE',
        rating: '4.8.0',
        quote: 'Loved the live workspace telemetry and automatic test assertion feedback. The leaderboard race in the final 10 minutes was electrifying.',
        highlight: 'Fast live compilation & test benchmarks',
      },
    ],
    softSkillImprovementData: [
      {
        skill: 'Cross-Year Squad Synchronization & Communication',
        growth: '+34%',
        score: '9.8 / 10',
        insight: 'Effective task delegation between seniors (systems logic) and juniors (test assertion fixtures).',
      },
      {
        skill: 'Algorithmic Articulation & Peer Code Review',
        growth: '+29%',
        score: '9.6 / 10',
        insight: 'Clear mathematical formulation during live whiteboard huddles under 15-minute deadlines.',
      },
      {
        skill: 'Crisis Twist Constraint Adaptability',
        growth: '+38%',
        score: '9.7 / 10',
        insight: 'Rapid pivot when memory-bounded sub-16MB limit was introduced mid-challenge.',
      },
      {
        skill: 'High-Pressure Decision Making',
        growth: '+31%',
        score: '9.5 / 10',
        insight: 'Leaderboard sprint in the final 10 minutes without regression in syntax correctness.',
      },
    ],
    challengesFaced: [
      {
        title: 'Edge-Case Race Conditions',
        description: 'Several squads encountered race conditions when multiplexing telemetry packets over simulated concurrent channels.',
        impact: 'Required refactoring toward mutex synchronization and lock-free ring buffers.',
      },
      {
        title: 'Memory Bound Violations',
        description: 'Recursive matrix transformations exceeded standard heap limits under 100k test records.',
        impact: 'Required transition to iterative dynamic programming with in-place rolling arrays.',
      },
    ],
    improvementsForNext: [
      {
        title: 'Pre-Sprint Sandbox Benchmarks',
        description: 'Provide an interactive compiler playground 15 minutes before the clock starts to test language standard flags.',
      },
      {
        title: 'Mid-Sprint 5-Minute Strategy Huddle',
        description: 'Incorporate a dedicated strategic pause when Visual Architects release unexpected twist constraints.',
      },
    ],
    winningSquad: {
      teamNumber: 1,
      teamName: 'Team #1 — Algorithmic Titans',
      rank: '🥇 1st Place (Grand Champions)',
      members: [
        { name: 'demo L', role: 'Lead Algorithmic Architect', year: '3rd Year · CSE' },
        { name: 'Rahul Sharma', role: 'Core Logic & Data Engineer', year: '4th Year · AIML' },
        { name: 'Meera K', role: 'Debugging & Edge-Case Specialist', year: '2nd Year · AIDS' },
        { name: 'Sanjay V', role: 'Junior Systems Modeler', year: '1st Year · AIDS' },
      ],
      prizesWon: [
        '+150 Domain Credits per Member',
        'Gold Pull Shark Badge Tier 2',
        'Official Visual Architects Certificate of Excellence',
        'Direct Finalist Entry for Summer Hackathon 2026',
      ],
      creditsAwarded: 150,
    },
    runnerUpSquad: {
      teamName: 'Team #2 — Neural Networkers',
      rank: '🥈 2nd Place (Runner Up)',
      prizesWon: ['+100 Domain Credits per Member', 'Silver Quickdraw Badge Tier 2'],
    },
  },
  {
    id: 'past-comp-2',
    title: 'Distributed Fault-Tolerant Hack 2025',
    category: 'DISTRIBUTED SYSTEMS',
    conductedDate: 'January 28, 2026',
    theme: 'Distributed Consensus & Network Partition Recovery',
    overview: 'Squads engineered a resilient distributed key-value store with Raft consensus that survived simulated node crashes, network splits, and corrupted logs.',
    rating: 4.8,
    reviewCount: 36,
    tags: ['Systems Track', 'Fault Tolerance', 'Live Chaos Testing'],
    bannerGradient: 'from-cyan-950/80 via-slate-900 to-blue-950/80',
    participantReviews: [
      {
        author: 'Karthik N.',
        cohort: '4th Year · CSE',
        rating: 5,
        quote: 'Chaos testing injected random 500ms network partitions while our nodes were synchronizing leader heartbeats. Deeply educational!',
        highlight: 'Real-world production chaos engineering',
      },
      {
        author: 'Sneha P.',
        cohort: '3rd Year · AIDS',
        rating: 4.7,
        quote: 'Working across AIDS and AIML students helped us blend data modeling with low-level systems programming.',
        highlight: 'Cross-department innovation',
      },
    ],
    challengesFaced: [
      {
        title: 'Split-Brain Scenario during Partition',
        description: 'Handling minority partition write rejections while maintaining linearizable consistency.',
        impact: 'Required strict majority quorum validation before acknowledging client commits.',
      },
    ],
    improvementsForNext: [
      {
        title: 'Real-Time Network Topology Visualizer',
        description: 'Render interactive graph nodes so teams see which node dropped live during the test run.',
      },
    ],
    winningSquad: {
      teamNumber: 3,
      teamName: 'Team #3 — Quantum Coders',
      rank: '🥇 1st Place (Grand Champions)',
      members: [
        { name: 'Arjun M', role: 'Systems Lead', year: '4th Year · CSE' },
        { name: 'Sneha P', role: 'Consensus Engineer', year: '3rd Year · AIDS' },
        { name: 'Tanvi R', role: 'Test Assertion Specialist', year: '2nd Year · AIML' },
        { name: 'Aditya K', role: 'Log Pipeline Modeler', year: '1st Year · CSE' },
      ],
      prizesWon: [
        '+150 Domain Credits per Member',
        'Galaxy Brain Tier 2 Badge',
        '₹10,000 Student Innovation Voucher',
      ],
      creditsAwarded: 150,
    },
  },
  {
    id: 'past-comp-3',
    title: 'Neural Vector Search & SIMD Optimization Sprint',
    category: 'MACHINE LEARNING & OPTIMIZATION',
    conductedDate: 'December 12, 2025',
    theme: 'Fast Approximate Nearest Neighbor (HNSW) Indexing in C++ & Python',
    overview: 'Optimizing high-dimensional cosine similarity queries on 1536-dimensional embeddings with SIMD vector intrinsics and memory prefetching.',
    rating: 4.9,
    reviewCount: 42,
    tags: ['AI/ML Optimization', 'SIMD Intrinsics', 'Vector Search'],
    bannerGradient: 'from-emerald-950/80 via-slate-900 to-teal-950/80',
    participantReviews: [
      {
        author: 'Priya D.',
        cohort: '3rd Year · AIDS',
        rating: 5,
        quote: 'Optimizing AVX2 vectorized dot products reduced our search query latency from 14ms down to 0.8ms. Truly exhilarating!',
        highlight: 'Massive 17x speedup achieved',
      },
    ],
    challengesFaced: [
      {
        title: 'Cache Line Misses on High Dimensions',
        description: 'Unaligned memory buffers caused CPU cache stalls during batch similarity compute.',
        impact: 'Switched to aligned memory allocators and quantized vector representations.',
      },
    ],
    improvementsForNext: [
      {
        title: 'Pre-Compiled Vector Benchmark Test Suite',
        description: 'Provide standardized dataset fixtures for faster local iteration.',
      },
    ],
    winningSquad: {
      teamNumber: 4,
      teamName: 'Team #4 — Byte Force',
      rank: '🥇 1st Place (Grand Champions)',
      members: [
        { name: 'Rohan K', role: 'Vector Algorithms Lead', year: '3rd Year · AIML' },
        { name: 'Harish B', role: 'SIMD Optimization Engineer', year: '4th Year · AIDS' },
        { name: 'Deepa V', role: 'Memory Layout Specialist', year: '2nd Year · CSE' },
        { name: 'Manoj S', role: 'Benchmark Analyst', year: '1st Year · AIML' },
      ],
      prizesWon: [
        '+150 Domain Credits per Member',
        'Streak Beast Tier 2 Badge',
        'Official Club Excellence Citation',
      ],
      creditsAwarded: 150,
    },
  },
];


// Interactive Demo Competitions for Students to Explore & Register
export const SEED_DEMO_COMPETITIONS = [
  {
    id: 'demo-event-1',
    title: 'Algorithmic Sprint 2026: Concurrency & Graph Partitioning',
    description: 'Time-critical competitive coding sprint testing dynamic programming, streaming telemetry pipelines, memory-bounded graph partitioning, and live stress testing.',
    category: 'ALGORITHMS',
    difficulty: 'HARD',
    is_team: true,
    team_size: 4,
    status: 'LIVE',
    credits_reward: 150,
    rules: '1. All solutions must pass within 2.0s time limit.\n2. Sub-16MB memory bound constraint.\n3. Squad members collaborate on multi-tier tasks.',
    eligibility: 'Open to all registered student club members across 1st to 4th year cohorts.',
    registrations: [],
    challenges: [
      {
        id: 'chal-1',
        title: 'Subarray Sum Matrix Optimization',
        description: 'Find the maximum sum contiguous submatrix in an N x M grid with negative weights in O(N^3) time.',
        difficulty: 'MEDIUM',
        points: 100,
        time_limit: 45,
        status: 'RELEASED',
      },
      {
        id: 'chal-2',
        title: 'Shortest Path with K Energy Teleports',
        description: 'Graph traversal algorithm allowing up to K edge weight overrides to 0.',
        difficulty: 'HARD',
        points: 150,
        time_limit: 60,
        status: 'RELEASED',
      },
    ],
  },
  {
    id: 'demo-event-2',
    title: 'Hackathon CodeSprint: AI & Web Microservices',
    description: 'Full-stack hackathon & algorithmic team challenge building high-concurrency microservices, smart predictive pipelines, and Next.js 14 backends.',
    category: 'SYSTEMS & AI',
    difficulty: 'MEDIUM',
    is_team: true,
    team_size: 3,
    status: 'REGISTRATION_OPEN',
    credits_reward: 200,
    rules: '1. Teams must consist of 3 members assigned by random skill balance.\n2. All members share team score and credit rewards.',
    eligibility: 'Open to all registered student club members.',
    registrations: [],
    challenges: [
      {
        id: 'chal-3',
        title: 'Concurrent Task Queue with Rate Limiting',
        description: 'Implement a thread-safe token bucket rate limiter with sliding window metrics in Python/TypeScript.',
        difficulty: 'MEDIUM',
        points: 120,
        time_limit: 50,
        status: 'RELEASED',
      },
    ],
  },
  {
    id: 'demo-event-3',
    title: 'SpeedCode Arena: Bit Manipulation & Graph Traversal',
    description: 'Rapid-fire solo algorithmic sprint testing bitwise masks, fast modular exponentiation, and topological DAG sorts.',
    category: 'SPEEDCODE',
    difficulty: 'MEDIUM',
    is_team: false,
    team_size: 1,
    status: 'REGISTRATION_OPEN',
    credits_reward: 100,
    rules: 'Fastest clean submission with 100% test assertion coverage wins.',
    eligibility: 'Individual solo competition for all club members.',
    registrations: [],
    challenges: [
      {
        id: 'chal-4',
        title: 'Bitwise Mask State Search',
        description: 'Count minimum flips to reach target state in a connected binary switch graph.',
        difficulty: 'EASY',
        points: 80,
        time_limit: 30,
        status: 'RELEASED',
      },
    ],
  },
];

export default function StudentCodingHub({ user, onRefresh, subTab, setSubTab }: StudentCodingHubProps) {
  const [internalTab, setInternalTab] = useState<'events' | 'workspace' | 'team' | 'leaderboard' | 'history'>('events');
  
  const activeTab = (subTab as 'events' | 'workspace' | 'team' | 'leaderboard' | 'history') || internalTab;
  const setActiveTab = (tab: 'events' | 'workspace' | 'team' | 'leaderboard' | 'history') => {
    setInternalTab(tab);
    if (setSubTab) setSubTab(tab);
  };

  const [events, setEvents] = useState<any[]>(SEED_DEMO_COMPETITIONS);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDetail, setEventDetail] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);

  // Registration Modal State
  const [registerModalEvent, setRegisterModalEvent] = useState<any | null>(null);
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regUsn, setRegUsn] = useState('');
  const [regYear, setRegYear] = useState('3rd Year');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('AIDS');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Past Competition Retrospective Modal State
  const [selectedRetrospective, setSelectedRetrospective] = useState<any | null>(null);

  // Team View Selection State
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Leaderboard data state
  const [codingLeaderboardData, setCodingLeaderboardData] = useState<any[]>([]);
  const [userScorecard, setUserScorecard] = useState<any>({ rank: 1, total: 193, credits: 193 });
  const [codingMetrics, setCodingMetrics] = useState<any>({});
  const [studentHistory, setStudentHistory] = useState<any>({});

  // Real-time live clock
  const [currentTime, setCurrentTime] = useState<string>('');

  // UI state
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [cancelModalEvent, setCancelModalEvent] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Team data from API
  const [teamData, setTeamData] = useState<any | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coding/events');
      const data = await res.json();
      if (res.ok && data.events && data.events.length > 0) {
        setEvents(data.events);
        if (!selectedEventId) {
          const liveOrUpcoming = data.events.find((e: any) => e.status === 'LIVE') || data.events[0];
          setSelectedEventId(liveOrUpcoming.id);
        }
      } else {
        setEvents(SEED_DEMO_COMPETITIONS);
        if (!selectedEventId) setSelectedEventId(SEED_DEMO_COMPETITIONS[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch coding events", e);
      setEvents(SEED_DEMO_COMPETITIONS);
      if (!selectedEventId) setSelectedEventId(SEED_DEMO_COMPETITIONS[0].id);
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
        if (data.challenges && data.challenges.length > 0 && !selectedChallenge) {
          setSelectedChallenge(data.challenges[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch event details", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/coding/leaderboard');
      const data = await res.json();
      if (res.ok) {
        setCodingLeaderboardData(data.leaderboard || []);
        if (data.userScorecard) {
          setUserScorecard(data.userScorecard);
        }
        if (data.codingMetrics) {
          setCodingMetrics(data.codingMetrics);
        }
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

  // Open Registration Modal with Pre-filled Student Details
  const handleOpenRegisterModal = (evt: any) => {
    setRegisterModalEvent(evt);
    setRegEmail(user?.college_email || user?.email || 'demo@rvce.edu.in');
    setRegName(user?.name || 'demo L');
    setRegUsn(user?.usn || '1RV23CS001');
    setRegYear((user as any)?.year || '3rd Year');
    setRegPhone((user as any)?.phone || '+91 98450 12345');
    setRegDept((user as any)?.department === 'AIML' ? 'AIML' : 'AIDS');
  };

  const handleExtractRegFromSkillBarter = async () => {
    try {
      const res = await fetch(`/api/skill-barter/profile?userId=${encodeURIComponent(user?.id || 'default')}`);
      const data = await res.json();
      if (res.ok && data.profile) {
        if (data.profile.name) setRegName(data.profile.name);
        if (data.profile.yearBranch) {
          if (data.profile.yearBranch.includes('1st')) setRegYear('1st Year');
          else if (data.profile.yearBranch.includes('2nd')) setRegYear('2nd Year');
          else if (data.profile.yearBranch.includes('3rd')) setRegYear('3rd Year');
          else if (data.profile.yearBranch.includes('4th')) setRegYear('4th Year');

          if (data.profile.yearBranch.includes('AIML')) setRegDept('AIML');
          else if (data.profile.yearBranch.includes('AIDS')) setRegDept('AIDS');
        }
        setActionMsg('✓ Auto-filled registration fields from your Skill Barter profile!');
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch {
      // Ignore
    }
  };

  // Submit Registration Form to Backend (Saved to Visual Architects)
  const handleSubmitRegistrationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModalEvent) return;
    setActionMsg('');
    setActionErr('');
    setIsSubmittingReg(true);

    try {
      if (registerModalEvent.id.startsWith('demo-')) {
        const currentUserId = user?.id || 'demo-current-user';
        setEvents((prev) =>
          prev.map((e) =>
            e.id === registerModalEvent.id
              ? {
                  ...e,
                  registrations: [
                    ...(e.registrations || []),
                    { student_id: currentUserId, status: 'REGISTERED', registered_at: new Date().toISOString() },
                  ],
                }
              : e
          )
        );

        if (registerModalEvent.is_team) {
          setTeamData({
            teamName: 'Team #1 — Algorithmic Titans',
            teamNumber: 1,
            eventName: registerModalEvent.title,
            members: [
              {
                id: 'mem-1',
                name: regName || user?.name || 'demo L',
                usn: regUsn || '1RV23CS001',
                phone: regPhone || '+91 98450 12345',
                cohort: regYear || '3rd Year · CSE',
                role_title: 'Lead Algorithmic Architect (Slot #1)',
                isCurrentUser: true,
                slot: 1,
              },
              {
                id: 'mem-2',
                name: 'Aditya Nair',
                usn: '1RV22AI014',
                phone: '+91 98451 22334',
                cohort: '4th Year · AIDS',
                role_title: 'Concurrency & Backend Lead (Slot #2)',
                isCurrentUser: false,
                slot: 2,
              },
              {
                id: 'mem-3',
                name: 'Meera K',
                usn: '1RV24CS089',
                phone: '+91 98452 33445',
                cohort: '2nd Year · CSE',
                role_title: 'Logic & Algorithm Specialist (Slot #3)',
                isCurrentUser: false,
                slot: 3,
              },
              {
                id: 'mem-4',
                name: 'Kavya V',
                usn: '1RV25AI042',
                phone: '+91 98453 44556',
                cohort: '1st Year · AIML',
                role_title: 'Unit Testing & Assertion Analyst (Slot #4)',
                isCurrentUser: false,
                slot: 4,
              },
            ],
          });
        }

        setActionMsg(
          registerModalEvent.is_team
            ? `✓ Registration confirmed by Visual Architects! Your balanced squad is ready under My Peers.`
            : `✓ Successfully registered for ${registerModalEvent.title}! Your individual workspace is ready.`
        );
        setRegisterModalEvent(null);
        return;
      }

      const res = await fetch(`/api/coding/events/${registerModalEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          name: regName,
          usn: regUsn,
          year: regYear,
          phone: regPhone,
          department: regDept,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit registration');

      setActionMsg(
        registerModalEvent.is_team
          ? `✓ Registration submitted to Visual Architects! Your team will be synthesized and visible under My Peers.`
          : `✓ Successfully registered for ${registerModalEvent.title}! Your individual workspace is ready.`
      );
      setRegisterModalEvent(null);
      fetchEvents();
      if (selectedEventId) fetchEventDetail(selectedEventId);
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message || 'Registration failed');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const myRegisteredEvents = events.filter((evt) =>
    evt.registrations?.some((r: any) => (r.student_id === user?.id || r.student_id === 'demo-current-user') && r.status === 'REGISTERED')
  );

  return (
    <div className="space-y-6 font-sans">

      {/* Global Action Alerts */}
      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-emerald-400 hover:text-white"><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {actionErr && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{actionErr}</span>
          </div>
          <button onClick={() => setActionErr('')} className="text-rose-400 hover:text-white"><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {/* TAB 1: COMPETITIONS ARENA */}
      {activeTab === 'events' && (
        <div className="space-y-12">

          {/* ========================================================= */}
          {/* SECTION 1: VISUAL ARCHITECTS RELEASED COMPETITIONS       */}
          {/* ========================================================= */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>Visual Architects Live Arena</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-heading">
                  Released Competitions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  Active and upcoming coding challenges officially published and approved by Visual Architects.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10">
                  {events.length} Competitions Released
                </span>
              </div>
            </div>

            {/* Released Competitions Grid */}
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
            ) : events.length === 0 ? (
              <div className="glass-card p-10 rounded-3xl border border-purple-500/30 text-center max-w-2xl mx-auto space-y-3 bg-slate-950/60 shadow-xl">
                <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-heading">No Competitions Currently Released</h3>
                <p className="text-xs text-slate-400 font-sans">Visual Architects are preparing new algorithmic challenges. Check back shortly!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => {
                  const isRegistered = evt.registrations?.some(
                    (r: any) => (r.student_id === user?.id || r.student_id === 'demo-current-user') && r.status === 'REGISTERED'
                  );
                  const isLive = evt.status === 'LIVE';
                  const isTeam = evt.is_team;

                  return (
                    <div
                      key={evt.id}
                      className={`glass-card p-6 rounded-3xl flex flex-col justify-between space-y-5 border transition-all relative overflow-hidden ${
                        isRegistered
                          ? 'border-purple-500/60 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 hover:border-purple-500/40 bg-slate-950/40'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isLive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isLive ? '⚡ LIVE NOW' : '📅 REGISTRATION OPEN'}
                          </span>

                          <span className="text-xs font-extrabold text-amber-400 flex items-center space-x-1 font-mono">
                            <Award className="w-3.5 h-3.5" />
                            <span>+{evt.credits_reward || 100} Credits</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-lg font-bold text-white font-heading leading-snug">{evt.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1.5 line-clamp-2">
                            {evt.description}
                          </p>
                        </div>

                        {/* Competition Format Badge & Visual Architect Notice */}
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[10px] uppercase">Competition Mode</span>
                            <span className={`font-bold flex items-center space-x-1 ${isTeam ? 'text-purple-300' : 'text-cyan-300'}`}>
                              {isTeam ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              <span>{isTeam ? `Team Competition (${evt.team_size || 4} Members)` : 'Individual Competition'}</span>
                            </span>
                          </div>

                          {isTeam ? (
                            <p className="text-[11px] text-amber-300 font-sans leading-relaxed pt-1 border-t border-white/5">
                              ✨ <strong>Team will be made by Visual Architects</strong> and will be visible on event under <strong>My Peers</strong>.
                            </p>
                          ) : (
                            <p className="text-[11px] text-cyan-300 font-sans leading-relaxed pt-1 border-t border-white/5">
                              👤 Individual solo coding challenge with direct leaderboard ranking.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-white/10">
                        {isRegistered ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => {
                                setSelectedEventId(evt.id);
                                setActiveTab('workspace');
                              }}
                              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Code className="w-3.5 h-3.5" />
                              <span>Enter Workspace →</span>
                            </button>
                            {isTeam && (
                              <button
                                onClick={() => setActiveTab('team')}
                                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                                title="View Team Allocation"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>My Peers</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenRegisterModal(evt)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs font-mono shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Register for Competition 🚀</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: RECENTLY HAPPENED COMPETITIONS (RETROSPECTIVES) */}
          {/* ========================================================= */}
          <div className="space-y-5 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Competition Retrospectives & Reviews</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-heading">
                  Recently Happened Competitions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  Explore past competition retrospectives, participant feedback, challenges faced, and winning squads.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10">
                {PAST_COMPETITIONS_DATA.length} Completed Sprints
              </span>
            </div>

            {/* Past Competitions Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAST_COMPETITIONS_DATA.map((past) => (
                <div
                  key={past.id}
                  className="glass-card p-6 rounded-3xl border border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-slate-950/80 to-slate-900 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 uppercase">
                        ✓ COMPLETED
                      </span>
                      <span className="text-xs font-mono text-amber-400 flex items-center space-x-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{past.rating} / 5.0</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">{past.category}</span>
                      <h3 className="text-base font-bold text-white font-heading mt-0.5 group-hover:text-amber-200 transition-colors">
                        {past.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-1">Conducted on {past.conductedDate}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {past.theme}
                    </p>

                    {/* Winner Strip */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono space-y-1">
                      <span className="text-[10px] text-amber-300 uppercase font-bold block">Winning Squad</span>
                      <p className="text-white font-bold">{past.winningSquad.teamName}</p>
                      <p className="text-amber-200 text-[11px]">+{past.winningSquad.creditsAwarded} Credits & Badges Awarded</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRetrospective(past)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300 font-mono text-xs font-bold border border-white/10 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>View Retrospective & Reviews 🔍</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: MY REGISTERED COMPETITIONS                    */}
          {/* ========================================================= */}
          <div className="space-y-5 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Active Registrations</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-heading">
                  My Registered Competitions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  Competitions you have confirmed. Team allocations by Visual Architects will appear under My Peers.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold">
                {myRegisteredEvents.length} Active Registration{myRegisteredEvents.length === 1 ? '' : 's'}
              </span>
            </div>

            {myRegisteredEvents.length === 0 ? (
              <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-3 bg-slate-950/50 max-w-xl mx-auto">
                <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-heading">No Competitions Registered Yet</h3>
                <p className="text-xs text-slate-400 font-sans">
                  You have not registered for any upcoming coding competitions yet. Select a released competition above and tap Register!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRegisteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="glass-card p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-950 to-slate-900 flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VERIFIED REGISTERED</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">+{evt.credits_reward || 100} Pts</span>
                      </div>

                      <h3 className="text-base font-bold text-white font-heading">{evt.title}</h3>
                      <p className="text-xs text-slate-300 font-sans mt-1 line-clamp-2">{evt.description}</p>

                      <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono text-slate-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px] uppercase">Format:</span>
                          <span className="text-purple-300 font-bold">{evt.is_team ? 'Team (4 Members)' : 'Individual'}</span>
                        </div>
                        {evt.is_team && (
                          <div className="text-[11px] text-amber-300 font-sans pt-1 border-t border-white/5">
                            👥 Squad synthesized by Visual Architects. View in <strong>My Peers</strong> tab.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setActiveTab('workspace');
                        }}
                        className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Open Workspace</span>
                      </button>
                      {evt.is_team && (
                        <button
                          onClick={() => setActiveTab('team')}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 text-xs font-mono font-bold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>My Peers</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: INTERACTIVE STUDENT REGISTRATION MODAL           */}
      {/* ========================================================= */}
      {registerModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-black font-sans space-y-5 shadow-2xl animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Register for Competition</h3>
                  <span className="text-[10px] font-mono text-purple-300">{registerModalEvent.title}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExtractRegFromSkillBarter}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-all"
                  title="Auto-fill name, year, and department from Skill Barter Profile"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Extract from Skill Barter</span>
                </button>
                <button
                  onClick={() => setRegisterModalEvent(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event Summary Notice */}
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs font-sans space-y-1">
              <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                <span className="text-purple-300">{registerModalEvent.is_team ? '👥 Team Competition (4 Members)' : '👤 Individual Competition'}</span>
                <span className="text-amber-300">+{registerModalEvent.credits_reward || 100} Reward Credits</span>
              </div>
              {registerModalEvent.is_team && (
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ℹ️ Visual Architects will use your credentials to synthesize a balanced multi-year squad across <strong>1st, 2nd, 3rd, and 4th Year cohorts</strong>.
                </p>
              )}
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmitRegistrationForm} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Google Account / College Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@rvce.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Participant Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. demo L"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                    <span>USN (Seat Number)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsn}
                    onChange={(e) => setRegUsn(e.target.value)}
                    placeholder="e.g. 1RV23CS001"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Academic Year</span>
                  </label>
                  <select
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Engineering Department</span>
                </label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                >
                  <option value="AIDS">Artificial Intelligence & Data Science (AIDS)</option>
                  <option value="AIML">Artificial Intelligence & Machine Learning (AIML)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRegisterModalEvent(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReg ? (
                    <span>Submitting to Architects...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Submit Registration 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PAST COMPETITIONS RETROSPECTIVE & REVIEWS MODAL   */}
      {/* ========================================================= */}
      {selectedRetrospective && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black font-sans space-y-6 shadow-2xl animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                    🏆 COMPETITION RETROSPECTIVE & REVIEWS
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedRetrospective.conductedDate}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">{selectedRetrospective.title}</h3>
                <p className="text-xs text-purple-300 font-mono">{selectedRetrospective.theme}</p>
              </div>
              <button
                onClick={() => setSelectedRetrospective(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Competition Overview</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedRetrospective.overview}</p>
            </div>

            {/* 1. Winning Squad & Award Highlights */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white font-heading">
                    {selectedRetrospective.winningSquad.rank}: {selectedRetrospective.winningSquad.teamName}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  +{selectedRetrospective.winningSquad.creditsAwarded} Credits Won
                </span>
              </div>

              {/* Winning Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {selectedRetrospective.winningSquad.members.map((m: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">{m.name}</span>
                      <span className="text-[11px] text-purple-300">{m.role}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{m.year}</span>
                  </div>
                ))}
              </div>

              {/* Prizes Won */}
              <div className="space-y-1 text-xs font-mono">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Prizes & Credentials Awarded:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRetrospective.winningSquad.prizesWon.map((p: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-200 text-[11px]">
                      🎁 {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Soft Skill Improvement Data */}
            {selectedRetrospective.softSkillImprovementData && (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-300 font-mono uppercase flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Soft Skill Improvement & Telemetry Data</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">AI Analyzed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedRetrospective.softSkillImprovementData.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.skill}</span>
                        <span className="font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                          {item.growth} ({item.score})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{item.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Participant Reviews ("What Participants Felt") */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>What Participants Felt (Reviews & Reflections)</span>
                </h4>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  ★ {selectedRetrospective.rating} ({selectedRetrospective.reviewCount} Reviews)
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedRetrospective.participantReviews.map((rev: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold">{rev.author} ({rev.cohort})</span>
                      <span className="text-amber-400 font-bold">★ {rev.rating}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans italic">&ldquo;{rev.quote}&rdquo;</p>
                    <span className="text-[10px] font-mono text-purple-300 block">✨ {rev.highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Challenges Faced & What to Improve for Next Competition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-300 uppercase block flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Challenges Faced</span>
                </span>
                {selectedRetrospective.challengesFaced.map((ch: any, idx: number) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <strong className="text-white block">{ch.title}</strong>
                    <p className="text-slate-300 text-[11px] font-sans">{ch.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase block flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Improvements for Next Time</span>
                </span>
                {selectedRetrospective.improvementsForNext.map((imp: any, idx: number) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <strong className="text-white block">{imp.title}</strong>
                    <p className="text-slate-300 text-[11px] font-sans">{imp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedRetrospective(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Close Retrospective
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: LIVE CODE WORKSPACE */}
      {activeTab === 'workspace' && (
        <CodingWorkspaceView
          user={user}
          selectedEventId={selectedEventId || ''}
          selectedChallenge={selectedChallenge}
          eventDetail={eventDetail}
          onRefresh={onRefresh}
        />
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
                    ⏰ {currentTime || '12:00:00 PM'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Timing Synced
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                🎓 AIDS & AIML Department Track
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                🏛️ Visual Architects Control
              </span>
            </div>
          </div>

          {/* Loading state */}
          {teamLoading && (
            <div className="glass-panel p-12 rounded-3xl border border-white/10 bg-slate-950/60 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-slate-300 text-sm font-mono">Connecting to Visual Architects Team Allocator...</p>
            </div>
          )}

          {/* Error state */}
          {teamError && !teamLoading && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <span>{teamError}</span>
              <button onClick={fetchMyTeam} className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-white font-mono text-xs">Retry</button>
            </div>
          )}

          {/* PENDING STATE — Countdown & Waiting Screen */}
          {!teamLoading && !teamError && teamData && !teamData.released && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 shadow-xl">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Team Allocation in Progress</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Team Allocation & Roster
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    Teams are synthesized using multi-year cohort balancing and verified by Visual Architects before release.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono font-bold text-xs tracking-wide">
                    ⏳ Awaiting Release
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
                    🤖 AI Multi-Year Balanced Formation
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    🎓 AIDS & AIML Department Exclusive
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RELEASED STATE — Show All Teams Directory & Selected Team Details */}
          {!teamLoading && !teamError && teamData && teamData.released && (() => {
            const allTeams = teamData.allTeams || (teamData.team ? [teamData.team] : []);
            const myTeam = teamData.team || allTeams.find((t: any) => t.isMyTeam) || allTeams[0];
            const currentSelectedTeam = selectedTeamId ? (allTeams.find((t: any) => t.id === selectedTeamId) || null) : null;

            return (
              <div className="space-y-6">

                {/* Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 shadow-xl">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Team Synthesis & Architect Verification</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-heading flex flex-wrap items-center gap-3">
                      <span>Team Allocation & Directory</span>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visual Architects Release Approved</span>
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl">
                      Browse all competition squads released by Visual Architects. Click on any team option to inspect its verified multi-year members.
                    </p>
                  </div>
                  {myTeam && (
                    <button
                      onClick={() => setSelectedTeamId(selectedTeamId === myTeam.id ? null : myTeam.id)}
                      className={`px-4 py-2 rounded-2xl font-mono font-bold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
                        selectedTeamId === myTeam.id
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/20'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{selectedTeamId === myTeam.id ? 'Viewing My Squad' : `Select My Squad: Team #${myTeam.team_number}`}</span>
                    </button>
                  )}
                </div>

                {/* 1. ALL TEAMS DIRECTORY BROWSER */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>All Released Squads ({allTeams.length} Teams)</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">Click any team to inspect details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {allTeams.map((t: any) => {
                      const isAssigned = t.isMyTeam || t.id === myTeam?.id;
                      const isSelected = currentSelectedTeam && t.id === currentSelectedTeam.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTeamId(isSelected ? null : t.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-purple-950/50 border-purple-400 ring-2 ring-purple-500/40 shadow-xl'
                              : isAssigned
                              ? 'bg-gradient-to-b from-purple-950/30 to-slate-900 border-purple-500/40 hover:border-purple-300'
                              : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-mono font-bold text-purple-300">
                                Team #{t.team_number}
                              </span>
                              {isAssigned ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30">
                                  ✨ YOUR TEAM
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[9px] font-mono">
                                  {t.memberCount || 4} Members
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-white font-heading group-hover:text-purple-200 transition-colors">
                              {t.name}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-400 mt-1">
                              {t.cohortSummary || '1st, 2nd, 3rd, 4th Year'}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                            <span className={isSelected ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                              {isSelected ? '● Selected View' : 'Click to View Roster'}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-purple-300 translate-x-0.5' : 'text-slate-500'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. PROMPT WHEN NO TEAM IS SELECTED */}
                {!currentSelectedTeam && (
                  <div className="glass-card p-8 rounded-3xl border border-purple-500/20 bg-purple-950/10 text-center space-y-4 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
                      <Users className="w-7 h-7" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-base font-bold text-white font-heading">
                        Select a Squad Above to View Verified Roster
                      </h3>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Click on any team option above (or inspect your assigned squad) to view verified USNs, contact credentials, and AI multi-year formation breakdown.
                      </p>
                    </div>
                    {myTeam && (
                      <button
                        onClick={() => setSelectedTeamId(myTeam.id)}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center space-x-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Inspect My Squad (Team #{myTeam.team_number} — {myTeam.name})</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 3. SELECTED TEAM DETAILS & VERIFIED ROSTER (VISIBLE ONLY ONCE A TEAM IS SELECTED) */}
                {currentSelectedTeam && (
                  <div className="space-y-6 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-base text-purple-300">
                          #{currentSelectedTeam.team_number}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-white font-heading">{currentSelectedTeam.name}</h3>
                            {(currentSelectedTeam.isMyTeam || currentSelectedTeam.id === myTeam?.id) && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                                YOUR SQUAD
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-slate-400">
                            Visual Architects Verified Team • 4 Roster Slots Active
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        {myTeam && currentSelectedTeam.id !== myTeam.id && (
                          <button
                            onClick={() => setSelectedTeamId(myTeam.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            <span>Switch to My Peers</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedTeamId(null)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-xs transition-all cursor-pointer"
                        >
                          ✕ Close Roster
                        </button>
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
                          Our AI algorithm automatically balances students across <strong>1st, 2nd, 3rd, and 4th year cohorts</strong> exclusively for <strong>AIDS & AIML departments</strong>, blending algorithmic problem solving, machine learning model logic, and competitive coding efficiency.
                        </p>
                      </div>
                      <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 shadow-lg">
                        <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs font-mono uppercase">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Visual Architects Release Approved</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          <strong>Validated & Locked!</strong> Visual Architects have officially validated this team roster and released participant credentials. Connect with team members using their verified USN and contact numbers below.
                        </p>
                      </div>
                    </div>

                    {/* Verified Team Roster Grid */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span>Verified Team Roster — {currentSelectedTeam.name}</span>
                        </h3>
                        <span className="text-xs font-mono text-slate-400">
                          Registered Credentials (Name, USN, Phone Number, Year)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(currentSelectedTeam.members || []).map((m: any, idx: number) => (
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
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">Verified Member</span>
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
                        <span>Squad Diversity: <strong>1st, 2nd, 3rd & 4th Year Balanced</strong></span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Approved by: <strong className="text-purple-300">Visual Architects</strong></span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">✓ Team Synchronized</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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

      {/* TAB 4: LEADERBOARD (Coding Arena & Algorithmic Leaderboard) */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-8 font-sans">

          {/* Coder Profile & Arena Hub Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Coding Arena & Algorithmic Leaderboard</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Coder Profile — {user?.name || 'demo L'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                {user?.usn ? `USN: ${user.usn} | ` : ''}Live competitive rankings, sprint scores, code test coverage, and benchmark stats.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center font-mono">
                <span className="text-[10px] text-cyan-300 uppercase block font-bold">Arena Rank</span>
                <span className="text-xl font-extrabold text-white">#{userScorecard.rank || 1}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center font-mono">
                <span className="text-[10px] text-amber-300 uppercase block font-bold">Sprint Score</span>
                <span className="text-xl font-extrabold text-amber-300">{userScorecard.total || 193} Pts</span>
              </div>
            </div>
          </div>

          {/* Scorecards & Benchmark Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/60">
              <span className="text-slate-400 uppercase text-[10px] block">Test Suite Coverage</span>
              <span className="text-lg font-bold text-emerald-400">98.4%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">24/25 test assertions pass</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/60">
              <span className="text-slate-400 uppercase text-[10px] block">Avg Execution Time</span>
              <span className="text-lg font-bold text-cyan-300">1.2ms</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Benchmarked on O(N log N)</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/60">
              <span className="text-slate-400 uppercase text-[10px] block">Bugs Found / Solved</span>
              <span className="text-lg font-bold text-purple-300">12 / 12</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Bug Hunter Specialist</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/60">
              <span className="text-slate-400 uppercase text-[10px] block">Domain Credits Earned</span>
              <span className="text-lg font-bold text-amber-300">+{userScorecard.credits || 193} Pts</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Rank #1 Leaderboard Bonus</span>
            </div>
          </div>

          {/* Standings Table */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Sprint Standings</h3>
                <span className="text-xs text-slate-400">Live competitive rankings across student coders</span>
              </div>
              <button
                onClick={fetchLeaderboard}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Standings</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 pr-4">Rank</th>
                    <th className="pb-3 px-4">Student Coder</th>
                    <th className="pb-3 px-4">Department & USN</th>
                    <th className="pb-3 px-4">Test Accuracy</th>
                    <th className="pb-3 px-4">Execution Time</th>
                    <th className="pb-3 pl-4 text-right">Sprint Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {codingLeaderboardData.map((row: any) => {
                    const isUser = row.isCurrentUser || row.name === user?.name || row.student_id === user?.id;

                    return (
                      <tr
                        key={row.rank}
                        className={`transition-colors ${
                          isUser
                            ? 'bg-purple-950/40 text-purple-200 font-bold border-l-2 border-purple-400'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            row.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            row.rank === 2 ? 'bg-slate-400/20 text-slate-200 border border-slate-400/30' :
                            row.rank === 3 ? 'bg-amber-700/20 text-amber-400 border border-amber-700/30' :
                            'text-slate-400'
                          }`}>
                            #{row.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{row.name}</span>
                            {isUser && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          <span>{row.department || 'CSE'}</span>
                          {row.usn && <span className="text-slate-500 ml-1.5">({row.usn})</span>}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">
                          {row.accuracy || '96%'}
                        </td>
                        <td className="py-3.5 px-4 text-cyan-300">
                          {row.execTime || '1.4ms'}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-extrabold text-amber-300">
                          {row.points || row.score || 150} Pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MY HISTORY (20-Badge Achievement Profile & Contest History) */}
      {activeTab === 'history' && (
        <StudentCodingProfileView
          user={user}
          onRefresh={onRefresh}
          onNavigateToWorkspace={() => setActiveTab('workspace')}
        />
      )}

    </div>
  );
}
