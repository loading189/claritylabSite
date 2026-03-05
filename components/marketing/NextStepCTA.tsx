import { BrandedBackdrop } from '@/components/brand/BrandedBackdrop';
import { BrandIcon } from '@/components/brand/iconMap';
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
    <div
      className={`relative isolate overflow-hidden rounded-card p-1 ${className || ''}`}
    >
      <BrandedBackdrop withScan />
      <div className="relative z-10 rounded-card p-4">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          <BrandIcon concept="lead" size={15} />
          Clarity Labs next step
        </p>
        <h2 className="heading-md mt-2 text-text">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          {subtitle}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
      </div>
    </div>
  );
}
