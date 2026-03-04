export function ScoreBadge({ tier }: { tier: string }) {
  const styles = tier === 'Hot' ? 'bg-emerald-100 text-emerald-800' : tier === 'Warm' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>{tier} fit</span>;
}
