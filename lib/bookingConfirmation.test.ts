import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatScheduledWindow,
  getPrepChecklist,
  getSignalMeaning,
  parseBookingConfirmationContext,
} from '@/lib/bookingConfirmation';

test('parseBookingConfirmationContext reads explicit and calendly alias params', () => {
  const context = parseBookingConfirmationContext({
    diagnosticId: 'diag_123',
    a2: 'cash_flow',
    a5: 'capacity',
    a3: '67',
    a4: 'priority',
    startTime: '2025-05-12T18:00:00.000Z',
    timezone: 'America/New_York',
    bookingSummary: 'Clarity Call',
  });

  assert.equal(context.diagnosticId, 'diag_123');
  assert.equal(context.signal, 'cash_flow');
  assert.equal(context.secondarySignal, 'capacity');
  assert.equal(context.score, 67);
  assert.equal(context.tier, 'priority');
  assert.equal(context.timezone, 'America/New_York');
  assert.equal(context.bookingSummary, 'Clarity Call');
});

test('getSignalMeaning and checklist return plainspoken cash guidance', () => {
  const meaning = getSignalMeaning('cash flow');
  const checklist = getPrepChecklist('cash_flow');

  assert.ok(meaning.includes('money is getting stuck'));
  assert.ok(checklist.some((item) => item.includes('A/R aging report')));
  assert.ok(checklist.some((item) => item.includes('Bring what you already have')));
});

test('formatScheduledWindow safely formats valid time and returns null for invalid', () => {
  const formatted = formatScheduledWindow({
    startTime: '2025-05-12T18:00:00.000Z',
    timezone: 'America/New_York',
  });
  assert.ok(formatted);

  const invalid = formatScheduledWindow({ startTime: 'bad-value' });
  assert.equal(invalid, null);
});
