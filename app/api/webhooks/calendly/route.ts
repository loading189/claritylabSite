import { NextResponse } from 'next/server';
import {
  getBookingById,
  upsertBooking,
  updateClientBookingState,
} from '@/lib/bookingsData';
import {
  getCalendlySignatureHeader,
  verifyCalendlyWebhookSignature,
} from '@/lib/calendlyWebhook';
import { getLatestDiagnosticByEmail } from '@/lib/diagnosticsData';
import { getDiagnosticInsights } from '@/lib/diagnosticsPresentation';
import { sendClientBookedConfirm, sendOwnerBookedBrief } from '@/lib/email';
import { deriveBookingDiagnosticContext } from '@/lib/bookingContext';

type CalendlyPayload = {
  event?: string;
  time?: string;
  payload?: {
    event?: string;
    event_type?: string;
    tracking?: {
      utm_source?: string;
      utm_campaign?: string;
    };
    invitee?: {
      uri?: string;
      email?: string;
      name?: string;
      timezone?: string;
    };
    scheduled_event?: {
      uri?: string;
      start_time?: string;
      end_time?: string;
      event_type?: string;
    };
  };
};

const allowedSources = new Set([
  'direct',
  'business_card_qr',
  'linkedin',
  'google',
  'local',
]);

function normalizeSource(source?: string) {
  const normalized = (source || '').trim().toLowerCase();
  return allowedSources.has(normalized)
    ? (normalized as
        | 'direct'
        | 'business_card_qr'
        | 'linkedin'
        | 'google'
        | 'local')
    : 'direct';
}

function deriveBookingId(payload: CalendlyPayload) {
  const eventType = payload.event || payload.payload?.event;
  const inviteeUri = payload.payload?.invitee?.uri || '';
  const scheduledEventUri = payload.payload?.scheduled_event?.uri || '';
  const timestamp = payload.time || payload.payload?.scheduled_event?.start_time || '';

  return [eventType, inviteeUri, scheduledEventUri, timestamp]
    .filter(Boolean)
    .join('|');
}


export async function POST(req: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const toleranceSeconds =
    process.env.CALENDLY_WEBHOOK_TOLERANCE_SECONDS || '300';

  const rawBody = await req.text();

  if (!signingKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[calendly:webhook] CALENDLY_WEBHOOK_SIGNING_KEY missing; skipping persistence.',
      );
    }
    return NextResponse.json({ ok: true, skipped: 'no_signing_key' });
  }

  const signature = getCalendlySignatureHeader(req.headers);
  const verified = verifyCalendlyWebhookSignature({
    rawBody,
    signatureHeader: signature,
    signingKey,
    toleranceSeconds,
  });

  if (!verified.ok) {
    console.warn('[calendly:webhook] signature verification failed', {
      reason: verified.reason,
    });
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let body: CalendlyPayload;
  try {
    body = JSON.parse(rawBody) as CalendlyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const eventType = body.event || body.payload?.event || '';
  if (eventType !== 'invitee.created' && eventType !== 'invitee.canceled') {
    return NextResponse.json({ ok: true, skipped: 'unsupported_event' });
  }

  const email = (body.payload?.invitee?.email || '').trim().toLowerCase();
  const bookingId = deriveBookingId(body);
  if (!email || !bookingId) {
    console.warn('[calendly:webhook] missing booking identity', {
      hasEmail: Boolean(email),
      hasBookingId: Boolean(bookingId),
      eventType,
    });
    return NextResponse.json({ ok: true, skipped: 'missing_identity' });
  }

  const existing = await getBookingById(bookingId);
  if (existing) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  const diagnostic = await getLatestDiagnosticByEmail(email);
  const context = deriveBookingDiagnosticContext(
    {
      trackingCampaign: body.payload?.tracking?.utm_campaign,
      eventUri: body.payload?.scheduled_event?.uri,
    },
    diagnostic
      ? {
          diagnosticId: diagnostic.id,
          signal: diagnostic.primarySignal,
          secondarySignal: diagnostic.secondarySignal,
          score: diagnostic.score,
          tier: diagnostic.tier,
        }
      : undefined,
  );

  const source = normalizeSource(
    body.payload?.tracking?.utm_source || diagnostic?.source,
  );

  const status = eventType === 'invitee.created' ? 'booked' : 'canceled';
  const startTime = body.payload?.scheduled_event?.start_time || null;
  const endTime = body.payload?.scheduled_event?.end_time || null;
  const timezone = body.payload?.invitee?.timezone || null;

  const clientStateResult = await updateClientBookingState(email, {
    status: status === 'booked' ? 'booked' : 'active',
    booked_start_time: startTime,
    booked_end_time: endTime,
    booked_timezone: timezone,
    last_booking_id: bookingId,
    last_booking_status: status,
  });

  const bookingResult = await upsertBooking({
    booking_id: bookingId,
    client_email: email,
    client_id: clientStateResult.ok ? clientStateResult.clientId : undefined,
    status,
    start_time: startTime,
    end_time: endTime,
    timezone,
    calendly_event_uri: body.payload?.scheduled_event?.uri || '',
    calendly_invitee_uri: body.payload?.invitee?.uri || '',
    source,
    diagnostic_id: context.diagnosticId || undefined,
    diagnostic_signal: context.signal || undefined,
    diagnostic_score: context.score,
    diagnostic_tier: context.tier || undefined,
    created_at: new Date().toISOString(),
  });

  if (!bookingResult.ok) {
    return NextResponse.json({ ok: false, error: 'booking_write_failed' }, { status: 500 });
  }

  if (!clientStateResult.ok) {
    console.warn('[calendly:webhook] client state update failed', {
      reason: clientStateResult.reason,
      email,
    });
  }

  if (status === 'booked') {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const diagnosticInsights = diagnostic
      ? getDiagnosticInsights(diagnostic).slice(0, 5)
      : [];
    const summaryPairs = diagnostic
      ? Object.entries(diagnostic.answers)
          .slice(0, 5)
          .map(([key, value]) => `${key}: ${String(value ?? '')}`)
      : [];

    const confirmationUrl = `${siteUrl}/booking/confirmed?diagnosticId=${encodeURIComponent(context.diagnosticId || '')}&signal=${encodeURIComponent(context.signal || '')}&secondarySignal=${encodeURIComponent(context.secondarySignal || diagnostic?.secondarySignal || '')}&score=${encodeURIComponent(String(context.score || ''))}&tier=${encodeURIComponent(context.tier || '')}&startTime=${encodeURIComponent(startTime || '')}&endTime=${encodeURIComponent(endTime || '')}&timezone=${encodeURIComponent(timezone || '')}&bookingSummary=${encodeURIComponent('Clarity Diagnostic Call')}`;

    const [ownerEmailResult, clientEmailResult] = await Promise.all([
      sendOwnerBookedBrief({
        booking: {
          bookingId,
          email,
          inviteeName: body.payload?.invitee?.name,
          company: diagnostic?.company,
          startTime,
          endTime,
          timezone,
          source,
          diagnosticId: context.diagnosticId || diagnostic?.id,
        },
        diagnosticSummary: {
          score: context.score ?? diagnostic?.score,
          tier: context.tier || diagnostic?.tier,
          primarySignal: context.signal || diagnostic?.primarySignal,
          keyAnswers: summaryPairs,
          insights: diagnosticInsights,
        },
      }),
      sendClientBookedConfirm({
        booking: {
          startTime,
          endTime,
          timezone,
        },
        portalUrl: `${siteUrl}/client?booked=1`,
        prepUrl: confirmationUrl,
        to: email,
      }),
    ]);

    if (!ownerEmailResult.delivered || !clientEmailResult.delivered) {
      console.warn('[calendly:webhook] booking emails partially delivered', {
        ownerDelivered: ownerEmailResult.delivered,
        clientDelivered: clientEmailResult.delivered,
      });
    }
  }

  return NextResponse.json({ ok: true, booking: bookingResult, client: clientStateResult });
}
