import { ReactNode } from 'react';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandConcept, BrandIcon } from '@/components/brand/iconMap';

type StatCardProps = {
  label: string;
  value: ReactNode;
  note?: string;
  className?: string;
  icon?: BrandConcept;
};

export function StatCard({
  label,
  value,
  note,
  className = '',
  icon = 'proof',
}: StatCardProps) {
  return (
    <article className={`neu-card p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent2">
          {label}
        </p>
        <BrandIcon concept={icon} size={16} />
      </div>
      <p className="stat-number mt-3 text-3xl font-semibold text-text">
        {value}
      </p>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
      <DataMotif variant="ticks" className="mt-3" />
    </article>
  );
}
