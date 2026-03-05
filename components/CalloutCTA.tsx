import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

type CalloutCTAProps = {
  trackingEvent?: string;
  trackingPage?: string;
};

export function CalloutCTA({
  trackingEvent = 'scan_click',
  trackingPage = 'callout_cta',
}: CalloutCTAProps) {
  return (
    <section className="py-sectionPaddingY">
      <Container>
        <div className="neu-card rounded-2xl border-accent/25 p-cardPad sm:p-10">
          <h2 className="heading-lg text-text">
            Ready to diagnose the next move?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Start with Clarity Scan to qualify the right next step, then book a
            focused call if the fit is strong.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href="/scan"
              trackingEvent={trackingEvent}
              trackingProps={{ page: trackingPage }}
            >
              Start Diagnostic
            </Button>
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                variant="ghost"
                trackingEvent="booking_click"
                trackingProps={{ page: `${trackingPage}_secondary` }}
              >
                Book a 20-minute Clarity Call
              </Button>
            ) : null}
            <Button href="/sample-report" variant="ghost">
              View Sample Report
            </Button>
            <Button href="/resources/ar-recovery-checklist" variant="secondary">
              Get the AR Checklist
            </Button>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-muted"
            >
              {siteConfig.email}
            </a>
            {runtimeConfig.site.hasPhone ? (
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-sm text-muted"
              >
                {siteConfig.phone}
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
