import { createHmac } from 'crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseCalendlySignature,
  verifyCalendlyWebhookSignature,
} from '@/lib/calendlyWebhook';

test('parseCalendlySignature parses timestamp and v1 digest', () => {
  const parsed = parseCalendlySignature('t=1700000000,v1=abc123');
  assert.equal(parsed?.timestamp, 1700000000);
  assert.equal(parsed?.signature, 'abc123');
});

test('verifyCalendlyWebhookSignature returns ok for valid signature', () => {
  const signingKey = 'test_signing_key';
  const rawBody = JSON.stringify({ event: 'invitee.created' });
  const timestamp = 1700000000;
  const digest = createHmac('sha256', signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const result = verifyCalendlyWebhookSignature({
    rawBody,
    signatureHeader: `t=${timestamp},v1=${digest}`,
    signingKey,
    nowMs: timestamp * 1000,
    toleranceSeconds: 300,
  });

  assert.equal(result.ok, true);
});

test('verifyCalendlyWebhookSignature rejects invalid signature', () => {
  const result = verifyCalendlyWebhookSignature({
    rawBody: '{"event":"invitee.created"}',
    signatureHeader: 't=1700000000,v1=bad',
    signingKey: 'test_signing_key',
    nowMs: 1700000000 * 1000,
    toleranceSeconds: 300,
  });

  assert.equal(result.ok, false);
});

test('verifyCalendlyWebhookSignature rejects out-of-tolerance timestamp', () => {
  const signingKey = 'test_signing_key';
  const rawBody = JSON.stringify({ event: 'invitee.created' });
  const timestamp = 1700000000;
  const digest = createHmac('sha256', signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const result = verifyCalendlyWebhookSignature({
    rawBody,
    signatureHeader: `t=${timestamp},v1=${digest}`,
    signingKey,
    nowMs: (timestamp + 500) * 1000,
    toleranceSeconds: 300,
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'timestamp_out_of_tolerance');
});

test('verifyCalendlyWebhookSignature rejects non-hex signature digests', () => {
  const result = verifyCalendlyWebhookSignature({
    rawBody: '{"event":"invitee.created"}',
    signatureHeader: 't=1700000000,v1=not-hex-value',
    signingKey: 'test_signing_key',
    nowMs: 1700000000 * 1000,
    toleranceSeconds: 300,
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_signature');
});
