import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';
import { getClerkConfig } from '@/lib/clerkConfig';
import { resolveAppRole } from '@/lib/clerkRole';

const isProtectedRoute = createRouteMatcher([
  '/client(.*)',
  '/admin(.*)',
  '/api/client(.*)',
  '/api/admin(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

const clerkConfig = getClerkConfig();

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

  const role = resolveAppRole(sessionClaims, clerkConfig.ownerEmail);

  if (role !== 'admin') {
    const deniedUrl = new URL('/client?denied=admin', req.url);
    return NextResponse.redirect(deniedUrl);
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!clerkConfig.clerkEnvPresent) {
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
