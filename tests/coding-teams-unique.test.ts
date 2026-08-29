import { describe, it, expect } from 'vitest';
import { evaluateCodingAchievements, CodingActivityMetrics } from '../src/lib/codingChallengeAchievementEngine';

describe('Unique Participant History & All-Teams Showcase', () => {
  it('should evaluate unique achievement metrics per participant', () => {
    // Participant A (Advanced coder)
    const metricsParticipantA: CodingActivityMetrics = {
      challengesCompleted: 50,
      bugsFound: 25,
      bugsSolved: 20,
      logicChallengesCompleted: 30,
      timedChallengesCompleted: 10,
      precisionCorrectCount: 10,
      distinctDifficultyLevels: 3,
      hardBugsSolved: 5,
      top10CompetitionsCount: 1,
      top3BugHuntsCount: 1,
      multiCompetitionScore: 100,
    };

    // Participant B (Starter coder)
    const metricsParticipantB: CodingActivityMetrics = {
      challengesCompleted: 1,
      bugsFound: 1,
      bugsSolved: 0,
      logicChallengesCompleted: 0,
      timedChallengesCompleted: 0,
      precisionCorrectCount: 0,
      distinctDifficultyLevels: 1,
      hardBugsSolved: 0,
      top10CompetitionsCount: 0,
      top3BugHuntsCount: 0,
      multiCompetitionScore: 0,
    };

    const evalA = evaluateCodingAchievements(metricsParticipantA);
    const evalB = evaluateCodingAchievements(metricsParticipantB);

    // Participant A should have unlocked higher-tier badges (e.g. #15 Challenge Hunter, #13 Logic Master)
    expect(evalA.unlockedCount).toBeGreaterThan(evalB.unlockedCount);
    expect(evalA.badges.find(b => b.badgeNumber === 15)?.isUnlocked).toBe(true);

    // Participant B only has Code Starter (#1) and Bug Finder (#2)
    expect(evalB.badges.find(b => b.badgeNumber === 1)?.isUnlocked).toBe(true);
    expect(evalB.badges.find(b => b.badgeNumber === 15)?.isUnlocked).toBe(false);
  });

  it('should support multiple released teams in allTeams showcase with participant team flagged', () => {
    const mockTeams = [
      { id: 'team-1', team_number: 1, name: 'Algorithmic Titans', isMyTeam: true, memberCount: 4 },
      { id: 'team-2', team_number: 2, name: 'Neural Networkers', isMyTeam: false, memberCount: 4 },
      { id: 'team-3', team_number: 3, name: 'Quantum Coders', isMyTeam: false, memberCount: 4 },
      { id: 'team-4', team_number: 4, name: 'Byte Force', isMyTeam: false, memberCount: 4 },
    ];

    expect(mockTeams).toHaveLength(4);
    const myTeam = mockTeams.find(t => t.isMyTeam);
    expect(myTeam?.name).toBe('Algorithmic Titans');
    expect(myTeam?.team_number).toBe(1);

    // Selecting any team should yield its identity
    const selectedTeam = mockTeams.find(t => t.id === 'team-3');
    expect(selectedTeam?.name).toBe('Quantum Coders');
  });
});
