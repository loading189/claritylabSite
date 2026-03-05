import 'server-only';
import { auth } from '@clerk/nextjs/server';

export type AppUser = {
  userId: string;
  email: string;
  role: 'admin' | 'client';
};

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

export async function getServerUser(): Promise<AppUser | null> {
  if (!isClerkConfigured) return null;

  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const email = getEmailFromClaims(sessionClaims);
  const metadataRole = getRoleFromClaims(sessionClaims);
  const role: 'admin' | 'client' =
    metadataRole === 'admin' || email === OWNER_EMAIL ? 'admin' : 'client';

  return { userId, email, role };
}

export async function requireServerUser() {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function isAdmin(user: AppUser) {
  return user.role === 'admin';
}
