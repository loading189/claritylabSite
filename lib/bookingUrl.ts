import type { DiagnosticRecord } from '@/lib/diagnosticsData';

export function buildDiagnosticBookingUrl(
  baseUrl: string,
  diagnostic: Pick<DiagnosticRecord, 'id' | 'primarySignal' | 'score' | 'tier'>,
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
  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
}
