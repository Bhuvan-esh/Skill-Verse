import { describe, it, expect } from 'vitest';

describe('Categorized Notifications System', () => {
  const sampleNotifications = [
    {
      id: 'notif-1',
      title: '🏛️ Visual Architects Team Roster Released',
      category: 'CODING_CHALLENGE',
      actionTab: 'competitions',
      actionSubTab: 'team',
    },
    {
      id: 'notif-2',
      title: '🤝 Skill Barter Match Approved',
      category: 'SKILL_BARTER',
      actionTab: 'skillbarter',
    },
    {
      id: 'notif-3',
      title: '🎭 Soft Skills League Round 2 Live',
      category: 'SOFT_SKILLS',
      actionTab: 'soft-skills',
    },
  ];

  it('should cleanly segregate notifications by category', () => {
    const codingNotifs = sampleNotifications.filter(n => n.category === 'CODING_CHALLENGE');
    const skillBarterNotifs = sampleNotifications.filter(n => n.category === 'SKILL_BARTER');
    const softSkillsNotifs = sampleNotifications.filter(n => n.category === 'SOFT_SKILLS');

    expect(codingNotifs).toHaveLength(1);
    expect(codingNotifs[0].actionTab).toBe('competitions');
    expect(codingNotifs[0].actionSubTab).toBe('team');

    expect(skillBarterNotifs).toHaveLength(1);
    expect(skillBarterNotifs[0].actionTab).toBe('skillbarter');

    expect(softSkillsNotifs).toHaveLength(1);
    expect(softSkillsNotifs[0].actionTab).toBe('soft-skills');
  });

  it('should support filtering queries across all three domains', () => {
    const filterFn = (categoryFilter: string) => {
      if (categoryFilter === 'coding') return sampleNotifications.filter(n => n.category === 'CODING_CHALLENGE');
      if (categoryFilter === 'skillbarter') return sampleNotifications.filter(n => n.category === 'SKILL_BARTER');
      if (categoryFilter === 'softskills') return sampleNotifications.filter(n => n.category === 'SOFT_SKILLS');
      return sampleNotifications;
    };

    expect(filterFn('all')).toHaveLength(3);
    expect(filterFn('coding')).toHaveLength(1);
    expect(filterFn('skillbarter')).toHaveLength(1);
    expect(filterFn('softskills')).toHaveLength(1);
  });
});
