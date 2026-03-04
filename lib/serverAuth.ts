import 'server-only';
import { headers } from 'next/headers';

export type AppUser = {
  userId: string;
  email: string;
  role: 'admin' | 'client';
};

const OWNER_EMAIL = (process.env.OWNER_EMAIL || '').toLowerCase();

export function getServerUser(): AppUser | null {
  const h = headers();
  const userId = h.get('x-clerk-user-id') || h.get('x-user-id') || '';
  const email = (h.get('x-clerk-email') || h.get('x-user-email') || '').toLowerCase();
  const metadataRole = h.get('x-clerk-role') || h.get('x-user-role');

  if (!userId || !email) return null;

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
