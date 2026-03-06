import { Button } from '@/components/Button';
import { EmptyState } from '@/components/portal/EmptyState';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
import { getLatestDiagnosticByEmailWithStatus } from '@/lib/diagnosticsData';
import { getDiagnosticInsights, getGroupedAnswers } from '@/lib/diagnosticsPresentation';
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
        description="We couldn't load your response data right now. Contact support and we'll help resolve access quickly."
        actionLabel="Contact support"
        actionHref="/contact"
      />
    );
  }

  if (!diagnostic) {
    return (
      <EmptyState
        title="No diagnostic on file"
        description="Take the Clarity diagnostic to unlock your score summary and call planning workflow."
        actionLabel="Start diagnostic"
        actionHref="/scan"
      />
    );
  }

  const groupedAnswers = getGroupedAnswers(diagnostic.answers);
  const insights = getDiagnosticInsights(diagnostic);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Diagnostic"
        title="Your diagnostic result"
        description="This readout summarizes your current operating signal and gives us the baseline for your call."
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
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Next action</p>
            <Button href={calendlyUrl} className="mt-2">Book call</Button>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Key signals</h2>
        {insights.length ? (
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {insights.map((insight) => (
              <li key={insight} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                {insight}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">We&apos;ll review your responses together during the call.</p>
        )}
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Response detail</h2>
        <ul className="mt-4 space-y-3">
          {groupedAnswers.map((answer) => (
            <li key={answer.key} className="rounded-input border border-border/70 bg-surfaceRaised px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{answer.step}</p>
              <p className="mt-1 text-sm font-semibold text-text">{answer.question}</p>
              <p className="mt-1 text-sm text-muted">{answer.value}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
