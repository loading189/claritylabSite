import { Button } from '@/components/Button';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientByEmail } from '@/lib/bookingsData';
import { getServerUser } from '@/lib/serverAuth';

const checklist = [
  'Top 2-3 operational bottlenecks from the past 30 days.',
  'Current cash pressure and AR trend snapshot.',
  'Capacity constraints across dispatch, field, and invoicing.',
  'Any KPI report, dashboard, or weekly scorecard you already use.',
];

function formatDateTime(startTime?: string | null, timezone?: string | null) {
  if (!startTime) return 'Once booked, details appear here.';
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone || 'UTC',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export default async function ClientPrepPage() {
  const user = await getServerUser();
  const client = user?.email ? await getClientByEmail(user.email) : null;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';
  const isBooked = client?.status === 'booked';

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Call prep"
        title="Prepare for your call"
        description="A short prep helps us use your call on real decisions, not background catch-up."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Booked session</h2>
          <p className="mt-3 text-sm text-muted">
            <strong className="text-text">Scheduled:</strong> {formatDateTime(client?.booked_start_time, client?.booked_timezone)}
          </p>
          <p className="mt-2 text-sm text-muted">
            <strong className="text-text">Timezone:</strong> {client?.booked_timezone || 'Pending'}
          </p>
          <Button href={calendlyUrl} variant="ghost" className="mt-4">
            {isBooked ? 'View booking details' : 'Book call'}
          </Button>
        </article>

        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">What to expect</h2>
          <p className="mt-3 text-sm text-muted">In 45 minutes, we will review what is slowing the business down and agree on practical next steps.</p>
          <Button href="/client/scan" variant="secondary" className="mt-4">
            View diagnostic
          </Button>
        </article>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Simple prep checklist</h2>
        <ul className="mt-4 space-y-3">
          {checklist.map((item, index) => (
            <li key={item} className="flex gap-3 rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm text-muted">
              <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Bring supporting documents</h2>
        <p className="mt-2 text-sm text-muted">If you have reports or exports, upload them now so we can prepare before your call.</p>
        <Button href="/client/files" className="mt-4">
          Upload documents
        </Button>
      </section>
    </div>
  );
}
