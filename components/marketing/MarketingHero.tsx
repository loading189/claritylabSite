import { ReactNode } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { sharedMarketingContent } from '@/content/marketing';
import { pickVariant } from '@/content/variants';
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
  trackingEvent = 'resource_cta_click',
  trackingPage = 'marketing_hero',
  children,
  className,
}: MarketingHeroProps) {
  const ctas = pickVariant(sharedMarketingContent.hero.ctas);

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
        {ctas.map((cta, index) => (
          <Button
            key={cta.href}
            href={cta.href}
            variant={cta.variant}
            trackingEvent={index === 0 ? trackingEvent : undefined}
            trackingProps={index === 0 ? { page: trackingPage } : undefined}
          >
            {cta.label}
          </Button>
        ))}
      </div>
      {children}
    </div>
  );
}
