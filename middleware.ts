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

const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();

const clerkEnvPresent = Boolean(
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').trim() &&
    (process.env.CLERK_SECRET_KEY || '').trim(),
);

type ClaimsRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ClaimsRecord {
  return typeof value === 'object' && value !== null;
}

function resolveEmail(input: unknown): string {
  if (!isRecord(input)) return '';

  const directEmail = input.email;
  if (typeof directEmail === 'string') return directEmail.toLowerCase();

  const primaryEmail = input.primary_email_address;
  if (typeof primaryEmail === 'string') return primaryEmail.toLowerCase();

  const emailAddress = input.email_address;
  if (typeof emailAddress === 'string') return emailAddress.toLowerCase();

  return '';
}

function resolveRole(input: unknown): string | undefined {
  if (!isRecord(input)) return undefined;

  const metadata = input.metadata;
  if (isRecord(metadata)) {
    const role = metadata.role;
    if (typeof role === 'string') return role;
  }

  const directRole = input.role;
  if (typeof directRole === 'string') return directRole;

  const publicMetadataSnake = input.public_metadata;
  if (isRecord(publicMetadataSnake)) {
    const role = publicMetadataSnake.role;
    if (typeof role === 'string') return role;
  }

  const publicMetadataCamel = input.publicMetadata;
  if (isRecord(publicMetadataCamel)) {
    const role = publicMetadataCamel.role;
    if (typeof role === 'string') return role;
  }

  return undefined;
}

function resolveAppRole(input: unknown, ownerEmail?: string): 'admin' | 'client' {
  const email = resolveEmail(input);
  const role = resolveRole(input);

  if (role === 'admin') return 'admin';
  if (ownerEmail && email === ownerEmail) return 'admin';

  return 'client';
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

  const role = resolveAppRole(sessionClaims, ownerEmail);

  if (role !== 'admin') {
    const deniedUrl = new URL('/client?denied=admin', req.url);
    return NextResponse.redirect(deniedUrl);
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!clerkEnvPresent) {
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