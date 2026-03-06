import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAirtableConfig } from '@/lib/airtableConfig';

type HealthState = 'ok' | 'missing_env' | 'error';

const hasResendEnv = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
const hasNewsletterEnv =
  (process.env.NEWSLETTER_PROVIDER || 'none') !== 'none' &&
  Boolean(process.env.NEWSLETTER_ENDPOINT_URL && process.env.NEWSLETTER_API_KEY);
const hasUploadsEnv = Boolean(process.env.NEXT_PUBLIC_INTAKE_UPLOAD_URL);
const hasCalendlyEnv = Boolean(
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
    process.env.NEXT_PUBLIC_CALENDLY_EVENT_TYPE_URL,
);
const hasClerkEnv = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

async function checkAirtableDeep(): Promise<HealthState> {
  const config = getAirtableConfig();
  if (!config.apiKey || !config.baseId) return 'missing_env';

  const tableName = encodeURIComponent(config.diagnosticsTable);
  const url = `https://api.airtable.com/v0/${config.baseId}/${tableName}?maxRecords=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    cache: 'no-store',
  });

  return response.ok ? 'ok' : 'error';
}

async function checkResendDeep(): Promise<HealthState> {
  if (!hasResendEnv) return 'missing_env';

  const response = await fetch('https://api.resend.com/domains?limit=1', {
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    cache: 'no-store',
  });

  return response.ok ? 'ok' : 'error';
}

export async function GET(request: NextRequest) {
  const deep = request.nextUrl.searchParams.get('deep') === '1';

  if (deep) {
    const token = request.nextUrl.searchParams.get('token');

    if (!process.env.HEALTH_TOKEN) {
      return NextResponse.json(
        { ok: false, error: 'HEALTH_TOKEN is not configured.' },
        { status: 503 },
      );
    }

    if (!token || token !== process.env.HEALTH_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Invalid token.' }, { status: 401 });
    }
  }

  const services = {
    airtable: (deep
      ? await checkAirtableDeep()
      : getAirtableConfig().configured
        ? 'ok'
        : 'missing_env') as HealthState,
    resend: (deep
      ? await checkResendDeep()
      : hasResendEnv
        ? 'ok'
        : 'missing_env') as HealthState,
    newsletter: (hasNewsletterEnv ? 'ok' : 'missing_env') as HealthState,
    uploads: (hasUploadsEnv ? 'ok' : 'missing_env') as HealthState,
    calendly: (hasCalendlyEnv ? 'ok' : 'missing_env') as HealthState,
    auth: (hasClerkEnv ? 'ok' : 'missing_env') as HealthState,
    sentry:
      process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN
        ? 'configured'
        : 'not_configured',
  };

  const ok = Object.entries(services)
    .filter(([name]) => name !== 'sentry')
    .every(([, status]) => status !== 'error');

  return NextResponse.json({ ok, services });
}
