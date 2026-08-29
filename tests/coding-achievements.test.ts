import { describe, it, expect } from 'vitest';
import {
  CODING_CHALLENGE_BADGE_DEFINITIONS,
  evaluateCodingAchievements,
  CodingActivityMetrics,
} from '../src/lib/codingChallengeAchievementEngine';

describe('Coding Challenge 20-Badge Achievement System', () => {
  it('should define exactly 20 distinct progressive badges', () => {
    expect(CODING_CHALLENGE_BADGE_DEFINITIONS.length).toBe(20);

    const expectedBadgeNames = [
      'Code Starter',
      'Bug Finder',
      'Bug Buster',
      'Code Fixer',
      'Logic Solver',
      'Quick Fix',
      'Precision Coder',
      'Bug Tracker',
      'Debug Runner',
      'Code Crafter',
      'Debug Detective',
      'Speed Coder',
      'Logic Master',
      'Error Breaker',
      'Challenge Hunter',
      'Debug Expert',
      'Code Champion',
      'Bug Hunt Elite',
      'Coding Master',
      'Code Legend',
    ];

    expectedBadgeNames.forEach((name, index) => {
      const badge = CODING_CHALLENGE_BADGE_DEFINITIONS[index];
      expect(badge.name).toBe(name);
      expect(badge.badgeNumber).toBe(index + 1);
      expect(badge.icon).toBeDefined();
      expect(badge.requirement).toBeDefined();
    });
  });

  it('should evaluate unlocked badges accurately based on student activity metrics', () => {
    const metrics: CodingActivityMetrics = {
      challengesCompleted: 15,
      bugsFound: 10,
      bugsSolved: 5,
      logicChallengesCompleted: 5,
      timedChallengesCompleted: 3,
      precisionCorrectCount: 10,
      distinctDifficultyLevels: 3,
      hardBugsSolved: 1,
      top10CompetitionsCount: 1,
      top3BugHuntsCount: 1,
      multiCompetitionScore: 0,
    };

    const evaluation = evaluateCodingAchievements(metrics);
    expect(evaluation.totalCount).toBe(20);

    // Code Starter (req 1) -> Unlocked
    expect(evaluation.badges.find(b => b.name === 'Code Starter')?.isUnlocked).toBe(true);

    // Bug Buster (req 3 bugs) -> Unlocked (solved 5)
    expect(evaluation.badges.find(b => b.name === 'Bug Buster')?.isUnlocked).toBe(true);

    // Code Fixer (req 5 bugs) -> Unlocked (solved 5)
    expect(evaluation.badges.find(b => b.name === 'Code Fixer')?.isUnlocked).toBe(true);

    // Coding Master (req 100 challenges) -> Locked (completed 15)
    expect(evaluation.badges.find(b => b.name === 'Coding Master')?.isUnlocked).toBe(false);
  });

  it('should correctly support 5 visual progression tiers from Novice to Mythic', () => {
    const tiers = CODING_CHALLENGE_BADGE_DEFINITIONS.map(b => b.tierLevel);
    expect(tiers).toContain(1); // Novice Bronze
    expect(tiers).toContain(2); // Specialist Silver
    expect(tiers).toContain(3); // Veteran Gold
    expect(tiers).toContain(4); // Master Diamond
    expect(tiers).toContain(5); // Mythic Legend
  });
});
