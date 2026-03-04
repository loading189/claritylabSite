import { NextRequest, NextResponse } from 'next/server';
import { upsertLead } from '@/lib/airtable';
import { LeadInput, validateLead } from '@/lib/leads';
import { checkRateLimit } from '../_utils/rateLimit';

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

export async function POST(request: NextRequest) {
  try {
    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'leads');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const payload = (await request.json()) as LeadInput;
    const { lead, error, honeypotTriggered } = validateLead(payload);

    if (honeypotTriggered) {
      return NextResponse.json({ ok: true });
    }

    if (!lead) {
      return NextResponse.json({ ok: false, error: error || 'Invalid input.' }, { status: 400 });
    }

    await upsertLead(lead);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Lead capture error', error);
    return NextResponse.json({ ok: false, error: 'Could not submit right now. Please email us directly.' }, { status: 500 });
  }
}
