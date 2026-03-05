import { ReactNode } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { BrandedBackdrop } from '@/components/brand/BrandedBackdrop';
import { BrandIcon, BrandConcept } from '@/components/brand/iconMap';
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
  accentIcon?: BrandConcept;
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
  accentIcon = 'signal',
}: MarketingHeroProps) {
  return (
    <div className={`relative isolate ${className || ''}`}>
      {withBackdrop ? <BrandedBackdrop withScan /> : null}
      {badge ? (
        <div className="relative z-10 inline-flex items-center gap-2">
          <BrandIcon concept={accentIcon} size={16} variant="yellow" />
          <Badge>{badge}</Badge>
        </div>
      ) : null}
      <h1 className="heading-xl relative z-10 mt-4 text-balance font-bold text-text">
        {title}
      </h1>
      <p className="relative z-10 mt-5 max-w-2xl text-base text-muted sm:text-lg">
        {description}
      </p>
      <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
        <Button href="/resources/ar-recovery-checklist" variant="secondary">
          Get the AR Checklist
        </Button>
      </div>
      {children}
    </div>
  );
}
