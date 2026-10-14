import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/horizon', '/dashboard'];

// Routes that are always public
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/complete-profile',
  '/application-pending',
  '/application-rejected',
  '/account-suspended',
  '/forgot-password',
  '/pending-approval',
  '/join',
  '/sign-in',
  '/privacy',
  '/terms',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow API routes, static files, Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
  ) {
    return NextResponse.next();
  }

  // Check hub_session cookie for protected routes
  const session = req.cookies.get('hub_session');
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
