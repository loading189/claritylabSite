import { ScanResult } from '@/lib/scan';

export function ResultCard({ result }: { result: ScanResult }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {result.tier} priority
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-text">
        Score: {result.score}
      </h3>
      <p className="mt-2 text-sm text-muted">
        Primary signal: {result.primarySignal}
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
        {result.insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-medium text-text">
        {result.qualified
          ? 'You are a fit for a Clarity Scan follow-up.'
          : 'You may still benefit from the checklist + sample report first.'}
      </p>
    </div>
  );
}
