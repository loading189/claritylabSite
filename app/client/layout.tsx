import { redirect } from 'next/navigation';
import { PortalShell } from '@/components/client/PortalShell';
import { ensureClientRecord } from '@/lib/vaultData';
import { getServerUser } from '@/lib/serverAuth';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect('/sign-in');
  await ensureClientRecord(user.userId, user.email);

  return (
    <PortalShell
      title="Client Workspace"
      nav={[
        { href: '/client', label: 'Overview' },
        { href: '/client/reports', label: 'Reports' },
        { href: '/client/prep', label: 'Requests & prep' },
        { href: '/client/files', label: 'Uploads & documents' },
        { href: '/client/scan', label: 'Diagnostic context' },
        ...(user.role === 'admin' ? [{ href: '/admin/clients', label: 'Clients' }] : []),
      ]}
    >
      {children}
    </PortalShell>
  );
}
