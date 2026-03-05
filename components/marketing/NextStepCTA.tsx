import { Button } from '@/components/Button';

type NextStepCTAProps = {
  title?: string;
  subtitle?: string;
  trackingEvent?: string;
  trackingPage?: string;
  className?: string;
};

export function NextStepCTA({
  title = 'Next step: get this for your business',
  subtitle = 'Run the Clarity Scan for a quick qualification and tailored next step before booking.',
  trackingEvent = 'scan_cta_click',
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
    </div>
  );
}
