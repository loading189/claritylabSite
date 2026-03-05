import { NextRequest, NextResponse } from 'next/server';
import { createDiagnosticSubmission } from '@/lib/airtable';
import { sendDiagnosticOwnerNotification, sendDiagnosticResultEmail } from '@/lib/email';
import { checkRateLimit } from '../../_utils/rateLimit';

type ScanPayload = {
  answers?: Record<string, string | boolean | undefined>;
  score?: number;
  tier?: string;
  primarySignal?: string;
  email?: string;
  company?: string;
  consent?: boolean;
  source?: string;
  utm?: Record<string, string | undefined>;
};

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

export async function POST(request: NextRequest) {
  try {
    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'scan-submit');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const payload = (await request.json()) as ScanPayload;

    if (!payload.email || !payload.consent || !payload.answers || typeof payload.answers !== 'object') {
      return NextResponse.json({ ok: false, error: 'Missing required scan fields.' }, { status: 400 });
    }

    const storageResult = await createDiagnosticSubmission({
      email: payload.email,
      company: payload.company,
      consent: payload.consent,
      score: payload.score ?? 0,
      tier: payload.tier ?? 'maybe',
      primarySignal: payload.primarySignal ?? 'workflow',
      source: payload.source || 'direct',
      utm: payload.utm,
      answers: payload.answers,
    });

    const [resultEmail, ownerEmail] = await Promise.all([
      sendDiagnosticResultEmail({
        to: payload.email,
        company: payload.company,
        score: payload.score ?? 0,
        tier: payload.tier ?? 'maybe',
        primarySignal: payload.primarySignal ?? 'workflow',
      }),
      sendDiagnosticOwnerNotification({
        score: payload.score ?? 0,
        tier: payload.tier ?? 'maybe',
        primarySignal: payload.primarySignal ?? 'workflow',
        email: payload.email,
        company: payload.company,
        source: payload.source || 'direct',
      }),
    ]);

    return NextResponse.json({
      ok: true,
      storage: storageResult.mode,
      email: {
        userDelivered: resultEmail.delivered,
        ownerDelivered: ownerEmail.delivered,
      },
    });
  } catch (error) {
    console.error('Scan submit error', error);
    return NextResponse.json({ ok: false, error: 'Could not process scan right now. Please try again shortly.' }, { status: 500 });
  }
}
