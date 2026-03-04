import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/client(.*)',
  '/admin(.*)',
  '/api/client(.*)',
  '/api/admin(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

const OWNER_EMAIL = (process.env.OWNER_EMAIL || '').toLowerCase();

type SessionClaims = {
  email?: string;
  primary_email_address?: string;
  public_metadata?: {
    role?: string;
  };
};

function getEmailFromClaims(sessionClaims: unknown) {
  const claims = (sessionClaims || {}) as SessionClaims;
  return (claims.email || claims.primary_email_address || '').toLowerCase();
}

function getRoleFromClaims(sessionClaims: unknown) {
  const claims = (sessionClaims || {}) as SessionClaims;
  return claims.public_metadata?.role;
}

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (!isAdminRoute(req)) {
    return NextResponse.next();
  }

  const role = getRoleFromClaims(sessionClaims);
  const email = getEmailFromClaims(sessionClaims);
  const isAdmin = role === 'admin' || (OWNER_EMAIL && email === OWNER_EMAIL);

  if (!isAdmin) {
    const deniedUrl = new URL('/client?denied=admin', req.url);
    return NextResponse.redirect(deniedUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
