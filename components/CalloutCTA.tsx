import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

export function CalloutCTA() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="rounded-2xl bg-brand-900 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-semibold">Book a 15-min Clarity Call</h2>
          <p className="mt-3 max-w-2xl text-sm text-brand-100 sm:text-base">
            If you run an HVAC, plumbing, electrical, or mechanical service business and want clearer decisions around
            cash flow and operations, this is a no-pitch clarity call.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {runtimeConfig.booking.enabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                variant="secondary"
                className="bg-white text-brand-900 hover:bg-brand-100"
                trackingEvent="booking_click"
                trackingProps={{ page: 'callout_cta' }}
              >
                Open booking
              </Button>
            ) : null}
            <a href={`mailto:${siteConfig.email}`} className="text-sm text-brand-100">
              {siteConfig.email}
            </a>
            {runtimeConfig.site.hasPhone ? (
              <a href={`tel:${siteConfig.phone}`} className="text-sm text-brand-100">
                {siteConfig.phone}
              </a>
            ) : null}
          </div>
          <p className="mt-4 text-xs text-brand-100">No pitch • Just clarity. Not accounting or legal advice; operational guidance.</p>
        </div>
      </Container>
    </section>
  );
}
