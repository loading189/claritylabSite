import { ReactNode } from 'react';

type MarketingSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: MarketingSectionHeaderProps) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-text sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
