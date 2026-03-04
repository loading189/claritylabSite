import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OWNER_EMAIL = (process.env.OWNER_EMAIL || '').toLowerCase();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/client') && !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const userId = req.headers.get('x-clerk-user-id') || req.headers.get('x-user-id');
  const email = (req.headers.get('x-clerk-email') || req.headers.get('x-user-email') || '').toLowerCase();
  const role = req.headers.get('x-clerk-role') || req.headers.get('x-user-role');

  if (!userId || !email) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const isAdmin = role === 'admin' || email === OWNER_EMAIL;
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/client', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/client/:path*', '/admin/:path*'],
};
