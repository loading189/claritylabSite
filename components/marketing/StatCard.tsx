import { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  note?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  note,
  className = '',
}: StatCardProps) {
  return (
    <article className={`neu-card p-6 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent2">
        {label}
      </p>
      <p className="stat-number mt-3 text-3xl font-semibold text-text">
        {value}
      </p>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
    </article>
  );
}
