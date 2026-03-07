import { notFound, redirect } from 'next/navigation';
import { ReportChartBlock } from '@/components/portal/report/ReportChartBlock';
import { ReportDownloadButton } from '@/components/portal/report/ReportDownloadButton';
import { ReportFindingsTable } from '@/components/portal/report/ReportFindingsTable';
import { ReportPriorityActionsTable } from '@/components/portal/report/ReportPriorityActionsTable';
import { ReportSection } from '@/components/portal/report/ReportSection';
import { ReportSummaryCard } from '@/components/portal/report/ReportSummaryCard';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientReportReadModel } from '@/lib/clientReportReadModel';
import { getServerUser } from '@/lib/serverAuth';

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

export default async function ClientReportPage({ params }: { params: { reportId: string } }) {
  const user = await getServerUser();
  if (!user) redirect('/sign-in');

  const report = await getClientReportReadModel({
    clientId: user.userId,
    clientEmail: user.email,
    reportId: params.reportId,
  });

  if (!report) notFound();

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Report summary"
        title={report.title}
        description={report.subtitle || 'Here’s what we found, what matters most, and where we would start.'}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReportSummaryCard label="Primary signal" value={report.primarySignal} />
        <ReportSummaryCard label="Tier" value={report.tier} />
        <ReportSummaryCard label="Score" value={report.score === null ? 'Not scored' : `${report.score}/100`} />
        <ReportSummaryCard label="Period" value={report.periodCovered || 'Current engagement'} hint={`Delivered ${formatDate(report.createdAt)}`} />
      </div>

      <ReportSection title="Here’s what we found." description="This is the plain-language executive summary from your delivery team.">
        <p className="text-sm text-text">{report.executiveSummary}</p>
      </ReportSection>

      <ReportSection title="Here’s what matters most." description="Use this table to see where pressure is highest first.">
        <ReportFindingsTable findings={report.keyFindings} />
      </ReportSection>

      <ReportSection title="Here’s where we would start." description="Start with the first action this week, then work down the list.">
        <ReportPriorityActionsTable actions={report.priorityActions} />
      </ReportSection>

      <ReportSection title="Signal chart" description="A quick view of where pressure is strongest right now.">
        {report.chartNotes ? <p className="mb-3 text-sm text-muted">{report.chartNotes}</p> : null}
        {report.charts.map((chart) => (
          <ReportChartBlock key={chart.id} chart={chart} />
        ))}
      </ReportSection>

      {report.sections.map((section) => (
        <ReportSection key={section.id} title={section.title} description="Additional context from your delivery team.">
          <p className="text-sm text-text">{section.content}</p>
        </ReportSection>
      ))}

      <ReportSection title="Download the full report." description="The PDF is your formal consulting deliverable with full detail and recommendations.">
        <p className="text-sm text-muted">Use the PDF for your complete report package. Use this page for quick review and follow-through.</p>
        <ReportDownloadButton storageKey={report.storageKey} />
      </ReportSection>
    </div>
  );
}
