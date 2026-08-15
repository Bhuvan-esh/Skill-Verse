import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../src/lib/db';
import { signToken, verifyToken, hashPassword, verifyPassword } from '../src/lib/auth';

describe('Phase 1 — Authentication & Security System', () => {
  it('should verify preloaded USN whitelist entry', async () => {
    const preloaded = await db.preloadedUSN.findUnique({
      where: { usn: '1MS21CS001' },
    });
    expect(preloaded).not.toBeNull();
    expect(preloaded?.college_email).toBe('alex.student@college.edu');
  });

  it('should hash passwords and verify correctly', async () => {
    const hash = await hashPassword('mysecretpassword');
    const valid = await verifyPassword('mysecretpassword', hash);
    const invalid = await verifyPassword('wrongpassword', hash);
    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  it('should generate and verify valid JWT session tokens', () => {
    const payload = {
      id: 'test-user-id',
      name: 'Test Student',
      role: 'STUDENT' as const,
      usn: '1MS21CS001',
      college_email: 'test@college.edu',
    };

    const token = signToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.usn).toBe('1MS21CS001');
    expect(decoded?.role).toBe('STUDENT');
  });
});
