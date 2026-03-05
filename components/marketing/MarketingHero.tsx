import { ReactNode } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { HeroBackdrop } from '@/components/HeroBackdrop';
import { siteConfig } from '@/content/site';

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
  trackingEvent = 'booking_click',
  trackingPage = 'marketing_hero',
  children,
  className,
}: MarketingHeroProps) {
  return (
    <div className={className}>
      {withBackdrop ? <HeroBackdrop /> : null}
      {badge ? <Badge>{badge}</Badge> : null}
      <h1 className="relative mt-4 text-balance text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.03] text-text">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          href={siteConfig.calendlyUrl || '/contact'}
          trackingEvent={trackingEvent}
          trackingProps={{ page: trackingPage }}
        >
          Book Audit
        </Button>
        <Button href="/sample-report" variant="ghost">
          View Sample Report
        </Button>
      </div>
      {children}
    </div>
  );
}
