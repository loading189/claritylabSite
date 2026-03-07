import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { mapFileToDeliverable } from '@/lib/deliverablesData';
import { parseAuthoredReportContent, type ReportPublishState } from '@/lib/reportAuthoring';
import { listFiles, updateFileRecord } from '@/lib/vaultData';

function parseLines(value: FormDataEntryValue | null) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function AdminReportEditorPage({ params }: { params: { clientId: string; reportId: string } }) {
  const files = await listFiles(params.clientId, 'report');
  const fileMatch = files.find((file) => file.id === params.reportId);
  if (!fileMatch || fileMatch.client_id !== params.clientId || fileMatch.category !== 'report') notFound();
  const reportFile = fileMatch;

  const deliverable = mapFileToDeliverable(reportFile);
  const authored = parseAuthoredReportContent(deliverable.reportContentJson);
  const reports = files.map(mapFileToDeliverable);

  async function saveReport(formData: FormData) {
    'use server';

    const subtitle = String(formData.get('subtitle') || '').trim();
    const executiveSummary = String(formData.get('executiveSummary') || '').trim();
    const chartNotes = String(formData.get('chartNotes') || '').trim();
    const shortSummary = String(formData.get('shortSummary') || '').trim();
    const state = String(formData.get('publishState') || 'draft').trim() as ReportPublishState;

    const keyFindings = parseLines(formData.get('keyFindings')).map((line, index) => ({
      area: index === 0 ? 'Primary area' : index === 1 ? 'Secondary area' : 'Additional',
      finding: line,
      impact: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }));

    const priorityActions = parseLines(formData.get('priorityActions')).map((line, index) => ({
      action: line,
      owner: index === 0 ? 'Owner + Clarity Labs' : 'Operations lead',
      timing: index === 0 ? 'This week' : index === 1 ? 'Next 2 weeks' : 'This month',
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }));

    const sections = parseLines(formData.get('sections')).map((line, index) => ({
      id: `section-${index + 1}`,
      title: `Additional note ${index + 1}`,
      content: line,
    }));

    const content = {
      subtitle: subtitle || undefined,
      shortSummary: shortSummary || undefined,
      executiveSummary: executiveSummary || undefined,
      chartNotes: chartNotes || undefined,
      keyFindings: keyFindings.length ? keyFindings : undefined,
      priorityActions: priorityActions.length ? priorityActions : undefined,
      sections: sections.length ? sections : undefined,
    };

    await updateFileRecord(params.reportId, {
      title: String(formData.get('title') || '').trim() || reportFile.title || reportFile.filename,
      summary_note: shortSummary || undefined,
      period_covered: String(formData.get('periodCovered') || '').trim() || undefined,
      status: String(formData.get('status') || 'draft').trim(),
      report_content_json: JSON.stringify(content),
      deliverable_visibility: state,
      report_publish_state: state,
      visible_to_client: state === 'client_visible',
      report_published_at: state === 'client_visible' ? new Date().toISOString() : reportFile.report_published_at || undefined,
    });

    revalidatePath(`/admin/clients/${params.clientId}`);
    revalidatePath(`/admin/clients/${params.clientId}/reports/${params.reportId}`);
    revalidatePath('/client/reports');
    revalidatePath(`/client/reports/${params.reportId}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl">Edit report summary</h1>
        <p className="text-sm text-muted">Shape what the client sees in-app, then publish when ready.</p>
      </div>

      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <h2 className="mb-2 text-lg font-semibold">Other reports</h2>
        <div className="space-y-2 text-sm">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded border border-border px-3 py-2">
              <span>{report.title}</span>
              <Link className="text-xs underline" href={`/admin/clients/${params.clientId}/reports/${report.id}`}>
                Open
              </Link>
            </div>
          ))}
        </div>
      </section>

      <form action={saveReport} className="space-y-4 rounded-card border border-border bg-surface p-4 shadow-soft">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Report title
            <input name="title" defaultValue={reportFile.title || reportFile.filename} className="rounded border border-border px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Period covered
            <input name="periodCovered" defaultValue={reportFile.period_covered || ''} className="rounded border border-border px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Report state
            <select name="publishState" defaultValue={deliverable.visibility} className="rounded border border-border px-2 py-1">
              <option value="draft">draft</option>
              <option value="internal">internal</option>
              <option value="client_visible">client_visible</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Delivery status
            <input name="status" defaultValue={reportFile.status || 'draft'} className="rounded border border-border px-2 py-1" />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Subtitle (optional)
          <input name="subtitle" defaultValue={authored?.subtitle || ''} className="rounded border border-border px-2 py-1" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Short summary note
          <input name="shortSummary" defaultValue={authored?.shortSummary || reportFile.summary_note || ''} className="rounded border border-border px-2 py-1" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Executive summary
          <textarea name="executiveSummary" defaultValue={authored?.executiveSummary || ''} rows={4} className="rounded border border-border px-2 py-1" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Key findings (one per line)
          <textarea
            name="keyFindings"
            defaultValue={(authored?.keyFindings || []).map((item) => item.finding).join('\n')}
            rows={4}
            className="rounded border border-border px-2 py-1"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Priority actions (one per line)
          <textarea
            name="priorityActions"
            defaultValue={(authored?.priorityActions || []).map((item) => item.action).join('\n')}
            rows={4}
            className="rounded border border-border px-2 py-1"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Chart notes (optional)
          <textarea name="chartNotes" defaultValue={authored?.chartNotes || ''} rows={3} className="rounded border border-border px-2 py-1" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Extra section notes (one paragraph per line)
          <textarea
            name="sections"
            defaultValue={(authored?.sections || []).map((item) => item.content).join('\n')}
            rows={4}
            className="rounded border border-border px-2 py-1"
          />
        </label>

        <button type="submit" className="rounded bg-text px-3 py-2 text-sm text-surface">
          Save report draft
        </button>
      </form>

      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <h2 className="text-lg font-semibold">Preview guidance</h2>
        <p className="mt-1 text-sm text-muted">Use draft while editing. Move to internal when reviewed. Move to client_visible when ready to share.</p>
        {deliverable.visibility === 'client_visible' ? (
          <p className="mt-2 text-sm text-text">This report is ready to share with the client.</p>
        ) : (
          <p className="mt-2 text-sm text-muted">This report is not yet visible to the client.</p>
        )}
      </section>
    </div>
  );
}
