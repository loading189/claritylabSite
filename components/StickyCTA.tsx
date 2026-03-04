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
      <div aria-hidden className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          {hasPrimary ? (
            <a
              href={runtimeConfig.booking.calendlyUrl}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white no-underline"
              onClick={() => track('booking_click', { page: 'sticky_cta' })}
            >
              Book a call
            </a>
          ) : null}
          {hasPhone ? (
            <a
              href={`tel:${runtimeConfig.site.phone}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 no-underline"
            >
              Text
            </a>
          ) : null}
          {hasEmail ? (
            <a
              href={`mailto:${runtimeConfig.site.email}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 no-underline"
            >
              Email
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
