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

const clerkEnvPresent = Boolean(
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').trim() &&
    (process.env.CLERK_SECRET_KEY || '').trim(),
);

function redirectPortalSetup(req: NextRequest) {
  const url = new URL('/contact?portal=setup', req.url);
  return NextResponse.redirect(url);
}

const configuredMiddleware = clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    const localRedirect = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    signInUrl.searchParams.set('redirect_url', localRedirect || '/');
    return NextResponse.redirect(signInUrl);
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
