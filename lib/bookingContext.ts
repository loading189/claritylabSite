export type BookingDiagnosticContext = {
  diagnosticId?: string;
  signal?: string;
  secondarySignal?: string;
  score?: number;
  tier?: string;
};

function readQueryParam(value: string | undefined, key: string) {
  if (!value) return null;
  try {
    return new URL(value).searchParams.get(key);
  } catch {
    return null;
  }
}

function toScore(value: string | null | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function deriveBookingDiagnosticContext(
  payload: {
    trackingCampaign?: string;
    eventUri?: string;
  },
  fallback?: BookingDiagnosticContext,
): BookingDiagnosticContext {
  return {
    diagnosticId:
      readQueryParam(payload.eventUri, 'a1') ||
      payload.trackingCampaign ||
      readQueryParam(payload.eventUri, 'utm_campaign') ||
      fallback?.diagnosticId,
    signal: readQueryParam(payload.eventUri, 'a2') || fallback?.signal,
    secondarySignal:
      readQueryParam(payload.eventUri, 'a5') || fallback?.secondarySignal,
    score: toScore(readQueryParam(payload.eventUri, 'a3')) ?? fallback?.score,
    tier: readQueryParam(payload.eventUri, 'a4') || fallback?.tier,
  };
}
