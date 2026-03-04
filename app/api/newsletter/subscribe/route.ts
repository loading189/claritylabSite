import { NextRequest, NextResponse } from 'next/server';
import { upsertLead } from '@/lib/airtable';
import { validateLead } from '@/lib/leads';
import { checkRateLimit } from '../../_utils/rateLimit';

const provider = process.env.NEWSLETTER_PROVIDER || 'none';

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

export async function POST(request: NextRequest) {
  try {
    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'newsletter');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const payload = (await request.json()) as { email?: string; name?: string; website?: string };
    const validated = validateLead({
      source: 'newsletter',
      email: payload.email,
      name: payload.name,
      interest: 'ongoing_support',
      pain_area: 'other',
      consent: true,
      website: payload.website,
    });

    if (validated.honeypotTriggered) {
      return NextResponse.json({ ok: true });
    }

    if (!validated.lead) {
      return NextResponse.json({ ok: false, error: validated.error || 'Invalid input.' }, { status: 400 });
    }

    await upsertLead(validated.lead);

    if (provider !== 'none' && process.env.NEWSLETTER_ENDPOINT_URL) {
      await fetch(process.env.NEWSLETTER_ENDPOINT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEWSLETTER_API_KEY ? `Bearer ${process.env.NEWSLETTER_API_KEY}` : '',
        },
        body: JSON.stringify({
          email: validated.lead.email,
          name: validated.lead.name,
          list_id: process.env.NEWSLETTER_LIST_ID,
          provider,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Newsletter subscribe error', error);
    return NextResponse.json({ ok: false, error: 'Could not subscribe right now. Please try again later.' }, { status: 500 });
  }
}
