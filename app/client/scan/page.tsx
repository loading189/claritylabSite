import { Button } from '@/components/Button';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
import { getAdvisoryBriefFromDiagnostic } from '@/lib/diagnosticGuidance';
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
        description="Take the Clarity diagnostic to get a clear score, likely causes, and where to start."
        actionLabel="Start diagnostic"
        actionHref="/scan"
      />
    );
  }

  const brief = getAdvisoryBriefFromDiagnostic(diagnostic);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Diagnostic"
        title="Your scan results"
        description="Here’s what may be happening, where we would start, and how to get ready for your call."
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
            <Button href="/client/prep" className="w-full justify-center">
              Continue to prep
            </Button>
            <Button href={calendlyUrl} variant="ghost" className="w-full justify-center">
              Book your call
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Quick summary</h2>
        <p className="mt-3 text-sm text-muted">{brief.shortSummary}</p>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">What may be happening</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {brief.whatMayBeHappening.map((item) => (
            <li key={item} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Here’s where we would start</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {brief.whereToStart.map((step) => (
            <li key={step} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {step}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Short action plan</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
            <strong className="text-text">Step 1:</strong> {brief.firstStep}
          </li>
          {brief.nextTwoSteps.map((step, index) => (
            <li key={step} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              <strong className="text-text">Step {index + 2}:</strong> {step}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">You do not need to fix everything at once. This gives us a good place to begin.</p>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">What to bring to the call</h2>
        <p className="mt-2 text-sm text-muted">Bring what you already have. We can work from there.</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {brief.prepItems.map((item) => (
            <li key={item} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/client/prep" variant="secondary">
            Open prep page
          </Button>
          <Button href={calendlyUrl}>Book your call</Button>
          <Button href="/client/files" variant="ghost">
            Upload files now
          </Button>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">What we will watch first</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {brief.watchFor.map((item) => (
            <li key={item} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {brief.resources.length ? (
        <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Helpful resources</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {brief.resources.map((resource) => (
              <li key={resource.href}>
                <a href={resource.href} className="text-accent underline-offset-2 hover:underline">
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {brief.keyResponses.length ? (
        <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Your key responses</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {brief.keyResponses.map((bullet) => (
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
