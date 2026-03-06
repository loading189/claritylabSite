import Link from 'next/link';

type InsightHighlightProps = {
  title: string;
  detail: string;
  href?: string;
  className?: string;
};

export function InsightHighlight({
  title,
  detail,
  href,
  className = '',
}: InsightHighlightProps) {
  return (
    <article className={`neu-card p-6 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent2">
        Insight highlight
      </p>
      <h3 className="mt-2 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm text-muted">{detail}</p>
      {href ? (
        <Link
          href={href}
          className="mt-3 inline-block text-sm font-semibold no-underline"
        >
          View insight
        </Link>
      ) : null}
    </article>
  );
}
