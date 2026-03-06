import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getClientByEmail } from '@/lib/bookingsData';
import {
  getLatestDiagnosticByEmailWithStatus,
} from '@/lib/diagnosticsData';
import { getDiagnosticInsights } from '@/lib/diagnosticsPresentation';
import { getServerUser } from '@/lib/serverAuth';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';

function formatBookedDate(startTime?: string | null, timezone?: string | null) {
  if (!startTime) return 'Scheduling details will appear soon.';
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

export default async function ClientDashboard({ searchParams }: { searchParams: { booked?: string } }) {
  const user = await getServerUser();
  const diagnosticResult = user?.email
    ? await getLatestDiagnosticByEmailWithStatus(user.email)
    : { record: null, status: 'error' as const };
  const diagnostic = diagnosticResult.record;
  const client = user?.email ? await getClientByEmail(user.email) : null;
  const insights = diagnostic ? getDiagnosticInsights(diagnostic) : [];
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';
  const isBooked = searchParams.booked === '1' || client?.status === 'booked';

  if (shouldShowUnavailableRecordsState(diagnosticResult.status, Boolean(diagnostic))) {
    return (
      <Card title="Your Client Portal">
        <p>Client records are not available right now.</p>
        <p className="mt-1 text-sm text-muted">Please contact us if you need access while portal setup is still in progress.</p>
        <Button href="/contact" className="mt-4">
          Contact us
        </Button>
      </Card>
    );
  }

  if (!diagnostic) {
    return (
      <Card title="Your Client Portal">
        <p>We couldn&apos;t find a diagnostic tied to your signed-in email yet.</p>
        <Button href="/scan" className="mt-4">
          Start Diagnostic
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isBooked ? (
        <div className="rounded-card border border-emerald-400/50 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">
          You&apos;re booked. We&apos;ll use your diagnostic to tailor your Clarity Call.
        </div>
      ) : null}

      {isBooked ? (
        <Card title="Your call is scheduled">
          <p>
            <strong>When:</strong> {formatBookedDate(client?.booked_start_time, client?.booked_timezone)}
          </p>
          <p>
            <strong>Timezone:</strong> {client?.booked_timezone || 'Pending'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/client/prep">Prep for your call</Button>
            <Button href="/client/scan" variant="ghost">
              View your diagnostic
            </Button>
          </div>
        </Card>
      ) : null}

      <Card title="Your Diagnostic">
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
        </div>
        {insights.length ? (
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        ) : null}
        <Button href="/client/scan" variant="ghost" className="mt-4">
          View full diagnostic
        </Button>
      </Card>

      {!isBooked ? (
        <Card title="Book your Clarity Call">
          <p>This 45-minute call reviews your top operational pressure points and maps the next 90-day plan.</p>
          <Button href={calendlyUrl} className="mt-4">
            Book Call
          </Button>
        </Card>
      ) : null}

      <Card title="Prep for your call">
        <p>Use a short checklist so we can move from insight to execution quickly.</p>
        <Button href="/client/prep" variant="secondary" className="mt-4">
          Open Prep Checklist
        </Button>
      </Card>
    </div>
  );
}
