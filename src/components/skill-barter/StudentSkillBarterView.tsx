'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, XCircle, User, BookOpen, Layers,
  GraduationCap, CheckCircle2, ShieldAlert, MessageSquare,
  Search, Award, Star, Send, ShieldCheck,
  ArrowRight, Code2, Cpu, ChevronRight, Filter,
  Zap, Lock, Users, Sparkles, Trophy, Check, Flame, Bell,
  GitPullRequest, Compass, HelpCircle, Crown,
  Paperclip, Image as ImageIcon, FileText, Video,
  Download, ExternalLink, X, Link2, FileCode, CheckCheck,
  Smile, MoreVertical, PlaySquare, Phone, Mail, MessageCircle,
  ThumbsUp, ThumbsDown, MessageSquarePlus, Film, UploadCloud,
  Play, Pause, Clock, UserCheck, UserX, Inbox
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
import { formatVideoFileSize, isValidVideoFile } from '@/lib/videoUtils';

interface SkilloraProps {
  user: any;
  onRefresh: () => void;
  initialTab?: 'requests' | 'sessions' | 'discover' | 'videos' | 'achievements' | 'profile';
}

interface BarterSession {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  skill: string;
  type: 'TEACHING' | 'LEARNING';
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING_ACCEPTANCE';
  autoDeleteOnEnd: boolean;
  unreadCount?: number;
  isOnline?: boolean;
  messages: Array<{
    id: string;
    sender: 'me' | 'them';
    text: string;
    time: string;
  }>;
}

interface PeerProfile {
  id: string;
  name: string;
  year: string;
  branch: string;
  avatar: string;
  rating: number;
  studentsHelped: number;
  canTeach: string[];
  wantsToLearn: string[];
  reputationMark: string;
}

interface VideoReview {
  id: string;
  reviewer_name: string;
  rating: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  feedback_text: string;
  created_at: string;
  credit_impact: number;
}

interface LearningVideo {
  id: string;
  student_name: string;
  google_email: string;
  phone_number: string;
  title: string;
  topic: string;
  domain: string;
  video_url: string;
  video_filename?: string;
  video_size?: string;
  thumbnail_url?: string;
  description: string;
  creator_credits: number;
  leaderboard_points: number;
  average_rating: number;
  views: number;
  created_at: string;
  reviews: VideoReview[];
}

interface VideoQueryRequest {
  id: string;
  video_id: string;
  video_title: string;
  topic: string;
  author_name: string;
  author_email: string;
  author_phone?: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  query_message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
  accepted_at?: string;
  session_id?: string;
}

const SEED_SESSIONS: BarterSession[] = [
  {
    id: 's-1',
    name: 'Rahul Sharma',
    avatar: '👨‍💻',
    lastMessage: 'Here is our Google Meet session link: https://meet.google.com/rvc-dbms-tune',
    timestamp: '10:42 AM',
    skill: 'PostgreSQL & SQL',
    type: 'LEARNING',
    status: 'ACTIVE',
    autoDeleteOnEnd: true,
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 'm-1', sender: 'them', text: 'Hey Anusha! Saw your request for database index tuning & query plans.', time: '10:30 AM' },
      { id: 'm-2', sender: 'me', text: 'Hi Rahul! Yes, need some quick pointers on EXPLAIN ANALYZE and B-Tree indexing.', time: '10:35 AM' },
      { 
        id: 'm-3', 
        sender: 'them', 
        text: `[FILE_ATTACHMENT]:${JSON.stringify({
          name: 'postgres_btree_index_architecture.png',
          type: 'image/png',
          size: '184 KB',
          dataUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
          caption: 'Here is the B-Tree index scan architecture diagram for PostgreSQL.'
        })}`, 
        time: '10:39 AM' 
      },
      { 
        id: 'm-4', 
        sender: 'them', 
        text: `[MEETING_LINK]:${JSON.stringify({
          title: 'PostgreSQL Live Index Optimization Session',
          url: 'https://meet.google.com/rvc-dbms-tune',
          platform: 'Google Meet',
          note: 'Click below to join our live video review session directly'
        })}`, 
        time: '10:42 AM' 
      },
    ],
  },
  {
    id: 's-2',
    name: 'Meera K',
    avatar: '👩‍🎨',
    lastMessage: 'I reviewed the Figma design tokens document! Looks fantastic.',
    timestamp: 'Yesterday',
    skill: 'UI/UX & Figma',
    type: 'TEACHING',
    status: 'ACTIVE',
    autoDeleteOnEnd: false,
    unreadCount: 1,
    isOnline: false,
    messages: [
      { id: 'm-5', sender: 'them', text: 'Could you walk me through responsive auto-layout and design systems in Figma?', time: 'Yesterday' },
      { 
        id: 'm-6', 
        sender: 'me', 
        text: `[FILE_ATTACHMENT]:${JSON.stringify({
          name: 'design_token_guidelines.pdf',
          type: 'application/pdf',
          size: '420 KB',
          dataUrl: '#',
          caption: 'Official Skillora Design Token & Component System PDF'
        })}`, 
        time: 'Yesterday' 
      },
      { id: 'm-7', sender: 'them', text: 'I reviewed the Figma design tokens document! Looks fantastic.', time: 'Yesterday' },
    ],
  },
  {
    id: 's-3',
    name: 'Sanjay V',
    avatar: '⚡',
    lastMessage: 'Session completed. Thanks for the Docker walkthrough!',
    timestamp: '24 Aug',
    skill: 'Docker & DevOps',
    type: 'TEACHING',
    status: 'COMPLETED',
    autoDeleteOnEnd: true,
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 'm-8', sender: 'them', text: 'Thanks for walking me through docker compose and multi-stage builds!', time: '24 Aug' },
      { id: 'm-9', sender: 'me', text: 'Anytime! Don\'t forget to claim your credits on the weekly report.', time: '24 Aug' },
    ],
  },
];

const DISCOVER_PEERS: PeerProfile[] = [
  { id: 'p-1', name: 'Rahul Sharma', year: '4th Year', branch: 'CSE', avatar: '👨‍💻', rating: 4.9, studentsHelped: 18, canTeach: ['PostgreSQL', 'SQL', 'FastAPI'], wantsToLearn: ['Next.js', 'Tailwind'], reputationMark: '👑' },
  { id: 'p-2', name: 'Meera K', year: '3rd Year', branch: 'AI & DS', avatar: '👩‍🎨', rating: 4.8, studentsHelped: 12, canTeach: ['Figma', 'UI/UX', 'Python'], wantsToLearn: ['Docker', 'DevOps'], reputationMark: '🌟' },
  { id: 'p-3', name: 'Sanjay V', year: '3rd Year', branch: 'ISE', avatar: '⚡', rating: 4.9, studentsHelped: 15, canTeach: ['Docker', 'Kubernetes', 'Linux'], wantsToLearn: ['React Native', 'GraphQL'], reputationMark: '💎' },
  { id: 'p-4', name: 'Priya N', year: '2nd Year', branch: 'CSE', avatar: '👩‍💻', rating: 4.7, studentsHelped: 8, canTeach: ['React.js', 'JavaScript', 'CSS'], wantsToLearn: ['Machine Learning', 'PyTorch'], reputationMark: '🏆' },
];

const SEED_PEERVAULT_VIDEOS: LearningVideo[] = [
  {
    id: 'vid-1',
    student_name: 'Rahul Sharma',
    google_email: 'rahul.sharma.cse@rvce.edu.in',
    phone_number: '+91 98450 78901',
    title: 'PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified',
    topic: 'Database Systems & Performance Tuning',
    domain: 'Database Systems',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_filename: 'postgres_indexing_breakdown.mp4',
    video_size: '14.2 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Self-recorded walkthrough evaluating PostgreSQL query plans, B-Tree indexing scans, and sequential scan elimination.',
    creator_credits: 185,
    leaderboard_points: 340,
    average_rating: 4.9,
    views: 128,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    reviews: [
      {
        id: 'rev-1',
        reviewer_name: 'Anusha A',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Super clear self-made video walkthrough! Solved my query latency issue in seconds.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        credit_impact: 15,
      },
      {
        id: 'rev-2',
        reviewer_name: 'Meera K',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Loved the live terminal demo of heap pointers and buffer caches. Deserves top spot on the leaderboard!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        credit_impact: 15,
      },
    ],
  },
  {
    id: 'vid-2',
    student_name: 'Meera K',
    google_email: 'meera.k.aiml@rvce.edu.in',
    phone_number: '+91 98450 65432',
    title: 'Next.js 14 App Router, Server Actions & Streaming SSR',
    topic: 'Modern Full-Stack React Architecture',
    domain: 'Web Development',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_filename: 'nextjs14_app_router_demo.mp4',
    video_size: '18.6 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description: 'Recorded code session showing production Next.js 14 nested layouts, zero-API Server Actions, Suspense streaming, and optimistic mutations.',
    creator_credits: 160,
    leaderboard_points: 295,
    average_rating: 4.8,
    views: 94,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    reviews: [
      {
        id: 'rev-3',
        reviewer_name: 'Sanjay V',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Awesome live coding recording on parallel routes and streaming SSR components. Great job!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        credit_impact: 15,
      },
    ],
  },
  {
    id: 'vid-3',
    student_name: 'Sanjay V',
    google_email: 'sanjay.v.aids@rvce.edu.in',
    phone_number: '+91 98450 32109',
    title: 'Docker Multi-Stage Builds & Kubernetes Pod Orchestration',
    topic: 'Containerization & Microservices DevOps',
    domain: 'Cloud DevOps',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    video_filename: 'docker_multistage_microservices.mp4',
    video_size: '12.8 MB',
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
    description: 'Direct recording demonstrating how to shrink Docker image sizes using Alpine multi-stage builds and configure local Minikube cluster pods.',
    creator_credits: 140,
    leaderboard_points: 260,
    average_rating: 4.9,
    views: 82,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reviews: [
      {
        id: 'rev-4',
        reviewer_name: 'Rahul Sharma',
        rating: 5,
        sentiment: 'POSITIVE',
        feedback_text: 'Shrunk our container image from 1.2GB down to 68MB. Phenomenal video guide!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        credit_impact: 15,
      },
    ],
  },
];

const SEED_VIDEO_QUERIES: VideoQueryRequest[] = [
  {
    id: 'vq-1',
    video_id: 'vid-1',
    video_title: 'PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified',
    topic: 'Database Systems & Performance Tuning',
    author_name: 'Rahul Sharma',
    author_email: 'rahul.sharma.cse@rvce.edu.in',
    author_phone: '+91 98450 78901',
    requester_name: 'Anusha A',
    requester_email: 'anusha.student@rvce.edu.in',
    requester_phone: '+91 98450 99887',
    query_message: 'Watched your video on B-Tree index scan. Wanted to resolve queries on composite index ordering vs filter selectivity.',
    status: 'ACCEPTED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    accepted_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    session_id: 's-1',
  },
  {
    id: 'vq-2',
    video_id: 'vid-2',
    video_title: 'Next.js 14 App Router, Server Actions & Streaming SSR',
    topic: 'Modern Full-Stack React Architecture',
    author_name: 'Meera K',
    author_email: 'meera.k.aiml@rvce.edu.in',
    author_phone: '+91 98450 65432',
    requester_name: 'demo L',
    requester_email: 'demo.student@rvce.edu.in',
    requester_phone: '+91 98450 12345',
    query_message: 'Hi Meera! I watched your PeerVault video on Next.js 14. I have queries regarding server action revalidation with optimistic UI.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const DOMAIN_CHIP: Record<string, string> = {
  'Web Development': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Artificial Intelligence & ML': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Cloud DevOps': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Database Systems': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

type ActiveTab = 'requests' | 'sessions' | 'discover' | 'videos' | 'achievements';

export default function StudentSkillBarterView({ user, onRefresh, initialTab = 'requests' }: SkilloraProps) {
  const isParticipant = user?.role === 'STUDENT' || user?.role === 'FOUNDER';

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    initialTab === 'profile' ? 'requests' : (initialTab as ActiveTab)
  );

  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };

  const navItems = [
    { id: 'requests' as const, label: 'Peer Requests', icon: BookOpen },
    { id: 'sessions' as const, label: 'My Sessions', icon: MessageSquare },
    { id: 'discover' as const, label: 'Discover Peers', icon: Search },
    { id: 'videos' as const, label: 'PeerVault', icon: Film },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  /* ------------------------------------------------------------------ */
  /* State: Requests & Video Query Requests                             */
  /* ------------------------------------------------------------------ */
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [skill, setSkill] = useState('');
  const [domain, setDomain] = useState('Web Development');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [respondingLoading, setRespondingLoading] = useState(false);

  // Video Query Requests State
  const [videoQueryRequests, setVideoQueryRequests] = useState<VideoQueryRequest[]>(SEED_VIDEO_QUERIES);
  const [requestsSubFilter, setRequestsSubFilter] = useState<'ALL' | 'GENERAL' | 'VIDEO_QUERIES'>('ALL');
  const [acceptingQueryId, setAcceptingQueryId] = useState<string | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(null), 5000);
  };

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await fetch('/api/skill-barter/requests');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load requests');
      setRequests(data.requests || []);
    } catch (e: any) {
      console.error('Requests fetch error:', e.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchVideoQueries = async () => {
    try {
      const res = await fetch('/api/skill-barter/video-queries');
      const data = await res.json();
      if (res.ok && data.queries && data.queries.length > 0) {
        setVideoQueryRequests(data.queries);
      }
    } catch {
      // Keep static seed queries
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingRequest(true);
      const res = await fetch('/api/skill-barter/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, domain, message, urgency }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create request');
      showFeedback('Your peer session request has been published!');
      setIsCreateModalOpen(false);
      setSkill('');
      setMessage('');
      fetchRequests();
      onRefresh();
    } catch (e: any) {
      showFeedback(e.message, 'error');
    } finally {
      setCreatingRequest(false);
    }
  };

  const handleSendResponse = async (requestId: string) => {
    if (!responseMessage.trim()) return;
    try {
      setRespondingLoading(true);
      const res = await fetch(`/api/skill-barter/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: responseMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to offer mentorship');
      showFeedback('Mentorship offer sent! The student will be notified.');
      setRespondingRequestId(null);
      setResponseMessage('');
      fetchRequests();
    } catch (e: any) {
      showFeedback(e.message, 'error');
    } finally {
      setRespondingLoading(false);
    }
  };

  // Author Accept Video Query Request -> Unlocks Communication & Creates Active Chat Session
  const handleAcceptVideoQuery = async (query: VideoQueryRequest) => {
    try {
      setAcceptingQueryId(query.id);
      const res = await fetch(`/api/skill-barter/video-queries/${query.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT' }),
      });
      const data = await res.json();

      const newSessionId = data.session_id || `s-${Date.now()}`;

      // Update query status
      setVideoQueryRequests((prev) => prev.map((q) => q.id === query.id ? { ...q, status: 'ACCEPTED', session_id: newSessionId } : q));

      // Create / Unlock 1:1 Active Chat Session
      const newSession: BarterSession = {
        id: newSessionId,
        name: query.requester_name,
        avatar: '👩‍💻',
        lastMessage: `Accepted request for "${query.video_title}". Communication unlocked!`,
        timestamp: 'Just now',
        skill: query.topic,
        type: 'TEACHING',
        status: 'ACTIVE',
        autoDeleteOnEnd: true,
        unreadCount: 0,
        isOnline: true,
        messages: [
          {
            id: `m-${Date.now()}-1`,
            sender: 'them',
            text: `Hi! ${query.query_message}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: `m-${Date.now()}-2`,
            sender: 'me',
            text: `Hi ${query.requester_name}! I accepted your query request for "${query.video_title}". Happy to help explain!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      setActiveTab('sessions');
      showFeedback(`✓ Accepted query request from ${query.requester_name}! Communication unlocked in My Sessions.`);
    } catch (e: any) {
      showFeedback(e.message || 'Failed to accept query request', 'error');
    } finally {
      setAcceptingQueryId(null);
    }
  };

  const handleDeclineVideoQuery = (queryId: string) => {
    setVideoQueryRequests((prev) => prev.map((q) => q.id === queryId ? { ...q, status: 'DECLINED' } : q));
    showFeedback('✓ Video query request declined.');
  };

  /* ------------------------------------------------------------------ */
  /* State: Sessions & WhatsApp-style Chat (NO Voice/Video Call / Mic)  */
  /* ------------------------------------------------------------------ */
  const [sessions, setSessions] = useState<any[]>(SEED_SESSIONS);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>('s-1');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [completingSession, setCompletingSession] = useState(false);

  const [sidebarFilter, setSidebarFilter] = useState<'ALL' | 'UNREAD' | 'TEACHING' | 'LEARNING'>('ALL');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachment, setPendingAttachment] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingPlatform, setMeetingPlatform] = useState<'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Custom'>('Google Meet');
  const [customMeetingUrl, setCustomMeetingUrl] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState<{ name: string; url: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const res = await fetch('/api/skill-barter/chats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load sessions');
      if (data.chats && data.chats.length > 0) {
        setSessions(data.chats);
        if (!activeSessionId) {
          setActiveSessionId(data.chats[0].id);
        }
      }
    } catch (e: any) {
      console.warn('Sessions fallback to local seed data:', e.message);
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
      console.warn('Chat messages fallback to active session messages:', e.message);
      if (activeSession?.messages) {
        setChatMessages(activeSession.messages);
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setPendingAttachment({
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream',
        dataUrl,
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!chatInput.trim() && !pendingAttachment) || !activeSession) return;

    // Check if session is pending author acceptance
    if (activeSession.status === 'PENDING_ACCEPTANCE') {
      showFeedback('Communication is locked until the video author accepts your request.', 'error');
      return;
    }

    let payloadText = chatInput.trim();

    if (pendingAttachment) {
      payloadText = `[FILE_ATTACHMENT]:${JSON.stringify({
        name: pendingAttachment.name,
        size: pendingAttachment.size,
        type: pendingAttachment.type,
        dataUrl: pendingAttachment.dataUrl,
        caption: chatInput.trim(),
      })}`;
    }

    try {
      setSendingMsg(true);
      const res = await fetch(`/api/skill-barter/chats/${activeSession.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payloadText }),
      });
      const data = await res.json();
      if (!res.ok) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: 'me' as const,
          text: payloadText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSessions((prev) => prev.map((s) => s.id === activeSession.id ? {
          ...s,
          lastMessage: pendingAttachment ? `📎 ${pendingAttachment.name}` : chatInput.trim(),
          messages: [...(s.messages || []), newMsg],
        } : s));
        setChatMessages((prev) => [...prev, newMsg]);
      } else {
        fetchChatMessages(activeSession.id);
      }
      setChatInput('');
      setPendingAttachment(null);
      setShowEmojiPicker(false);
    } catch (e: any) {
      console.warn('Send message fallback to local session:', e.message);
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'me' as const,
        text: payloadText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSessions((prev) => prev.map((s) => s.id === activeSession.id ? {
        ...s,
        lastMessage: pendingAttachment ? `📎 ${pendingAttachment.name}` : chatInput.trim(),
        messages: [...(s.messages || []), newMsg],
      } : s));
      setChatMessages((prev) => [...prev, newMsg]);
      setChatInput('');
      setPendingAttachment(null);
      setShowEmojiPicker(false);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSendMeetingLink = async (customUrl?: string, platform = 'Google Meet') => {
    if (!activeSession) return;
    if (activeSession.status === 'PENDING_ACCEPTANCE') {
      showFeedback('Communication is locked until the video author accepts your request.', 'error');
      return;
    }

    const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const url = customUrl?.trim() || (
      platform === 'Google Meet'
        ? `https://meet.google.com/${randomCode}`
        : platform === 'Zoom'
        ? `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`
        : platform === 'Microsoft Teams'
        ? `https://teams.microsoft.com/l/meetup-join/${randomCode}`
        : 'https://meet.google.com/new'
    );

    const payloadText = `[MEETING_LINK]:${JSON.stringify({
      title: `Live 1:1 ${activeSession.skill || 'Peer'} Session`,
      url,
      platform,
      note: 'Click below to join our live video meeting directly',
    })}`;

    try {
      setSendingMsg(true);
      const res = await fetch(`/api/skill-barter/chats/${activeSession.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payloadText }),
      });
      const data = await res.json();
      if (!res.ok) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: 'me' as const,
          text: payloadText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSessions((prev) => prev.map((s) => s.id === activeSession.id ? {
          ...s,
          lastMessage: `📹 Meeting Link (${platform})`,
          messages: [...(s.messages || []), newMsg],
        } : s));
        setChatMessages((prev) => [...prev, newMsg]);
      } else {
        fetchChatMessages(activeSession.id);
      }
      setIsMeetingModalOpen(false);
      setShowAttachMenu(false);
      setCustomMeetingUrl('');
    } catch (e: any) {
      console.warn('Send meeting link fallback:', e.message);
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'me' as const,
        text: payloadText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSessions((prev) => prev.map((s) => s.id === activeSession.id ? {
        ...s,
        lastMessage: `📹 Meeting Link (${platform})`,
        messages: [...(s.messages || []), newMsg],
      } : s));
      setChatMessages((prev) => [...prev, newMsg]);
      setIsMeetingModalOpen(false);
      setShowAttachMenu(false);
      setCustomMeetingUrl('');
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
      showFeedback('✓ Session marked complete! Mentorship credits synchronized.');
      fetchSessions();
    } catch (e: any) {
      showFeedback(e.message, 'error');
    } finally {
      setCompletingSession(false);
    }
  };

  useEffect(() => {
    if (activeSession?.id) {
      fetchChatMessages(activeSession.id);
    }
  }, [activeSessionId]);

  /* ------------------------------------------------------------------ */
  /* State: PeerVault (Direct Video Upload & HTML5 Player)               */
  /* ------------------------------------------------------------------ */
  const [learningVideos, setLearningVideos] = useState<LearningVideo[]>(SEED_PEERVAULT_VIDEOS);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoDomainFilter, setVideoDomainFilter] = useState('ALL');

  // Video Upload Modal State
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [vidStudentName, setVidStudentName] = useState(user?.name || 'demo L');
  const [vidGoogleEmail, setVidGoogleEmail] = useState(user?.email || 'demo.student@rvce.edu.in');
  const [vidPhoneNumber, setVidPhoneNumber] = useState('+91 98450 12345');
  const [vidTitle, setVidTitle] = useState('');
  const [vidTopic, setVidTopic] = useState('');
  const [vidDomain, setVidDomain] = useState('Web Development');
  const [vidDescription, setVidDescription] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<{
    file: File;
    url: string;
    name: string;
    size: string;
  } | null>(null);

  // Video Feedback Modal State
  const [feedbackVideoTarget, setFeedbackVideoTarget] = useState<LearningVideo | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Send Query Request Modal State (Author must accept first before chat unlocks)
  const [queryTargetVideo, setQueryTargetVideo] = useState<LearningVideo | null>(null);
  const [queryCustomMessage, setQueryCustomMessage] = useState('');
  const [sendingQueryRequest, setSendingQueryRequest] = useState(false);

  const fetchLearningVideos = async () => {
    try {
      setVideosLoading(true);
      const res = await fetch('/api/skill-barter/videos');
      const data = await res.json();
      if (res.ok && data.videos && data.videos.length > 0) {
        setLearningVideos(data.videos);
      }
    } catch (e: any) {
      console.warn('Videos fetch error:', e.message);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidVideoFile(file.name) && !file.type.startsWith('video/')) {
      showFeedback('Please select a valid video file (.mp4, .webm, .mov, .mkv)', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadedVideoFile({
      file,
      url: objectUrl,
      name: file.name,
      size: formatVideoFileSize(file.size),
    });
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidTopic.trim() || !uploadedVideoFile) {
      showFeedback('Please provide all details and upload your recorded video file.', 'error');
      return;
    }

    try {
      setUploadingVideo(true);
      const res = await fetch('/api/skill-barter/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: vidStudentName,
          google_email: vidGoogleEmail,
          phone_number: vidPhoneNumber,
          title: vidTitle,
          topic: vidTopic,
          domain: vidDomain,
          video_url: uploadedVideoFile.url,
          video_filename: uploadedVideoFile.name,
          video_size: uploadedVideoFile.size,
          description: vidDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload video');

      showFeedback('✓ Video uploaded to PeerVault! +50 Credits & +100 Leaderboard points awarded.');
      setIsUploadVideoModalOpen(false);
      setVidTitle('');
      setVidTopic('');
      setUploadedVideoFile(null);
      setVidDescription('');
      fetchLearningVideos();
    } catch (e: any) {
      const newVid: LearningVideo = {
        id: `vid-${Date.now()}`,
        student_name: vidStudentName,
        google_email: vidGoogleEmail,
        phone_number: vidPhoneNumber,
        title: vidTitle,
        topic: vidTopic,
        domain: vidDomain,
        video_url: uploadedVideoFile?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        video_filename: uploadedVideoFile?.name || 'peer_walkthrough.mp4',
        video_size: uploadedVideoFile?.size || '16.4 MB',
        description: vidDescription || 'Student uploaded peer learning walkthrough.',
        creator_credits: 50,
        leaderboard_points: 100,
        average_rating: 5.0,
        views: 1,
        created_at: new Date().toISOString(),
        reviews: [],
      };
      setLearningVideos((prev) => [newVid, ...prev]);
      showFeedback('✓ Video uploaded to PeerVault! +50 Credits & +100 Leaderboard points awarded.');
      setIsUploadVideoModalOpen(false);
      setVidTitle('');
      setVidTopic('');
      setUploadedVideoFile(null);
      setVidDescription('');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackVideoTarget || !feedbackText.trim()) return;

    try {
      setSubmittingFeedback(true);
      const res = await fetch(`/api/skill-barter/videos/${feedbackVideoTarget.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: user?.name || 'Peer Reviewer',
          rating: feedbackRating,
          feedback_text: feedbackText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      const creditDelta = data.credit_impact ?? (feedbackRating >= 4 ? 15 : feedbackRating === 3 ? 5 : -10);

      setLearningVideos((prev) => prev.map((v) => {
        if (v.id === feedbackVideoTarget.id) {
          const updatedReviews = [data.review || {
            id: `rev-${Date.now()}`,
            reviewer_name: user?.name || 'Peer Reviewer',
            rating: feedbackRating,
            sentiment: feedbackRating >= 4 ? 'POSITIVE' : feedbackRating === 3 ? 'NEUTRAL' : 'CRITICAL',
            feedback_text: feedbackText.trim(),
            created_at: new Date().toISOString(),
            credit_impact: creditDelta,
          }, ...v.reviews];
          const avg = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));

          return {
            ...v,
            creator_credits: Math.max(0, v.creator_credits + creditDelta),
            leaderboard_points: Math.max(0, v.leaderboard_points + (creditDelta * 2)),
            average_rating: avg,
            reviews: updatedReviews,
          };
        }
        return v;
      }));

      showFeedback(data.message || (creditDelta > 0 ? `✓ Positive review posted! +${creditDelta} Credits awarded to the author.` : `✓ Review posted. ${creditDelta} Credits applied.`));
      setFeedbackVideoTarget(null);
      setFeedbackText('');
    } catch (e: any) {
      const creditDelta = feedbackRating >= 4 ? 15 : feedbackRating === 3 ? 5 : -10;
      setLearningVideos((prev) => prev.map((v) => {
        if (v.id === feedbackVideoTarget.id) {
          const updatedReviews = [{
            id: `rev-${Date.now()}`,
            reviewer_name: user?.name || 'Peer Reviewer',
            rating: feedbackRating,
            sentiment: (feedbackRating >= 4 ? 'POSITIVE' : feedbackRating === 3 ? 'NEUTRAL' : 'CRITICAL') as any,
            feedback_text: feedbackText.trim(),
            created_at: new Date().toISOString(),
            credit_impact: creditDelta,
          }, ...v.reviews];
          const avg = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));

          return {
            ...v,
            creator_credits: Math.max(0, v.creator_credits + creditDelta),
            leaderboard_points: Math.max(0, v.leaderboard_points + (creditDelta * 2)),
            average_rating: avg,
            reviews: updatedReviews,
          };
        }
        return v;
      }));

      showFeedback(creditDelta > 0 ? `✓ Positive review posted! +${creditDelta} Credits awarded to ${feedbackVideoTarget.student_name}.` : `✓ Review posted. ${creditDelta} Credits adjusted.`);
      setFeedbackVideoTarget(null);
      setFeedbackText('');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Open modal to send request to the video author's account
  const handleOpenQueryModal = (video: LearningVideo) => {
    setQueryTargetVideo(video);
    setQueryCustomMessage(`Hi ${video.student_name}! I watched your PeerVault video on "${video.title}". I have a few queries regarding ${video.topic} that I'd love to solve together in Skillora.`);
  };

  // Submit request directly to author's account (First accept -> then communication unlocks)
  const handleSubmitQueryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryTargetVideo || !queryCustomMessage.trim()) return;

    try {
      setSendingQueryRequest(true);
      const res = await fetch('/api/skill-barter/video-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: queryTargetVideo.id,
          video_title: queryTargetVideo.title,
          topic: queryTargetVideo.topic,
          author_name: queryTargetVideo.student_name,
          author_email: queryTargetVideo.google_email,
          author_phone: queryTargetVideo.phone_number,
          requester_name: user?.name || 'demo L',
          requester_email: user?.email || 'demo.student@rvce.edu.in',
          requester_phone: '+91 98450 12345',
          query_message: queryCustomMessage.trim(),
        }),
      });
      const data = await res.json();

      const newQuery: VideoQueryRequest = data.query || {
        id: `vq-${Date.now()}`,
        video_id: queryTargetVideo.id,
        video_title: queryTargetVideo.title,
        topic: queryTargetVideo.topic,
        author_name: queryTargetVideo.student_name,
        author_email: queryTargetVideo.google_email,
        author_phone: queryTargetVideo.phone_number,
        requester_name: user?.name || 'demo L',
        requester_email: user?.email || 'demo.student@rvce.edu.in',
        query_message: queryCustomMessage.trim(),
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };

      setVideoQueryRequests((prev) => [newQuery, ...prev]);

      // Add a session in PENDING_ACCEPTANCE state
      const pendingSession: BarterSession = {
        id: `pending-${newQuery.id}`,
        name: queryTargetVideo.student_name,
        avatar: '👨‍💻',
        lastMessage: `⏳ Request sent: "${queryTargetVideo.title}". Waiting for author acceptance...`,
        timestamp: 'Just now',
        skill: queryTargetVideo.topic,
        type: 'LEARNING',
        status: 'PENDING_ACCEPTANCE',
        autoDeleteOnEnd: true,
        unreadCount: 0,
        isOnline: false,
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'me',
            text: `[PENDING QUERY REQUEST]: ${queryCustomMessage.trim()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };

      setSessions((prev) => [pendingSession, ...prev]);
      showFeedback(`✓ Request successfully sent to ${queryTargetVideo.student_name}'s account! Once accepted, communication will unlock.`);
      setQueryTargetVideo(null);
      setQueryCustomMessage('');
    } catch (e: any) {
      showFeedback(e.message || 'Failed to send query request', 'error');
    } finally {
      setSendingQueryRequest(false);
    }
  };

  const filteredVideos = learningVideos.filter((v) => {
    const q = videoSearchQuery.toLowerCase();
    const matchesSearch =
      v.title.toLowerCase().includes(q) ||
      v.topic.toLowerCase().includes(q) ||
      v.student_name.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.domain.toLowerCase().includes(q);

    if (videoDomainFilter === 'ALL') return matchesSearch;
    return matchesSearch && v.domain.toLowerCase() === videoDomainFilter.toLowerCase();
  });

  /* ------------------------------------------------------------------ */
  /* State: Discover Peers                                              */
  /* ------------------------------------------------------------------ */
  const [discoverPeers, setDiscoverPeers] = useState<PeerProfile[]>(DISCOVER_PEERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchDiscoverPeers = async () => {
    try {
      const res = await fetch('/api/skill-barter/discover');
      const data = await res.json();
      if (res.ok && data.peers && data.peers.length > 0) {
        setDiscoverPeers(data.peers);
      }
    } catch {
      // Keep static discover list
    }
  };

  const filteredPeers = discoverPeers.filter((peer) => {
    const matchesSearch =
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.canTeach.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      peer.wantsToLearn.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'ALL') return matchesSearch;
    return (
      matchesSearch &&
      (peer.canTeach.some((s) => s.toUpperCase().includes(selectedFilter)) ||
        peer.wantsToLearn.some((s) => s.toUpperCase().includes(selectedFilter)))
    );
  });

  /* ------------------------------------------------------------------ */
  /* State: Achievements (1 Unlocked in each category & All Others Locked)*/
  /* ------------------------------------------------------------------ */
  const [achievementsData, setAchievementsData] = useState<any | null>(null);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  const [metricsForEngine, setMetricsForEngine] = useState<StudentActivityMetrics>({
    totalSessionsCompleted: 1,
    studentsHelped: 0,
    teachingSessionsCompleted: 0,
    distinctSkillsTaught: 0,
    currentRating: 4.9,
    consecutiveTeachingWeeks: 0,
  });

  const [evaluation, setEvaluation] = useState(evaluateStudentAchievements(metricsForEngine, {
    'sb-badge-1': 'Earned 12 Aug 2026',
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
          totalSessionsCompleted: data.metrics.totalSessionsCompleted || 1,
          studentsHelped: data.metrics.studentsHelped || 0,
          teachingSessionsCompleted: data.metrics.teachingSessionsCompleted || 0,
          distinctSkillsTaught: data.metrics.distinctSkillsTaught || 0,
          currentRating: data.metrics.currentRating || 4.5,
          consecutiveTeachingWeeks: data.metrics.consecutiveTeachingWeeks || 0,
        };
        setMetricsForEngine(newMetrics);
        setEvaluation(evaluateStudentAchievements(newMetrics, data.unlockedDatesMap || { 'sb-badge-1': 'Earned 12 Aug 2026' }));
      }
    } catch (e: any) {
      console.error('Achievements fetch error:', e.message);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const [evaluatedBadges, setEvaluatedBadges] = useState<EvaluatedBadge[]>(evaluation.badges);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);

  useEffect(() => {
    setEvaluatedBadges(evaluation.badges);
  }, [evaluation]);

  const ghStats = {
    prsMerged: 2,
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
  const ghUnlockedDatesMap = { 'gh-pull-shark': 'Earned 14 Aug 2026' };
  const ghEvaluation = evaluateGitHubAchievements(ghStats, ghUnlockedDatesMap);
  const [evaluatedGhBadges] = useState<EvaluatedGitHubBadge[]>(ghEvaluation.badges);
  const [selectedGhBadgeDetail, setSelectedGhBadgeDetail] = useState<EvaluatedGitHubBadge | null>(null);
  const [achievementSubTab, setAchievementSubTab] = useState<'all' | 'skillbarter' | 'github'>('all');

  /* Initial Load */
  useEffect(() => {
    fetchRequests();
    fetchSessions();
    fetchDiscoverPeers();
    fetchAchievements();
    fetchLearningVideos();
    fetchVideoQueries();
  }, []);

  const handleToggleAutoDelete = (sessionId: string) => {
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, autoDeleteOnEnd: !s.autoDeleteOnEnd } : s));
  };

  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const totalBadgesCount = evaluatedBadges.length;

  const filteredSessions = sessions.filter((sess) => {
    const nameMatch = (sess.name || sess.partner?.name || '').toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      (sess.skill || '').toLowerCase().includes(sidebarSearch.toLowerCase());
    if (!nameMatch) return false;

    if (sidebarFilter === 'UNREAD') return (sess.unreadCount || 0) > 0;
    if (sidebarFilter === 'TEACHING') return sess.type === 'TEACHING';
    if (sidebarFilter === 'LEARNING') return sess.type === 'LEARNING';
    return true;
  });

  const renderMessageContent = (rawText: string, isMe: boolean) => {
    if (rawText.startsWith('[PENDING QUERY REQUEST]:')) {
      const cleanText = rawText.replace('[PENDING QUERY REQUEST]:', '').trim();
      return (
        <div className="space-y-1.5 p-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px] font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Query Request Sent (Awaiting Acceptance)</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{cleanText}</p>
        </div>
      );
    }

    if (rawText.startsWith('[FILE_ATTACHMENT]:')) {
      try {
        const fileData = JSON.parse(rawText.replace('[FILE_ATTACHMENT]:', ''));
        const isImg = fileData.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(fileData.name);

        return (
          <div className="space-y-2">
            {isImg ? (
              <div className="space-y-1.5">
                <div
                  onClick={() => setPreviewImageModal({ name: fileData.name, url: fileData.dataUrl })}
                  className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer max-w-xs"
                >
                  <img
                    src={fileData.dataUrl}
                    alt={fileData.name}
                    className="w-full max-h-60 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                    🔍 Tap to View
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 px-1">
                  <span className="truncate max-w-[180px]">{fileData.name}</span>
                  <span className="text-slate-400">{fileData.size}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3 min-w-[220px] max-w-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{fileData.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{fileData.size || 'Document'}</p>
                  </div>
                </div>
                <a
                  href={fileData.dataUrl}
                  download={fileData.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
            {fileData.caption && (
              <p className="text-xs text-white/90 pt-1 leading-relaxed border-t border-white/10 font-sans">
                {fileData.caption}
              </p>
            )}
          </div>
        );
      } catch {
        // Fallback
      }
    }

    if (rawText.startsWith('[MEETING_LINK]:')) {
      try {
        const meetData = JSON.parse(rawText.replace('[MEETING_LINK]:', ''));
        return (
          <div className="space-y-2.5 min-w-[240px] max-w-sm p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/70 via-teal-950/50 to-[#071317] border border-emerald-500/40 shadow-xl">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{meetData.platform || 'Video Session'}</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                🟢 LIVE LINK
              </span>
            </div>

            <div>
              <h5 className="text-xs font-bold text-white font-heading">{meetData.title || '1:1 Peer Session'}</h5>
              <p className="text-[10px] text-slate-300 font-mono truncate mt-0.5">{meetData.url}</p>
            </div>

            <a
              href={meetData.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(meetData.url, '_blank');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer text-center no-underline"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Video Meeting ↗</span>
            </a>

            {meetData.note && (
              <p className="text-[10px] text-slate-400 font-sans">{meetData.note}</p>
            )}
          </div>
        );
      } catch {
        // Fallback
      }
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = rawText.match(urlRegex);
    if (match) {
      const url = match[0];
      const isMeetingUrl = url.includes('meet.google.com') || url.includes('zoom.us') || url.includes('teams.microsoft.com') || url.includes('meet.jit.si');

      return (
        <div className="space-y-2">
          <p className="whitespace-pre-wrap">{rawText}</p>
          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
            isMeetingUrl
              ? 'bg-emerald-950/50 border-emerald-500/30'
              : 'bg-black/30 border-white/10'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              {isMeetingUrl ? <Video className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span className="text-[11px] font-mono text-slate-300 truncate">{url}</span>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, '_blank');
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold text-white shrink-0 cursor-pointer flex items-center gap-1 ${
                isMeetingUrl ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              <span>{isMeetingUrl ? 'Join Call ↗' : 'Open Link ↗'}</span>
            </a>
          </div>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap">{rawText}</p>;
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-slate-200 font-sans pb-16">

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.zip,.ts,.tsx,.js,.py,.json"
        className="hidden"
      />

      {/* Hero Banner */}
      <div className="relative border-b border-white/[0.06] bg-gradient-to-b from-emerald-950/20 via-[#07080f] to-[#07080f] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Skillora Peer Network
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Peer Skill Exchange & PeerVault Video Hub
            </h1>
            <p className="text-xs text-slate-400 max-w-xl font-light">
              Connect 1:1 with verified peer mentors, upload self-recorded video walkthroughs to PeerVault, and send requests directly to authors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
              <span className="text-slate-400">Active Chats:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {sessions.filter(s => s.status === 'ACTIVE').length} active
              </span>
            </div>

            <button
              onClick={() => setIsUploadVideoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-purple-200" />
              <span>Upload to PeerVault</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request Skill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Feedback Banner */}
        {msg && (
          <div className={`p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between ${
            msgType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}>
            <span>{msg}</span>
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1 — PEER REQUESTS & INCOMING VIDEO QUERIES               */}
        {/* ============================================================ */}
        {activeTab === 'requests' && (
          <div className="space-y-5">
            {/* Header & Sub-filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Peer Requests & Video Query Inbox ({requests.length + videoQueryRequests.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review and accept requests sent to your account before 1:1 communication unlocks.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['ALL', 'VIDEO_QUERIES', 'GENERAL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRequestsSubFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      requestsSubFilter === filter
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Requests' : filter === 'VIDEO_QUERIES' ? 'PeerVault Queries' : 'General Skill Requests'}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Video Query Requests (Targeted to Author's Account) */}
            {(requestsSubFilter === 'ALL' || requestsSubFilter === 'VIDEO_QUERIES') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    PeerVault Video Query Requests ({videoQueryRequests.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoQueryRequests.map((vq) => {
                    const isPending = vq.status === 'PENDING';
                    const isAccepted = vq.status === 'ACCEPTED';

                    return (
                      <div
                        key={vq.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 shadow-lg ${
                          isAccepted
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : isPending
                            ? 'bg-purple-950/20 border-purple-500/40'
                            : 'bg-white/[0.02] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <Film className="w-3 h-3" />
                            <span>{vq.topic}</span>
                          </span>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            isAccepted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {isAccepted ? '✓ ACCEPTED' : isPending ? '⏳ AWAITING ACCEPTANCE' : 'DECLINED'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-300 font-mono">
                            Video: <span className="text-white">{vq.video_title}</span>
                          </h4>
                          <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed p-3 rounded-xl bg-black/40 border border-white/5">
                            "{vq.query_message}"
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                              {vq.requester_name[0] || 'S'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{vq.requester_name}</p>
                              <p className="text-[9px] font-mono text-slate-400">{vq.requester_email}</p>
                            </div>
                          </div>

                          {isPending ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDeclineVideoQuery(vq.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-mono cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptVideoQuery(vq)}
                                disabled={acceptingQueryId === vq.id}
                                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1 cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{acceptingQueryId === vq.id ? 'Accepting...' : 'Accept & Start Chat'}</span>
                              </button>
                            </div>
                          ) : isAccepted ? (
                            <button
                              onClick={() => {
                                if (vq.session_id) setActiveSessionId(vq.session_id);
                                setActiveTab('sessions');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Open Chat →</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. General Public Requests */}
            {(requestsSubFilter === 'ALL' || requestsSubFilter === 'GENERAL') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    General Peer Requests ({requests.length})
                  </h3>
                </div>

                {requestsLoading ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500 space-y-3 glass-card rounded-2xl border border-white/5">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-600 opacity-40" />
                    <p>No open general requests found right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/30 transition-all space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${DOMAIN_CHIP[req.domain] || 'bg-white/10 text-white'}`}>
                            {req.domain}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white font-heading">{req.skill}</h3>
                          <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2">{req.message}</p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                              {req.student?.name?.[0] || 'S'}
                            </div>
                            <span className="text-xs text-slate-300 font-mono">{req.student?.name || 'Student'}</span>
                          </div>

                          <button
                            onClick={() => setRespondingRequestId(req.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                          >
                            Offer Mentorship
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2 — MY SESSIONS (WHATSAPP CHAT WITHOUT CALL / MIC)       */}
        {/* ============================================================ */}
        {activeTab === 'sessions' && (
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c1317] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12" style={{ height: '720px' }}>

            {/* WHATSAPP LEFT SIDEBAR */}
            <div className="lg:col-span-4 flex flex-col border-r border-white/[0.08] bg-[#111b21] overflow-hidden">
              <div className="px-4 py-3 bg-[#202c33] flex items-center justify-between border-b border-white/[0.05] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-base shadow-md">
                    👩‍💻
                  </div>
                  <span className="text-xs font-bold text-white font-heading">
                    {user?.name || 'My Chats'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                    title="New Barter Chat"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showFeedback('WhatsApp Status: End-to-end encrypted peer chat protocol active.')}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                    title="Menu"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-2.5 bg-[#111b21] border-b border-white/[0.05] space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    placeholder="Search or start new chat"
                    className="w-full pl-9 pr-7 py-1.5 rounded-lg bg-[#202c33] border-none text-xs text-white placeholder-slate-400 focus:outline-none font-sans"
                  />
                  {sidebarSearch && (
                    <button
                      onClick={() => setSidebarSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
                  {(['ALL', 'UNREAD', 'TEACHING', 'LEARNING'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setSidebarFilter(filterType)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarFilter === filterType
                          ? 'bg-[#00a884] text-[#111b21]'
                          : 'bg-[#202c33] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filterType === 'ALL' ? 'All' : filterType === 'UNREAD' ? 'Unread' : filterType === 'TEACHING' ? 'Teaching' : 'Learning'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Items List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                {filteredSessions.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-600 opacity-40" />
                    <p>No conversations found.</p>
                  </div>
                )}

                {filteredSessions.map((sess) => {
                  const selected = sess.id === activeSession?.id;
                  const sessName = sess.name || sess.partner?.name || 'Peer';
                  const sessAvatar = sess.avatar || '🧑‍💻';
                  const sessTime = sess.timestamp || (sess.lastMessageAt ? new Date(sess.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
                  const hasUnread = (sess.unreadCount || 0) > 0;
                  const isPendingAccept = sess.status === 'PENDING_ACCEPTANCE';

                  return (
                    <div
                      key={sess.id}
                      onClick={() => setActiveSessionId(sess.id)}
                      className={`px-3.5 py-3 flex items-center gap-3 transition-all cursor-pointer relative group ${
                        selected
                          ? 'bg-[#2a3942]'
                          : 'hover:bg-[#202c33]/70'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#202c33] border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                          {sessAvatar}
                        </div>
                        {sess.isOnline && !isPendingAccept && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00a884] border-2 border-[#111b21]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white truncate font-sans">
                            {sessName}
                          </span>
                          <span className={`text-[11px] font-mono shrink-0 ml-1 ${hasUnread ? 'text-[#00a884] font-bold' : 'text-slate-400'}`}>
                            {sessTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs text-slate-400 truncate font-sans flex items-center gap-1">
                            {!isPendingAccept && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />}
                            <span>{sess.lastMessage}</span>
                          </p>
                          {isPendingAccept ? (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                              PENDING
                            </span>
                          ) : hasUnread ? (
                            <span className="w-5 h-5 rounded-full bg-[#00a884] text-[#111b21] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {sess.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WHATSAPP RIGHT CHAT PANE */}
            {activeSession ? (
              <div className="lg:col-span-8 flex flex-col bg-[#0b141a] overflow-hidden relative">

                {/* Top Header */}
                <div className="px-4 py-2.5 bg-[#202c33] flex items-center justify-between border-b border-white/[0.05] shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#111b21] border border-white/10 flex items-center justify-center text-xl shadow-md">
                        {activeSession.avatar || '🧑‍💻'}
                      </div>
                      {activeSession.isOnline && activeSession.status === 'ACTIVE' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-[#202c33]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight font-sans">
                        {activeSession.name || activeSession.partner?.name || 'Peer'}
                      </h4>
                      <p className={`text-[11px] font-mono flex items-center gap-1 ${
                        activeSession.status === 'PENDING_ACCEPTANCE'
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }`}>
                        <span>{activeSession.status === 'PENDING_ACCEPTANCE' ? '⏳ awaiting acceptance' : '🟢 online'}</span>
                        <span className="text-slate-400">• {activeSession.skill}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 text-slate-300">
                    {activeSession.status === 'ACTIVE' && (
                      <button
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30 hover:bg-[#00a884]/30 transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Meet Link</span>
                      </button>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isHeaderMenuOpen && (
                        <div className="absolute right-0 top-11 w-48 rounded-2xl bg-[#233138] border border-white/10 shadow-2xl py-1.5 z-50 text-xs font-sans">
                          {activeSession.status === 'ACTIVE' && (
                            <button
                              onClick={() => {
                                handleCompleteSession(activeSession.id);
                                setIsHeaderMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-white/10 text-emerald-300 flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Complete</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleToggleAutoDelete(activeSession.id);
                              setIsHeaderMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Auto-delete ({activeSession.autoDeleteOnEnd ? 'ON' : 'OFF'})</span>
                          </button>
                          <button
                            onClick={() => {
                              showFeedback('Chat exported to download folder.');
                              setIsHeaderMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Chat</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pending Acceptance Notice Banner */}
                {activeSession.status === 'PENDING_ACCEPTANCE' && (
                  <div className="p-3 bg-amber-950/60 border-b border-amber-500/30 px-6 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-200">
                          Request Sent to {activeSession.name}'s Account
                        </p>
                        <p className="text-[10px] text-slate-300 font-mono">
                          Communication will unlock automatically once {activeSession.name} accepts your request.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Stream */}
                <div 
                  className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 relative"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, rgba(17, 27, 33, 0.4) 0%, rgba(11, 20, 26, 0.95) 100%), url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                    backgroundBlendMode: 'overlay',
                  }}
                >
                  <div className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-lg bg-[#182229] border border-white/5 text-[11px] font-mono text-slate-400 shadow-md">
                      TODAY
                    </span>
                  </div>

                  {chatLoading && (
                    <div className="text-center py-4 text-xs font-mono text-slate-400">
                      Loading messages...
                    </div>
                  )}

                  {(chatMessages.length > 0 ? chatMessages : (activeSession.messages || [])).map((m: any, idx: number) => {
                    const isMe = m.sender === 'me' || (m.sender_id && user?.id && m.sender_id === user.id) || m.sender?.id === user?.id;
                    const timeStr = m.time || (m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

                    return (
                      <div key={m.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[85%] sm:max-w-[72%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed relative shadow-md ${
                            isMe
                              ? 'bg-[#005c4b] text-white rounded-tr-none'
                              : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-white/[0.05]'
                          }`}
                        >
                          {renderMessageContent(m.text, isMe)}

                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] font-mono text-slate-300/80">
                            <span>{timeStr}</span>
                            {isMe && activeSession.status === 'ACTIVE' && (
                              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 bg-[#202c33] flex items-center gap-2 border-t border-white/[0.05] z-10">
                  <button
                    type="button"
                    disabled={activeSession.status === 'PENDING_ACCEPTANCE'}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-30"
                    title="Emojis"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    disabled={activeSession.status === 'PENDING_ACCEPTANCE'}
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                    title="Attach File, Image or Meeting"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      activeSession.status === 'PENDING_ACCEPTANCE'
                        ? `🔒 Waiting for ${activeSession.name} to accept your request before communication unlocks...`
                        : pendingAttachment
                        ? `Add caption for ${pendingAttachment.name}...`
                        : "Type a message or paste a meeting link..."
                    }
                    disabled={sendingMsg || activeSession.status === 'PENDING_ACCEPTANCE'}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#2a3942] border-none text-xs text-white placeholder-slate-400 focus:outline-none font-sans disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={sendingMsg || (!chatInput.trim() && !pendingAttachment) || activeSession.status === 'PENDING_ACCEPTANCE'}
                    className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#008f72] text-[#111b21] transition-all cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0 disabled:opacity-30"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            ) : (
              <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#0b141a] p-8 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-600 opacity-40" />
                <h4 className="text-base font-bold text-white font-heading">Skillora Web for Peer Mentorship</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select a chat on the left to send messages, documents, code files, and instant video meetings.
                </p>
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
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or branch…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] focus:border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', 'PYTHON', 'REACT', 'FIGMA', 'AI'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      selectedFilter === f
                        ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-500/15'
                        : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPeers.map((peer) => (
                <div
                  key={peer.id}
                  className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/30 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-lg">
                        {peer.avatar || '🧑‍💻'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                          <span>{peer.name}</span>
                          <span>{peer.reputationMark}</span>
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400">{peer.year} • {peer.branch}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{peer.rating}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Can Teach:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {peer.canTeach.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Wants to Learn:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {peer.wantsToLearn.map((l) => (
                          <span key={l} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSkill(peer.canTeach[0] || 'Programming');
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-emerald-600 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all border border-white/[0.06] hover:border-emerald-500 cursor-pointer"
                  >
                    Request Session →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4 — PEERVAULT (DIRECT SELF-RECORDED VIDEO FILES)         */}
        {/* ============================================================ */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                    PeerVault Video Repository
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                  <Film className="w-5 h-5 text-purple-400" />
                  <span>PeerVault — Self-Made Learning Videos</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload self-recorded tech walkthroughs directly from your device, review peers to adjust creator credits, and send query requests to author accounts.
                </p>
              </div>

              <button
                onClick={() => setIsUploadVideoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload to PeerVault</span>
              </button>
            </div>

            {/* Search & Domain Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  placeholder="Search PeerVault by topic, skill, student name, or concepts..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] focus:border-purple-500/40 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', 'Web Development', 'Artificial Intelligence & ML', 'Cloud DevOps', 'Database Systems'].map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setVideoDomainFilter(dom)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      videoDomainFilter === dom
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {dom === 'ALL' ? 'All Domains' : dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Videos Grid */}
            {videosLoading ? (
              <div className="p-12 text-center text-xs font-mono text-slate-400">Loading PeerVault video library...</div>
            ) : filteredVideos.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-3 glass-card rounded-3xl border border-white/10 bg-slate-950/40">
                <Film className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
                <h4 className="text-base font-bold text-white font-heading">No Peer Videos in Vault</h4>
                <p className="text-xs text-slate-400">Record a video of what you have learned and upload it directly!</p>
                <button
                  onClick={() => setIsUploadVideoModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold font-mono"
                >
                  + Upload to PeerVault
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="rounded-3xl border border-white/[0.08] bg-[#0d0f1a] overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-purple-500/40 transition-all"
                  >
                    {/* HTML5 Direct Video Player */}
                    <div className="relative w-full aspect-video bg-black overflow-hidden border-b border-white/10">
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        src={vid.video_url}
                        poster={vid.thumbnail_url}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Video Info & Student Author Card */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${DOMAIN_CHIP[vid.domain] || 'bg-white/10 text-white'}`}>
                            {vid.domain}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[9px] font-mono">
                            🎬 {vid.video_size || 'Video File'}
                          </span>
                        </div>

                        {/* Credits & Star Rating */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-300" />
                            <span>{vid.average_rating}</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            +{vid.creator_credits} Credits
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white font-heading leading-snug">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-purple-300 font-mono mt-0.5">Topic: {vid.topic}</p>
                        <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-3 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>

                      {/* Author Student Card with Call & Email */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm shadow-md">
                              👨‍💻
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white font-sans">{vid.student_name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{vid.google_email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${vid.phone_number}`}
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors border border-emerald-500/20 cursor-pointer"
                              title={`Call ${vid.phone_number}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`mailto:${vid.google_email}`}
                              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors border border-cyan-500/20 cursor-pointer"
                              title={`Email ${vid.google_email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                          <span>Phone: {vid.phone_number}</span>
                          <span className="text-amber-300 font-bold">Leaderboard: {vid.leaderboard_points} Pts</span>
                        </div>
                      </div>

                      {/* Reviews Summary */}
                      <div className="space-y-2.5 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                            <span>Public Peer Reviews ({vid.reviews.length})</span>
                          </span>
                          <button
                            onClick={() => {
                              setFeedbackVideoTarget(vid);
                              setFeedbackRating(5);
                              setFeedbackText('');
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold cursor-pointer"
                          >
                            + Post Review
                          </button>
                        </div>

                        {vid.reviews.length > 0 ? (
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {vid.reviews.map((rev) => (
                              <div
                                key={rev.id}
                                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white font-mono text-[11px]">{rev.reviewer_name}</span>
                                    <span className="text-amber-400 font-bold text-[10px]">{'★'.repeat(rev.rating)}</span>
                                  </div>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                    rev.credit_impact >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                  }`}>
                                    {rev.credit_impact >= 0 ? `+${rev.credit_impact} Creds` : `${rev.credit_impact} Creds`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                                  {rev.feedback_text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">No reviews posted yet. Be the first to review and boost the creator's credits!</p>
                        )}
                      </div>

                      {/* Main Action: Send Query Request to Author's Account */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenQueryModal(vid)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                        >
                          <Inbox className="w-3.5 h-3.5" />
                          <span>Send Query Request to {vid.student_name}'s Account →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5 — ACHIEVEMENTS (GRAND MASTER & MILESTONES)             */}
        {/* ============================================================ */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Skillora Achievements</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Badges unlock progressively as you teach peer sessions, merge pull requests, upload video walkthroughs to PeerVault, and maintain streaks.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 bg-white/[0.03] border border-white/[0.06] p-3 rounded-2xl">
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-emerald-400 font-mono">{unlockedCount + ghEvaluation.unlockedCount}</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Earned</p>
                </div>
                <div className="w-px h-6 bg-white/[0.08]" />
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-slate-500 font-mono">
                    {(totalBadgesCount + ghEvaluation.totalCount) - (unlockedCount + ghEvaluation.unlockedCount)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Locked</p>
                </div>
                <div className="w-px h-6 bg-white/[0.08]" />
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-amber-400 font-mono">
                    {Math.round(((unlockedCount + ghEvaluation.unlockedCount) / (totalBadgesCount + ghEvaluation.totalCount)) * 100)}%
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Progress</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setAchievementSubTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    achievementSubTab === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
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
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>SkillBarter Milestones</span>
                </button>

                <button
                  onClick={() => setAchievementSubTab('github')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    achievementSubTab === 'github'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Grand Master Prestige ({ghEvaluation.totalCount})</span>
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

            {/* 1. Grand Master Prestige Badges */}
            {(achievementSubTab === 'all' || achievementSubTab === 'github') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Grand Master Prestige Badges & Tier Levels
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    High-Stakes Peer Breakthroughs
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
                          title={`${badge.name} — ${badge.category} (Tap to inspect)`}
                          className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                            isUnlocked
                              ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-cyan-400 shadow-lg'
                              : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                          }`}
                          style={isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.accentColor}` } : undefined}
                        >
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

            {/* 2. SkillBarter Milestones */}
            {(achievementSubTab === 'all' || achievementSubTab === 'skillbarter') && (
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      SkillBarter Milestones & Reputation Marks
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    20 Progressive Milestones
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#090b17]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                    {evaluatedBadges.map((badge) => {
                      return (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadgeDetail(badge)}
                          title={`#${badge.badgeNumber} ${badge.name} — ${badge.category} (Tap to inspect)`}
                          className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                            badge.isUnlocked
                              ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-emerald-400 shadow-lg'
                              : badge.isNextAchievable
                              ? 'bg-amber-500/[0.05] border-amber-400/40 ring-1 ring-amber-400/20 shadow-md hover:border-amber-400'
                              : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                          }`}
                          style={badge.isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.glowColor}` } : undefined}
                        >
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
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: SEND QUERY REQUEST TO AUTHOR'S ACCOUNT              */}
      {/* ============================================================ */}
      {queryTargetVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSubmitQueryRequest} className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Request Query Session with {queryTargetVideo.student_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQueryTargetVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
              <p className="font-bold text-white">Video: {queryTargetVideo.title}</p>
              <p className="text-[11px] font-mono text-emerald-300">Topic: {queryTargetVideo.topic} • Author: {queryTargetVideo.student_name}</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-start gap-2">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This request will be sent to <strong>{queryTargetVideo.student_name}'s</strong> account. 1:1 communication will unlock only after they review and accept your request.
              </span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Your Query / Introduction Note</label>
              <textarea
                required
                rows={4}
                value={queryCustomMessage}
                onChange={(e) => setQueryCustomMessage(e.target.value)}
                placeholder="Explain what queries you have regarding the topic..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setQueryTargetVideo(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingQueryRequest || !queryCustomMessage.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingQueryRequest ? 'Sending to Account...' : 'Send Request to Author →'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: UPLOAD DIRECT VIDEO TO PEERVAULT                    */}
      {/* ============================================================ */}
      {isUploadVideoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleUploadVideo} className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            
            <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoFileSelect}
              accept="video/*,.mp4,.webm,.mov,.mkv"
              className="hidden"
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Upload Self-Recorded Video to PeerVault
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your own recorded video walkthrough. Peers can watch it, post reviews that directly affect your credits & leaderboard ranking, and send query requests to your account.
            </p>

            <div
              onClick={() => videoFileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                uploadedVideoFile
                  ? 'border-purple-500/60 bg-purple-950/30'
                  : 'border-white/20 hover:border-purple-500/50 bg-white/[0.02]'
              }`}
            >
              {uploadedVideoFile ? (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto">
                    <Film className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white font-mono truncate max-w-xs mx-auto">
                    {uploadedVideoFile.name}
                  </p>
                  <p className="text-[10px] font-mono text-purple-300">
                    {uploadedVideoFile.size} • Ready to Publish (Tap to change)
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <UploadCloud className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    Click to select your self-recorded video file
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    Supports MP4, WebM, MOV, MKV (device recording)
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={vidStudentName}
                  onChange={(e) => setVidStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Google Account Email</label>
                <input
                  type="email"
                  required
                  value={vidGoogleEmail}
                  onChange={(e) => setVidGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com or @rvce.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={vidPhoneNumber}
                  onChange={(e) => setVidPhoneNumber(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Domain</label>
                <select
                  value={vidDomain}
                  onChange={(e) => setVidDomain(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Cloud DevOps">Cloud DevOps</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Video Title</label>
              <input
                type="text"
                required
                value={vidTitle}
                onChange={(e) => setVidTitle(e.target.value)}
                placeholder="e.g. PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE Demystified"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Topic / Specific Skill Covered</label>
              <input
                type="text"
                required
                value={vidTopic}
                onChange={(e) => setVidTopic(e.target.value)}
                placeholder="e.g. Database Systems, React Server Components, Microservices"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Key Takeaways & Description</label>
              <textarea
                rows={2}
                value={vidDescription}
                onChange={(e) => setVidDescription(e.target.value)}
                placeholder="Summarize what peers will learn from this video walkthrough..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsUploadVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadingVideo || !uploadedVideoFile}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/30 cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadingVideo ? 'Publishing...' : 'Publish to PeerVault →'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ADD REVIEW & FEEDBACK (IMPACTS LEADERBOARD/CREDITS) */}
      {/* ============================================================ */}
      {feedbackVideoTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddReview} className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                Add Review for {feedbackVideoTarget.student_name}
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackVideoTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Your feedback is visible to all peers and directly impacts <strong className="text-white">{feedbackVideoTarget.student_name}'s</strong> leaderboard standing & domain credits.
            </p>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => setFeedbackRating(starNum)}
                    className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <span className={starNum <= feedbackRating ? 'text-amber-400' : 'text-slate-600'}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-purple-300 ml-2">
                  {feedbackRating >= 4 ? '👍 Positive (+15 Credits)' : feedbackRating === 3 ? '👌 Neutral (+5 Credits)' : '👎 Critical (-10 Credits)'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Public Feedback Comment</label>
              <textarea
                required
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you learn from this video? What was great and what can be improved?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setFeedbackVideoTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingFeedback}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                {submittingFeedback ? 'Posting...' : 'Post Public Review →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: SEND MEETING LINK MODAL                             */}
      {/* ============================================================ */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Send Video Meeting Link
                </h3>
              </div>
              <button
                onClick={() => setIsMeetingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Generate an instant Google Meet link or provide your custom meeting URL for this 1:1 session with <strong className="text-white">{activeSession?.name || 'Peer'}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-bold">
                  Choose Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Google Meet', 'Zoom', 'Custom'] as const).map((plt) => (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => setMeetingPlatform(plt)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                        meetingPlatform === plt
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {plt}
                    </button>
                  ))}
                </div>
              </div>

              {meetingPlatform === 'Custom' ? (
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-bold">
                    Custom Meeting URL
                  </label>
                  <input
                    type="url"
                    value={customMeetingUrl}
                    onChange={(e) => setCustomMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/xyz or https://zoom.us/j/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <span>Instant {meetingPlatform} Link Generator</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">Auto-Gen</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsMeetingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendMeetingLink(meetingPlatform === 'Custom' ? customMeetingUrl : undefined, meetingPlatform)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Send to Chat →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: FULLSCREEN IMAGE PREVIEW                           */}
      {/* ============================================================ */}
      {previewImageModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between text-white font-mono text-xs">
              <span className="truncate max-w-sm">{previewImageModal.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={previewImageModal.url}
                  download={previewImageModal.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewImageModal(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center max-h-[80vh]">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.name}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: CREATE SKILL REQUEST                                */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateRequest} className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                Request a Peer Mentorship Session
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Skill or Topic</label>
                <input
                  type="text"
                  required
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Next.js App Router, Docker Compose, PostgreSQL Indexing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Cloud DevOps">Cloud DevOps</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what help you need or what you'd like to practice together..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingRequest}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {creatingRequest ? 'Publishing...' : 'Publish Request →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 7: OFFER MENTORSHIP RESPONSE                          */}
      {/* ============================================================ */}
      {respondingRequestId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                Offer Mentorship to Peer
              </h3>
              <button
                onClick={() => setRespondingRequestId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Your Intro / Response</label>
              <textarea
                required
                rows={3}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Hi! I can help you with this topic. Let's connect for a 1:1 session..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setRespondingRequestId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendResponse(respondingRequestId)}
                disabled={respondingLoading || !responseMessage.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {respondingLoading ? 'Sending...' : 'Send Offer →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 8: BADGE INSPECT MODAL                                 */}
      {/* ============================================================ */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Milestone #{selectedBadgeDetail.badgeNumber}
              </span>
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br ${
                selectedBadgeDetail.isUnlocked ? selectedBadgeDetail.color : 'from-slate-800 to-slate-900 border border-white/10'
              }`}>
                {selectedBadgeDetail.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                {selectedBadgeDetail.name}
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                {selectedBadgeDetail.category}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">Requirement:</span>
                <p className="text-white font-semibold mt-0.5">{selectedBadgeDetail.requirement}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">Status:</span>
                <p className={`font-bold mt-0.5 font-mono ${
                  selectedBadgeDetail.isUnlocked ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedBadgeDetail.isUnlocked ? '✓ Unlocked & Earned in Skillora' : '🔒 Locked — Progressive Milestone'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 9: GRAND MASTER BADGE INSPECT MODAL                    */}
      {/* ============================================================ */}
      {selectedGhBadgeDetail && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Grand Master Prestige Badge</span>
              </span>
              <button
                onClick={() => setSelectedGhBadgeDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-2xl ${
                selectedGhBadgeDetail.isUnlocked ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-white/5 border border-white/10 grayscale'
              }`}>
                {selectedGhBadgeDetail.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                {selectedGhBadgeDetail.name}
              </h3>
              <p className="text-xs text-cyan-300 font-mono">
                {selectedGhBadgeDetail.category}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedGhBadgeDetail.description}</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Status:</span>
                <span className={selectedGhBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedGhBadgeDetail.isUnlocked ? '✓ Grand Achievement Earned' : '🔒 Locked — High-Stakes Milestone'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGhBadgeDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
