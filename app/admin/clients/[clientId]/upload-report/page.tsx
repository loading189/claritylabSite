import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';

export default function AdminUploadReportPage({ params }: { params: { clientId: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Upload report for {params.clientId}</h1>
      <FileUploader category="report" clientId={params.clientId} />
      <FileList category="report" clientId={params.clientId} />
    </div>
  );
}
