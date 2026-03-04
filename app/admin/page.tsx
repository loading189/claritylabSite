import Link from 'next/link';
import { Card } from '@/components/Card';

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <Card title="Admin Vault Overview">
        <p>Manage clients, review uploads, and publish reports.</p>
        <Link href="/admin/clients">Open clients</Link>
      </Card>
    </div>
  );
}
