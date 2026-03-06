import { Button } from '@/components/Button';
import { ActionCard } from '@/components/portal/ActionCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientEngagementReadModel } from '@/lib/clientEngagementReadModel';
import { getServerUser } from '@/lib/serverAuth';

function formatListDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(parsed);
}

export default async function ClientDashboard() {
  const user = await getServerUser();
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';

  if (!user?.email) {
    return (
      <EmptyState
        title="No active workspace yet"
        description="This workspace opens when your engagement starts. If you already booked a call, we will send access as soon as setup is complete."
        actionLabel="Book a call"
        actionHref={calendlyUrl}
      />
    );
  }

  const model = await getClientEngagementReadModel({
    email: user.email,
    userId: user.userId,
  });

  if (model.recordsUnavailable) {
    return (
      <EmptyState
        title="Portal records are temporarily unavailable"
        description="We couldn't load your portal records right now. Contact us and we'll help you regain access quickly."
        actionLabel="Contact support"
        actionHref="/contact"
      />
    );
  }

  if (!model.diagnosticContext.hasDiagnostic) {
    return (
      <EmptyState
        title="No active workspace yet"
        description="This workspace opens when your engagement starts. If you already booked a call, we will send access as soon as setup is complete."
        actionLabel="Book a call"
        actionHref={calendlyUrl}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Client delivery dashboard"
        title="Overview"
        description="Here’s where things stand, what we need from you next, and what has already been delivered."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Engagement status</p>
          <p className="mt-2 text-lg font-semibold text-text">{model.engagementStatusLabel}</p>
          <p className="mt-2 text-sm text-muted">{model.bookedSessionSummary}</p>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Next action</p>
          <p className="mt-2 text-lg font-semibold text-text">{model.nextAction.label}</p>
          <p className="mt-2 text-sm text-muted">{model.nextAction.description}</p>
          <Button href={model.nextAction.href} className="mt-4">
            Continue
          </Button>
        </article>
        <article className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Next milestone</p>
          <p className="mt-2 text-lg font-semibold text-text">{model.nextMilestone}</p>
          <p className="mt-2 text-sm text-muted">{model.latestReportSummary}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Open requests</h2>
          <p className="mt-2 text-sm text-muted">Here’s what we need from you next.</p>
          {model.outstandingRequests.length ? (
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {model.outstandingRequests.map((request) => (
                <li key={request.id} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                  {request.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-input border border-dashed border-border px-3 py-3 text-sm text-muted">
              You are up to date right now.
            </p>
          )}
          <Button href="/client/prep" variant="ghost" className="mt-4">
            Open requests page
          </Button>
        </article>

        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Recent deliverables</h2>
          <p className="mt-2 text-sm text-muted">Here’s what has been delivered so far.</p>
          {model.recentDeliverables.length ? (
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {model.recentDeliverables.map((item) => (
                <li key={item.id} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                  <p className="font-medium text-text">{item.title}</p>
                  <p className="text-xs text-muted">Delivered {formatListDate(item.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-input border border-dashed border-border px-3 py-3 text-sm text-muted">
              No reports delivered yet. We will post them here as they are ready.
            </p>
          )}
          <Button href="/client/reports" variant="ghost" className="mt-4">
            Open reports
          </Button>
        </article>
      </section>

      <section className="rounded-card border border-border/70 bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Engagement timeline</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          {model.milestones.map((step) => (
            <li key={step.key} className="flex items-center gap-3 rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              <span className="text-base" aria-hidden>
                {step.completed ? '✅' : '◻️'}
              </span>
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
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
            description="See what we need from you next before and after each session."
            action="Open requests"
          />
          <ActionCard
            href="/client/files"
            title="Uploads and documents"
            description="Upload what you already have. We can work from there."
            action="Upload files"
          />
          <ActionCard
            href={model.nextAction.href}
            title="Next steps"
            description="Keep momentum with practical next actions for this engagement."
            action="Review next steps"
          />
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text">Diagnostic context</h2>
          <span className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Score {model.diagnosticContext.score ?? '—'}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">Your earlier scan is still here for reference while delivery work moves forward.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Tier</span>
            <span className="mt-1 block font-semibold capitalize text-text">{model.diagnosticContext.tier ?? 'Pending'}</span>
          </p>
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Primary signal</span>
            <span className="mt-1 block font-semibold capitalize text-text">
              {model.diagnosticContext.primarySignal ?? 'Pending'}
            </span>
          </p>
          <p className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm">
            <span className="block text-xs uppercase tracking-[0.12em] text-muted">Summary</span>
            <span className="mt-1 block text-text">{model.diagnosticContext.summary}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-muted">Latest upload: {model.latestUploadSummary}</p>
        <Button href="/client/scan" variant="ghost" className="mt-4">
          Open full diagnostic details
        </Button>
      </section>
    </div>
  );
}
