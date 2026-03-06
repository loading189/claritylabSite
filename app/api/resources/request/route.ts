import { NextRequest, NextResponse } from 'next/server';
import { upsertLead } from '@/lib/airtable';
import { sendResourceEmail } from '@/lib/email';
import { resources } from '@/content/resources';
import { runtimeConfig } from '@/content/runtime';
import { validateLead } from '@/lib/leads';
import { checkRateLimit } from '../../_utils/rateLimit';

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

const resourceLinks: Record<string, string> = {
  'ar-recovery-checklist': runtimeConfig.resources.arUrl,
  'cash-flow-snapshot': runtimeConfig.resources.cashflowUrl,
};

export async function POST(request: NextRequest) {
  try {
    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'resource-request');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const payload = (await request.json()) as { resource_slug?: string; email?: string; name?: string; website?: string };

    const found = resources.find((item) => item.slug === payload.resource_slug);
    if (!found) {
      return NextResponse.json({ ok: false, error: 'Unknown resource requested.' }, { status: 400 });
    }

    const validated = validateLead({
      source: 'resource_download',
      email: payload.email,
      name: payload.name,
      resource_slug: payload.resource_slug,
      interest: 'implementation',
      pain_area: payload.resource_slug === 'ar-recovery-checklist' ? 'ar_cashflow' : 'workflow_gaps',
      consent: true,
      website: payload.website,
    });

    if (validated.honeypotTriggered) {
      return NextResponse.json({ ok: true });
    }

    if (!validated.lead) {
      return NextResponse.json({ ok: false, error: validated.error || 'Invalid request' }, { status: 400 });
    }

    await upsertLead(validated.lead);

    const emailResult = await sendResourceEmail({
      to: validated.lead.email,
      name: validated.lead.name,
      resourceTitle: found.title,
      downloadUrl: resourceLinks[found.slug],
    });

    return NextResponse.json({
      ok: true,
      delivered: emailResult.delivered,
      message: emailResult.delivered
        ? 'Check your inbox for your resource link.'
        : 'We received your request. If the email does not arrive soon, contact us and we will send it manually.',
    });
  } catch (error) {
    console.error('Resource request error', error);
    return NextResponse.json({ ok: false, error: 'Could not process request right now. Please email us directly.' }, { status: 500 });
  }
}
