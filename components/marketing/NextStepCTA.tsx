import { Button } from '@/components/Button';

type NextStepCTAProps = {
  title?: string;
  subtitle?: string;
  trackingEvent?: string;
  trackingPage?: string;
  className?: string;
};

export function NextStepCTA({
  title = 'Pick your next step',
  subtitle = 'Start with a sample report or checklist. The diagnostic is available when you want a deeper read.',
  trackingEvent = 'resource_cta_click',
  trackingPage = 'next_step_cta',
  className,
}: NextStepCTAProps) {
  return (
    <div className={className}>
      <h2 className="heading-md text-text">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        {subtitle}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          href="/resources/ar-recovery-checklist"
          trackingEvent={trackingEvent}
          trackingProps={{ page: trackingPage }}
        >
          Get the AR Checklist
        </Button>
        <Button href="/sample-report" variant="ghost">
          View Sample Report
        </Button>
        <Button href="/scan" variant="secondary">
          Take the Diagnostic
        </Button>
      </div>
    </div>
  );
}
