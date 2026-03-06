import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { DiagnosticActions } from '@/components/admin/DiagnosticActions';
import { getDiagnosticById } from '@/lib/diagnosticsData';
import { getDiagnosticInsights, getGroupedAnswers } from '@/lib/diagnosticsPresentation';

export default async function AdminDiagnosticDetailPage({ params }: { params: { id: string } }) {
  const diagnostic = await getDiagnosticById(params.id);
  if (!diagnostic) notFound();

  const groupedAnswers = getGroupedAnswers(diagnostic.answers);
  const insights = getDiagnosticInsights(diagnostic);
  const airtableBase = process.env.AIRTABLE_DIAGNOSTICS_TABLE_URL;
  const airtableUrl = airtableBase ? `${airtableBase}${airtableBase.includes('?') ? '&' : '?'}recordId=${diagnostic.id}` : undefined;

  return (
    <div className="space-y-4">
      <Card title="Diagnostic Summary">
        <div className="grid gap-3 md:grid-cols-3">
          <p>
            <strong>Score:</strong> {diagnostic.score}
          </p>
          <p>
            <strong>Tier:</strong> <span className="capitalize">{diagnostic.tier}</span>
          </p>
          <p>
            <strong>Primary signal:</strong> <span className="capitalize">{diagnostic.primarySignal}</span>
          </p>
          <p>
            <strong>Source:</strong> {diagnostic.source}
          </p>
          <p>
            <strong>Created:</strong> {new Date(diagnostic.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Email:</strong> {diagnostic.email}
          </p>
        </div>
      </Card>

      <Card title="Actions">
        <DiagnosticActions diagnosticId={diagnostic.id} email={diagnostic.email} airtableUrl={airtableUrl} />
      </Card>

      <Card title="UTM Parameters">
        <ul className="space-y-1 text-sm">
          <li>
            <strong>utm_source:</strong> {diagnostic.utm_source || '—'}
          </li>
          <li>
            <strong>utm_medium:</strong> {diagnostic.utm_medium || '—'}
          </li>
          <li>
            <strong>utm_campaign:</strong> {diagnostic.utm_campaign || '—'}
          </li>
        </ul>
      </Card>

      <Card title="Answers by Step">
        <ul className="space-y-3">
          {groupedAnswers.map((answer) => (
            <li key={answer.key} className="rounded-input border border-border/70 bg-surface px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted">{answer.step}</p>
              <p className="text-sm font-semibold text-text">{answer.question}</p>
              <p className="text-sm text-muted">{answer.value}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Derived Insights">
        {insights.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        ) : (
          <p>No derived insights available for this response set.</p>
        )}
      </Card>
    </div>
  );
}
