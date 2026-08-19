import { describe, it, expect } from 'vitest';

// 7-Pillar Utility helper functions to test
export function formatPillarTag(tag: string): string {
  return tag
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function shouldShowTeamSection(isTeam: boolean, teamMembersCount: number): boolean {
  return isTeam && teamMembersCount > 0;
}

export function calculateRankDifference(prevRank: number, currentRank: number): number {
  return prevRank - currentRank;
}

export function filterActiveTwists(twists: Array<{ id: string; status: string }>): Array<{ id: string; status: string }> {
  return twists.filter((t) => t.status === 'ACTIVE');
}

describe('Coding Challenge — 7 Pillars Module Tests', () => {
  it('should format 7-Pillar tag strings into readable human titles', () => {
    expect(formatPillarTag('REAL_WORLD_PROBLEMS')).toBe('Real World Problems');
    expect(formatPillarTag('UNEXPECTED_TWISTS')).toBe('Unexpected Twists');
    expect(formatPillarTag('DEBUGGING_BATTLES')).toBe('Debugging Battles');
    expect(formatPillarTag('AI_VS_HUMAN')).toBe('Ai Vs Human');
    expect(formatPillarTag('BUILD_AND_DEMO')).toBe('Build And Demo');
  });

  it('should conditionally show team section only for team challenges with active members', () => {
    expect(shouldShowTeamSection(true, 3)).toBe(true);
    expect(shouldShowTeamSection(true, 0)).toBe(false);
    expect(shouldShowTeamSection(false, 1)).toBe(false);
    expect(shouldShowTeamSection(false, 0)).toBe(false);
  });

  it('should accurately compute rank movement differences on the Coding Leaderboard', () => {
    expect(calculateRankDifference(5, 2)).toBe(3); // Moved up by 3 ranks (+3)
    expect(calculateRankDifference(2, 5)).toBe(-3); // Dropped down by 3 ranks (-3)
    expect(calculateRankDifference(4, 4)).toBe(0); // Unchanged rank
  });

  it('should filter active mid-challenge twists correctly', () => {
    const twists = [
      { id: 't1', status: 'ACTIVE' },
      { id: 't2', status: 'EXPIRED' },
      { id: 't3', status: 'UPCOMING' },
    ];

    const active = filterActiveTwists(twists);
    expect(active.length).toBe(1);
    expect(active[0].id).toBe('t1');
  });
});
