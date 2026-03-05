import { Button } from '@/components/Button';
import { siteConfig } from '@/content/site';

type NextStepCTAProps = {
  title?: string;
  subtitle?: string;
  trackingEvent?: string;
  trackingPage?: string;
  className?: string;
};

export function NextStepCTA({
  title = 'Next step: get this for your business',
  subtitle = 'Bring your data, and you’ll get a deliverable-driven audit with clear next actions and optional implementation support.',
  trackingEvent = 'booking_click',
  trackingPage = 'next_step_cta',
  className,
}: NextStepCTAProps) {
  return (
    <div className={className}>
      <h2 className="text-3xl font-semibold text-text">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        {subtitle}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
    </div>
  );
}
