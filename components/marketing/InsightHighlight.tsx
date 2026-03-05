import Link from 'next/link';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandConcept, BrandIcon } from '@/components/brand/iconMap';

type InsightHighlightProps = {
  title: string;
  detail: string;
  href?: string;
  className?: string;
  icon?: BrandConcept;
};

export function InsightHighlight({
  title,
  detail,
  href,
  className = '',
  icon = 'signal',
}: InsightHighlightProps) {
  return (
    <article className={`neu-card p-6 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent2">
          Insight highlight
        </p>
        <BrandIcon concept={icon} size={16} />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm text-muted">{detail}</p>
      <DataMotif variant="signal" className="mt-3" />
      {href ? (
        <Link
          href={href}
          className="mt-3 inline-block text-sm font-semibold no-underline"
        >
          Read more →
        </Link>
      ) : null}
    </article>
  );
}
