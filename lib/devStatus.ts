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

  const bookingFlowEnabled = Boolean(process.env.CALENDLY_WEBHOOK_SIGNING_KEY);

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
    },
    clerk: {
      clerk_env_present: clerk.clerkEnvPresent,
      clerk_provider_enabled: clerk.clerkProviderEnabled,
      middleware_protected_mode: clerk.middlewareProtectedMode,
      admin_role_source: clerk.adminRoleSource,
    },
  };
}
