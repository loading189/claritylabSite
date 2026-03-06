import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PortalShell } from '@/components/client/PortalShell';
import { isAdminFromClerkUser } from '@/lib/auth/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) redirect('/sign-in?redirect_url=/admin');
  if (!isAdminFromClerkUser(user)) redirect('/client?denied=admin');

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
