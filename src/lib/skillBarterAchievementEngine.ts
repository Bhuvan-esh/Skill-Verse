export interface BadgeDefinition {
  badgeNumber: number;
  id: string;
  name: string;
  category: string;
  icon: string;
  requirement: string;
  requirementType: 
    | 'COMPLETED_SESSIONS' 
    | 'STUDENTS_HELPED' 
    | 'TEACHING_SESSIONS' 
    | 'DISTINCT_SKILLS_TAUGHT' 
    | 'MIN_RATING' 
    | 'STREAK_WEEKS'
    | 'IMMORTAL_TIER';
  requirementValue: number;
  unit: string;
  color: string;
  glowColor: string;
  reputationMark: string;
}

export interface StudentActivityMetrics {
  totalSessionsCompleted: number;
  studentsHelped: number;
  teachingSessionsCompleted: number;
  distinctSkillsTaught: number;
  currentRating: number;
  consecutiveTeachingWeeks: number;
}

export interface EvaluatedBadge extends BadgeDefinition {
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  isNextAchievable?: boolean;
}

// Exactly 20 Configurable Badge Definitions matching the specification
export const SKILLBARTER_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    badgeNumber: 1,
    id: 'sb-badge-1',
    name: 'First Exchange',
    category: 'Exchange',
    icon: '🤝',
    requirement: 'Complete 1 session',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 1,
    unit: 'session',
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251,146,60,0.4)',
    reputationMark: '🤝',
  },
  {
    badgeNumber: 2,
    id: 'sb-badge-2',
    name: 'Helping Hand',
    category: 'Peer Help',
    icon: '🫶',
    requirement: 'Help 2 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 2,
    unit: 'students',
    color: 'from-pink-500 to-rose-500',
    glowColor: 'rgba(244,63,94,0.4)',
    reputationMark: '🫶',
  },
  {
    badgeNumber: 3,
    id: 'sb-badge-3',
    name: 'Skill Sharer',
    category: 'Teaching',
    icon: '🧑‍🏫',
    requirement: 'Teach 3 sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 3,
    unit: 'teaching sessions',
    color: 'from-violet-500 to-indigo-600',
    glowColor: 'rgba(168,85,247,0.4)',
    reputationMark: '🧑‍🏫',
  },
  {
    badgeNumber: 4,
    id: 'sb-badge-4',
    name: 'Knowledge Exchange',
    category: 'Exchange',
    icon: '🔄',
    requirement: 'Complete 5 total sessions',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 5,
    unit: 'total sessions',
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(56,189,248,0.4)',
    reputationMark: '🔄',
  },
  {
    badgeNumber: 5,
    id: 'sb-badge-5',
    name: 'Friendly Guide',
    category: 'Peer Help',
    icon: '🌟',
    requirement: 'Help 5 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 5,
    unit: 'students helped',
    color: 'from-amber-300 to-yellow-500',
    glowColor: 'rgba(252,211,77,0.4)',
    reputationMark: '🌟',
  },
  {
    badgeNumber: 6,
    id: 'sb-badge-6',
    name: 'Skill Connector',
    category: 'Domain Diversity',
    icon: '🧩',
    requirement: 'Teach 2 different skills',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 2,
    unit: 'distinct skills',
    color: 'from-teal-400 to-emerald-500',
    glowColor: 'rgba(45,212,191,0.4)',
    reputationMark: '🧩',
  },
  {
    badgeNumber: 7,
    id: 'sb-badge-7',
    name: 'Active Mentor',
    category: 'Teaching',
    icon: '👥',
    requirement: 'Complete 10 teaching sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 10,
    unit: 'teaching sessions',
    color: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(99,102,241,0.4)',
    reputationMark: '👥',
  },
  {
    badgeNumber: 8,
    id: 'sb-badge-8',
    name: 'Trusted Guide',
    category: 'Quality & Reputation',
    icon: '🛡️',
    requirement: 'Maintain 4.5+ rating',
    requirementType: 'MIN_RATING',
    requirementValue: 4.5,
    unit: '★ average rating',
    color: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(52,211,153,0.4)',
    reputationMark: '🛡️',
  },
  {
    badgeNumber: 9,
    id: 'sb-badge-9',
    name: 'Consistent Helper',
    category: 'Consistency',
    icon: '📅',
    requirement: 'Help peers 3 weeks in a row',
    requirementType: 'STREAK_WEEKS',
    requirementValue: 3,
    unit: 'weeks active streak',
    color: 'from-purple-400 to-pink-500',
    glowColor: 'rgba(216,180,254,0.4)',
    reputationMark: '📅',
  },
  {
    badgeNumber: 10,
    id: 'sb-badge-10',
    name: 'Skill Mentor',
    category: 'Peer Help',
    icon: '🎓',
    requirement: 'Help 10 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 10,
    unit: 'students helped',
    color: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(129,140,248,0.4)',
    reputationMark: '🎓',
  },
  {
    badgeNumber: 11,
    id: 'sb-badge-11',
    name: 'Knowledge Network',
    category: 'Exchange',
    icon: '🌐',
    requirement: 'Complete 15 total sessions',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 15,
    unit: 'total sessions',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6,182,212,0.4)',
    reputationMark: '🌐',
  },
  {
    badgeNumber: 12,
    id: 'sb-badge-12',
    name: 'Mentor Plus',
    category: 'Teaching',
    icon: '✨',
    requirement: 'Teach 20 sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 20,
    unit: 'teaching sessions',
    color: 'from-amber-400 to-rose-500',
    glowColor: 'rgba(251,191,36,0.4)',
    reputationMark: '✨',
  },
  {
    badgeNumber: 13,
    id: 'sb-badge-13',
    name: 'Impact Builder',
    category: 'Peer Help',
    icon: '🚀',
    requirement: 'Help 25 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 25,
    unit: 'students helped',
    color: 'from-rose-500 to-red-600',
    glowColor: 'rgba(244,63,94,0.4)',
    reputationMark: '🚀',
  },
  {
    badgeNumber: 14,
    id: 'sb-badge-14',
    name: 'Multi-Skill Guide',
    category: 'Domain Diversity',
    icon: '📚',
    requirement: 'Teach 5 different skills',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 5,
    unit: 'distinct skills',
    color: 'from-violet-400 to-indigo-500',
    glowColor: 'rgba(167,139,250,0.4)',
    reputationMark: '📚',
  },
  {
    badgeNumber: 15,
    id: 'sb-badge-15',
    name: 'Community Mentor',
    category: 'Teaching',
    icon: '🏛️',
    requirement: 'Teach 50 sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 50,
    unit: 'teaching sessions',
    color: 'from-emerald-500 to-cyan-600',
    glowColor: 'rgba(16,185,129,0.4)',
    reputationMark: '🏛️',
  },
  {
    badgeNumber: 16,
    id: 'sb-badge-16',
    name: 'Skill Champion',
    category: 'Exchange',
    icon: '🏆',
    requirement: 'Complete 75 total sessions',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 75,
    unit: 'total sessions',
    color: 'from-amber-400 via-orange-500 to-yellow-500',
    glowColor: 'rgba(245,158,11,0.4)',
    reputationMark: '🏆',
  },
  {
    badgeNumber: 17,
    id: 'sb-badge-17',
    name: 'SkillBarter Legend',
    category: 'Legend Tier',
    icon: '⚡',
    requirement: 'Complete 100 total sessions',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 100,
    unit: 'total sessions',
    color: 'from-fuchsia-500 via-purple-600 to-indigo-600',
    glowColor: 'rgba(217,70,239,0.4)',
    reputationMark: '⚡',
  },
  {
    badgeNumber: 18,
    id: 'sb-badge-18',
    name: 'Master Alchemist',
    category: 'Domain Mastery',
    icon: '🔮',
    requirement: 'Teach 10 different skills',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 10,
    unit: 'distinct skills',
    color: 'from-purple-500 via-indigo-600 to-pink-500',
    glowColor: 'rgba(168,85,247,0.4)',
    reputationMark: '🔮',
  },
  {
    badgeNumber: 19,
    id: 'sb-badge-19',
    name: 'Grand Scholar',
    category: 'Impact Builder',
    icon: '👑',
    requirement: 'Help 100 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 100,
    unit: 'students helped',
    color: 'from-amber-300 to-orange-500',
    glowColor: 'rgba(252,211,77,0.4)',
    reputationMark: '👑',
  },
  {
    badgeNumber: 20,
    id: 'sb-badge-20',
    name: 'SkillBarter Immortal',
    category: 'Immortal Tier',
    icon: '🌌',
    requirement: 'Maintain 4.9+ rating & 150 sessions',
    requirementType: 'IMMORTAL_TIER',
    requirementValue: 150,
    unit: 'elite sessions',
    color: 'from-violet-400 via-fuchsia-500 to-indigo-500',
    glowColor: 'rgba(192,132,252,0.4)',
    reputationMark: '🌌',
  },
];

/* ========================================================================== */
/* GITHUB-STYLE DEVELOPER BADGE DEFINITIONS                                  */
/* ========================================================================== */

export interface GitHubBadgeTierInfo {
  level: number;
  tierName: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  reqValue: number;
  pillColor: string;
}

export interface GitHubBadgeDefinition {
  id: string;
  name: string;
  tagline: string;
  category: string;
  icon: string;
  description: string;
  unit: string;
  activityKey: string;
  tiers: GitHubBadgeTierInfo[];
  badgeSkinGradient: string;
  accentColor: string;
}

export interface EvaluatedGitHubBadge extends GitHubBadgeDefinition {
  currentValue: number;
  currentTier: GitHubBadgeTierInfo | null;
  currentLevel: number;
  isUnlocked: boolean;
  nextTier: GitHubBadgeTierInfo | null;
  currentProgressPercent: number;
  unlockedAt?: string;
}

export const GITHUB_BADGE_DEFINITIONS: GitHubBadgeDefinition[] = [
  {
    id: 'gh-pull-shark',
    name: 'Pull Shark',
    tagline: 'Merged peer code walkthrough PRs & solutions',
    category: 'Pull Requests & Code Sync',
    icon: '🦈',
    description: 'Awarded for opening, reviewing, and merging code solutions and walkthrough pull requests with peers.',
    unit: 'PRs merged',
    activityKey: 'prsMerged',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 2, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 5, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 12, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 25, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-cyan-500/20 via-blue-600/30 to-slate-900',
    accentColor: '#38BDF8',
  },
  {
    id: 'gh-quickdraw',
    name: 'Quickdraw',
    tagline: 'Answered/closed a query within 5 minutes',
    category: 'Rapid Response',
    icon: '⚡',
    description: 'Awarded for exceptional agility: responding to or resolving a student query in under 5 minutes.',
    unit: 'fast responses',
    activityKey: 'fastResponses',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 1, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 3, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 8, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 20, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-amber-500/20 via-yellow-600/30 to-slate-900',
    accentColor: '#FBBF24',
  },
  {
    id: 'gh-galaxy-brain',
    name: 'Galaxy Brain',
    tagline: 'Provided accepted solutions in discussions',
    category: 'Verified Knowledge',
    icon: '🪐',
    description: 'Awarded for authoritative problem-solving: providing answers accepted by Visual Architects & peers.',
    unit: 'accepted answers',
    activityKey: 'acceptedSolutions',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 2, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 5, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 10, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 25, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-purple-500/20 via-violet-600/30 to-slate-900',
    accentColor: '#A855F7',
  },
  {
    id: 'gh-pair-extraordinaire',
    name: 'Pair Extraordinaire',
    tagline: 'Completed collaborative pair exchange sessions',
    category: 'Co-Authoring & Pairing',
    icon: '👥',
    description: 'Awarded for co-authoring code, real-time debugging, and side-by-side programming exchange.',
    unit: 'pair sessions',
    activityKey: 'pairSessions',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 2, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 5, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 10, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 20, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-emerald-500/20 via-teal-600/30 to-slate-900',
    accentColor: '#34D399',
  },
  {
    id: 'gh-starstruck',
    name: 'Starstruck',
    tagline: 'Received 10+ peer stars & 5-star ratings',
    category: 'Peer Recognition',
    icon: '🌟',
    description: 'Awarded when students star your profile or award full 5-star evaluations after a session.',
    unit: 'stars collected',
    activityKey: 'starsReceived',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 5, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 12, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 25, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 50, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-yellow-500/20 via-orange-600/30 to-slate-900',
    accentColor: '#F59E0B',
  },
  {
    id: 'gh-yolo',
    name: 'YOLO Deployer',
    tagline: 'Deployed a solo challenge without rollback',
    category: 'Deployment Mastery',
    icon: '🚀',
    description: 'Awarded for shipping working software directly to production or campus testbeds on first attempt.',
    unit: 'flawless deploys',
    activityKey: 'flawlessDeploys',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 1, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 3, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 6, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 12, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-rose-500/20 via-red-600/30 to-slate-900',
    accentColor: '#F43F5E',
  },
  {
    id: 'gh-arctic-vault',
    name: 'Arctic Code Vault',
    tagline: 'Contributed verified curriculum code to vault',
    category: 'Archival & Curricula',
    icon: '❄️',
    description: 'Awarded for authoring canonical tutorial templates and boilerplate code archived for future cohorts.',
    unit: 'vault modules',
    activityKey: 'vaultContributions',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 1, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 3, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 5, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 10, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-sky-500/20 via-blue-700/30 to-slate-900',
    accentColor: '#38BDF8',
  },
  {
    id: 'gh-heart-sleeve',
    name: 'Heart On Your Sleeve',
    tagline: 'Gave kudos and constructive feedback to peers',
    category: 'Community Empathy',
    icon: '💖',
    description: 'Awarded for writing encouraging review comments, providing detailed feedback, and celebrating peer wins.',
    unit: 'kudos written',
    activityKey: 'kudosGiven',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 3, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 8, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 15, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 30, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-pink-500/20 via-rose-600/30 to-slate-900',
    accentColor: '#FB7185',
  },
  {
    id: 'gh-night-owl',
    name: 'Night Owl',
    tagline: 'Active contributor during evening build sessions',
    category: 'Late Night Builder',
    icon: '🦉',
    description: 'Awarded for active coding, peer reviews, and mentorship exchanges during late-night build hours (9PM - 2AM).',
    unit: 'evening sessions',
    activityKey: 'nightSessions',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 3, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 7, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 15, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 30, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-indigo-600/25 via-slate-800 to-slate-950',
    accentColor: '#818CF8',
  },
  {
    id: 'gh-streak-beast',
    name: 'Streak Beast',
    tagline: 'Consecutive weekly exchange activity streak',
    category: 'Long-term Cadence',
    icon: '🔥',
    description: 'Awarded for sustaining active participation across consecutive calendar weeks without missing a beat.',
    unit: 'weeks active',
    activityKey: 'streakWeeks',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 2, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 4, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 8, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 16, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-orange-500/25 via-red-600/30 to-slate-900',
    accentColor: '#FB923C',
  },
  {
    id: 'gh-public-sponsor',
    name: 'Public Sponsor',
    tagline: 'Mentored peers across 3+ distinct branches',
    category: 'Cross-Disciplinary',
    icon: '🎯',
    description: 'Awarded for breaking department silos: mentoring peers from CSE, ISE, AI/DS, ECE, and Mech departments.',
    unit: 'branches mentored',
    activityKey: 'branchesMentored',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 2, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 3, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 5, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 8, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-teal-500/20 via-emerald-600/30 to-slate-900',
    accentColor: '#2DD4BF',
  },
  {
    id: 'gh-security-sentinel',
    name: 'Security Sentinel',
    tagline: 'Identified & resolved code vulnerabilities in reviews',
    category: 'Security & Linting',
    icon: '🛡️',
    description: 'Awarded for finding SQL injections, security leaks, or unhandled secrets during peer code audits.',
    unit: 'security audits',
    activityKey: 'securityAudits',
    tiers: [
      { level: 1, tierName: 'Bronze', reqValue: 1, pillColor: 'from-amber-700 to-amber-900' },
      { level: 2, tierName: 'Silver', reqValue: 3, pillColor: 'from-slate-300 to-slate-500' },
      { level: 3, tierName: 'Gold', reqValue: 6, pillColor: 'from-yellow-400 to-amber-600' },
      { level: 4, tierName: 'Diamond', reqValue: 12, pillColor: 'from-cyan-400 via-fuchsia-400 to-indigo-500' },
    ],
    badgeSkinGradient: 'from-indigo-500/20 via-purple-700/30 to-slate-900',
    accentColor: '#A78BFA',
  },
];

/**
 * Evaluates GitHub-style badge levels, progress, and unlocked dates from student developer stats.
 */
export function evaluateGitHubAchievements(
  stats: Record<string, number> = {
    prsMerged: 6,
    fastResponses: 4,
    acceptedSolutions: 5,
    pairSessions: 4,
    starsReceived: 14,
    flawlessDeploys: 1,
    vaultContributions: 2,
    kudosGiven: 8,
    nightSessions: 5,
    streakWeeks: 4,
    branchesMentored: 3,
    securityAudits: 2,
  },
  unlockedDatesMap: Record<string, string> = {
    'gh-pull-shark': 'Earned 14 Aug 2026',
    'gh-quickdraw': 'Earned 17 Aug 2026',
    'gh-galaxy-brain': 'Earned 21 Aug 2026',
    'gh-pair-extraordinaire': 'Earned 18 Aug 2026',
    'gh-starstruck': 'Earned 23 Aug 2026',
    'gh-yolo': 'Earned 19 Aug 2026',
    'gh-arctic-vault': 'Earned 20 Aug 2026',
    'gh-heart-sleeve': 'Earned 24 Aug 2026',
    'gh-night-owl': 'Earned 22 Aug 2026',
    'gh-streak-beast': 'Earned 25 Aug 2026',
    'gh-public-sponsor': 'Earned 25 Aug 2026',
    'gh-security-sentinel': 'Earned 25 Aug 2026',
  }
): {
  badges: EvaluatedGitHubBadge[];
  unlockedCount: number;
  totalCount: number;
  tierCounts: { Bronze: number; Silver: number; Gold: number; Diamond: number };
} {
  const evaluated: EvaluatedGitHubBadge[] = GITHUB_BADGE_DEFINITIONS.map((def) => {
    const val = stats[def.activityKey] || 0;
    
    // Find highest unlocked tier
    let currentTier: GitHubBadgeTierInfo | null = null;
    let nextTier: GitHubBadgeTierInfo | null = def.tiers[0];

    for (let i = 0; i < def.tiers.length; i++) {
      if (val >= def.tiers[i].reqValue) {
        currentTier = def.tiers[i];
        nextTier = def.tiers[i + 1] || null;
      } else {
        if (!currentTier) {
          nextTier = def.tiers[i];
        }
        break;
      }
    }

    const isUnlocked = currentTier !== null;
    const currentLevel = currentTier ? currentTier.level : 0;

    let currentProgressPercent = 100;
    if (nextTier) {
      const baseReq = currentTier ? currentTier.reqValue : 0;
      const targetReq = nextTier.reqValue;
      const range = targetReq - baseReq;
      const currentAboveBase = Math.max(0, val - baseReq);
      currentProgressPercent = Math.min(100, Math.round((currentAboveBase / range) * 100));
    }

    return {
      ...def,
      currentValue: val,
      currentTier,
      currentLevel,
      isUnlocked,
      nextTier,
      currentProgressPercent,
      unlockedAt: isUnlocked ? (unlockedDatesMap[def.id] || 'Earned Aug 2026') : undefined,
    };
  });

  const unlockedCount = evaluated.filter((b) => b.isUnlocked).length;
  const tierCounts = {
    Bronze: evaluated.filter((b) => b.currentTier?.tierName === 'Bronze').length,
    Silver: evaluated.filter((b) => b.currentTier?.tierName === 'Silver').length,
    Gold: evaluated.filter((b) => b.currentTier?.tierName === 'Gold').length,
    Diamond: evaluated.filter((b) => b.currentTier?.tierName === 'Diamond').length,
  };

  return {
    badges: evaluated,
    unlockedCount,
    totalCount: evaluated.length,
    tierCounts,
  };
}

/**
 * Backend engine to calculate real achievement progress and unlocks from actual activity metrics.
 */
export function evaluateStudentAchievements(
  metrics: StudentActivityMetrics,
  unlockedDatesMap: Record<string, string> = {}
): {
  badges: EvaluatedBadge[];
  unlockedCount: number;
  totalCount: number;
  highestBadge: EvaluatedBadge | null;
} {
  let hasFoundNextAchievable = false;

  const evaluated: EvaluatedBadge[] = SKILLBARTER_BADGE_DEFINITIONS.map((badge) => {
    let current = 0;

    switch (badge.requirementType) {
      case 'COMPLETED_SESSIONS':
        current = metrics.totalSessionsCompleted;
        break;
      case 'STUDENTS_HELPED':
        current = metrics.studentsHelped;
        break;
      case 'TEACHING_SESSIONS':
        current = metrics.teachingSessionsCompleted;
        break;
      case 'DISTINCT_SKILLS_TAUGHT':
        current = metrics.distinctSkillsTaught;
        break;
      case 'MIN_RATING':
        current = metrics.currentRating;
        break;
      case 'STREAK_WEEKS':
        current = metrics.consecutiveTeachingWeeks;
        break;
      case 'IMMORTAL_TIER':
        current = metrics.currentRating >= 4.9 ? metrics.totalSessionsCompleted : 0;
        break;
      default:
        current = 0;
    }

    const isUnlocked = current >= badge.requirementValue;
    const progressVal = Math.min(current, badge.requirementValue);

    let isNextAchievable = false;
    if (!isUnlocked && !hasFoundNextAchievable) {
      isNextAchievable = true;
      hasFoundNextAchievable = true;
    }

    return {
      ...badge,
      currentProgress: progressVal,
      isUnlocked,
      unlockedAt: isUnlocked ? (unlockedDatesMap[badge.id] || 'Earned 20 Aug 2026') : undefined,
      isNextAchievable,
    };
  });

  const unlockedCount = evaluated.filter((b) => b.isUnlocked).length;
  const highestBadge = evaluated.filter((b) => b.isUnlocked).slice(-1)[0] || evaluated[0];

  return {
    badges: evaluated,
    unlockedCount,
    totalCount: evaluated.length,
    highestBadge,
  };
}
