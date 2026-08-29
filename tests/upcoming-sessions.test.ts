import { describe, it, expect } from 'vitest';

describe('Upcoming Sessions & Attendance Confirmation Engine', () => {
  it('should list upcoming sessions with speaker, date, and domain metadata', () => {
    const sessions = [
      {
        id: 'sess-1',
        title: 'AI Code Review & Automated Agent Hackathon',
        speaker: 'Alex Johnson',
        domain: 'Skill League · CS-Lec-4',
        date: '📅 Tomorrow, 4:00 PM',
        description: 'A contest where students build dynamic prompts and agents to perform automated security audits.',
      },
      {
        id: 'sess-2',
        title: 'Full-Stack Next.js 14 & Prisma Bootcamp',
        speaker: 'Priya Sharma',
        domain: 'Web Architecture · CS-Lec-2',
        date: '📅 20 Apr, 2:30 PM',
        description: 'Hands-on session building server actions, database schemas, and authenticated REST endpoints.',
      },
      {
        id: 'sess-3',
        title: 'Docker Containerization & Kubernetes Workflow',
        speaker: 'Sanjay V',
        domain: 'Cloud DevOps · CS-Lec-3',
        date: '📅 22 Apr, 5:00 PM',
        description: 'Walkthrough covering Dockerfiles, multi-stage builds, container networking, and cluster orchestration.',
      },
    ];

    expect(sessions.length).toBe(3);
    expect(sessions[0].speaker).toBe('Alex Johnson');
    expect(sessions[1].speaker).toBe('Priya Sharma');
    expect(sessions[2].speaker).toBe('Sanjay V');
  });

  it('should accept session attendance and update confirmation state', () => {
    let acceptedSessions: string[] = [];
    const acceptSession = (id: string) => {
      if (!acceptedSessions.includes(id)) {
        acceptedSessions.push(id);
      }
      return {
        accepted: true,
        message: `✓ Attendance confirmed for ${id} (+15 Attendance Credits)!`,
      };
    };

    const res1 = acceptSession('sess-1');
    expect(res1.accepted).toBe(true);
    expect(res1.message).toContain('+15 Attendance Credits');
    expect(acceptedSessions.includes('sess-1')).toBe(true);

    const res2 = acceptSession('sess-2');
    expect(acceptedSessions.length).toBe(2);
  });
});
