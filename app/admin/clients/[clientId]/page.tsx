import Link from 'next/link';
import { FileList } from '@/components/client/FileList';

export default function AdminClientDetail({ params }: { params: { clientId: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Client: {params.clientId}</h1>
      <Link href={`/admin/clients/${params.clientId}/upload-report`}>Upload report</Link>
      <FileList category="all" clientId={params.clientId} />
    </div>
  );
}
