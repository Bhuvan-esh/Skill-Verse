"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  Video,
  Play,
  Award,
  Trophy,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Send,
  Star,
  Calendar,
  Layers,
  BookOpen,
  User,
  ShieldCheck,
  History,
  TrendingUp,
  FileText,
  Clock,
  Mic,
  Share2,
  Bell,
  X,
  UserCheck,
  Bot,
  Zap,
  Lock,
  UploadCloud,
  Paperclip,
  FileCheck,
  Trash2,
  Film,
  Book,
  File,
  Image as ImageIcon
} from 'lucide-react'

// Retrospectives data
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
        rating: '5.0',
        quote: 'Chaos testing injected random 500ms network partitions while our nodes were synchronizing leader heartbeats. Deeply educational!',
        highlight: 'Real-world production chaos engineering',
      },
    ],
    softSkillImprovementData: [
      {
        skill: 'Fault-Tolerant Distributed Coordination',
        growth: '+30%',
        score: '9.5 / 10',
        insight: 'Collaborative architectural blueprinting before implementing consensus nodes.',
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
      prizesWon: ['+150 Domain Credits per Member', 'Galaxy Brain Tier 2 Badge'],
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
        rating: '5.0',
        quote: 'Optimizing AVX2 vectorized dot products reduced our search query latency from 14ms down to 0.8ms. Truly exhilarating!',
        highlight: 'Massive 17x speedup achieved',
      },
    ],
    softSkillImprovementData: [
      {
        skill: 'Technical Precision & Benchmark Reasoning',
        growth: '+36%',
        score: '9.7 / 10',
        insight: 'Accurate hypothesis testing on cache-line misses and SIMD vector alignment.',
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
      prizesWon: ['+150 Domain Credits per Member', 'Vector Master Tier 1 Badge'],
      creditsAwarded: 150,
    },
  },
]

export default function SoftSkillsArenaPage() {
  const [activeTab, setActiveTab] = useState<'competitions' | 'videos' | 'founder' | 'simulator' | 'judge' | 'audit'>('competitions')
  
  // Competitions state
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [participantsData, setParticipantsData] = useState<any>(null)
  const [teamsData, setTeamsData] = useState<any[]>([])
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([])
  const [registerModalEvent, setRegisterModalEvent] = useState<any>(null)
  const [teamModalEvent, setTeamModalEvent] = useState<any>(null)
  const [selectedRetrospective, setSelectedRetrospective] = useState<any>(null)

  // Videos state
  const [videos, setVideos] = useState<any[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)

  // Reports state
  const [reports, setReports] = useState<any[]>([])
  const [selectedReportModal, setSelectedReportModal] = useState<any>(null)

  // User & Profile
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isExtractingProfile, setIsExtractingProfile] = useState(false)
  const [extractMsg, setExtractMsg] = useState<string | null>(null)
  const [isReportFormOpen, setIsReportFormOpen] = useState(false)

  // Forms
  const [regForm, setRegForm] = useState({
    student_name: '',
    usn: '',
    year: 1,
    branch: 'Computer Science',
    email: '',
  })

  const [eventForm, setEventForm] = useState({
    public_event_name: 'Winter SpeedCode Championship II',
    internal_challenge_type: 'SPEED_CODE',
    description: 'High-velocity syntax and algorithmic optimization tournament.',
    team_based: false,
    team_size: 1,
    credits_reward: 80,
    status: 'REGISTRATION_OPEN',
  })

  const [reportForm, setReportForm] = useState({
    student_name: '',
    usn: '',
    academic_year: 1,
    department: 'Computer Science & Engineering',
    video_id: '',
    video_title: '',
    report_title: '',
    what_watched_summary: '',
    key_learnings: '',
    communication_techniques: '',
    proposed_stage_topic: '',
    why_selected_rationale: '',
    external_references: '',
    attachments: [] as Array<{ name: string; size: string; type: string; dataUrl?: string }>,
  })

  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    video_url: '',
    video_type: 'TED_TALK',
    shared_by_name: 'Visual Architects Core Team',
    shared_by_role: 'Visual Architect',
    what_to_notice: '',
    topic_tags: 'Public Speaking, Technical Rhetoric, Presence',
    duration: '12:00',
  })

  const [judgeForm, setJudgeForm] = useState({
    winningTeamId: '',
    judgeRemarks: 'Exemplary cross-year debate performance, sharp rebuttals, and outstanding team coordination.',
    communication: 9,
    confidence: 10,
    quickThinking: 9,
    contentLogic: 9,
  })

  const [judgeCoderProfile, setJudgeCoderProfile] = useState({
    name: 'Demo L',
    branchYear: 'Branch & Year not added yet',
    bio: 'Bio not added yet',
    creditsEarned: 0,
    peersHelped: 0,
    sessionsDone: 0,
    averageRating: 0.0,
  })
  const [badgeTab, setBadgeTab] = useState<'all' | 'grandmaster' | 'milestones'>('all')
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(15)
  const [isProfileReportFormOpen, setIsProfileReportFormOpen] = useState(false)
  const [isMySubmissionsOpen, setIsMySubmissionsOpen] = useState(false)
  const [isEditingProfileModal, setIsEditingProfileModal] = useState(false)
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<any>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [softSkillsNotifs, setSoftSkillsNotifs] = useState([
    {
      id: 'ss-notif-1',
      time: '07:02 pm',
      category: 'SOFT SKILLS',
      title: '🏆 Live Stage Keynote Selection Approved (+100 Pts)',
      message: "Visual Architects approved your weekly reflection report: 'Strategic Pacing & The Elimination of Verbal Crutches'. Scheduled for March 20, 2026 at Main Horizon Stage!",
      actionLabel: 'Open in Learn Quest →',
      tabTarget: 'videos',
      read: false,
      badge: '+100 Credits',
    },
    {
      id: 'ss-notif-2',
      time: '06:25 pm',
      category: 'SOFT SKILLS',
      title: '🎬 New Mentor Masterclass Video Published',
      message: "Visual Architects Lead shared 'Mastering Stage Presence & Pitching Under Pressure'. Guidance note: Focus on diaphragmatic breathing and deliberate silence.",
      actionLabel: 'Watch in Learn Quest →',
      tabTarget: 'videos',
      read: false,
      badge: 'Learn Quest',
    },
    {
      id: 'ss-notif-3',
      time: '04:40 pm',
      category: 'SOFT SKILLS',
      title: '⚡ Algorithmic Sprint & Debate Battle Booked',
      message: "You are marked and registered for Round 1: Live Concurrency Sprint & Live Debate Qualifiers (Team #1 — Algorithmic Titans) on August 15, 2026.",
      actionLabel: 'View in Event Calendar →',
      calendarDay: 15,
      read: false,
      badge: 'Registered',
    },
    {
      id: 'ss-notif-4',
      time: '02:15 pm',
      category: 'SOFT SKILLS',
      title: '💎 Soft Skill Milestone Unlocked (#1 First Voice)',
      message: "You completed your first speaking activity and unlocked the 'First Voice' milestone (+25 Credits). Ready to level up to #2 Conversation Starter!",
      actionLabel: 'Inspect in Badge Ladder →',
      badgeTabTarget: 'milestones',
      read: true,
      badge: 'Milestone #1',
    },
    {
      id: 'ss-notif-5',
      time: '11:30 am',
      category: 'SOFT SKILLS',
      title: '💬 Visual Architect Feedback & Review Received',
      message: "Reviewer Feedback: 'Outstanding synthesis of Chris Voss tactical empathy in technical keynotes. +100 Credits deposited to your domain balance.'",
      actionLabel: 'Open Dossier 🔍 →',
      openDossier: true,
      read: true,
      badge: 'Review Complete',
    },
    {
      id: 'ss-notif-6',
      time: '09:10 am',
      category: 'SOFT SKILLS',
      title: '⚔️ Mystery Challenge #001 Announced',
      message: "Visual Architects revealed the mystery topic: Live Stage Debate Battle & Technical Rhetoric Qualifiers. Form your squad now!",
      actionLabel: 'Enter Competitions →',
      tabTarget: 'competitions',
      read: true,
      badge: 'Mystery Sprint',
    },
    {
      id: 'ss-notif-7',
      time: 'Yesterday',
      category: 'SOFT SKILLS',
      title: '📜 Soft Skills Certificate of Excellence Issued',
      message: "Dean of Academics & Skill League Jury awarded you the 'Advanced Negotiator & Communicator' credential (+50 Domain 4 Credits).",
      actionLabel: 'Inspect in Badge Ladder →',
      badgeTabTarget: 'grandmaster',
      read: true,
      badge: '+50 Credits',
    },
    {
      id: 'ss-notif-8',
      time: 'Yesterday',
      category: 'SOFT SKILLS',
      title: '🏅 Inter-Department Soft Skills Rank #1 Standing',
      message: 'Your cumulative communication, Learn Quest reflection reports, and sprint points placed you at Rank #1 on the Soft Skills Leaderboard (+193 Pts).',
      actionLabel: 'View in Leaderboard →',
      tabTarget: 'audit',
      read: true,
      badge: 'Rank #1',
    },
  ])
  const [editProfileForm, setEditProfileForm] = useState({
    name: 'Demo L',
    branchYear: '',
    bio: '',
  })

  const grandMasterBadges = [
    { id: 'gm-1', icon: '🎙️', name: 'Keynote Virtuoso', count: 'x1', unlocked: true, tier: 'Diamond', description: 'Delivered a keynote on the Horizon Main Stage with unanimous standing ovation.', category: 'Live Stage Keynote', reward: '+150 Credits' },
    { id: 'gm-2', icon: '⚡', name: 'Impromptu Maestro', locked: true, tier: 'Gold', description: 'Delivered a 3-minute impromptu argument under 15 seconds prep with zero hesitation.', category: 'Spontaneous Rhetoric', reward: '+100 Credits' },
    { id: 'gm-3', icon: '🧠', name: 'Rhetoric Grand Master', locked: true, tier: 'Diamond', description: 'Mastered Aristotelian ethos, pathos, and logos in 5 consecutive championship rounds.', category: 'Classical Rhetoric', reward: '+150 Credits' },
    { id: 'gm-4', icon: '🤝', name: 'Synergy Architect', locked: true, tier: 'Silver', description: 'Led a diverse 4-member cross-year squad to unanimous debate tournament victory.', category: 'Squad Diplomacy', reward: '+80 Credits' },
    { id: 'gm-5', icon: '🌟', name: 'Charisma Luminary', locked: true, tier: 'Gold', description: 'Achieved highest peer communication rating (5.0 ★) across 20 collaborative sessions.', category: 'Interpersonal Magnetism', reward: '+120 Credits' },
    { id: 'gm-6', icon: '🚀', name: 'Stage Dynamo', locked: true, tier: 'Diamond', description: 'Commanded an audience of 500+ attendees in a live collegiate symposium final.', category: 'Stage Presence', reward: '+150 Credits' },
    { id: 'gm-7', icon: '🛡️', name: 'Crisis Diplomat', locked: true, tier: 'Bronze', description: 'Successfully mediated and de-escalated high-stakes team conflict during timed challenge.', category: 'Conflict Resolution', reward: '+60 Credits' },
    { id: 'gm-8', icon: '💖', name: 'Empathy Mentor', locked: true, tier: 'Silver', description: 'Coached 5 junior students to conquer stage fright and deliver their first speech.', category: 'Peer Mentorship', reward: '+80 Credits' },
    { id: 'gm-9', icon: '🦉', name: 'Philosopher Voice', locked: true, tier: 'Bronze', description: 'Synthesized insights from 10 classical books and cinema masterworks into live arguments.', category: 'Deep Insight Synthesis', reward: '+60 Credits' },
    { id: 'gm-10', icon: '🔥', name: 'Debate Titan', locked: true, tier: 'Gold', description: '5 consecutive debate victories as lead rebuttal speaker without dropping a contention.', category: 'Rebuttal & Argumentation', reward: '+120 Credits' },
    { id: 'gm-11', icon: '🎯', name: 'Persuasion Prodigy', locked: true, tier: 'Diamond', description: 'Converted a skeptical audience poll from 20% to 85% favorability in a 3-minute pitch.', category: 'High-Stakes Persuasion', reward: '+150 Credits' },
    { id: 'gm-12', icon: '👑', name: 'Apex Leader', locked: true, tier: 'Gold', description: 'Formed, mentored, and steered collegiate squads to overall soft skills championship victory.', category: 'Executive Leadership', reward: '+120 Credits' },
  ]

  const milestoneBadges = [
    { level: 1, name: 'First Voice', icon: '🎙️', desc: 'Complete 1 speaking activity', category: 'Speaking & Presence', status: 'UNLOCKED', reward: '+25 Credits' },
    { level: 2, name: 'Conversation Starter', icon: '💬', desc: 'Participate in 3 discussions', category: 'Interpersonal Dialogue', status: 'LOCKED', reward: '+30 Credits' },
    { level: 3, name: 'Speak Up', icon: '📢', desc: 'Complete 5 speaking activities', category: 'Vocal Confidence', status: 'LOCKED', reward: '+35 Credits' },
    { level: 4, name: 'Quick Thinker', icon: '⚡', desc: 'Complete 3 random-topic challenges', category: 'Impromptu Rhetoric', status: 'LOCKED', reward: '+40 Credits' },
    { level: 5, name: 'Clear Speaker', icon: '✨', desc: 'Receive positive feedback 5 times', category: 'Articulate Delivery', status: 'LOCKED', reward: '+45 Credits' },
    { level: 6, name: 'Debate Spark', icon: '🔥', desc: 'Participate in 1 debate', category: 'Competitive Debate', status: 'LOCKED', reward: '+50 Credits' },
    { level: 7, name: 'Team Player', icon: '🤝', desc: 'Complete 3 team activities', category: 'Squad Collaboration', status: 'LOCKED', reward: '+55 Credits' },
    { level: 8, name: 'Confident Voice', icon: '🎤', desc: 'Complete 10 speaking activities', category: 'Public Speaking', status: 'LOCKED', reward: '+60 Credits' },
    { level: 9, name: 'Fast Thinker', icon: '🧠', desc: 'Complete 10 spontaneous-topic challenges', category: 'Cognitive Agility', status: 'LOCKED', reward: '+65 Credits' },
    { level: 10, name: 'Debate Ready', icon: '⚔️', desc: 'Participate in 5 debates', category: 'Argumentation Strategy', status: 'LOCKED', reward: '+70 Credits' },
    { level: 11, name: 'Communication Pro', icon: '🌟', desc: 'Strong feedback in 10 activities', category: 'Executive Communication', status: 'LOCKED', reward: '+75 Credits' },
    { level: 12, name: 'Collaboration Star', icon: '👥', desc: 'Complete 10 team activities', category: 'Team Dynamics', status: 'LOCKED', reward: '+80 Credits' },
    { level: 13, name: 'Stage Performer', icon: '🎭', desc: 'Complete 20 speaking activities', category: 'Stage Mastery', status: 'LOCKED', reward: '+90 Credits' },
    { level: 14, name: 'Quick Response', icon: '⏱️', desc: 'Perform well in 15 spontaneous-topic challenges', category: 'Rapid Eloquence', status: 'LOCKED', reward: '+100 Credits' },
    { level: 15, name: 'Debate Champion', icon: '🏆', desc: 'Win/perform well in 5 debates', category: 'Championship Debate', status: 'LOCKED', reward: '+110 Credits' },
    { level: 16, name: 'Confident Communicator', icon: '💎', desc: 'Complete 30 soft-skill activities', category: 'Elite Rhetoric', status: 'LOCKED', reward: '+125 Credits' },
    { level: 17, name: 'Team Leader', icon: '🛡️', desc: 'Lead 5 team activities', category: 'Leadership & Delegation', status: 'LOCKED', reward: '+140 Credits' },
    { level: 18, name: 'Communication Mentor', icon: '🦉', desc: 'Help 10 students improve communication', category: 'Mentorship & Coaching', status: 'LOCKED', reward: '+160 Credits' },
    { level: 19, name: 'Speaking Champion', icon: '🥇', desc: 'Top performer across multiple speaking activities', category: 'Grand Champion Speaker', status: 'LOCKED', reward: '+180 Credits' },
    { level: 20, name: 'Soft Skill Legend', icon: '👑', desc: 'Exceptional across speaking, debate, teamwork, and leadership', category: 'Pinnacle Mastery', status: 'LOCKED', reward: '+200 Credits' },
  ]

  // Simulator
  const [simRunning, setSimRunning] = useState(false)
  const [simSteps, setSimSteps] = useState<Array<{ step: string; status: 'pending' | 'running' | 'done'; detail?: string }>>([
    { step: '1. Register 4 Students (1st, 2nd, 3rd, 4th Years) for Mystery Challenge', status: 'pending' },
    { step: '2. Close Registration & Fetch Year-Wise Participant Roster', status: 'pending' },
    { step: '3. Request AI Mixed-Year Team Generation (Agent 1)', status: 'pending' },
    { step: '4. Founder Reviews & Approves Teams (TEAMS_APPROVED)', status: 'pending' },
    { step: '5. Founder Reveals Secret Challenge (DEBATE_BATTLE)', status: 'pending' },
    { step: '6. Conduct Round & Judge Submits Result (JUDGE_SUBMITTED)', status: 'pending' },
    { step: '7. Founder Ratifies & Confirms Winner (FOUNDER_CONFIRMED)', status: 'pending' },
    { step: '8. AI Post-Winner Pipeline: Credit Calc (120 -> +50 -> 170)', status: 'pending' },
    { step: '9. Participant Submits Weekly Soft Skills Report with Media Attachments', status: 'pending' },
    { step: '10. Visual Architects Select Best Report for Stage Keynote & Public Showcase', status: 'pending' },
  ])

  // Fetch all data
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/soft-skills/events')
      const data = await res.json()
      if (res.ok && data.events) {
        setEvents(data.events)
        if (data.events.length > 0 && !selectedEventId) {
          setSelectedEventId(data.events[0].id)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchEventDetails = async (id: string) => {
    if (!id) return
    try {
      const res = await fetch(`/api/soft-skills/events/${id}`)
      const data = await res.json()
      if (res.ok && data.event) setSelectedEvent(data.event)

      const partRes = await fetch(`/api/soft-skills/events/${id}/participants`)
      const partData = await partRes.json()
      if (partRes.ok) setParticipantsData(partData)

      const teamRes = await fetch(`/api/soft-skills/events/${id}/teams`)
      const teamData = await teamRes.json()
      if (teamRes.ok) setTeamsData(teamData.teams || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true)
      const res = await fetch('/api/soft-skills/videos')
      const data = await res.json()
      if (res.ok && data.videos) {
        setVideos(data.videos)
        if (!reportForm.video_title && data.videos.length > 0) {
          setReportForm((prev) => ({
            ...prev,
            video_id: data.videos[0].id,
            video_title: data.videos[0].title,
          }))
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingVideos(false)
    }
  }

  const [leaderboardData, setLeaderboardData] = useState<any>(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true)
      const res = await fetch('/api/soft-skills/leaderboard')
      const data = await res.json()
      if (res.ok && data.success) {
        setLeaderboardData(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingLeaderboard(false)
    }
  }

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/soft-skills/reports')
      const data = await res.json()
      if (res.ok && data.reports) setReports(data.reports)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchVideos()
    fetchReports()
    fetchLeaderboard()

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user)
          if (data.user.name) {
            setRegForm((prev) => ({ ...prev, student_name: data.user.name }))
            setReportForm((prev) => ({ ...prev, student_name: data.user.name }))
          }
          if (data.user.usn) {
            setRegForm((prev) => ({ ...prev, usn: data.user.usn }))
            setReportForm((prev) => ({ ...prev, usn: data.user.usn }))
          }
          if (data.user.college_email) setRegForm((prev) => ({ ...prev, email: data.user.college_email }))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedEventId) fetchEventDetails(selectedEventId)
  }, [selectedEventId])

  // Profile Auto-Fill
  const handleExtractFromSkillBarter = async () => {
    try {
      setIsExtractingProfile(true)
      const res = await fetch('/api/skill-barter/profile?userId=default')
      const data = await res.json()

      const rawName = data?.profile?.name
      const rawYearBranch = data?.profile?.yearBranch

      const finalName = rawName && rawName.trim() ? rawName.trim() : 'Name not added yet'

      let yearNum = 1
      if (rawYearBranch) {
        if (rawYearBranch.includes('2')) yearNum = 2
        else if (rawYearBranch.includes('3')) yearNum = 3
        else if (rawYearBranch.includes('4')) yearNum = 4
      }

      let branchName = 'Department not added yet'
      if (rawYearBranch && rawYearBranch.trim()) {
        if (rawYearBranch.includes('AIDS')) branchName = 'Artificial Intelligence & Data Science (AIDS)'
        else if (rawYearBranch.includes('AIML')) branchName = 'Artificial Intelligence & Machine Learning (AIML)'
        else if (rawYearBranch.includes('CSE')) branchName = 'Computer Science & Engineering (CSE)'
        else branchName = rawYearBranch.trim()
      }

      setRegForm((prev) => ({
        ...prev,
        student_name: finalName,
        year: yearNum,
        branch: branchName,
      }))

      setReportForm((prev) => ({
        ...prev,
        student_name: finalName,
        academic_year: yearNum,
        department: branchName,
      }))

      const updatedCoderProfile = {
        name: finalName,
        branchYear: branchName !== 'Department not added yet' ? `${branchName} • ${yearNum}th Year` : 'Computer Science & Engineering • 1st Year',
        bio: data?.profile?.bio || 'Passionate algorithmic problem solver and system designer.',
        creditsEarned: data?.profile?.credits || 193,
        peersHelped: data?.profile?.peersHelped || 12,
        sessionsDone: data?.profile?.sessionsDone || 8,
        averageRating: data?.profile?.rating || 4.9,
      }
      setJudgeCoderProfile(updatedCoderProfile)
      setEditProfileForm({
        name: updatedCoderProfile.name,
        branchYear: updatedCoderProfile.branchYear,
        bio: updatedCoderProfile.bio,
      })

      setExtractMsg('✓ Successfully synced profile from Skill Barter!')
      setActionMessage({ type: 'success', text: 'Profile successfully extracted from Skill Barter!' })
      setTimeout(() => setExtractMsg(null), 4000)
    } catch (e: any) {
      setExtractMsg('Error syncing: ' + (e.message || 'Network error'))
      setTimeout(() => setExtractMsg(null), 4000)
    } finally {
      setIsExtractingProfile(false)
    }
  }

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : (file.size / 1024).toFixed(0) + ' KB'

      const reader = new FileReader()
      reader.onload = () => {
        setReportForm((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              name: file.name,
              size: sizeStr,
              type: file.type || 'application/octet-stream',
              dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
            },
          ],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveAttachment = (indexToRemove: number) => {
    setReportForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  // Registration handler
  const handleModalRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerModalEvent) return
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${registerModalEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setActionMessage({
        type: 'success',
        text: `Registered successfully for ${registerModalEvent.public_event_name}! (Academic Year: ${regForm.year})`,
      })
      setRegisteredEventIds((prev) => [...prev, registerModalEvent.id])
      setRegisterModalEvent(null)
      await fetchEvents()
      fetchEventDetails(registerModalEvent.id)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  // Weekly report submission handler
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch('/api/soft-skills/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportForm,
          attachments: JSON.stringify(reportForm.attachments),
          student_id: currentUser?.id || 'demo-current-user',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit report')
      
      setActionMessage({
        type: 'success',
        text: 'Weekly Soft Skills Report with Attachments successfully submitted to Visual Architects for Stage Performance review!',
      })

      setReportForm((prev) => ({
        ...prev,
        report_title: '',
        what_watched_summary: '',
        key_learnings: '',
        communication_techniques: '',
        proposed_stage_topic: '',
        why_selected_rationale: '',
        external_references: '',
        attachments: [],
      }))

      setIsReportFormOpen(false)
      fetchReports()
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  // Competition Launch Handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch('/api/soft-skills/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventForm,
          participant_limit: 100,
          created_by: 'Visual Architects',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to launch competition')
      setActionMessage({ type: 'success', text: `Visual Architects published: '${data.event.public_event_name}'!` })
      await fetchEvents()
      setSelectedEventId(data.event.id)
      setActiveTab('competitions')
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  // Share Video Handler
  const handleShareVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch('/api/soft-skills/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideoForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to publish video')
      setActionMessage({ type: 'success', text: `Video '${data.video.title}' published to Participant Stream!` })
      setNewVideoForm({
        title: '',
        video_url: '',
        video_type: 'TED_TALK',
        shared_by_name: 'Visual Architects Core Team',
        shared_by_role: 'Visual Architect',
        what_to_notice: '',
        topic_tags: 'Public Speaking, Technical Rhetoric, Presence',
        duration: '12:00',
      })
      fetchVideos()
      setActiveTab('videos')
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  // Stage Selection Handler
  const handleSelectForStage = async (reportId: string) => {
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SELECT_FOR_STAGE',
          visual_architect_feedback: '🏆 Selected for Live Stage Performance Keynote at Horizon Stage!',
          stage_performance_date: 'March 20, 2026 • Main Horizon Stage',
          credits_awarded: 100,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to select report')
      setActionMessage({ type: 'success', text: data.message })
      fetchReports()
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  // Simulator
  const runEndToEndSimulation = async () => {
    setSimRunning(true)
    const updateSimStep = (idx: number, status: 'running' | 'done', detail?: string) => {
      setSimSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, status, detail: detail || s.detail } : s))
      )
    }

    try {
      const suffix = Date.now().toString().slice(-4)
      const evRes = await fetch('/api/soft-skills/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_event_name: `Skill League — Mystery Challenge #${suffix}`,
          internal_challenge_type: 'DEBATE_BATTLE',
          description: 'Official Soft Skills Mystery League Tournament.',
          participant_limit: 20,
          team_size: 4,
          credits_reward: 50,
        }),
      })
      const evData = await evRes.json()
      setSelectedEventId(evData.event.id)

      updateSimStep(0, 'running')
      const students = [
        { name: 'Alex Johnson', usn: `1MS24CS001_${suffix}`, year: 1, email: `alex_${suffix}@college.edu` },
        { name: 'Bethany Clark', usn: `1MS23CS002_${suffix}`, year: 2, email: `bethany_${suffix}@college.edu` },
        { name: 'Carlos Mendez', usn: `1MS22CS003_${suffix}`, year: 3, email: `carlos_${suffix}@college.edu` },
        { name: 'Diana Prince', usn: `1MS21CS004_${suffix}`, year: 4, email: `diana_${suffix}@college.edu` },
      ]
      for (const s of students) {
        await fetch(`/api/soft-skills/events/${evData.event.id}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name: s.name, usn: s.usn, year: s.year, branch: 'CSE', email: s.email }),
        })
      }
      updateSimStep(0, 'done', '4 students registered (1st, 2nd, 3rd, 4th Year).')

      updateSimStep(1, 'running')
      const partRes = await fetch(`/api/soft-skills/events/${evData.event.id}/participants`)
      const partData = await partRes.json()
      updateSimStep(1, 'done', `Year distribution confirmed: Y1: ${partData.summary.year1Count}, Y2: ${partData.summary.year2Count}, Y3: ${partData.summary.year3Count}, Y4: ${partData.summary.year4Count}`)

      updateSimStep(2, 'running')
      const teamGenRes = await fetch(`/api/soft-skills/events/${evData.event.id}/teams/generate`, { method: 'POST' })
      const teamGenData = await teamGenRes.json()
      updateSimStep(2, 'done', `AI Agent generated ${teamGenData.result.teams.length} balanced squad mixing all 4 academic years.`)

      updateSimStep(3, 'running')
      await fetch(`/api/soft-skills/events/${evData.event.id}/teams`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      })
      updateSimStep(3, 'done', 'Founder ratified squad composition.')

      updateSimStep(4, 'running')
      const revRes = await fetch(`/api/soft-skills/events/${evData.event.id}/reveal`, { method: 'POST' })
      const revData = await revRes.json()
      updateSimStep(4, 'done', `Secret challenge revealed: ${revData.revealedChallengeType}`)

      updateSimStep(5, 'running')
      const teamsRes = await fetch(`/api/soft-skills/events/${evData.event.id}/teams`)
      const teamsList = await teamsRes.json()
      const winningTeam = teamsList.teams[0]

      const judgeRes = await fetch(`/api/soft-skills/events/${evData.event.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winning_team_id: winningTeam.id,
          judge_remarks: 'Superb debate defense, agile rebuttals under time compression.',
          scores_summary: { communication: 9.5, confidence: 10, quickThinking: 9.0, contentLogic: 9.5 },
        }),
      })
      const judgeData = await judgeRes.json()
      updateSimStep(5, 'done', `Judge submitted score for ${winningTeam.team_name}.`)

      updateSimStep(6, 'running')
      await fetch(`/api/soft-skills/events/${evData.event.id}/confirm-winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result_id: judgeData.result.id }),
      })
      updateSimStep(6, 'done', 'Founder officially ratified winner (FOUNDER_CONFIRMED).')

      updateSimStep(7, 'done', '+50 credits added to winning team members.')

      updateSimStep(8, 'running')
      const repRes = await fetch('/api/soft-skills/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 'stu-sim-' + Date.now(),
          student_name: 'Simulated Participant',
          usn: '1MS23AI099',
          academic_year: 3,
          department: 'Artificial Intelligence & Data Science (AIDS)',
          video_title: 'How to Speak So That People Want to Listen',
          report_title: 'The Resonance of Strategic Silence in Tech Debates',
          what_watched_summary: 'Analyzed how intentional silence creates psychological authority.',
          key_learnings: '1. Strategic pauses highlight critical ideas.\n2. Diaphragmatic breathing eliminates vocal tremor.',
          communication_techniques: 'Controlled silence and vocal modulation.',
          proposed_stage_topic: '“The Architecture of Persuasion: Engineering Clean Explanations”',
          why_selected_rationale: 'I connect voice acoustic physics with cognitive bias mitigation in live debate tournaments.',
          external_references: '• Book: "Talk Like TED" by Carmine Gallo\n• Movie: "Whiplash" — High pressure pacing and rhythmic authority.',
          attachments: JSON.stringify([
            { name: 'Vocal_Pacing_Research.pdf', type: 'application/pdf', size: '1.8 MB' }
          ]),
        }),
      })
      const repData = await repRes.json()
      updateSimStep(8, 'done', 'Participant submitted weekly soft skills reflection report with attachments.')

      updateSimStep(9, 'running')
      await fetch(`/api/soft-skills/reports/${repData.report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SELECT_FOR_STAGE',
          visual_architect_feedback: '🏆 Selected for Live Stage Performance Keynote at Horizon Stage!',
          stage_performance_date: 'March 20, 2026 • Main Horizon Stage',
          credits_awarded: 100,
        }),
      })
      updateSimStep(9, 'done', 'Report marked as Best Submission & Published to Public Showcase.')

      await fetchEvents()
      await fetchReports()
      setActionMessage({ type: 'success', text: 'Full simulation completed successfully!' })
    } catch (e: any) {
      console.error(e)
      setActionMessage({ type: 'error', text: 'Simulation error: ' + e.message })
    } finally {
      setSimRunning(false)
    }
  }

  const myRegisteredEvents = events.filter((evt) =>
    evt.registrations?.some(
      (r: any) =>
        (currentUser?.id && r.student_id === currentUser?.id) ||
        (currentUser?.usn && r.usn?.toUpperCase() === currentUser?.usn?.toUpperCase()) ||
        r.student_id === 'demo-current-user' ||
        registeredEventIds.includes(evt.id)
    ) || registeredEventIds.includes(evt.id)
  )

  const publicReports = reports.filter((r) => r.is_public)

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 selection:bg-purple-500 selection:text-white p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(167, 139, 250, 0.12) 0%, rgba(8, 7, 13, 0.98) 75%)' }}
      />

      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10 mb-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <Link
            href="/horizon"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Horizon</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent font-heading">
                Soft Skill
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Student Innovation & Credit Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'competitions'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Competitions</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-300" />
            <span>Learn Quest</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audit')
              fetchLeaderboard()
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'judge'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-300" />
            <span>Profile</span>
          </button>

          {/* Soft Skills Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-white/10 hover:border-purple-400/40 transition-all cursor-pointer flex items-center justify-center"
            title="Soft Skills Notifications"
          >
            <Bell className="w-4 h-4 text-purple-300" />
            {softSkillsNotifs.filter((n) => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-mono font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {softSkillsNotifs.filter((n) => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Slide-Over Notification Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-2xl bg-gradient-to-b from-slate-900 to-black font-sans">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    🎤 Soft Skills Notifications
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300">
                    Peer Exchanges, Credits & Live Stage Alerts
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scoped Context Info Strip */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  🎤 Soft Skills Feed ({softSkillsNotifs.length})
                </span>
              </div>

              {softSkillsNotifs.some((n) => !n.read) && (
                <button
                  onClick={() => {
                    setSoftSkillsNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
                  }}
                  className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Mark section read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
              {softSkillsNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setSoftSkillsNotifs((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                    )
                    if (n.tabTarget) {
                      setActiveTab(n.tabTarget as any)
                      setIsNotificationsOpen(false)
                    } else if (n.calendarDay) {
                      setActiveTab('judge')
                      setSelectedCalendarDay(n.calendarDay)
                      setIsNotificationsOpen(false)
                      setTimeout(() => {
                        document.getElementById('event-calendar-section')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    } else if (n.badgeTabTarget) {
                      setActiveTab('judge')
                      setBadgeTab(n.badgeTabTarget as any)
                      setIsNotificationsOpen(false)
                      setTimeout(() => {
                        document.getElementById('achievements-ladder-section')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    } else if (n.openDossier) {
                      const targetRep = reports.find((r) => r.status === 'SELECTED_FOR_STAGE' || r.is_public) || reports[0]
                      if (targetRep) setSelectedReportModal(targetRep)
                      setIsNotificationsOpen(false)
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    n.read
                      ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/[0.04]'
                      : 'bg-purple-950/30 border-purple-500/40 shadow-lg shadow-purple-950/40 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        🎤 {n.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{n.time}</span>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white font-heading">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="mt-2 text-[11px] font-mono text-purple-300 hover:text-purple-200 flex items-center space-x-1 font-bold">
                    <span>{n.actionLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto space-y-8">
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-300 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: COMPETITIONS (RELEASED + RETROSPECTIVES + MY REGISTRATIONS)       */}
        {/* ========================================================================= */}
        {activeTab === 'competitions' && (
          <div className="space-y-12">
            {/* SECTION 1: RELEASED COMPETITIONS */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Competitions</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Released Competitions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    Active and upcoming coding challenges officially published and approved by Visual Architects.
                  </p>
                </div>

                <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10">
                  {events.length} Competitions Released
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => {
                  const isRegistered = evt.registrations?.some(
                    (r: any) =>
                      (currentUser?.id && r.student_id === currentUser?.id) ||
                      (currentUser?.usn && r.usn?.toUpperCase() === currentUser?.usn?.toUpperCase()) ||
                      r.student_id === 'demo-current-user' ||
                      registeredEventIds.includes(evt.id)
                  ) || registeredEventIds.includes(evt.id)
                  const isLive = evt.status === 'LIVE'
                  const isTeam = evt.team_based !== undefined ? evt.team_based : (evt.team_size > 1)

                  const getAttractiveTagline = () => {
                    const name = (evt.public_event_name || '').toLowerCase()
                    if (name.includes('speed') || name.includes('winter')) {
                      return 'Annual speed-coding tournament focused on rapid syntax, recursion, and string manipulation.'
                    }
                    if (name.includes('hackathon') || name.includes('web') || name.includes('ai & web')) {
                      return 'Full-stack hackathon & algorithmic team challenge building high-concurrency microservices and smart predictive pipelines.'
                    }
                    if (name.includes('algorithmic') || name.includes('2026')) {
                      return 'Time-critical coding challenge testing data structures, dynamic programming, and graph optimization algorithms.'
                    }
                    return evt.description || 'High-stakes collegiate challenge published by Visual Architects.'
                  }

                  return (
                    <div
                      key={evt.id}
                      className={`glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-5 border transition-all relative overflow-hidden ${
                        isRegistered
                          ? 'border-purple-500/60 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 hover:border-purple-500/40 bg-slate-950/40'
                      }`}
                    >
                      <div className="space-y-3">
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
                            <span>+{evt.credits_reward || 80} Credits</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white font-heading leading-snug">
                            {evt.public_event_name}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1.5">
                            {getAttractiveTagline()}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[10px] uppercase">Competition Mode</span>
                            <span className={`font-bold flex items-center space-x-1 ${isTeam ? 'text-purple-300' : 'text-cyan-300'}`}>
                              {isTeam ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              <span>{isTeam ? `Team Competition (${evt.team_size || 3} Members)` : 'Individual Competition'}</span>
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

                      <div className="pt-3 border-t border-white/10">
                        {isRegistered ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified Registered ✓</span>
                            </div>
                            {isTeam && (
                              <button
                                onClick={() => setTeamModalEvent(evt)}
                                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>My Peers</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setRegisterModalEvent(evt)
                              setSelectedEventId(evt.id)
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs font-mono shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Register for Competition 🚀</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SECTION 2: RECENTLY HAPPENED COMPETITIONS */}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PAST_COMPETITIONS_DATA.map((past) => (
                  <div
                    key={past.id}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-slate-950/80 to-slate-900 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 uppercase">
                          ✓ COMPLETED
                        </span>
                        <span className="text-xs font-mono text-amber-400 flex items-center space-x-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{past.rating} / 5.0 Rating</span>
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

                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono space-y-1">
                        <span className="text-[10px] text-amber-300 uppercase font-bold block">Winning Squad</span>
                        <p className="text-white font-bold">{past.winningSquad.teamName}</p>
                        <p className="text-amber-200 text-[11px]">+{past.winningSquad.creditsAwarded} Credits Awarded</p>
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

            {/* SECTION 3: MY REGISTERED COMPETITIONS */}
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
                    Competitions you have confirmed. Team allocations appear under My Peers.
                  </p>
                </div>

                <span className="text-xs font-mono text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold">
                  {myRegisteredEvents.length} Active Registration{myRegisteredEvents.length === 1 ? '' : 's'}
                </span>
              </div>

              {myRegisteredEvents.length === 0 ? (
                <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-3 bg-slate-950/50 max-w-xl mx-auto">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white font-heading">No Competitions Registered Yet</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Select a released competition above and tap Register!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRegisteredEvents.map((evt) => {
                    const isTeam = evt.team_based !== undefined ? evt.team_based : (evt.team_size > 1)
                    return (
                      <div
                        key={evt.id}
                        className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-950 to-slate-900 flex flex-col justify-between space-y-4 shadow-lg"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>VERIFIED REGISTERED</span>
                            </span>
                            <span className="text-xs font-mono text-amber-300 font-bold">
                              +{evt.credits_reward || 80} Credits
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white font-heading">{evt.public_event_name}</h4>
                          <p className="text-xs text-slate-400 font-sans mt-1">
                            {evt.event_location || 'Main Digital Arena'} • Scheduled for {new Date(evt.event_date).toLocaleDateString()}
                          </p>

                          <div className="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono">
                            {isTeam ? (
                              <span className="text-amber-300">
                                ✨ Team made by Visual Architects. Check <strong>My Peers</strong>.
                              </span>
                            ) : (
                              <span className="text-cyan-300">
                                👤 Individual solo challenge with direct leaderboard ranking.
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                          {isTeam && (
                            <button
                              onClick={() => setTeamModalEvent(evt)}
                              className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>View My Peers</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedEventId(evt.id)
                              fetchEventDetails(evt.id)
                            }}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-md"
                          >
                            <span>Event Status Details</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LEARN QUEST, WEEKLY TASKS & STAGE SHOWCASE                         */}
        {/* ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-12">
            {/* Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-950 to-purple-950/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold font-mono">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Weekly Soft Skills Challenge & Live Stage Qualifier</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Watch. Reflect. Upload Evidence & Win a Live Stage Keynote! 🎤
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Watch any video shared by mentors or Visual Architects. Submit your weekly reflection report detailing deep insights, rhetoric techniques, connected books & movies, why your perspective is special, and attach documents/media. Top-rated reports win a <strong>Live Stage Keynote</strong> at Horizon Arena, <strong>Prize Pool & +100 Credits</strong>, and are published to the Public Showcase!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReportFormOpen(true)
                      setTimeout(() => {
                        document.getElementById('submit-report-section')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs font-mono transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-950" />
                    <span>Submit Weekly Report ↓</span>
                  </button>
                  <a
                    href="#public-showcase-section"
                    className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-purple-200 text-xs font-mono font-bold transition-all border border-white/10 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>View Selected Reports ({publicReports.length})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Video Stream */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    <span>Curated Video Stream</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-heading">
                    Videos Shared by Mentors & Visual Architects
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    Hand-picked talks and mentor masterclasses covering vocal pacing, body language, and high-stakes technical storytelling.
                  </p>
                </div>

                <span className="text-xs font-mono text-purple-300 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  {videos.length} Videos Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-purple-500/40 bg-slate-950/60 flex flex-col justify-between space-y-5 shadow-xl transition-all group"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300">
                            {vid.shared_by_name?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block leading-tight">{vid.shared_by_name}</span>
                            <span className="text-[10px] font-mono text-purple-400">{vid.shared_by_role}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                          {vid.duration || '10:00'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">{vid.video_type}</span>
                        <h4 className="text-base font-bold text-white font-heading mt-1 group-hover:text-purple-200 transition-colors">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 mt-1">🏷️ {vid.topic_tags}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/25 space-y-1 text-xs">
                        <div className="flex items-center space-x-1.5 text-purple-300 font-mono font-bold text-[11px]">
                          <Eye className="w-3.5 h-3.5 text-purple-400" />
                          <span>Mentor's Note: What to Notice</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans italic">&ldquo;{vid.what_to_notice}&rdquo;</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <a
                        href={vid.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Video on YouTube ↗</span>
                      </a>

                      <button
                        onClick={() => {
                          setIsReportFormOpen(true)
                          setReportForm((prev) => ({ ...prev, video_id: vid.id, video_title: vid.title }))
                          setTimeout(() => {
                            document.getElementById('submit-report-section')?.scrollIntoView({ behavior: 'smooth' })
                          }, 100)
                        }}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-white/5"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>Select for My Weekly Report 📝</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Report Submission */}
            <div id="submit-report-section" className="space-y-5 pt-4">
              {!isReportFormOpen ? (
                <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-900 shadow-2xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5 max-w-xl mx-auto">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Participant Report Submission</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-heading">Submit Your Weekly Reflection Report</h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Document what you watched, deep insights, rhetoric techniques, connected books & movies, why your angle is special, and attach documents/media to qualify for the live stage!
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReportFormOpen(true)}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs font-mono shadow-xl shadow-purple-600/30 transition-all cursor-pointer inline-flex items-center space-x-2.5 transform hover:scale-105"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>Click to Open Report Submission Form 📝</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Participant Report Submission</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white font-heading">Submit Your Weekly Reflection Report</h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-sans">
                        Complete all reflection sections, cross-domain references, live stage pitch, and attach supporting media/documents.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleExtractFromSkillBarter}
                        disabled={isExtractingProfile}
                        className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isExtractingProfile ? 'Syncing...' : 'Auto-Fill from Skill Barter'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsReportFormOpen(false)}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
                        title="Hide Form"
                      >
                        <span>Hide Form ✕</span>
                      </button>
                    </div>
                  </div>

                  {extractMsg && (
                    <p className="text-xs text-purple-300 font-mono bg-purple-950/40 p-3 rounded-xl border border-purple-500/30">{extractMsg}</p>
                  )}

                  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl">
                    <form onSubmit={handleSubmitReport} className="space-y-6 text-xs">
                      {/* Section A: Participant & Video metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Participant Name</label>
                          <input
                            type="text"
                            required
                            value={reportForm.student_name}
                            onChange={(e) => setReportForm({ ...reportForm, student_name: e.target.value })}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">University USN</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1MS23AI042"
                            value={reportForm.usn}
                            onChange={(e) => setReportForm({ ...reportForm, usn: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400 font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Academic Year</label>
                          <select
                            value={reportForm.academic_year}
                            onChange={(e) => setReportForm({ ...reportForm, academic_year: parseInt(e.target.value, 10) })}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                          >
                            <option value={1}>1st Year (Freshman)</option>
                            <option value={2}>2nd Year (Sophomore)</option>
                            <option value={3}>3rd Year (Junior)</option>
                            <option value={4}>4th Year (Senior)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Department / Branch</label>
                          <input
                            type="text"
                            required
                            value={reportForm.department}
                            onChange={(e) => setReportForm({ ...reportForm, department: e.target.value })}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Select Watched Video</label>
                          <select
                            value={reportForm.video_title}
                            onChange={(e) => {
                              const selected = videos.find((v) => v.title === e.target.value)
                              setReportForm({ ...reportForm, video_title: e.target.value, video_id: selected?.id || '' })
                            }}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                          >
                            {videos.map((v) => (
                              <option key={v.id} value={v.title}>{v.title} ({v.shared_by_name})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Report Title / Headline</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Strategic Pacing & The Elimination of Verbal Crutches in High-Stakes Presentations"
                            value={reportForm.report_title}
                            onChange={(e) => setReportForm({ ...reportForm, report_title: e.target.value })}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                          />
                        </div>
                      </div>

                      {/* 1. What was watched */}
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium font-mono text-xs text-purple-300">
                          1. Summary of What You Watched & Core Thesis
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Briefly summarize the core themes, speaker thesis, and narrative flow..."
                          value={reportForm.what_watched_summary}
                          onChange={(e) => setReportForm({ ...reportForm, what_watched_summary: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 2. Deep Insights */}
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium font-mono text-xs text-purple-300">
                          2. Deep Insights & Psychological Mental Models Learnt
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="1. Silence signals cognitive control.\n2. Diaphragmatic breathing prevents voice pitch elevation under high stress..."
                          value={reportForm.key_learnings}
                          onChange={(e) => setReportForm({ ...reportForm, key_learnings: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 3. Communication Techniques */}
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium font-mono text-xs text-purple-300">
                          3. Communication & Rhetoric Techniques Observed
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Detail specific observations: open chest posture, deliberate silence, modulated vocal register, tactical framing..."
                          value={reportForm.communication_techniques}
                          onChange={(e) => setReportForm({ ...reportForm, communication_techniques: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 4. Connected Books & Movies */}
                      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-2">
                        <label className="block text-purple-300 font-bold font-mono text-xs flex items-center space-x-1.5">
                          <Book className="w-4 h-4 text-purple-400" />
                          <span>4. Cross-Domain References: Books Read & Movies Watched Relating to This Video</span>
                        </label>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Mention books (e.g. <em>Never Split the Difference</em>, <em>Talk Like TED</em>), movies (e.g. <em>The King&apos;s Speech</em>, <em>Whiplash</em>), or articles you have studied and explain why/how they correlate to the video concepts.
                        </p>
                        <textarea
                          rows={2}
                          placeholder="• Book: 'Never Split the Difference' by Chris Voss — Tactical empathy and late-night FM DJ vocal pacing.&#10;• Movie: 'The King’s Speech' (2010) — Mechanics of overcoming diaphragmatic constriction under immense public scrutiny."
                          value={reportForm.external_references}
                          onChange={(e) => setReportForm({ ...reportForm, external_references: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 5. What Makes You Special & Why You Should Be Selected */}
                      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-2">
                        <label className="block text-indigo-300 font-bold font-mono text-xs flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span>5. What Makes You Special: Why Visual Architects Should Select You for Live Stage Keynote</span>
                        </label>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Highlight your unique perspective, domain synthesis (e.g. AIDS/AIML + rhetoric), or specialized case study that will captivate the live Horizon Arena audience.
                        </p>
                        <textarea
                          rows={2}
                          placeholder="I synthesize physiological autonomic nervous system control with algorithmic rhetoric, enabling engineers to anchor boardroom authority without aggressive posturing."
                          value={reportForm.why_selected_rationale}
                          onChange={(e) => setReportForm({ ...reportForm, why_selected_rationale: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 6. Proposed Stage Topic */}
                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                        <label className="block text-amber-300 font-bold font-mono text-xs flex items-center space-x-1.5">
                          <Mic className="w-4 h-4 text-amber-400" />
                          <span>6. Your Proposed Live Stage Topic (If Selected by Visual Architects)</span>
                        </label>
                        <p className="text-[11px] text-slate-400 font-sans">
                          If Visual Architects choose your report as the best submission, you will present a 3-minute keynote on this topic to win prizes!
                        </p>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 'Engineering Persuasive Arguments in Technical Keynotes'"
                          value={reportForm.proposed_stage_topic}
                          onChange={(e) => setReportForm({ ...reportForm, proposed_stage_topic: e.target.value })}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* 7. Attachments & Evidence Vault */}
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-200 font-bold font-mono text-xs flex items-center space-x-1.5">
                            <Paperclip className="w-4 h-4 text-purple-400" />
                            <span>7. Evidence & Attachments Vault (Upload PDFs, DOCX, Images, Pages, Notes)</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">PDF, DOC, DOCX, PAGES, PNG, JPG, PPTX</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Upload your slide deck, summary PDF, posture diagram images, or book notes to back your reflection report.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <label className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer">
                            <UploadCloud className="w-4 h-4 text-purple-300" />
                            <span>Upload Files & Media</span>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.pages,.txt,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {reportForm.attachments.length} File{reportForm.attachments.length === 1 ? '' : 's'} Attached
                          </span>
                        </div>

                        {reportForm.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                            {reportForm.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200"
                              >
                                {att.type.includes('image') ? (
                                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                                ) : (
                                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                )}
                                <span className="font-semibold">{att.name}</span>
                                <span className="text-[10px] text-slate-400">({att.size})</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttachment(idx)}
                                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs font-mono shadow-xl shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Submit Report & Evidence Vault to Visual Architects for Stage Qualifier 🚀</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Public Showcase */}
            <div id="public-showcase-section" className="space-y-5 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Public Showcase & Stage Performers</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-heading">
                    Selected Reports Approved by Visual Architects
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    Once Visual Architects review submissions, top reports with evidence attachments are published publicly for all participants to study.
                  </p>
                </div>

                <span className="text-xs font-mono text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 font-bold">
                  {publicReports.length} Stage Qualifier{publicReports.length === 1 ? '' : 's'} Published
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publicReports.map((rep) => {
                  let parsedAttachments: any[] = []
                  if (rep.attachments) {
                    try {
                      parsedAttachments = typeof rep.attachments === 'string' ? JSON.parse(rep.attachments) : rep.attachments
                    } catch (e) {}
                  }

                  return (
                    <div
                      key={rep.id}
                      className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-950 to-purple-950/20 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                            <Trophy className="w-3 h-3" />
                            <span>STAGE PERFORMANCE QUALIFIER</span>
                          </span>
                          <span className="text-xs font-mono text-amber-400 font-bold">+{rep.credits_awarded || 100} Credits</span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-white font-heading">{rep.report_title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-mono">
                            <span className="text-purple-300 font-bold">Author: {rep.student_name}</span>
                            {rep.usn && (
                              <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[10px]">
                                USN: {rep.usn}
                              </span>
                            )}
                            <span className="text-slate-400 text-[11px]">• {rep.academic_year}rd Year • {rep.department}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-1">Video Analyzed: &quot;{rep.video_title}&quot;</p>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
                          <span className="text-amber-300 font-mono font-bold text-[10px] uppercase block">🎤 Approved Live Stage Topic</span>
                          <p className="text-slate-200 font-semibold font-sans">{rep.proposed_stage_topic}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Scheduled: {rep.stage_performance_date || 'Upcoming Horizon Showcase'}
                          </span>
                        </div>

                        {rep.external_references && (
                          <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-0.5">
                            <span className="text-purple-300 font-mono font-bold text-[10px] uppercase block">📚 Books & Movies Referenced</span>
                            <p className="text-slate-300 whitespace-pre-line text-[11px]">{rep.external_references}</p>
                          </div>
                        )}

                        {parsedAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {parsedAttachments.map((att: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300"
                              >
                                <Paperclip className="w-3 h-3 text-cyan-400" />
                                <span>{att.name}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {rep.visual_architect_feedback && (
                          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs">
                            <span className="text-purple-300 font-mono font-bold text-[10px] uppercase block">Visual Architects Feedback</span>
                            <p className="text-slate-300 italic text-[11px] mt-0.5">&ldquo;{rep.visual_architect_feedback}&rdquo;</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedReportModal(rep)}
                        className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Full Public Report & Evidence 📖</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROFILE & ARENA SCHEDULE                                           */}
        {/* ========================================================================= */}
        {activeTab === 'judge' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Coder Profile Info Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-950/80 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white">
                      👩💻
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                      {judgeCoderProfile.name || currentUser?.name || 'Demo L'}
                    </h2>
                    <p className="text-xs text-purple-300 font-mono">
                      {judgeCoderProfile.branchYear || 'Branch & Year not added yet'}
                    </p>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      {judgeCoderProfile.bio || 'Bio not added yet'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExtractFromSkillBarter}
                    disabled={isExtractingProfile}
                    className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>👩💻 Extract from Skill Barter</span>
                    {isExtractingProfile && <Sparkles className="w-3.5 h-3.5 animate-spin" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditProfileForm({
                        name: judgeCoderProfile.name,
                        branchYear: judgeCoderProfile.branchYear,
                        bio: judgeCoderProfile.bio,
                      })
                      setIsEditingProfileModal(true)
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    Edit Profile Info
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center space-y-1">
                  <p className="text-2xl font-extrabold text-amber-400 font-heading">
                    {judgeCoderProfile.creditsEarned} Pts
                  </p>
                  <span className="text-xs font-mono text-slate-400 block">Credits Earned</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center space-y-1">
                  <p className="text-2xl font-extrabold text-purple-300 font-heading">
                    {judgeCoderProfile.peersHelped} Students
                  </p>
                  <span className="text-xs font-mono text-slate-400 block">Peers Helped</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center space-y-1">
                  <p className="text-2xl font-extrabold text-cyan-300 font-heading">
                    {judgeCoderProfile.sessionsDone} Sessions
                  </p>
                  <span className="text-xs font-mono text-slate-400 block">Sessions Done</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center space-y-1">
                  <p className="text-2xl font-extrabold text-emerald-400 font-heading">
                    {judgeCoderProfile.averageRating.toFixed(1)} ★
                  </p>
                  <span className="text-xs font-mono text-slate-400 block">Average Rating</span>
                </div>
              </div>

              {/* Participant Report Submission & My Submissions Section */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Participant Report Submissions</span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      Submit Your Weekly Reflection Report
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Document what you watched, deep insights, rhetoric techniques, connected books & movies, why your angle is special, and attach documents/media to qualify for the live stage!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsProfileReportFormOpen(!isProfileReportFormOpen)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer flex items-center space-x-2 self-start sm:self-auto shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isProfileReportFormOpen ? 'Hide Form ✕' : 'Click to Open Report Submission Form 📝'}</span>
                  </button>
                </div>

                {/* Profile Report Submission Form (when opened) */}
                {isProfileReportFormOpen && (
                  <div className="p-6 rounded-3xl border border-purple-500/30 bg-slate-900/90 shadow-2xl space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold text-purple-300 font-mono">
                        📝 Direct Report Submission Station
                      </span>
                      <button
                        type="button"
                        onClick={handleExtractFromSkillBarter}
                        disabled={isExtractingProfile}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold hover:bg-purple-600/40 cursor-pointer"
                      >
                        Auto-Fill from Skill Barter
                      </button>
                    </div>

                    <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Participant Name</label>
                          <input
                            type="text"
                            required
                            value={reportForm.student_name}
                            onChange={(e) => setReportForm({ ...reportForm, student_name: e.target.value })}
                            className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Academic Year</label>
                          <select
                            value={reportForm.academic_year}
                            onChange={(e) => setReportForm({ ...reportForm, academic_year: parseInt(e.target.value) })}
                            className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                          >
                            <option value={1}>1st Year (Freshman)</option>
                            <option value={2}>2nd Year (Sophomore)</option>
                            <option value={3}>3rd Year (Junior)</option>
                            <option value={4}>4th Year (Senior)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1 font-medium">Department / Branch</label>
                          <input
                            type="text"
                            required
                            value={reportForm.department}
                            onChange={(e) => setReportForm({ ...reportForm, department: e.target.value })}
                            className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">Report Title / Headline</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vocal Micro-Adjustments & Strategic Silence in Tech Pitches"
                          value={reportForm.report_title}
                          onChange={(e) => setReportForm({ ...reportForm, report_title: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">1. Summary of What You Watched & Key Concepts</label>
                        <textarea
                          rows={2}
                          required
                          value={reportForm.what_watched_summary}
                          onChange={(e) => setReportForm({ ...reportForm, what_watched_summary: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">2. Deep Insights & What You Learnt from It</label>
                        <textarea
                          rows={2}
                          required
                          value={reportForm.key_learnings}
                          onChange={(e) => setReportForm({ ...reportForm, key_learnings: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">3. Communication & Rhetoric Techniques Observed</label>
                        <textarea
                          rows={2}
                          required
                          value={reportForm.communication_techniques}
                          onChange={(e) => setReportForm({ ...reportForm, communication_techniques: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">4. Proposed 3-Minute Live Stage Keynote Topic</label>
                        <input
                          type="text"
                          required
                          value={reportForm.proposed_stage_topic}
                          onChange={(e) => setReportForm({ ...reportForm, proposed_stage_topic: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer"
                      >
                        Submit Report to Visual Architects 🚀
                      </button>
                    </form>
                  </div>
                )}

                {/* Collapsible List of My Submissions */}
                {(() => {
                  const myUniqueReports = Array.from(
                    new Map(reports.map((r: any) => [r.report_title || r.id, r])).values()
                  )

                  return (
                    <div className="space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsMySubmissionsOpen(!isMySubmissionsOpen)}
                        className="w-full p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center justify-between text-xs font-mono cursor-pointer shadow-md"
                      >
                        <div className="flex items-center space-x-2.5">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-white">
                            My Active Reflection Reports ({myUniqueReports.length})
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            Verified Dossiers
                          </span>
                        </div>
                        <span className="text-purple-300 font-bold">
                          {isMySubmissionsOpen ? 'Hide Reports ▲' : 'Click to View Submissions ▼'}
                        </span>
                      </button>

                      {isMySubmissionsOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 pt-1">
                          {myUniqueReports.map((rep: any) => {
                            const isSelected = rep.status === 'SELECTED_FOR_STAGE' || rep.is_public
                            return (
                              <div
                                key={rep.id}
                                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                                  isSelected
                                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg'
                                    : 'bg-slate-900/60 border-white/10'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-white font-heading leading-snug">
                                    {rep.report_title}
                                  </span>
                                  <span
                                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                                      isSelected
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    }`}
                                  >
                                    {isSelected ? '🏆 Stage Performer • +100 Pts' : '📝 Under Review'}
                                  </span>
                                </div>

                                <p className="text-[11px] text-purple-300 font-mono">
                                  Author: {rep.student_name} • {rep.academic_year}th Year • {rep.department}
                                </p>

                                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-[11px]">
                                  <span className="text-amber-300 font-bold font-mono block">
                                    Keynote: {rep.proposed_stage_topic || 'Engineering Persuasive Arguments in Technical Keynotes'}
                                  </span>
                                  <p className="text-slate-400 font-sans line-clamp-2">
                                    {rep.key_learnings || rep.what_watched_summary}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                                    <span>📚 Books Read</span>
                                    <span>•</span>
                                    <span>🎬 Movies</span>
                                    <span>•</span>
                                    <span>📎 Evidence Vault</span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedReportModal(rep)}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 hover:text-white text-xs font-mono transition-all cursor-pointer border border-purple-500/40 font-bold"
                                  >
                                    View Dossier 🔍
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* 2. Soft Skills Notifications Feed */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-950/70 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-widest">
                    <Bell className="w-3 h-3 text-purple-400" />
                    <span>Soft Skills Notifications</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    Peer Exchanges, Credits & Live Stage Alerts
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Live stage qualifiers, mentor video drops, debate sprint bookings, and credit deposits.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200">
                    🎤 Soft Skills Feed ({softSkillsNotifs.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSoftSkillsNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
                    }}
                    className="text-[11px] font-mono text-purple-300 hover:text-white transition-colors cursor-pointer border border-purple-500/20 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    Mark section read
                  </button>
                </div>
              </div>

              {/* Feed Items */}
              <div className="space-y-3">
                {softSkillsNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-2.5 ${
                      notif.read
                        ? 'bg-slate-900/40 border-white/5 opacity-80'
                        : 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          🎤 {notif.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{notif.time}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {notif.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (notif.tabTarget) {
                            setActiveTab(notif.tabTarget as any)
                          } else if (notif.calendarDay) {
                            setSelectedCalendarDay(notif.calendarDay)
                            document.getElementById('event-calendar-section')?.scrollIntoView({ behavior: 'smooth' })
                          } else if (notif.badgeTabTarget) {
                            setBadgeTab(notif.badgeTabTarget as any)
                            document.getElementById('achievements-ladder-section')?.scrollIntoView({ behavior: 'smooth' })
                          } else if (notif.openDossier) {
                            const targetRep = reports.find((r) => r.status === 'SELECTED_FOR_STAGE' || r.is_public) || reports[0]
                            if (targetRep) setSelectedReportModal(targetRep)
                          }
                        }}
                        className="text-xs font-mono font-bold text-purple-300 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>{notif.actionLabel}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Arena Schedule & Sprint Timeline */}
            <div id="event-calendar-section" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-widest">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Arena Schedule & Sprint Timeline</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">Soft Skills Event Calendar</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Registered competition dates, live sprint rounds, and demo deadlines are highlighted on your calendar.
                </p>
              </div>

              {/* August 2026 Calendar Grid */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-heading">August 2026</span>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                      <span>🟣 Registered Sprint Round</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                      <span>⚡ Live Challenge Day</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      <span>🏆 Demo & Finale</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="py-1 text-[11px] font-bold text-slate-400 uppercase">
                      {d}
                    </div>
                  ))}

                  {/* Empty padding for August 2026 (Starts on Saturday) */}
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 opacity-20"></div>

                  {/* Days 1 to 31 */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isR1 = day === 15
                    const isR2 = day === 20
                    const isR3 = day === 28
                    const isBooked = isR1 || isR2 || isR3
                    const isSelected = selectedCalendarDay === day

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedCalendarDay(day)}
                        className={`p-2 rounded-xl border transition-all text-left min-h-[54px] flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-purple-400 bg-purple-950/40 border-purple-400 shadow-lg'
                            : isBooked
                            ? 'bg-amber-500/15 border-amber-500/50 hover:bg-amber-500/25'
                            : 'bg-slate-950/60 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isBooked ? 'text-amber-300' : 'text-slate-300'}`}>
                          {day}
                        </span>
                        {isR1 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono self-start">
                            ⚡ R1 Live
                          </span>
                        )}
                        {isR2 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono self-start">
                            ⚡ R2 Live
                          </span>
                        )}
                        {isR3 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono self-start">
                            ⚡ R3 Live
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Active Registered Sprint Card based on selected day */}
              {selectedCalendarDay === 15 && (
                <div className="p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-purple-950/30 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wide">
                        ROUND MARKED & REGISTERED (August 15, 2026)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                        +150 Pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-white font-heading">
                      Algorithmic Sprint 2026
                    </h4>
                    <p className="text-xs font-bold text-amber-300 font-mono">
                      Round 1 · Live Concurrency Sprint
                    </p>
                    <p className="text-xs text-slate-300 font-sans">
                      High-throughput stream processing, memory-bounded graph partitioning, and live stress testing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Sprint Window:</span>
                      <span className="text-white font-bold">02:00 PM – 04:30 PM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Assigned Squad:</span>
                      <span className="text-purple-300 font-bold">Team #1 — Algorithmic Titans</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Role in Squad:</span>
                      <span className="text-emerald-400 font-bold">Lead Algorithmic Architect (Slot #1)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('competitions')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Enter Live Code Workspace →</span>
                  </button>
                </div>
              )}

              {selectedCalendarDay === 20 && (
                <div className="p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wide">
                        ROUND MARKED & REGISTERED (August 20, 2026)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                        +80 Pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-white font-heading">
                      Winter SpeedCode Championship II
                    </h4>
                    <p className="text-xs font-bold text-cyan-300 font-mono">
                      Round 2 · High-Velocity Syntax & Algorithmic Optimization
                    </p>
                    <p className="text-xs text-slate-300 font-sans">
                      Individual solo challenge focused on sub-millisecond execution and memory cache optimization.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Sprint Window:</span>
                      <span className="text-white font-bold">10:00 AM – 12:00 PM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Assigned Arena:</span>
                      <span className="text-purple-300 font-bold">Solo Challenger Lane #4</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Role in Squad:</span>
                      <span className="text-cyan-400 font-bold">Speed Optimizer</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('competitions')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Enter Live Code Workspace →</span>
                  </button>
                </div>
              )}

              {selectedCalendarDay === 28 && (
                <div className="p-6 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/30 via-slate-900 to-pink-950/30 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wide">
                        ROUND MARKED & REGISTERED (August 28, 2026)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold">
                        +120 Pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-white font-heading">
                      Skill League — Mystery Challenge #001
                    </h4>
                    <p className="text-xs font-bold text-pink-300 font-mono">
                      Round 3 · Live Stage Debate & Technical Rhetoric Finals
                    </p>
                    <p className="text-xs text-slate-300 font-sans">
                      Elite collegiate mystery soft skills competition with live stage pitch qualifiers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Sprint Window:</span>
                      <span className="text-white font-bold">03:00 PM – 05:30 PM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Assigned Squad:</span>
                      <span className="text-purple-300 font-bold">Team #2 — Titan Debaters</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Role in Squad:</span>
                      <span className="text-pink-400 font-bold">Lead Keynote Speaker</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('competitions')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Enter Live Code Workspace →</span>
                  </button>
                </div>
              )}

              {![15, 20, 28].includes(selectedCalendarDay) && (
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 text-center space-y-3">
                  <p className="text-xs font-mono text-slate-400">
                    No active competition scheduled for <strong>August {selectedCalendarDay}, 2026</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('competitions')}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all cursor-pointer inline-flex items-center space-x-2"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Browse Competitions to Book 🚀</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Soft Skills Achievement Ladder */}
            <div id="achievements-ladder-section" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-widest mb-1.5">
                    <Trophy className="w-3 h-3 text-purple-400" />
                    <span>Soft Skills Achievement Ladder</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-heading">All Achievement Badges</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    32 Badges • Badges unlock progressively for speaking milestones, impromptu challenges, debate victories, and communication leadership. Tap any badge for details!
                  </p>
                </div>

                {/* Badges KPI summary */}
                <div className="flex items-center space-x-4 font-mono">
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-emerald-400 block">2</span>
                    <span className="text-[10px] text-slate-400 uppercase">Earned</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-slate-400 block">30</span>
                    <span className="text-[10px] text-slate-400 uppercase">Locked</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-purple-400 block">6%</span>
                    <span className="text-[10px] text-slate-400 uppercase">Unlocked</span>
                  </div>
                </div>
              </div>

              {/* Badges Filter Tabs */}
              <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-white/10 w-fit text-xs font-mono">
                <button
                  onClick={() => setBadgeTab('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    badgeTab === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Badges (32)
                </button>
                <button
                  onClick={() => setBadgeTab('grandmaster')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    badgeTab === 'grandmaster' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Grand Master Prestige (12)
                </button>
                <button
                  onClick={() => setBadgeTab('milestones')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    badgeTab === 'milestones' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Soft Skills Milestones (20)
                </button>
              </div>

              {/* Grand Master Prestige Badges Grid */}
              {(badgeTab === 'all' || badgeTab === 'grandmaster') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">
                        Grand Master Prestige Badges (12)
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Tiers: Bronze • Silver • Gold • Diamond • High-Stakes Arena Breakthroughs (Tap to inspect)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2.5">
                    {grandMasterBadges.map((badge) => (
                      <div
                        key={badge.id}
                        onClick={() => setSelectedBadgeDetail(badge)}
                        title={badge.name}
                        className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transform hover:scale-110 active:scale-95 ${
                          badge.unlocked
                            ? 'bg-gradient-to-b from-purple-900/50 via-slate-900 to-slate-950 border-purple-500/50 shadow-lg shadow-purple-500/20 hover:border-purple-300 ring-1 ring-purple-500/30'
                            : 'bg-slate-950/60 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                        }`}
                      >
                        <div className="text-3xl filter drop-shadow-md py-1">{badge.icon}</div>
                        <div className="flex items-center justify-center">
                          {badge.unlocked ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              {badge.count}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">🔒</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills Milestones Grid */}
              {(badgeTab === 'all' || badgeTab === 'milestones') && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">
                        Soft Skills Milestones (Levels 1 to 20)
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Levels 1 to 20 • Progressive Eloquence, Impromptu Speech, Debate & Leadership Ladder (Tap any icon to inspect)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
                    {milestoneBadges.map((m) => {
                      const isUnlocked = m.status === 'UNLOCKED'
                      return (
                        <div
                          key={m.level}
                          onClick={() => setSelectedBadgeDetail(m)}
                          title={`#${m.level} ${m.name}`}
                          className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transform hover:scale-110 active:scale-95 ${
                            isUnlocked
                              ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-500/20 hover:border-emerald-300 ring-1 ring-emerald-500/30'
                              : 'bg-slate-950/60 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                          }`}
                        >
                          <div className="text-3xl filter drop-shadow-md py-1">{m.icon}</div>
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400">
                              #{m.level}
                            </span>
                            {isUnlocked ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400"></span>
                            ) : (
                              <span className="text-[9px] text-slate-500">🔒</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Badge Detail Inspection Modal */}
            {selectedBadgeDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="glass-panel w-full max-w-sm p-6 sm:p-7 rounded-3xl border border-purple-500/50 bg-slate-950 shadow-2xl space-y-5 text-center relative">
                  <button
                    onClick={() => setSelectedBadgeDetail(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    ✕
                  </button>

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600/30 to-amber-500/30 border border-purple-500/40 flex items-center justify-center text-4xl mx-auto shadow-xl">
                    {selectedBadgeDetail.icon}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                      {selectedBadgeDetail.level ? `Level #${selectedBadgeDetail.level} Milestone` : `${selectedBadgeDetail.tier} Prestige`}
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-heading">
                      {selectedBadgeDetail.name}
                    </h3>
                    <p className="text-xs text-purple-300 font-mono">
                      Category: {selectedBadgeDetail.category || 'Soft Skills Mastery'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs text-left">
                    <span className="text-slate-400 text-[10px] font-mono uppercase block">Requirement / Criteria:</span>
                    <p className="text-white font-medium leading-relaxed">
                      {selectedBadgeDetail.desc || selectedBadgeDetail.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono">
                    <span className="text-slate-300">Reward Bonus:</span>
                    <span className="text-amber-300 font-bold">{selectedBadgeDetail.reward || '+50 Credits'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBadgeDetail(null)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all cursor-pointer"
                  >
                    Close Badge Dossier
                  </button>
                </div>
              </div>
            )}

            {/* Profile Edit Modal */}
            {isEditingProfileModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white font-heading">Edit Profile Info</h3>
                    <button
                      onClick={() => setIsEditingProfileModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setJudgeCoderProfile((prev) => ({
                        ...prev,
                        name: editProfileForm.name || prev.name,
                        branchYear: editProfileForm.branchYear || prev.branchYear,
                        bio: editProfileForm.bio || prev.bio,
                      }))
                      setIsEditingProfileModal(false)
                      setActionMessage({ type: 'success', text: 'Profile info updated successfully!' })
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
                      <input
                        type="text"
                        value={editProfileForm.name}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Branch & Year</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science & Engineering • 3rd Year"
                        value={editProfileForm.branchYear}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, branchYear: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Bio / Specialization</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. AI Architect & High-Throughput Stream Processing Specialist."
                        value={editProfileForm.bio}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfileModal(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: LEADERBOARD                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header & Coder Profile */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-950 to-purple-950/20 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>Live Competitive Standings</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Leaderboard
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-sm font-bold text-purple-300 font-mono">
                      Coder Profile — {currentUser?.name || 'Demo L'}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">
                      • Live competitive rankings, sprint scores, code test coverage, and benchmark stats.
                    </span>
                  </div>
                </div>

                <button
                  onClick={fetchLeaderboard}
                  disabled={loadingLeaderboard}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${loadingLeaderboard ? 'animate-spin' : ''}`} />
                  <span>{loadingLeaderboard ? 'Updating...' : 'Refresh Standings 🔄'}</span>
                </button>
              </div>
            </div>

            {/* Profile 6 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Card 1: Arena Rank */}
              <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">Arena Rank</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">
                  {leaderboardData?.profile?.arena_rank || '#1'}
                </p>
                <span className="text-[10px] text-amber-200/80 font-mono block">Top 1% Collegiate</span>
              </div>

              {/* Card 2: Sprint Score */}
              <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">Sprint Score</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-200 font-heading">
                  {leaderboardData?.profile?.sprint_score || '193 Pts'}
                </p>
                <span className="text-[10px] text-purple-300/80 font-mono block">Dynamic Sprint Metric</span>
              </div>

              {/* Card 3: Test Suite Coverage */}
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold block">Test Suite Coverage</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-200 font-heading">
                  {leaderboardData?.profile?.test_suite_coverage || '98.4%'}
                </p>
                <span className="text-[10px] text-cyan-300/80 font-mono block">
                  {leaderboardData?.profile?.test_assertions_detail || '24/25 test assertions pass'}
                </span>
              </div>

              {/* Card 4: Avg Execution Time */}
              <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block">Avg Execution Time</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-200 font-heading">
                  {leaderboardData?.profile?.avg_execution_time || '1.2ms'}
                </p>
                <span className="text-[10px] text-emerald-300/80 font-mono block">
                  {leaderboardData?.profile?.execution_benchmark || 'Benchmarked on O(N log N)'}
                </span>
              </div>

              {/* Card 5: Bugs Found / Solved */}
              <div className="glass-panel p-4 rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-950/30 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-pink-300 font-bold block">Bugs Found / Solved</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-pink-200 font-heading">
                  {leaderboardData?.profile?.bugs_solved || '12 / 12'}
                </p>
                <span className="text-[10px] text-pink-300/80 font-mono block">
                  {leaderboardData?.profile?.bug_hunter_badge || 'Bug Hunter Specialist'}
                </span>
              </div>

              {/* Card 6: Domain Credits Earned */}
              <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-slate-900 shadow-lg space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">Domain Credits Earned</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">
                  {leaderboardData?.profile?.domain_credits_earned || '+193 Pts'}
                </p>
                <span className="text-[10px] text-amber-200/80 font-mono block">
                  {leaderboardData?.profile?.rank_bonus_label || 'Rank #1 Leaderboard Bonus'}
                </span>
              </div>
            </div>

            {/* Dynamic Credits Breakdown Rule Banner */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-purple-300 font-bold block">💎 How Credits & Sprint Points Are Computed:</span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Leaderboard points reflect aggregate performance from <strong>Competitions Attended/Won (+80 to +150 Credits)</strong> and <strong>Learn Quest Weekly Reflection Reports (+100 Credits)</strong>.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-[11px]">
                  🏆 {leaderboardData?.profile?.competitions_credit_contrib || '+80 Pts (Comps)'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-200 text-[11px]">
                  🎬 {leaderboardData?.profile?.video_learning_credit_contrib || '+100 Pts (Learn Quest)'}
                </span>
              </div>
            </div>

            {/* Sprint Standings Table */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Sprint Standings</h3>
                  <p className="text-xs text-slate-400 font-sans">Live competitive rankings across student coders</p>
                </div>
                <button
                  onClick={fetchLeaderboard}
                  disabled={loadingLeaderboard}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer self-start sm:self-auto"
                >
                  Refresh Standings 🔄
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Student Coder</th>
                      <th className="py-3 px-4">Department & USN</th>
                      <th className="py-3 px-4">Test Accuracy</th>
                      <th className="py-3 px-4">Execution Time</th>
                      <th className="py-3 px-4 text-right">Sprint Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(leaderboardData?.standings || [
                      { rank: 1, student_name: 'Alex Johnson', department_usn: 'CSE(1MS21CS001)', test_accuracy: '96%', execution_time: '1.4ms', sprint_points: '1350 Pts' },
                      { rank: 2, student_name: 'Student Participant', department_usn: 'CSE(1RV23CS001)', test_accuracy: '96%', execution_time: '1.4ms', sprint_points: '1100 Pts' },
                      { rank: 3, student_name: 'Prior Smith', department_usn: 'CSE(1MS21CS002)', test_accuracy: '96%', execution_time: '1.4ms', sprint_points: '850 Pts' },
                      { rank: 4, student_name: 'Student Participant', department_usn: 'CSE(1RV23IS089)', test_accuracy: '96%', execution_time: '1.4ms', sprint_points: '600 Pts' },
                    ]).map((coder: any) => {
                      const isTopRank = coder.rank === 1
                      const isSecond = coder.rank === 2
                      const isThird = coder.rank === 3

                      return (
                        <tr
                          key={coder.rank}
                          className={`hover:bg-white/5 transition-colors ${
                            isTopRank ? 'bg-amber-500/10' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                                isTopRank
                                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                                  : isSecond
                                  ? 'bg-slate-300 text-slate-950 font-bold'
                                  : isThird
                                  ? 'bg-amber-700 text-white font-bold'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              #{coder.rank}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-white">
                            <div className="flex items-center space-x-2">
                              <span>{coder.student_name}</span>
                              {coder.alias && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                                  {coder.alias}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-purple-300">{coder.department_usn}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">{coder.test_accuracy}</td>
                          <td className="py-3.5 px-4 text-cyan-300">{coder.execution_time}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-amber-300 font-extrabold">
                              {coder.sprint_points}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: REGISTRATION MODAL                                               */}
        {/* ========================================================================= */}
        {registerModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setRegisterModalEvent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Registration Portal</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Register: {registerModalEvent.public_event_name}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Complete registration to secure your spot. Reward: <strong className="text-amber-300">+{registerModalEvent.credits_reward || 80} Credits</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-purple-300 font-bold block">Auto-Fill from Skill Barter</span>
                  <span className="text-slate-400 text-[11px]">Sync name, USN, and department in 1 click</span>
                </div>
                <button
                  type="button"
                  onClick={handleExtractFromSkillBarter}
                  disabled={isExtractingProfile}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isExtractingProfile ? 'Syncing...' : 'Auto Fill'}</span>
                </button>
              </div>

              <form onSubmit={handleModalRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={regForm.student_name}
                    onChange={(e) => setRegForm({ ...regForm, student_name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">University USN / ID</label>
                  <input
                    type="text"
                    required
                    value={regForm.usn}
                    onChange={(e) => setRegForm({ ...regForm, usn: e.target.value })}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Academic Year</label>
                    <select
                      value={regForm.year}
                      onChange={(e) => setRegForm({ ...regForm, year: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                    >
                      <option value={1}>1st Year (Freshman)</option>
                      <option value={2}>2nd Year (Sophomore)</option>
                      <option value={3}>3rd Year (Junior)</option>
                      <option value={4}>4th Year (Senior)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Department</label>
                    <input
                      type="text"
                      required
                      value={regForm.branch}
                      onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">College Email</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-xs font-mono shadow-lg cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Confirm Official Registration 🚀</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: RETROSPECTIVE & REVIEWS MODAL                                    */}
        {/* ========================================================================= */}
        {selectedRetrospective && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-slate-950 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setSelectedRetrospective(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Completed Sprint</span>
                  </span>
                  <span className="text-xs font-mono text-amber-400 flex items-center space-x-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedRetrospective.rating} / 5.0 Rating</span>
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-heading">{selectedRetrospective.title}</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Conducted on {selectedRetrospective.conductedDate} • {selectedRetrospective.theme}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <span className="text-slate-400 uppercase font-mono text-[10px] font-bold block">Sprint Overview</span>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedRetrospective.overview}</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase font-mono flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{selectedRetrospective.winningSquad.rank}</span>
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-extrabold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                    +{selectedRetrospective.winningSquad.creditsAwarded} Credits Awarded
                  </span>
                </div>

                <p className="text-white font-bold text-base font-heading">{selectedRetrospective.winningSquad.teamName}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {selectedRetrospective.winningSquad.members?.map((m: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs flex justify-between items-center">
                      <span className="text-slate-100 font-semibold">{m.name}</span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">{m.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRetrospective.softSkillImprovementData && (
                <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase font-mono flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span>Soft Skill Improvement & Telemetry Data</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">AI Analyzed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRetrospective.softSkillImprovementData.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{item.skill}</span>
                          <span className="font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                            {item.growth} ({item.score})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{item.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Participant Feedback & Reviews</h4>
                <div className="space-y-3">
                  {selectedRetrospective.participantReviews?.map((rev: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">
                          {rev.author} <span className="text-xs font-normal text-slate-400">({rev.cohort})</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          ★ {rev.rating}
                        </span>
                      </div>
                      <p className="text-slate-300 italic text-xs leading-relaxed">&ldquo;{rev.quote}&rdquo;</p>
                      <span className="text-xs text-purple-300 font-mono block font-medium">✨ {rev.highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: MY PEERS TEAM ALLOCATION MODAL                                   */}
        {/* ========================================================================= */}
        {teamModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setTeamModalEvent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>Visual Architects Squad Allocation</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">My Peers — {teamModalEvent.public_event_name}</h3>
                <p className="text-xs text-slate-400 font-sans">Teams are formed and balanced across academic cohorts by Visual Architects.</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-heading">Assigned Squad</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    CONFIRMED SQUAD
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                    <span className="text-slate-200">{currentUser?.name || regForm.student_name || 'Alex Johnson'} (You)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Year {regForm.year || 1}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                    <span className="text-slate-200">Rahul Sharma</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Year 4 · Lead</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                    <span className="text-slate-200">Meera K</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Year 3 · Logic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: FULL PUBLIC REPORT VIEWER & EVIDENCE VAULT                       */}
        {/* ========================================================================= */}
        {selectedReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-slate-950 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setSelectedReportModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    🏆 Official Public Showcase Report
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    +{selectedReportModal.credits_awarded} Credits Awarded
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-heading">{selectedReportModal.report_title}</h3>
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="text-purple-200 font-bold">Author: {selectedReportModal.student_name}</span>
                  {selectedReportModal.usn && (
                    <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40 text-[10px]">
                      USN: {selectedReportModal.usn}
                    </span>
                  )}
                  <span className="text-slate-300">• {selectedReportModal.academic_year}rd Year</span>
                  <span className="text-amber-300 font-semibold">• {selectedReportModal.department}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                <span className="text-purple-300 uppercase font-mono text-[10px] font-bold block">1. What Was Watched & Core Thesis</span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedReportModal.what_watched_summary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                <span className="text-purple-300 uppercase font-mono text-[10px] font-bold block">2. Deep Insights & Psychological Mental Models</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed font-sans">{selectedReportModal.key_learnings}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                <span className="text-purple-300 uppercase font-mono text-[10px] font-bold block">3. Communication & Rhetoric Observations</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed font-sans">{selectedReportModal.communication_techniques}</p>
              </div>

              {selectedReportModal.external_references && (
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 text-xs">
                  <span className="text-purple-300 uppercase font-mono text-[10px] font-bold block flex items-center space-x-1.5">
                    <Book className="w-3.5 h-3.5 text-purple-400" />
                    <span>4. Books Read & Movies Watched Relating to This Concept</span>
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed font-sans">{selectedReportModal.external_references}</p>
                </div>
              )}

              {selectedReportModal.why_selected_rationale && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 text-xs">
                  <span className="text-indigo-300 uppercase font-mono text-[10px] font-bold block flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>5. Why Selected / What Makes This Perspective Special</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed font-sans">{selectedReportModal.why_selected_rationale}</p>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs">
                <span className="text-amber-300 uppercase font-mono text-[10px] font-bold block flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Selected Live Stage Keynote Topic</span>
                </span>
                <p className="text-white font-bold text-sm font-sans">{selectedReportModal.proposed_stage_topic}</p>
                <p className="text-slate-300 font-mono text-[11px]">Scheduled Date: {selectedReportModal.stage_performance_date}</p>
              </div>

              {/* Evidence Vault / Attachments */}
              {selectedReportModal.attachments && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                  <span className="text-cyan-300 uppercase font-mono text-[10px] font-bold block flex items-center space-x-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Evidence & Uploaded Media Vault</span>
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(() => {
                      let attList: any[] = []
                      try {
                        attList = typeof selectedReportModal.attachments === 'string'
                          ? JSON.parse(selectedReportModal.attachments)
                          : selectedReportModal.attachments
                      } catch (e) {}

                      return attList.map((att: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs font-mono text-purple-200"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
