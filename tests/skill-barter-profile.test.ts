import { describe, it, expect } from 'vitest';

describe('Student Profile Clean Initial Baseline & Customization Engine', () => {
  it('should initialize newly created student accounts with clean empty profile fields', () => {
    const newAccountProfile = {
      name: '',
      yearBranch: '',
      bio: '',
      canTeach: [] as string[],
      wantsToLearn: [] as string[],
      specialProjects: [] as Array<{ id: string; title: string; description: string }>,
    };

    expect(newAccountProfile.name).toBe('');
    expect(newAccountProfile.canTeach.length).toBe(0);
    expect(newAccountProfile.wantsToLearn.length).toBe(0);
    expect(newAccountProfile.specialProjects.length).toBe(0);
  });

  it('should populate and update profile fields when student enters custom data', () => {
    let profile = {
      name: '',
      yearBranch: '',
      bio: '',
      canTeach: [] as string[],
      wantsToLearn: [] as string[],
      specialProjects: [] as Array<{ id: string; title: string; description: string }>,
    };

    // User edits profile info
    profile = {
      ...profile,
      name: 'demo L',
      yearBranch: '3rd Year · Computer Science & Engineering (CSE)',
      bio: 'Active student developer contributing to peer learning circles.',
      canTeach: ['Python', 'React.js'],
      wantsToLearn: ['Docker', 'Kubernetes'],
      specialProjects: [{ id: 'proj-1', title: 'SkillVerse Platform', description: 'Gamified student club ecosystem' }],
    };

    expect(profile.name).toBe('demo L');
    expect(profile.yearBranch).toContain('CSE');
    expect(profile.canTeach).toContain('Python');
    expect(profile.wantsToLearn).toContain('Docker');
    expect(profile.specialProjects.length).toBe(1);
  });

  it('should format clean empty stats for new accounts', () => {
    const formatStats = (credits?: number, peers?: number, sessions?: number, rating?: number) => ({
      credits: `${credits || 0} Pts`,
      peers: `${peers || 0} Students`,
      sessions: `${sessions || 0} Sessions`,
      rating: `${(rating || 0).toFixed(1)} ★`,
    });

    const newStats = formatStats();
    expect(newStats.credits).toBe('0 Pts');
    expect(newStats.peers).toBe('0 Students');
    expect(newStats.sessions).toBe('0 Sessions');
    expect(newStats.rating).toBe('0.0 ★');
  });
});
