import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication here
const protectedPaths: string[] = [
  '/admin',
  '/builder',
  '/dashboard',
  '/ai-prompt'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Check for the auth token in cookies
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;

    if (!token) {
      // Missing token, redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control for sensitive admin routes
    const adminOnlyPaths = ['/admin/users', '/admin/categories', '/admin/comments', '/admin/pages'];
    const isAdminOnlyPath = adminOnlyPaths.some(path => pathname.startsWith(path));
    const isAdmin = role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'administrator';

    if (isAdminOnlyPath && !isAdmin) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow the request to proceed if not protected or if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
