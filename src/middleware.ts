import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/signup', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get session cookie
  const sessionCookie = request.cookies.get('session');

  // Verify session
  let isAuthenticated = false;
  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie.value, secret);
      isAuthenticated = true;
    } catch (error) {
      // Invalid token
      isAuthenticated = false;
    }
  }

  // Redirect logic
  if (!isAuthenticated && !isPublicRoute) {
    // Not authenticated, trying to access protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    // Already authenticated, trying to access auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};