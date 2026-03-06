import { Button } from '@/components/Button';
import { ActionCard } from '@/components/portal/ActionCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientByEmail } from '@/lib/bookingsData';
import { getPortalEngagementStage, shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
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

  // Transitional source-of-truth note:
  // We currently use booking records to infer active engagement while preserving diagnostic context.
  const client = user?.email ? await getClientByEmail(user.email) : null;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';
  const isBooked = searchParams.booked === '1' || client?.status === 'booked';
  const engagementStage = getPortalEngagementStage({
    hasDiagnostic: Boolean(diagnostic),
    isSessionBooked: isBooked,
  });
  const insights = diagnostic ? getDiagnosticInsights(diagnostic) : [];

  if (shouldShowUnavailableRecordsState(diagnosticResult.status, Boolean(diagnostic))) {
    return (
      <EmptyState
        title="Portal records are temporarily unavailable"
        description="We couldn't load your portal records right now. Contact us and we'll help you regain access quickly."
        actionLabel="Contact support"
        actionHref="/contact"
      />
    );
  }

  if (!diagnostic) {
    return (
      <EmptyState
        title="No active workspace yet"
        description="This workspace opens when your engagement starts. If you already booked a call, we will send access as soon as setup is complete."
        actionLabel="Book a call"
        actionHref={calendlyUrl}
      />
    );
  }

  const statusLabel =
    engagementStage === 'active_engagement'
      ? 'Active engagement'
      : engagementStage === 'qualified_lead'
        ? 'Booked pending'
        : 'Getting started';

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Client delivery dashboard"
        title="Overview"
        description="Here’s what we’re working through, what we need from you next, and where to find your files and reports."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Engagement status</p>
          <p className="mt-2 text-lg font-semibold text-text">{statusLabel}</p>
          <p className="mt-2 text-sm text-muted">
            {isBooked
              ? `Session scheduled for ${formatBookedDate(client?.booked_start_time, client?.booked_timezone)}.`
              : 'Book your call and we will move this into active delivery.'}
          </p>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Next step</p>
          <p className="mt-2 text-lg font-semibold text-text">{isBooked ? 'Send prep items' : 'Book your call'}</p>
          <p className="mt-2 text-sm text-muted">
            {isBooked
              ? 'Use the prep page to share numbers, blockers, and requests before we meet.'
              : 'Once your call is booked, we will start your delivery checklist.'}
          </p>
          <Button href={isBooked ? '/client/prep' : calendlyUrl} className="mt-4">
            {isBooked ? 'Open requests & prep' : 'Book call'}
          </Button>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Workspace access</p>
          <p className="mt-2 text-lg font-semibold text-text">Ready</p>
          <p className="mt-2 text-sm text-muted">{user?.email || 'Your client workspace is active.'}</p>
        </article>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Delivery workspace</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            href="/client/reports"
            title="Reports"
            description="Open the latest reports and delivery outputs in one place."
            action="View reports"
          />
          <ActionCard
            href="/client/prep"
            title="Requests"
            description="Here’s what we need from you next before and after each working session."
            action="Open requests"
          />
          <ActionCard
            href="/client/files"
            title="Uploads & documents"
            description="You can upload what you already have. We will work from there."
            action="Upload files"
          />
          <ActionCard
            href={isBooked ? '/client/prep' : calendlyUrl}
            title="Next steps"
            description="Keep momentum with practical next actions for this engagement."
            action={isBooked ? 'Review next steps' : 'Book call'}
          />
        </div>
      </section>

      <section className="rounded-card border border-border/70 bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Deliverables and timeline</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. We review your uploaded context and current bottlenecks.</li>
          <li>2. We meet to agree on priorities and practical actions.</li>
          <li>3. We share reports and next steps so execution stays clear.</li>
        </ol>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text">Diagnostic context</h2>
          <span className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Score {diagnostic.score}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">Your earlier scan is still here for reference while delivery work moves forward.</p>
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
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Summary</span>
            <span className="mt-1 block text-text">{insights[0] || 'Your full readout is ready for review.'}</span>
          </p>
        </div>
        <Button href="/client/scan" variant="ghost" className="mt-4">
          Open full diagnostic details
        </Button>
      </section>
    </div>
  );
}
