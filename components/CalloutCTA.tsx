import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

export function CalloutCTA() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="rounded-2xl border border-accent/40 bg-surface p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-text">
            Ready to book your audit?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Bring your current numbers and we will map where margin, cash flow,
            and operational execution are breaking.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                trackingEvent="booking_click"
                trackingProps={{ page: 'callout_cta' }}
              >
                Book Audit
              </Button>
            ) : null}
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
