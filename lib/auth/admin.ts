import 'server-only';
import { currentUser } from '@clerk/nextjs/server';

export type AdminLikeUser = {
  role?: unknown;
  publicMetadata?: { role?: unknown };
  public_metadata?: { role?: unknown };
  primaryEmailAddress?: { emailAddress?: string | null } | null;
};

function normalize(input: unknown) {
  return typeof input === 'string' ? input.trim().toLowerCase() : '';
}

export function isAdminFromClerkUser(
  user: AdminLikeUser | null | undefined,
  ownerEmailRaw = process.env.OWNER_EMAIL,
): boolean {
  if (!user) return false;

  const ownerEmail = normalize(ownerEmailRaw);
  const roleFromUser = normalize(user.role);
  const roleFromPublicMetadata = normalize(user.publicMetadata?.role);
  const roleFromPublicMetadataSnake = normalize(user.public_metadata?.role);
  const primaryEmail = normalize(user.primaryEmailAddress?.emailAddress ?? '');

  return (
    roleFromUser === 'admin' ||
    roleFromPublicMetadata === 'admin' ||
    roleFromPublicMetadataSnake === 'admin' ||
    Boolean(ownerEmail && primaryEmail === ownerEmail)
  );
}

export async function requireAdminUser() {
  const user = await currentUser();
  if (!user) return { ok: false as const, reason: 'signed_out' as const };
  if (!isAdminFromClerkUser(user)) {
    return { ok: false as const, reason: 'forbidden' as const, user };
  }

  return { ok: true as const, user };
}
