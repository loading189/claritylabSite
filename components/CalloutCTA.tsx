import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

type CalloutCTAProps = {
  trackingEvent?: string;
  trackingPage?: string;
};

export function CalloutCTA({
  trackingEvent = 'booking_click',
  trackingPage = 'callout_cta',
}: CalloutCTAProps) {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="neu-card rounded-2xl border-accent/30 p-8 sm:p-10">
          <h2 className="heading-lg text-text">Ready to book your audit?</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Bring your current numbers and we will map where margin, cash flow,
            and operational execution are breaking.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                trackingEvent={trackingEvent}
                trackingProps={{ page: trackingPage }}
              >
                Book Audit
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
