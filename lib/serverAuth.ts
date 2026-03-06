import 'server-only';
import { auth, currentUser } from '@clerk/nextjs/server';
import { isAdminFromClerkUser } from '@/lib/auth/admin';
import { getClerkConfig } from '@/lib/clerkConfig';
import { resolveClerkEmail } from '@/lib/clerkRole';

export type AppUser = {
  userId: string;
  email: string;
  role: 'admin' | 'client';
};

const clerkConfig = getClerkConfig();

export async function getServerUser(): Promise<AppUser | null> {
  if (!clerkConfig.clerkEnvPresent) return null;

  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ||
    resolveClerkEmail(sessionClaims);
  const role = isAdminFromClerkUser(user, clerkConfig.ownerEmail)
    ? 'admin'
    : 'client';

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
