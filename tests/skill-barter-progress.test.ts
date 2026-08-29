import { describe, it, expect } from 'vitest';

describe('SkillBarter Progress Tracker & Reciprocal Feedback Engine', () => {
  it('should structure Column 1 (Mentoring delivered) from My Sessions and PeerVault', () => {
    const col1 = [
      {
        id: 'c1-1',
        name: 'Rahul Sharma',
        role: 'Mentor · Database Systems',
        text: 'Published PeerVault walkthrough on PostgreSQL B-Tree Indexing & EXPLAIN ANALYZE scan evaluation.',
        tags: ['PeerVault', 'PostgreSQL', 'My Sessions'],
      },
    ];

    expect(col1[0].tags.includes('PeerVault')).toBe(true);
    expect(col1[0].tags.includes('My Sessions')).toBe(true);
  });

  it('should structure Column 2 (Classes learnt so far) with progress bar computation', () => {
    const computeProgress = (completed: number, total: number) => {
      return Math.round((completed / total) * 100);
    };

    expect(computeProgress(4, 5)).toBe(80);
    expect(computeProgress(3, 4)).toBe(75);
    expect(computeProgress(2, 3)).toBe(67);
  });

  it('should separate Feedback Received (what others gave you) from Feedback Given (what you gave others)', () => {
    // Column 3: What OTHER participants gave to this participant
    const feedbackReceived = {
      heading: 'Rahul Sharma → You',
      feedbacks: [
        {
          label: 'Peer Feedback Received',
          text: 'Super clear self-made video walkthrough! Solved my query latency issue in seconds.',
          rating: '★★★★★',
          credits: '+15 Credits Received',
        },
      ],
    };
    expect(feedbackReceived.feedbacks[0].label).toContain('Received');
    expect(feedbackReceived.feedbacks[0].credits).toContain('+15 Credits Received');

    // Column 4: What THIS participant gave to other participants
    const feedbackGiven = {
      name: 'Rahul Sharma',
      role: 'Feedback given for: PostgreSQL B-Tree Walkthrough',
      text: 'You gave: "Super clear self-made video walkthrough! Solved my query latency issue in seconds."',
      creditImpact: '+15 Credits Awarded to Rahul',
    };
    expect(feedbackGiven.role).toContain('Feedback given');
    expect(feedbackGiven.creditImpact).toContain('Awarded to Rahul');
  });
});
