import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDiagnosticBookingUrl } from '@/lib/bookingUrl';

test('buildDiagnosticBookingUrl carries diagnostic context and redirect location', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://claritylabs.test';

  const url = buildDiagnosticBookingUrl('https://calendly.com/clarity/call', {
    id: 'diag_1',
    primarySignal: 'cashflow',
    secondarySignal: 'capacity',
    score: 72,
    tier: 'critical',
  });

  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get('a1'), 'diag_1');
  assert.equal(parsed.searchParams.get('a2'), 'cashflow');
  assert.equal(parsed.searchParams.get('a3'), '72');
  assert.equal(parsed.searchParams.get('a4'), 'critical');
  assert.equal(parsed.searchParams.get('a5'), 'capacity');
  assert.equal(
    parsed.searchParams.get('location'),
    'https://claritylabs.test/booking/confirmed',
  );
});
