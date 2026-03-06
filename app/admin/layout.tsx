import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PortalShell } from '@/components/client/PortalShell';

const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();

function isAdminUser(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) return false;

  const roleFromPublicMetadata =
    typeof user.publicMetadata?.role === 'string'
      ? user.publicMetadata.role
      : undefined;

  const roleFromPublicMetadataSnake =
    typeof (user as { public_metadata?: { role?: unknown } }).public_metadata
      ?.role === 'string'
      ? ((user as { public_metadata?: { role?: string } }).public_metadata?.role ??
        undefined)
      : undefined;

  const roleFromUser =
    typeof (user as { role?: unknown }).role === 'string'
      ? ((user as { role?: string }).role ?? undefined)
      : undefined;

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? '';

  return (
    roleFromPublicMetadata === 'admin' ||
    roleFromPublicMetadataSnake === 'admin' ||
    roleFromUser === 'admin' ||
    (ownerEmail && primaryEmail === ownerEmail)
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) redirect('/sign-in');
  if (!isAdminUser(user)) redirect('/client?denied=admin');

  return (
    <PortalShell
      title="Admin"
      nav={[
        { href: '/admin/diagnostics', label: 'Diagnostics' },
        { href: '/admin/clients', label: 'Clients' },
        { href: '/admin', label: 'Dashboard' },
        { href: '/', label: 'Public Site' },
      ]}
    >
      {children}
    </PortalShell>
  );
}
