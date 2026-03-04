'use client';

import { runtimeConfig } from '@/content/runtime';
import { track } from '@/lib/track';

export function StickyCTA() {
  const hasPrimary = runtimeConfig.featureFlags.isBookingEnabled;
  const hasEmail = Boolean(runtimeConfig.site.email);
  const hasPhone = runtimeConfig.site.hasPhone;

  if (!hasPrimary && !hasEmail && !hasPhone) {
    return null;
  }

  return (
    <>
      <div aria-hidden className="h-24 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-50 p-3 md:hidden">
        <div className="sticky-cta-shell mx-auto flex max-w-3xl items-center gap-2 rounded-card border border-border bg-surface/90 p-2 shadow-raised backdrop-blur-xl">
          {hasPrimary ? (
            <a
              href={runtimeConfig.booking.calendlyUrl}
              className="motion-safe-transform inline-flex flex-1 items-center justify-center rounded-button border border-accent/30 bg-accent px-3 py-2 text-sm font-semibold text-white no-underline shadow-soft transition duration-200 hover:-translate-y-px hover:shadow-raised active:translate-y-px active:shadow-pressed"
              onClick={() => track('booking_click', { page: 'sticky_cta' })}
            >
              Book a call
            </a>
          ) : null}
          {hasPhone ? (
            <a
              href={`tel:${runtimeConfig.site.phone}`}
              className="motion-safe-transform inline-flex items-center justify-center rounded-button border border-border bg-surfaceRaised px-3 py-2 text-sm font-semibold text-text no-underline transition duration-200 hover:-translate-y-px hover:shadow-soft active:translate-y-px"
            >
              Text
            </a>
          ) : null}
          {hasEmail ? (
            <a
              href={`mailto:${runtimeConfig.site.email}`}
              className="motion-safe-transform inline-flex items-center justify-center rounded-button border border-border bg-surfaceRaised px-3 py-2 text-sm font-semibold text-text no-underline transition duration-200 hover:-translate-y-px hover:shadow-soft active:translate-y-px"
            >
              Email
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
