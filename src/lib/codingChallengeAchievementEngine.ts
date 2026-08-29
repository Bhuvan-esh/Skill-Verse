export interface CodingBadgeDefinition {
  badgeNumber: number;
  id: string;
  name: string;
  category: 'Foundation' | 'Bug Hunting' | 'Logic & Algorithms' | 'Speed & Accuracy' | 'Mastery' | 'Legendary';
  icon: string;
  requirement: string;
  requirementType:
    | 'CHALLENGES_COMPLETED'
    | 'BUGS_FOUND'
    | 'BUGS_SOLVED'
    | 'LOGIC_CHALLENGES'
    | 'TIMED_CHALLENGES'
    | 'PRECISION_CORRECT'
    | 'DIFFICULTY_LEVELS'
    | 'HARD_BUGS_FIXED'
    | 'COMPETITION_TOP_10'
    | 'BUG_HUNT_TOP_3'
    | 'MULTI_COMPETITION_LEGEND';
  requirementValue: number;
  unit: string;
  color: string;
  glowColor: string;
  reputationMark: string;
  tierName: 'Novice Bronze' | 'Specialist Silver' | 'Veteran Gold' | 'Master Diamond' | 'Mythic Legend';
  tierLevel: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export interface CodingActivityMetrics {
  challengesCompleted: number;
  bugsFound: number;
  bugsSolved: number;
  logicChallengesCompleted: number;
  timedChallengesCompleted: number;
  precisionCorrectCount: number;
  distinctDifficultyLevels: number;
  hardBugsSolved: number;
  top10CompetitionsCount: number;
  top3BugHuntsCount: number;
  multiCompetitionScore: number;
}

export interface EvaluatedCodingBadge extends CodingBadgeDefinition {
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  isNextAchievable?: boolean;
}

// Exactly 20 Coding Challenge Badges specified by the user
export const CODING_CHALLENGE_BADGE_DEFINITIONS: CodingBadgeDefinition[] = [
  {
    badgeNumber: 1,
    id: 'cc-badge-1',
    name: 'Code Starter',
    category: 'Foundation',
    icon: '💻',
    requirement: 'Complete 1 coding challenge',
    requirementType: 'CHALLENGES_COMPLETED',
    requirementValue: 1,
    unit: 'challenge',
    color: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59,130,246,0.4)',
    reputationMark: '💻',
    tierName: 'Novice Bronze',
    tierLevel: 1,
    description: 'Began your competitive coding journey by compiling, testing, and submitting your very first challenge.',
  },
  {
    badgeNumber: 2,
    id: 'cc-badge-2',
    name: 'Bug Finder',
    category: 'Bug Hunting',
    icon: '🔍',
    requirement: 'Find 1 hidden bug',
    requirementType: 'BUGS_FOUND',
    requirementValue: 1,
    unit: 'hidden bug',
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251,146,60,0.4)',
    reputationMark: '🔍',
    tierName: 'Novice Bronze',
    tierLevel: 1,
    description: 'Spotted and flagged a subtle syntax or boundary bug in faulty source code.',
  },
  {
    badgeNumber: 3,
    id: 'cc-badge-3',
    name: 'Bug Buster',
    category: 'Bug Hunting',
    icon: '🐛',
    requirement: 'Solve 3 bugs',
    requirementType: 'BUGS_SOLVED',
    requirementValue: 3,
    unit: 'bugs solved',
    color: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244,63,94,0.4)',
    reputationMark: '🐛',
    tierName: 'Novice Bronze',
    tierLevel: 1,
    description: 'Diagnosed, refactored, and squashed 3 algorithmic defects in code.',
  },
  {
    badgeNumber: 4,
    id: 'cc-badge-4',
    name: 'Code Fixer',
    category: 'Bug Hunting',
    icon: '🔧',
    requirement: 'Solve 5 bugs',
    requirementType: 'BUGS_SOLVED',
    requirementValue: 5,
    unit: 'bugs solved',
    color: 'from-teal-400 to-emerald-600',
    glowColor: 'rgba(45,212,191,0.4)',
    reputationMark: '🔧',
    tierName: 'Novice Bronze',
    tierLevel: 1,
    description: 'Fixed 5 system defects and restored code assertions to 100% pass rate.',
  },
  {
    badgeNumber: 5,
    id: 'cc-badge-5',
    name: 'Logic Solver',
    category: 'Logic & Algorithms',
    icon: '🧠',
    requirement: 'Complete 5 logic challenges',
    requirementType: 'LOGIC_CHALLENGES',
    requirementValue: 5,
    unit: 'logic challenges',
    color: 'from-purple-500 to-violet-600',
    glowColor: 'rgba(168,85,247,0.4)',
    reputationMark: '🧠',
    tierName: 'Specialist Silver',
    tierLevel: 2,
    description: 'Solved 5 algorithmic logic puzzles and complex data flow challenges.',
  },
  {
    badgeNumber: 6,
    id: 'cc-badge-6',
    name: 'Quick Fix',
    category: 'Speed & Accuracy',
    icon: '⚡',
    requirement: 'Solve 3 timed challenges',
    requirementType: 'TIMED_CHALLENGES',
    requirementValue: 3,
    unit: 'timed challenges',
    color: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(252,211,77,0.4)',
    reputationMark: '⚡',
    tierName: 'Specialist Silver',
    tierLevel: 2,
    description: 'Submitted 3 verified patches under strict countdown time pressure.',
  },
  {
    badgeNumber: 7,
    id: 'cc-badge-7',
    name: 'Precision Coder',
    category: 'Speed & Accuracy',
    icon: '🎯',
    requirement: 'Solve 10 challenges correctly',
    requirementType: 'PRECISION_CORRECT',
    requirementValue: 10,
    unit: 'correct challenges',
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(56,189,248,0.4)',
    reputationMark: '🎯',
    tierName: 'Specialist Silver',
    tierLevel: 2,
    description: 'Maintained zero-penalty, flawless assertion passes on 10 challenges.',
  },
  {
    badgeNumber: 8,
    id: 'cc-badge-8',
    name: 'Bug Tracker',
    category: 'Bug Hunting',
    icon: '🕵️',
    requirement: 'Find 10 hidden bugs',
    requirementType: 'BUGS_FOUND',
    requirementValue: 10,
    unit: 'hidden bugs',
    color: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(52,211,153,0.4)',
    reputationMark: '🕵️',
    tierName: 'Specialist Silver',
    tierLevel: 2,
    description: 'Uncovered 10 hidden edge-case defects across distributed programs.',
  },
  {
    badgeNumber: 9,
    id: 'cc-badge-9',
    name: 'Debug Runner',
    category: 'Foundation',
    icon: '🏃',
    requirement: 'Complete 15 challenges',
    requirementType: 'CHALLENGES_COMPLETED',
    requirementValue: 15,
    unit: 'challenges',
    color: 'from-fuchsia-500 to-pink-600',
    glowColor: 'rgba(236,72,153,0.4)',
    reputationMark: '🏃',
    tierName: 'Veteran Gold',
    tierLevel: 3,
    description: 'Powered through 15 competitive coding tracks across algorithm sprints.',
  },
  {
    badgeNumber: 10,
    id: 'cc-badge-10',
    name: 'Code Crafter',
    category: 'Mastery',
    icon: '🎨',
    requirement: 'Solve challenges in 3 difficulty levels',
    requirementType: 'DIFFICULTY_LEVELS',
    requirementValue: 3,
    unit: 'difficulty levels (Easy, Med, Hard)',
    color: 'from-amber-400 to-yellow-600',
    glowColor: 'rgba(245,158,11,0.4)',
    reputationMark: '🎨',
    tierName: 'Veteran Gold',
    tierLevel: 3,
    description: 'Demonstrated versatile mastery across Easy, Medium, and Hard tiers.',
  },
  {
    badgeNumber: 11,
    id: 'cc-badge-11',
    name: 'Debug Detective',
    category: 'Bug Hunting',
    icon: '🛡️',
    requirement: 'Solve 20 hidden bugs',
    requirementType: 'BUGS_SOLVED',
    requirementValue: 20,
    unit: 'hidden bugs solved',
    color: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(99,102,241,0.4)',
    reputationMark: '🛡️',
    tierName: 'Veteran Gold',
    tierLevel: 3,
    description: 'Elite code audit capability: solved 20 complex defects and memory leaks.',
  },
  {
    badgeNumber: 12,
    id: 'cc-badge-12',
    name: 'Speed Coder',
    category: 'Speed & Accuracy',
    icon: '⏱️',
    requirement: 'Complete 10 timed challenges',
    requirementType: 'TIMED_CHALLENGES',
    requirementValue: 10,
    unit: 'timed challenges',
    color: 'from-rose-400 to-orange-500',
    glowColor: 'rgba(251,113,133,0.4)',
    reputationMark: '⏱️',
    tierName: 'Veteran Gold',
    tierLevel: 3,
    description: 'Executed 10 fast-paced live coding sprint solutions without timeout.',
  },
  {
    badgeNumber: 13,
    id: 'cc-badge-13',
    name: 'Logic Master',
    category: 'Logic & Algorithms',
    icon: '🔮',
    requirement: 'Solve 30 logic challenges',
    requirementType: 'LOGIC_CHALLENGES',
    requirementValue: 30,
    unit: 'logic challenges',
    color: 'from-violet-600 to-purple-800',
    glowColor: 'rgba(139,92,246,0.4)',
    reputationMark: '🔮',
    tierName: 'Master Diamond',
    tierLevel: 4,
    description: 'Grandmaster algorithmic reasoning across dynamic programming & graph theory.',
  },
  {
    badgeNumber: 14,
    id: 'cc-badge-14',
    name: 'Error Breaker',
    category: 'Bug Hunting',
    icon: '💥',
    requirement: 'Solve difficult API/code bugs',
    requirementType: 'HARD_BUGS_FIXED',
    requirementValue: 5,
    unit: 'hard API defects',
    color: 'from-red-500 to-rose-700',
    glowColor: 'rgba(239,68,68,0.4)',
    reputationMark: '💥',
    tierName: 'Master Diamond',
    tierLevel: 4,
    description: 'Shattered tough concurrency, deadlock, and complex API integration defects.',
  },
  {
    badgeNumber: 15,
    id: 'cc-badge-15',
    name: 'Challenge Hunter',
    category: 'Foundation',
    icon: '🏹',
    requirement: 'Complete 50 challenges',
    requirementType: 'CHALLENGES_COMPLETED',
    requirementValue: 50,
    unit: 'challenges completed',
    color: 'from-teal-500 to-cyan-700',
    glowColor: 'rgba(20,184,166,0.4)',
    reputationMark: '🏹',
    tierName: 'Master Diamond',
    tierLevel: 4,
    description: 'Relentless persistence: 50 completed challenges and competitive submissions.',
  },
  {
    badgeNumber: 16,
    id: 'cc-badge-16',
    name: 'Debug Expert',
    category: 'Bug Hunting',
    icon: '🔬',
    requirement: 'Solve 50 bugs',
    requirementType: 'BUGS_SOLVED',
    requirementValue: 50,
    unit: 'bugs solved',
    color: 'from-emerald-500 to-teal-700',
    glowColor: 'rgba(16,185,129,0.4)',
    reputationMark: '🔬',
    tierName: 'Master Diamond',
    tierLevel: 4,
    description: 'A living debugger: diagnosed and solved 50 deep software defects.',
  },
  {
    badgeNumber: 17,
    id: 'cc-badge-17',
    name: 'Code Champion',
    category: 'Mastery',
    icon: '🏆',
    requirement: 'Reach top 10 in a coding competition',
    requirementType: 'COMPETITION_TOP_10',
    requirementValue: 1,
    unit: 'top 10 podium finish',
    color: 'from-amber-300 via-yellow-400 to-amber-600',
    glowColor: 'rgba(245,158,11,0.5)',
    reputationMark: '🏆',
    tierName: 'Mythic Legend',
    tierLevel: 5,
    description: 'Climbed to the top 10 on the official Visual Architects leaderboard.',
  },
  {
    badgeNumber: 18,
    id: 'cc-badge-18',
    name: 'Bug Hunt Elite',
    category: 'Bug Hunting',
    icon: '🥇',
    requirement: 'Win/finish top 3 in a Bug Hunt',
    requirementType: 'BUG_HUNT_TOP_3',
    requirementValue: 1,
    unit: 'top 3 Bug Hunt victory',
    color: 'from-yellow-400 via-amber-500 to-red-500',
    glowColor: 'rgba(251,191,36,0.5)',
    reputationMark: '🥇',
    tierName: 'Mythic Legend',
    tierLevel: 5,
    description: 'Took home a podium Top 3 victory in a live multi-tier Bug Hunt tournament.',
  },
  {
    badgeNumber: 19,
    id: 'cc-badge-19',
    name: 'Coding Master',
    category: 'Mastery',
    icon: '💎',
    requirement: 'Complete 100 challenges',
    requirementType: 'CHALLENGES_COMPLETED',
    requirementValue: 100,
    unit: 'challenges completed',
    color: 'from-cyan-300 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6,182,212,0.5)',
    reputationMark: '💎',
    tierName: 'Mythic Legend',
    tierLevel: 5,
    description: 'Century milestone: 100 challenges conquered across competitive seasons.',
  },
  {
    badgeNumber: 20,
    id: 'cc-badge-20',
    name: 'Code Legend',
    category: 'Legendary',
    icon: '👑',
    requirement: 'Exceptional across multiple competitions',
    requirementType: 'MULTI_COMPETITION_LEGEND',
    requirementValue: 1,
    unit: 'legendary multi-season status',
    color: 'from-fuchsia-400 via-pink-500 to-amber-400',
    glowColor: 'rgba(217,70,239,0.5)',
    reputationMark: '👑',
    tierName: 'Mythic Legend',
    tierLevel: 5,
    description: 'All-time legend recognized by Visual Architects across multiple competitive seasons.',
  },
];

// Helper to evaluate Coding Challenge badges
export function evaluateCodingAchievements(
  metrics: CodingActivityMetrics,
  earnedTimestamps: Record<string, string> = {}
): {
  badges: EvaluatedCodingBadge[];
  unlockedCount: number;
  totalCount: number;
  highestBadge: EvaluatedCodingBadge | null;
} {
  let nextFound = false;

  const evaluated = CODING_CHALLENGE_BADGE_DEFINITIONS.map((b) => {
    let currentProgress = 0;
    let isUnlocked = false;

    switch (b.requirementType) {
      case 'CHALLENGES_COMPLETED':
        currentProgress = metrics.challengesCompleted;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'BUGS_FOUND':
        currentProgress = metrics.bugsFound;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'BUGS_SOLVED':
        currentProgress = metrics.bugsSolved;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'LOGIC_CHALLENGES':
        currentProgress = metrics.logicChallengesCompleted;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'TIMED_CHALLENGES':
        currentProgress = metrics.timedChallengesCompleted;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'PRECISION_CORRECT':
        currentProgress = metrics.precisionCorrectCount;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'DIFFICULTY_LEVELS':
        currentProgress = metrics.distinctDifficultyLevels;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'HARD_BUGS_FIXED':
        currentProgress = metrics.hardBugsSolved;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'COMPETITION_TOP_10':
        currentProgress = metrics.top10CompetitionsCount;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'BUG_HUNT_TOP_3':
        currentProgress = metrics.top3BugHuntsCount;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
      case 'MULTI_COMPETITION_LEGEND':
        currentProgress = metrics.multiCompetitionScore;
        isUnlocked = currentProgress >= b.requirementValue;
        break;
    }

    const customTimestamp = earnedTimestamps[b.id];
    if (customTimestamp) {
      isUnlocked = true;
    }

    let isNextAchievable = false;
    if (!isUnlocked && !nextFound) {
      isNextAchievable = true;
      nextFound = true;
    }

    return {
      ...b,
      currentProgress,
      isUnlocked,
      unlockedAt: customTimestamp || (isUnlocked ? 'Earned recently' : undefined),
      isNextAchievable,
    };
  });

  const unlockedCount = evaluated.filter((b) => b.isUnlocked).length;
  const unlockedBadges = evaluated.filter((b) => b.isUnlocked);
  const highestBadge = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1] : null;

  return {
    badges: evaluated,
    unlockedCount,
    totalCount: CODING_CHALLENGE_BADGE_DEFINITIONS.length,
    highestBadge,
  };
}
