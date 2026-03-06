import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { DiagnosticActions } from '@/components/admin/DiagnosticActions';
import { getClientByEmail } from '@/lib/bookingsData';
import { getAdvisoryBriefFromDiagnostic } from '@/lib/diagnosticGuidance';
import { getDiagnosticById } from '@/lib/diagnosticsData';
import { getGroupedAnswers } from '@/lib/diagnosticsPresentation';

export default async function AdminDiagnosticDetailPage({ params }: { params: { id: string } }) {
  const diagnostic = await getDiagnosticById(params.id);
  if (!diagnostic) notFound();

  const groupedAnswers = getGroupedAnswers(diagnostic.answers);
  const client = diagnostic.email ? await getClientByEmail(diagnostic.email) : null;
  const brief = getAdvisoryBriefFromDiagnostic(diagnostic);
  const airtableBase = process.env.AIRTABLE_DIAGNOSTICS_TABLE_URL;
  const airtableUrl = airtableBase ? `${airtableBase}${airtableBase.includes('?') ? '&' : '?'}recordId=${diagnostic.id}` : undefined;

  return (
    <div className="space-y-4">
      <Card title="Client + diagnostic snapshot">
        <div className="grid gap-3 md:grid-cols-2">
          <p>
            <strong>Client email:</strong> {diagnostic.email || 'Unknown'}
          </p>
          <p>
            <strong>Company:</strong> {diagnostic.company || 'Unknown'}
          </p>
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
            <strong>Submitted:</strong> {new Date(diagnostic.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Source:</strong> {diagnostic.source}
          </p>
        </div>
      </Card>

      <Card title="Booking status">
        {client?.last_booking_status === 'booked' || client?.status === 'booked' ? (
          <div className="space-y-1 text-sm">
            <p>
              <strong>Status:</strong> booked
            </p>
            <p>
              <strong>Time:</strong> {client?.booked_start_time ? new Date(client.booked_start_time).toLocaleString() : 'Pending'}
            </p>
            <p>
              <strong>Timezone:</strong> {client?.booked_timezone || 'Pending'}
            </p>
          </div>
        ) : (
          <p className="text-sm">No booking yet.</p>
        )}
      </Card>

      <Card title="Summary">
        <p className="text-sm">{brief.shortSummary}</p>
      </Card>

      <Card title="Likely issue pattern">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {brief.whatMayBeHappening.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Card>

      <Card title="Where to start">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {brief.whereToStart.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </Card>

      <Card title="Prep items to request from client">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {brief.prepItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Discussion points for the call">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {brief.discussionPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Card>

      <Card title="Key answers">
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

      {brief.resources.length ? (
        <Card title="Linked resources">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {brief.resources.map((resource) => (
              <li key={resource.href}>
                <Link href={resource.href} className="text-accent underline-offset-2 hover:underline">
                  {resource.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card title="Useful links">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {client?.client_id ? (
            <li>
              <Link href={`/admin/clients/${client.client_id}`} className="text-accent underline-offset-2 hover:underline">
                Open client record
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={`/client/scan`} className="text-accent underline-offset-2 hover:underline">
              Client scan view
            </Link>
          </li>
          <li>
            <Link href="/client/files" className="text-accent underline-offset-2 hover:underline">
              Client files portal view
            </Link>
          </li>
          <li>
            <Link href="/client/prep" className="text-accent underline-offset-2 hover:underline">
              Client prep page
            </Link>
          </li>
          {airtableUrl ? (
            <li>
              <a href={airtableUrl} target="_blank" rel="noreferrer" className="text-accent underline-offset-2 hover:underline">
                Airtable diagnostic record
              </a>
            </li>
          ) : null}
        </ul>
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
    </div>
  );
}
