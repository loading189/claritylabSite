import { Button } from '@/components/Button';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
import { getDiagnosticGuidance } from '@/lib/diagnosticGuidance';
import { getLatestDiagnosticByEmailWithStatus } from '@/lib/diagnosticsData';
import { getServerUser } from '@/lib/serverAuth';

export default async function ClientScanPage() {
  const user = await getServerUser();
  const diagnosticResult = user?.email
    ? await getLatestDiagnosticByEmailWithStatus(user.email)
    : { record: null, status: 'error' as const };
  const diagnostic = diagnosticResult.record;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';

  if (shouldShowUnavailableRecordsState(diagnosticResult.status, Boolean(diagnostic))) {
    return (
      <EmptyState
        title="Diagnostic data unavailable"
        description="We couldn't load your scan right now. Contact support and we'll help fix access quickly."
        actionLabel="Contact support"
        actionHref="/contact"
      />
    );
  }

  if (!diagnostic) {
    return (
      <EmptyState
        title="No diagnostic on file"
        description="Take the Clarity diagnostic to get a clear score, likely causes, and next steps."
        actionLabel="Start diagnostic"
        actionHref="/scan"
      />
    );
  }

  const guidance = getDiagnosticGuidance(diagnostic);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Diagnostic"
        title="Your scan results"
        description="Here’s what may be slowing things down, and where we would start."
      />

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Score</p>
            <p className="mt-2 font-mono text-4xl font-semibold text-text">{diagnostic.score}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Tier</p>
            <p className="mt-2 text-lg font-semibold capitalize text-text">{diagnostic.tier}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Primary signal</p>
            <p className="mt-2 text-lg font-semibold capitalize text-text">{diagnostic.primarySignal}</p>
          </div>
          <div className="space-y-2">
            <Button href={calendlyUrl} className="w-full justify-center">Book a call</Button>
            <Button href="/client/prep" variant="ghost" className="w-full justify-center">
              Continue in portal
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">What may be happening</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {guidance.explanations.map((item) => (
            <li key={item} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Where to start</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {guidance.nextSteps.map((step) => (
            <li key={step} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {step}
            </li>
          ))}
        </ul>
      </section>

      {guidance.resources.length ? (
        <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Helpful resources</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {guidance.resources.map((resource) => (
              <li key={resource.href}>
                <a href={resource.href} className="text-accent underline-offset-2 hover:underline">
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {guidance.summaryBullets.length ? (
        <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Your key responses</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {guidance.summaryBullets.map((bullet) => (
              <li key={bullet} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                {bullet}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
