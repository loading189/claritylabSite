import Link from 'next/link';
import { ReactNode } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { HeroBackdrop } from '@/components/HeroBackdrop';

type MarketingHeroProps = {
  badge?: string;
  title: string;
  description: string;
  withBackdrop?: boolean;
  trackingEvent?: string;
  trackingPage?: string;
  children?: ReactNode;
  className?: string;
};

export function MarketingHero({
  badge,
  title,
  description,
  withBackdrop = false,
  trackingEvent = 'scan_click',
  trackingPage = 'marketing_hero',
  children,
  className,
}: MarketingHeroProps) {
  return (
    <div className={className}>
      {withBackdrop ? <HeroBackdrop /> : null}
      {badge ? <Badge>{badge}</Badge> : null}
      <h1 className="heading-xl relative mt-4 text-balance font-bold text-text">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          href="/scan"
          trackingEvent={trackingEvent}
          trackingProps={{ page: trackingPage }}
        >
          Start Diagnostic
        </Button>
        <Button href="/sample-report" variant="ghost">
          View Sample Report
        </Button>
        <Button href="/resources/ar-recovery-checklist" variant="secondary">
          Get the AR Checklist
        </Button>
      </div>
      <p className="text-xs text-muted">
        Explore more: <Link href="/scan">Diagnostic</Link> ·{' '}
        <Link href="/case-studies">Case Studies</Link> ·{' '}
        <Link href="/sample-report">Sample Report</Link> ·{' '}
        <Link href="/insights">Insights</Link> ·{' '}
        <Link href="/resources/ar-recovery-checklist">AR Checklist</Link> ·{' '}
        <Link href="/start-here">Start Here</Link>
      </p>
      {children}
    </div>
  );
}
