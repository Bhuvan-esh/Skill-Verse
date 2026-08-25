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
    unit: 'students',
    color: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(251,191,36,0.4)',
    reputationMark: '🌟',
  },
  {
    badgeNumber: 6,
    id: 'sb-badge-6',
    name: 'Skill Connector',
    category: 'Versatility',
    icon: '🧩',
    requirement: 'Teach 2 different skills',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 2,
    unit: 'skills taught',
    color: 'from-emerald-400 to-teal-500',
    glowColor: 'rgba(52,211,153,0.4)',
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
    glowColor: 'rgba(59,130,246,0.4)',
    reputationMark: '👥',
  },
  {
    badgeNumber: 8,
    id: 'sb-badge-8',
    name: 'Trusted Guide',
    category: 'Quality',
    icon: '🛡️',
    requirement: 'Maintain 4.5+ rating',
    requirementType: 'MIN_RATING',
    requirementValue: 4.5,
    unit: 'rating',
    color: 'from-indigo-400 to-purple-500',
    glowColor: 'rgba(129,140,248,0.4)',
    reputationMark: '🛡️',
  },
  {
    badgeNumber: 9,
    id: 'sb-badge-9',
    name: 'Consistent Helper',
    category: 'Consistency',
    icon: '📅',
    requirement: 'Teach for 4 weeks in a row',
    requirementType: 'STREAK_WEEKS',
    requirementValue: 4,
    unit: 'weeks streak',
    color: 'from-orange-400 to-amber-500',
    glowColor: 'rgba(251,146,60,0.4)',
    reputationMark: '📅',
  },
  {
    badgeNumber: 10,
    id: 'sb-badge-10',
    name: 'Skill Mentor',
    category: 'Mentorship',
    icon: '❤️',
    requirement: 'Help 15 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 15,
    unit: 'students',
    color: 'from-rose-500 to-red-600',
    glowColor: 'rgba(244,63,94,0.4)',
    reputationMark: '❤️',
  },
  {
    badgeNumber: 11,
    id: 'sb-badge-11',
    name: 'Knowledge Network',
    category: 'Versatility',
    icon: '🌐',
    requirement: 'Teach in 3 different skill areas',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 3,
    unit: 'skill areas',
    color: 'from-teal-400 to-emerald-500',
    glowColor: 'rgba(45,212,191,0.4)',
    reputationMark: '🌐',
  },
  {
    badgeNumber: 12,
    id: 'sb-badge-12',
    name: 'Mentor Plus',
    category: 'Teaching',
    icon: '🎓',
    requirement: 'Complete 25 teaching sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 25,
    unit: 'teaching sessions',
    color: 'from-purple-500 to-indigo-600',
    glowColor: 'rgba(168,85,247,0.4)',
    reputationMark: '🎓',
  },
  {
    badgeNumber: 13,
    id: 'sb-badge-13',
    name: 'Impact Builder',
    category: 'Impact',
    icon: '📈',
    requirement: 'Help 25 students successfully',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 25,
    unit: 'students',
    color: 'from-emerald-400 to-cyan-500',
    glowColor: 'rgba(52,211,153,0.4)',
    reputationMark: '📈',
  },
  {
    badgeNumber: 14,
    id: 'sb-badge-14',
    name: 'Multi-Skill Guide',
    category: 'Versatility',
    icon: '📖',
    requirement: 'Teach 5 different skills',
    requirementType: 'DISTINCT_SKILLS_TAUGHT',
    requirementValue: 5,
    unit: 'different skills',
    color: 'from-blue-400 to-indigo-500',
    glowColor: 'rgba(96,165,250,0.4)',
    reputationMark: '📖',
  },
  {
    badgeNumber: 15,
    id: 'sb-badge-15',
    name: 'Community Mentor',
    category: 'Community',
    icon: '🌍',
    requirement: 'Complete 40 teaching sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 40,
    unit: 'teaching sessions',
    color: 'from-cyan-500 to-teal-600',
    glowColor: 'rgba(6,182,212,0.4)',
    reputationMark: '🌍',
  },
  {
    badgeNumber: 16,
    id: 'sb-badge-16',
    name: 'Skill Champion',
    category: 'Mastery',
    icon: '🏆',
    requirement: 'Complete 60 teaching sessions',
    requirementType: 'TEACHING_SESSIONS',
    requirementValue: 60,
    unit: 'teaching sessions',
    color: 'from-amber-400 to-yellow-500',
    glowColor: 'rgba(250,204,21,0.4)',
    reputationMark: '🏆',
  },
  {
    badgeNumber: 17,
    id: 'sb-badge-17',
    name: 'SkillBarter Legend',
    category: 'Legendary',
    icon: '🥇',
    requirement: 'Help 75 students',
    requirementType: 'STUDENTS_HELPED',
    requirementValue: 75,
    unit: 'students helped',
    color: 'from-yellow-400 to-amber-600',
    glowColor: 'rgba(245,158,11,0.4)',
    reputationMark: '🥇',
  },
  {
    badgeNumber: 18,
    id: 'sb-badge-18',
    name: 'Master Alchemist',
    category: 'Mastery',
    icon: '🎖️',
    requirement: 'Complete 100 total sessions',
    requirementType: 'COMPLETED_SESSIONS',
    requirementValue: 100,
    unit: 'total sessions',
    color: 'from-fuchsia-500 to-pink-600',
    glowColor: 'rgba(217,70,239,0.4)',
    reputationMark: '🎖️',
  },
  {
    badgeNumber: 19,
    id: 'sb-badge-19',
    name: 'Grand Scholar',
    category: 'Legendary',
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
