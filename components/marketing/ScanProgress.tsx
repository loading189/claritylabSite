'use client';

export function ScanProgress({ step, total }: { step: number; total: number }) {
  const percent = Math.max(0, Math.min(100, Math.round((step / total) * 100)));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>
          Step {step} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-surfaceRaised">
        <div
          className="h-2 rounded-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
