import { Button } from '@/components/Button';
import { ActionCard } from '@/components/portal/ActionCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientByEmail } from '@/lib/bookingsData';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
import { getLatestDiagnosticByEmailWithStatus } from '@/lib/diagnosticsData';
import { getDiagnosticInsights } from '@/lib/diagnosticsPresentation';
import { getServerUser } from '@/lib/serverAuth';

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
      <EmptyState
        title="Portal records are temporarily unavailable"
        description="We couldn't load your diagnostic data right now. Contact us and we'll help you regain access quickly."
        actionLabel="Contact support"
        actionHref="/contact"
      />
    );
  }

  if (!diagnostic) {
    return (
      <EmptyState
        title="No diagnostic found"
        description="Start your diagnostic to unlock your dashboard summary, call prep, and file vault."
        actionLabel="Start diagnostic"
        actionHref="/scan"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Client vault"
        title="Operations dashboard"
        description="Track your diagnostic, keep prep organized, and move through your next actions in one workspace."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Account</p>
          <p className="mt-2 text-lg font-semibold text-text">Welcome back</p>
          <p className="mt-2 text-sm text-muted">{user?.email || 'Client workspace access active.'}</p>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Status</p>
          <p className="mt-2 text-lg font-semibold text-text">{isBooked ? 'Booked' : 'Awaiting booking'}</p>
          <p className="mt-2 text-sm text-muted">
            {isBooked
              ? `Scheduled for ${formatBookedDate(client?.booked_start_time, client?.booked_timezone)}.`
              : 'Book your clarity call to turn results into a 90-day execution plan.'}
          </p>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Next step</p>
          <p className="mt-2 text-lg font-semibold text-text">{isBooked ? 'Prep for call' : 'Book call'}</p>
          <Button href={isBooked ? '/client/prep' : calendlyUrl} className="mt-4">
            {isBooked ? 'Prep for call' : 'Book call'}
          </Button>
        </article>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text">Diagnostic summary</h2>
          <span className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Score {diagnostic.score}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Tier</span>
            <span className="mt-1 block font-semibold capitalize text-text">{diagnostic.tier}</span>
          </p>
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Primary signal</span>
            <span className="mt-1 block font-semibold capitalize text-text">{diagnostic.primarySignal}</span>
          </p>
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Readout</span>
            <span className="mt-1 block text-text">{insights[0] || 'Your full readout is ready for review.'}</span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            href={isBooked ? '/client/prep' : calendlyUrl}
            title={isBooked ? 'View call details' : 'Book call'}
            description="Confirm your session timing and move into a focused execution plan."
            action={isBooked ? 'View details' : 'Book call'}
          />
          <ActionCard
            href="/client/prep"
            title="Prep for call"
            description="Use the checklist to bring the exact metrics and blockers we need."
            action="Prep for call"
          />
          <ActionCard
            href="/client/scan"
            title="View diagnostic"
            description="Open your full score, grouped responses, and key signal breakdown."
            action="View diagnostic"
          />
          <ActionCard
            href="/client/files"
            title="Upload documents"
            description="Share reports, exports, and supporting files ahead of your working session."
            action="Upload"
          />
        </div>
      </section>

      <section className="rounded-card border border-border/70 bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">What happens next</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. We review your diagnostic and uploaded context before your session.</li>
          <li>2. During the call we prioritize your top operational bottlenecks.</li>
          <li>3. You leave with a clear 90-day action path and owner-level priorities.</li>
        </ol>
      </section>
    </div>
  );
}
