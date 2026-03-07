import Link from 'next/link';
import { FileList } from '@/components/client/FileList';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { listClientReportSummaries } from '@/lib/clientReportReadModel';
import { getServerUser } from '@/lib/serverAuth';

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

export default async function ClientReportsPage() {
  const user = await getServerUser();
  const reportSummaries = user ? await listClientReportSummaries(user.userId) : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Reports"
        title="Delivery reports"
        description="This is where we share report summaries in-app and the full polished PDF deliverables."
      />

      <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-text">In-app report summaries</h2>
        <p className="mt-1 text-sm text-muted">Open a report to see what we found, what matters most, and where we would start.</p>

        {reportSummaries.length ? (
          <div className="mt-4 space-y-3">
            {reportSummaries.map((report) => (
              <article key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-input border border-border bg-surfaceRaised px-4 py-3">
                <div>
                  <p className="font-medium text-text">{report.title}</p>
                  <p className="text-xs text-muted">
                    {formatDate(report.createdAt)} · {report.periodCovered || 'Current engagement'}
                  </p>
                  {report.subtitle ? <p className="mt-1 text-xs text-muted">{report.subtitle}</p> : null}
                </div>
                <Link href={`/client/reports/${report.id}`} className="rounded-input border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-text">
                  Open summary
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="No report summaries yet" description="As soon as a report is shared, you will see a quick in-app summary here." actionLabel="Refresh files" actionHref="/client/reports" />
          </div>
        )}
      </section>

      <FileList category="report" />
    </div>
  );
}
