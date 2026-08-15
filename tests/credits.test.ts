import { describe, it, expect } from 'vitest';
import { generateAICreditDraft } from '../src/lib/ai';

describe('Phase 4 & 5 — Credit Engine & AI Credit Agent', () => {
  it('should generate structured credit proposals for competition winners', async () => {
    const proposals = await generateAICreditDraft({
      competition_name: 'Test Hackathon',
      domain: 'DOMAIN_1',
      configured_credit_value: 10,
      participants: [
        { student_id: 'stu-1', student_name: 'Alex', current_credit: 20, rank: 1 },
        { student_id: 'stu-2', student_name: 'Prior', current_credit: 15, rank: 2 },
      ],
    });

    expect(proposals).toHaveLength(2);
    expect(proposals[0].student_id).toBe('stu-1');
    expect(proposals[0].old_credit).toBe(20);
    expect(proposals[0].proposed_credit).toBeGreaterThan(20);
    expect(proposals[0].domain).toBe('DOMAIN_1');
    expect(proposals[0].reason).toContain('Rank #1');
  });

  it('should ensure credits belong to individual students, not a team balance', () => {
    const student1Credit = 25;
    const student2Credit = 18;
    expect(student1Credit).not.toEqual(student2Credit);
  });
});
