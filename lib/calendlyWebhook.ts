import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

const DEFAULT_TOLERANCE_SECONDS = 300;

export type CalendlySignatureParts = {
  timestamp: number;
  signature: string;
};

export function parseCalendlySignature(
  headerValue: string | null,
): CalendlySignatureParts | null {
  if (!headerValue) return null;

  const parts = headerValue
    .split(',')
    .map((piece) => piece.trim())
    .filter(Boolean);

  let timestamp = 0;
  let signature = '';

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!key || !value) continue;

    if (key === 't') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) timestamp = parsed;
    }

    if (key === 'v1') {
      signature = value;
    }
  }

  if (!timestamp || !signature) return null;
  return { timestamp, signature };
}

function resolveToleranceSeconds(rawTolerance?: string) {
  const parsed = Number(rawTolerance || DEFAULT_TOLERANCE_SECONDS);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_TOLERANCE_SECONDS;
  return Math.floor(parsed);
}

export function verifyCalendlyWebhookSignature(params: {
  rawBody: string;
  signatureHeader: string | null;
  signingKey: string;
  nowMs?: number;
  toleranceSeconds?: number | string;
}) {
  const parsed = parseCalendlySignature(params.signatureHeader);
  if (!parsed)
    return { ok: false as const, reason: 'missing_signature' as const };

  const nowMs = params.nowMs ?? Date.now();
  const toleranceSeconds =
    typeof params.toleranceSeconds === 'number'
      ? params.toleranceSeconds
      : resolveToleranceSeconds(params.toleranceSeconds);

  const ageSeconds = Math.abs(nowMs / 1000 - parsed.timestamp);
  if (ageSeconds > toleranceSeconds) {
    return {
      ok: false as const,
      reason: 'timestamp_out_of_tolerance' as const,
    };
  }

  const signedPayload = `${parsed.timestamp}.${params.rawBody}`;
  const expected = createHmac('sha256', params.signingKey)
    .update(signedPayload)
    .digest('hex');

  if (!/^[a-fA-F0-9]+$/.test(parsed.signature)) {
    return { ok: false as const, reason: 'invalid_signature' as const };
  }

  const expectedBuffer = Buffer.from(expected, 'hex');
  const givenBuffer = Buffer.from(parsed.signature, 'hex');

  if (expectedBuffer.length !== givenBuffer.length) {
    return { ok: false as const, reason: 'invalid_signature' as const };
  }

  const isValid = timingSafeEqual(expectedBuffer, givenBuffer);

  return isValid
    ? { ok: true as const }
    : { ok: false as const, reason: 'invalid_signature' as const };
}

export function getCalendlySignatureHeader(headers: Headers) {
  return (
    headers.get('calendly-webhook-signature') ||
    headers.get('Calendly-Webhook-Signature') ||
    headers.get('x-calendly-webhook-signature') ||
    headers.get('X-Calendly-Webhook-Signature')
  );
}
