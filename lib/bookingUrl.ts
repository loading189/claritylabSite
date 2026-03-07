import type { DiagnosticRecord } from '@/lib/diagnosticsData';

function getBookingReturnUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const normalized = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  return `${normalized}/booking/confirmed`;
}

export function buildDiagnosticBookingUrl(
  baseUrl: string,
  diagnostic: Pick<
    DiagnosticRecord,
    'id' | 'primarySignal' | 'secondarySignal' | 'score' | 'tier'
  >,
) {
  const normalizedBase = baseUrl || '/contact';
  const isAbsolute = /^https?:\/\//i.test(normalizedBase);
  const url = new URL(normalizedBase, 'http://localhost:3000');
  url.searchParams.set('utm_source', 'diagnostic_scan');
  url.searchParams.set('utm_medium', 'diagnostic_result');
  url.searchParams.set('utm_campaign', diagnostic.id);
  url.searchParams.set('a1', diagnostic.id);
  url.searchParams.set('a2', diagnostic.primarySignal);
  url.searchParams.set('a3', String(diagnostic.score));
  url.searchParams.set('a4', diagnostic.tier);
  url.searchParams.set('a5', diagnostic.secondarySignal || '');
  url.searchParams.set('location', getBookingReturnUrl());
  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
}
