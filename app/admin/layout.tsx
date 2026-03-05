import { redirect } from 'next/navigation';
import { PortalShell } from '@/components/client/PortalShell';
import { getServerUser } from '@/lib/serverAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = getServerUser();
  if (!user) redirect('/sign-in');
  if (user.role !== 'admin') redirect('/client?denied=admin');

  return (
    <PortalShell
      title="Admin"
      nav={[
        { href: '/admin', label: 'Overview' },
        { href: '/admin/clients', label: 'Clients' },
        { href: '/client/files', label: 'Client Files View' },
      ]}
    >
      {children}
    </PortalShell>
  );
}
