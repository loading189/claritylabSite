import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getLatestDiagnosticByEmail } from '@/lib/diagnosticsData';
import { getDiagnosticInsights, getGroupedAnswers } from '@/lib/diagnosticsPresentation';
import { getServerUser } from '@/lib/serverAuth';

export default async function ClientScanPage() {
  const user = await getServerUser();
  const diagnostic = user?.email ? await getLatestDiagnosticByEmail(user.email) : null;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';

  if (!diagnostic) {
    return (
      <Card title="No diagnostic found">
        <p>Take the Clarity Scan first so we can personalize your call prep.</p>
        <Button href="/scan" className="mt-4">
          Start Diagnostic
        </Button>
      </Card>
    );
  }

  const groupedAnswers = getGroupedAnswers(diagnostic.answers);
  const insights = getDiagnosticInsights(diagnostic);

  return (
    <div className="space-y-4">
      <Card title="Diagnostic score">
        <p>
          Score <strong>{diagnostic.score}</strong> places you in the <strong className="capitalize">{diagnostic.tier}</strong> tier, with{' '}
          <strong className="capitalize">{diagnostic.primarySignal}</strong> as the primary signal.
        </p>
      </Card>

      <Card title="Your answers">
        <ul className="space-y-3">
          {groupedAnswers.map((answer) => (
            <li key={answer.key} className="rounded-input border border-border/70 bg-surface px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted">{answer.step}</p>
              <p className="text-sm font-semibold text-text">{answer.question}</p>
              <p>{answer.value}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Key insights">
        {insights.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        ) : (
          <p>We&apos;ll review your responses together during the call.</p>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button href={calendlyUrl}>Book Call</Button>
        <Button href="/scan" variant="ghost">
          Start Over
        </Button>
      </div>
    </div>
  );
}
