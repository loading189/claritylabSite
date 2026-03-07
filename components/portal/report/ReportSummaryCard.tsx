export function ReportSummaryCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="rounded-input border border-border bg-surfaceRaised p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-text">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </article>
  );
}
