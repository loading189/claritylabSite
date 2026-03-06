import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { getClerkConfig } from '@/lib/clerkConfig';
import { resolveAppRole, resolveClerkEmail } from '@/lib/clerkRole';

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

  const email = resolveClerkEmail(sessionClaims);
  const role = resolveAppRole(sessionClaims, clerkConfig.ownerEmail);

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
