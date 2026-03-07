import Link from 'next/link';
import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';
import { mapFileToDeliverable } from '@/lib/deliverablesData';
import { listEngagementRequests } from '@/lib/engagementRequestsData';
import { listFiles } from '@/lib/vaultData';

export default async function AdminUploadReportPage({ params }: { params: { clientId: string } }) {
  const [requests, reports] = await Promise.all([listEngagementRequests(params.clientId), listFiles(params.clientId, 'report')]);
  const deliverables = reports.map(mapFileToDeliverable);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Upload report for {params.clientId}</h1>
      <FileUploader
        category="report"
        clientId={params.clientId}
        enableDeliverableMetadata
        requestOptions={requests.map((request) => ({ id: request.id, title: request.title }))}
      />

      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <h2 className="text-lg font-semibold">Edit and publish report summaries</h2>
        <p className="mb-3 mt-1 text-sm text-muted">After upload, shape the summary and set it to draft, internal, or client_visible.</p>
        <div className="space-y-2">
          {deliverables.map((report) => (
            <article key={report.id} className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm">
              <div>
                <p className="font-medium">{report.title}</p>
                <p className="text-xs text-muted">State: {report.visibility}</p>
              </div>
              <Link className="text-xs underline" href={`/admin/clients/${params.clientId}/reports/${report.id}`}>
                Edit summary
              </Link>
            </article>
          ))}
          {!deliverables.length ? <p className="text-sm text-muted">Upload a PDF report first, then edit the in-app summary.</p> : null}
        </div>
      </section>

      <FileList category="report" clientId={params.clientId} />
    </div>
  );
}
