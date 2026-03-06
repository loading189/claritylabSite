import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

type CalloutCTAProps = {
  trackingEvent?: string;
  trackingPage?: string;
};

export function CalloutCTA({
  trackingEvent = 'resource_cta_click',
  trackingPage = 'callout_cta',
}: CalloutCTAProps) {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="neu-card rounded-2xl border-accent/30 p-8 sm:p-10">
          <h2 className="heading-lg text-text">
            Start with a practical resource
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Grab the AR checklist or sample report first. If you want help after
            that, we can walk through your situation together on a call.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href="/resources/ar-recovery-checklist"
              trackingEvent={trackingEvent}
              trackingProps={{ page: trackingPage }}
            >
              Get the AR Checklist
            </Button>
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                variant="ghost"
                trackingEvent="booking_click"
                trackingProps={{ page: `${trackingPage}_secondary` }}
              >
                Book a Call
              </Button>
            ) : null}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-muted"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
