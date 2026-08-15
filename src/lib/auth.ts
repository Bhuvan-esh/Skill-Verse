import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-2026';

export interface UserSession {
  id: string;
  name: string;
  role: 'STUDENT' | 'VOLUNTEER' | 'FOUNDER';
  usn?: string | null;
  college_email: string;
  isEmergencyAccess?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('hub_session')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (e) {
    return null;
  }
}

export async function requireAuth(allowedRoles?: ('STUDENT' | 'VOLUNTEER' | 'FOUNDER')[]): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }

  // Server-side check against database to prevent stale / revoked sessions
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    throw new Error('FORBIDDEN');
  }

  return session;
}
