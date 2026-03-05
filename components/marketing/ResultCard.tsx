import { FitTier, PrimarySignal } from '@/lib/scan';

type ResultCardProps = {
  score: number;
  tier: FitTier;
  primarySignal: PrimarySignal;
  insights: string[];
};

const tierLabel: Record<FitTier, string> = {
  high_fit: 'High Fit',
  maybe: 'Maybe',
  not_fit_yet: 'Not a Fit Yet',
};

export function ResultCard({
  score,
  tier,
  primarySignal,
  insights,
}: ResultCardProps) {
  return (
    <div className="space-y-5 rounded-card border border-border bg-surfaceRaised p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Operational Health Score</p>
          <p className="text-4xl font-bold text-accent">{score}</p>
        </div>
        <div className="rounded-full border border-accent2/40 bg-accent2/15 px-3 py-1 text-sm font-semibold text-accent2">
          {tierLabel[tier]}
        </div>
      </div>
      <p className="text-sm text-muted">
        Primary signal:{' '}
        <span className="font-semibold text-text">
          {primarySignal.replace('_', ' ')}
        </span>
      </p>
      <ul className="space-y-2 text-sm text-muted">
        {insights.map((insight) => (
          <li
            key={insight}
            className="rounded-input border border-border/70 bg-surface px-3 py-2"
          >
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
