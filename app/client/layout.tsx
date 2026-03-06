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
      title="Client Vault"
      nav={[
        { href: '/client', label: 'Dashboard' },
        { href: '/client/scan', label: 'Diagnostic' },
        { href: '/client/prep', label: 'Prep' },
        { href: '/client/files', label: 'Files' },
        { href: '/client/reports', label: 'Reports' },
        ...(user.role === 'admin' ? [{ href: '/admin/clients', label: 'Clients' }] : []),
      ]}
    >
      {children}
    </PortalShell>
  );
}
