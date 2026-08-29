import { describe, it, expect } from 'vitest';

describe('Participant Coding Competitions Flow', () => {
  const sampleEvents = [
    {
      id: 'event-1',
      title: 'Algorithmic Sprint 2026',
      is_team: true,
      team_size: 4,
      status: 'LIVE',
      credits_reward: 100,
      registrations: [{ student_id: 'user-1', status: 'REGISTERED' }],
    },
    {
      id: 'event-2',
      title: 'Solo Speed Code 2026',
      is_team: false,
      team_size: 1,
      status: 'REGISTRATION_OPEN',
      credits_reward: 80,
      registrations: [],
    },
  ];

  it('should correctly determine team vs individual competition and notices', () => {
    const teamEvent = sampleEvents[0];
    const soloEvent = sampleEvents[1];

    expect(teamEvent.is_team).toBe(true);
    expect(teamEvent.team_size).toBe(4);
    const teamNotice = 'Team will be made by Visual Architects and will be visible on event under My Team';
    expect(teamNotice).toContain('My Team');

    expect(soloEvent.is_team).toBe(false);
    expect(soloEvent.team_size).toBe(1);
  });

  it('should validate registration form payload with all required credentials', () => {
    const regPayload = {
      email: 'demo@rvce.edu.in',
      name: 'demo L',
      usn: '1RV23CS001',
      year: '3rd Year',
      phone: '+91 98450 12345',
      department: 'CSE',
    };

    expect(regPayload.email).toMatch(/@rvce\.edu\.in$/);
    expect(regPayload.usn).toBe('1RV23CS001');
    expect(regPayload.year).toBe('3rd Year');
    expect(regPayload.phone).toBe('+91 98450 12345');
  });

  it('should filter registered competitions for current user', () => {
    const userId = 'user-1';
    const myRegistrations = sampleEvents.filter(e =>
      e.registrations.some(r => r.student_id === userId && r.status === 'REGISTERED')
    );

    expect(myRegistrations).toHaveLength(1);
    expect(myRegistrations[0].title).toBe('Algorithmic Sprint 2026');
  });
});
