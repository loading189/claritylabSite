import 'server-only';
import { auth } from '@clerk/nextjs/server';

export type AppUser = {
  userId: string;
  email: string;
  role: 'admin' | 'client';
};

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

export function getServerUser(): AppUser | null {
  const { userId, sessionClaims } = auth();
  if (!userId) return null;

  const email = getEmailFromClaims(sessionClaims);
  const metadataRole = getRoleFromClaims(sessionClaims);
  const role: 'admin' | 'client' = metadataRole === 'admin' || email === OWNER_EMAIL ? 'admin' : 'client';

  return { userId, email, role };
}

export function requireServerUser() {
  const user = getServerUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function isAdmin(user: AppUser) {
  return user.role === 'admin';
}
