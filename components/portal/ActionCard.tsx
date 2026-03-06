import Link from 'next/link';

export function ActionCard({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-card border border-border/80 bg-surface p-5 no-underline shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surfaceRaised"
    >
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {action}
      </p>
    </Link>
  );
}
