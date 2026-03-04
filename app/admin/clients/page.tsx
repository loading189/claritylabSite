import Link from 'next/link';
import { Card } from '@/components/Card';
import { listClients } from '@/lib/vaultData';

export default async function AdminClientsPage() {
  const clients = await listClients();

  return (
    <Card title="Clients">
      <div className="space-y-2">
        {clients.map((client: Record<string, string>) => (
          <div key={client.client_id} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium text-text">{client.company || client.primary_email}</p>
              <p className="text-xs text-muted">{client.client_id}</p>
            </div>
            <div className="space-x-3 text-xs">
              <Link href={`/admin/clients/${client.client_id}`}>View</Link>
              <Link href={`/admin/clients/${client.client_id}/upload-report`}>Upload report</Link>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">Invite workflow: use Clerk dashboard invitations (v1).</p>
    </Card>
  );
}
