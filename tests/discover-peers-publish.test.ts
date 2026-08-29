import { describe, it, expect } from 'vitest';

describe('Discover Peers Profile Publishing & Mandatory Validation Engine', () => {
  it('should prevent publishing if Can Guide, Eager to Learn, or Special Projects are missing', () => {
    const validatePublishRequirements = (profile: {
      canTeach: string[];
      wantsToLearn: string[];
      specialProjects: any[];
    }) => {
      const missing: string[] = [];
      if (!profile.canTeach || profile.canTeach.length === 0) missing.push('Can Guide (Expertise)');
      if (!profile.wantsToLearn || profile.wantsToLearn.length === 0) missing.push('Eager to Learn (Goals)');
      if (!profile.specialProjects || profile.specialProjects.length === 0) missing.push('Special Skills & Projects');

      if (missing.length > 0) {
        return {
          allowed: false,
          error: `Compulsory requirement: Please fill in ${missing.join(', ')} before publishing to Discover Peers.`,
          missing,
        };
      }
      return { allowed: true, error: null, missing: [] };
    };

    // Incomplete profile
    const incomplete = validatePublishRequirements({
      canTeach: [],
      wantsToLearn: [],
      specialProjects: [],
    });
    expect(incomplete.allowed).toBe(false);
    expect(incomplete.missing.length).toBe(3);
    expect(incomplete.error).toContain('Can Guide (Expertise)');
    expect(incomplete.error).toContain('Eager to Learn (Goals)');

    // Fully completed profile
    const complete = validatePublishRequirements({
      canTeach: ['Python', 'React.js'],
      wantsToLearn: ['Docker', 'System Design'],
      specialProjects: [{ id: 'proj-1', title: 'SkillVerse Platform', description: 'Student ecosystem' }],
    });
    expect(complete.allowed).toBe(true);
    expect(complete.missing.length).toBe(0);
  });

  it('should toggle publishing student profile to Discover Peers directory and make visible to all', () => {
    const profileStore: Record<string, any> = {
      default: {
        name: 'Anusha A',
        yearBranch: '3rd Year · CSE',
        canTeach: ['Python', 'React.js', 'PostgreSQL'],
        wantsToLearn: ['Docker', 'System Design'],
        specialProjects: [{ id: 'proj-1', title: 'Neural Query Engine', description: 'Fast vector search' }],
        isPublishedInDiscover: false,
      },
    };

    const togglePublish = (userId: string, isPublished: boolean) => {
      profileStore[userId].isPublishedInDiscover = isPublished;
      return {
        success: true,
        isPublishedInDiscover: profileStore[userId].isPublishedInDiscover,
        message: isPublished
          ? '✓ Your profile is now published in Discover Peers!'
          : '✓ Your profile has been removed from the Discover Peers directory.',
      };
    };

    // 1. Publish to Discover Peers
    const res1 = togglePublish('default', true);
    expect(res1.isPublishedInDiscover).toBe(true);
    expect(res1.message).toContain('published in Discover Peers');

    // 2. Discover list includes the self-published peer at the top
    const generateDiscoverList = () => {
      const peers = [
        { id: 'p-1', name: 'Rahul Sharma', canTeach: ['PostgreSQL'], isSelfPublished: false },
        { id: 'p-2', name: 'Meera K', canTeach: ['Next.js'], isSelfPublished: false },
      ];

      const published = Object.entries(profileStore)
        .filter(([_, p]) => p.isPublishedInDiscover)
        .map(([id, p]) => ({
          id: `student-published-${id}`,
          name: p.name,
          canTeach: p.canTeach,
          wantsToLearn: p.wantsToLearn,
          isSelfPublished: true,
        }));

      return [...published, ...peers];
    };

    const discoverList = generateDiscoverList();
    expect(discoverList.length).toBe(3);
    expect(discoverList[0].name).toBe('Anusha A');
    expect(discoverList[0].isSelfPublished).toBe(true);
    expect(discoverList[0].canTeach).toContain('PostgreSQL');

    // 3. Unpublish from Discover Peers
    const res2 = togglePublish('default', false);
    expect(res2.isPublishedInDiscover).toBe(false);
    expect(generateDiscoverList().length).toBe(2);
  });
});
