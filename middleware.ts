import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/client(.*)',
  '/admin(.*)',
  '/api/client(.*)',
  '/api/admin(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

const OWNER_EMAIL = (process.env.OWNER_EMAIL || '').toLowerCase();
const isClerkConfigured =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

type ClaimsRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ClaimsRecord {
  return typeof value === 'object' && value !== null;
}

function getEmailFromClaims(sessionClaims: unknown) {
  if (!isRecord(sessionClaims)) return '';

  const directEmail = sessionClaims.email;
  if (typeof directEmail === 'string') return directEmail.toLowerCase();

  const primaryEmail = sessionClaims.primary_email_address;
  if (typeof primaryEmail === 'string') return primaryEmail.toLowerCase();

  return '';
}

function getRoleFromClaims(sessionClaims: unknown) {
  if (!isRecord(sessionClaims)) return undefined;
  const publicMetadata = sessionClaims.public_metadata;
  if (!isRecord(publicMetadata)) return undefined;

  const role = publicMetadata.role;
  return typeof role === 'string' ? role : undefined;
}

function redirectPortalSetup(req: NextRequest) {
  const url = new URL('/contact?portal=setup', req.url);
  return NextResponse.redirect(url);
}

const configuredMiddleware = clerkMiddleware(async (auth, req) => {
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

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured) {
    if (!isProtectedRoute(req)) {
      return NextResponse.next();
    }

    return redirectPortalSetup(req);
  }

  return configuredMiddleware(req, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
