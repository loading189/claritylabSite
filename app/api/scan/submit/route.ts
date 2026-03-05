import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/app/api/_utils/rateLimit';
import { createScanDiagnostic } from '@/lib/airtable';
import { sendScanNotifications } from '@/lib/email';
import { deriveScanSource, scoreScan, type ScanAnswers } from '@/lib/scan';

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

function isValidAnswers(input: unknown): input is ScanAnswers {
  if (!input || typeof input !== 'object') return false;
  const candidate = input as Record<string, string>;
  return Boolean(candidate.cashFlow && candidate.capacity && candidate.systems && candidate.urgency && candidate.teamReadiness);
}

export async function POST(request: NextRequest) {
  try {
    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'scan_submit');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      consent?: boolean;
      answers?: unknown;
      utmSource?: string;
      source?: string;
    };

    const email = (payload.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Valid email is required.' }, { status: 400 });
    }

    if (!payload.consent) {
      return NextResponse.json({ ok: false, error: 'Consent is required.' }, { status: 400 });
    }

    if (!isValidAnswers(payload.answers)) {
      return NextResponse.json({ ok: false, error: 'Invalid diagnostic answers.' }, { status: 400 });
    }

    const result = scoreScan(payload.answers);
    const source = deriveScanSource(payload.utmSource || payload.source);

    const createdAt = new Date().toISOString();
    const record = {
      created_at: createdAt,
      name: (payload.name || '').trim(),
      email,
      consent: true,
      source,
      utm_source: (payload.utmSource || '').trim(),
      score: result.score,
      tier: result.tier,
      primary_signal: result.primarySignal,
      qualified: result.qualified,
      answers_json: JSON.stringify(payload.answers),
    };

    await Promise.allSettled([
      createScanDiagnostic(record),
      sendScanNotifications({
        userEmail: email,
        name: record.name,
        score: result.score,
        tier: result.tier,
        qualified: result.qualified,
        primarySignal: result.primarySignal,
      }),
    ]);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Scan submission error', error);
    return NextResponse.json({ ok: true, fallback: true });
  }
}
