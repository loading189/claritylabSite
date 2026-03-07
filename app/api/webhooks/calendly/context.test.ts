import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveBookingDiagnosticContext } from '@/lib/bookingContext';

test('deriveBookingDiagnosticContext prefers calendly query context', () => {
  const context = deriveBookingDiagnosticContext(
    {
      trackingCampaign: 'from_tracking',
      eventUri:
        'https://calendly.com/events/123?a1=diag_1&a2=pricing&a3=61&a4=priority&a5=capacity',
    },
    {
      diagnosticId: 'diag_fallback',
      signal: 'cashflow',
      secondarySignal: 'systems',
      score: 40,
      tier: 'priority',
    },
  );

  assert.deepEqual(context, {
    diagnosticId: 'diag_1',
    signal: 'pricing',
    secondarySignal: 'capacity',
    score: 61,
    tier: 'priority',
  });
});

test('deriveBookingDiagnosticContext falls back to diagnostic record values', () => {
  const context = deriveBookingDiagnosticContext(
    {
      eventUri: 'https://calendly.com/events/123',
    },
    {
      diagnosticId: 'diag_fallback',
      signal: 'cashflow',
      secondarySignal: 'visibility',
      score: 44,
      tier: 'priority',
    },
  );

  assert.equal(context.diagnosticId, 'diag_fallback');
  assert.equal(context.signal, 'cashflow');
  assert.equal(context.secondarySignal, 'visibility');
  assert.equal(context.score, 44);
  assert.equal(context.tier, 'priority');
});
