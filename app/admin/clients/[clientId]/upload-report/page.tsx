import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';
import { listEngagementRequests } from '@/lib/engagementRequestsData';

export default async function AdminUploadReportPage({ params }: { params: { clientId: string } }) {
  const requests = await listEngagementRequests(params.clientId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Upload report for {params.clientId}</h1>
      <FileUploader
        category="report"
        clientId={params.clientId}
        enableDeliverableMetadata
        requestOptions={requests.map((request) => ({ id: request.id, title: request.title }))}
      />
      <FileList category="report" clientId={params.clientId} />
    </div>
  );
}
