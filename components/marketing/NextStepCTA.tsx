import { Button } from '@/components/Button';
import { sharedMarketingContent } from '@/content/marketing';
import { pickVariant } from '@/content/variants';

type NextStepCTAProps = {
  title?: string;
  subtitle?: string;
  trackingEvent?: string;
  trackingPage?: string;
  className?: string;
};

export function NextStepCTA({
  title = sharedMarketingContent.nextStep.title,
  subtitle = sharedMarketingContent.nextStep.subtitle,
  trackingEvent = 'resource_cta_click',
  trackingPage = 'next_step_cta',
  className,
}: NextStepCTAProps) {
  const ctas = pickVariant(sharedMarketingContent.hero.ctas);

  return (
    <div className={className}>
      <h2 className="heading-md text-text">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        {subtitle}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
    </div>
  );
}
