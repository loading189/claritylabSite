import 'server-only';
import { AirtableRequestError, airtableRequest } from '@/lib/airtableClient';
import { getAirtableConfig, type AirtableStatus } from '@/lib/airtableConfig';
import { getClerkConfig } from '@/lib/clerkConfig';

async function probeAirtableTable(table: string): Promise<AirtableStatus> {
  const config = getAirtableConfig();
  if (!config.apiKey || !config.baseId) return 'missing_env';

  try {
    await airtableRequest({ table, path: '?maxRecords=1' });
    return 'ok';
  } catch (error) {
    if (error instanceof AirtableRequestError) {
      if (error.code === 'missing_env') return 'missing_env';
      if (error.code === 'unauthorized') return 'unauthorized';
      if (error.code === 'forbidden') return 'forbidden';
      if (error.code === 'not_found') return 'not_found';
    }
    return 'error';
  }
}

export async function getDevStatusSummary() {
  const airtable = getAirtableConfig();
  const clerk = getClerkConfig();

  const calendlyPublicReady = Boolean(
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
      process.env.NEXT_PUBLIC_CALENDLY_EVENT_TYPE_URL,
  );
  const webhookSigningReady = Boolean(process.env.CALENDLY_WEBHOOK_SIGNING_KEY);
  const bookingFlowEnabled = calendlyPublicReady && webhookSigningReady;

  return {
    airtableConfig: {
      configured: airtable.configured,
      missing: airtable.missing,
      warnings: airtable.warnings,
      defaults: {
        diagnosticsTable: airtable.diagnosticsTable,
        clientsTable: airtable.clientsTable,
        bookingsTable: airtable.bookingsTable,
        filesTable: airtable.filesTable,
      },
    },
    airtableProbes: {
      diagnostics: await probeAirtableTable(airtable.diagnosticsTable),
      clients: await probeAirtableTable(airtable.clientsTable),
      bookings: bookingFlowEnabled
        ? await probeAirtableTable(airtable.bookingsTable)
        : 'skipped',
      files: await probeAirtableTable(airtable.filesTable),
    },
    clerk: {
      clerk_env_present: clerk.clerkEnvPresent,
      clerk_provider_enabled: clerk.clerkProviderEnabled,
      middleware_protected_mode: clerk.middlewareProtectedMode,
      admin_role_source: clerk.adminRoleSource,
      owner_email_set: Boolean((process.env.OWNER_EMAIL || '').trim()),
    },
    calendly: {
      public_booking_url_set: Boolean(process.env.NEXT_PUBLIC_CALENDLY_URL),
      public_event_type_url_set: Boolean(
        process.env.NEXT_PUBLIC_CALENDLY_EVENT_TYPE_URL,
      ),
      webhook_signing_key_set: webhookSigningReady,
      webhook_tolerance_seconds_set: Boolean(
        (process.env.CALENDLY_WEBHOOK_TOLERANCE_SECONDS || '').trim(),
      ),
      booking_flow_ready: bookingFlowEnabled,
    },
    resend: {
      resend_api_key_set: Boolean((process.env.RESEND_API_KEY || '').trim()),
      email_from_set: Boolean((process.env.EMAIL_FROM || '').trim()),
      email_reply_to_set: Boolean((process.env.EMAIL_REPLY_TO || '').trim()),
      owner_email_set: Boolean((process.env.OWNER_EMAIL || '').trim()),
    },
  };
}
