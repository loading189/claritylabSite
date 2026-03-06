import 'server-only';

export type AirtableStatus =
  | 'ok'
  | 'missing_env'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'error'
  | 'skipped';

export type AirtableConfig = {
  configured: boolean;
  missing: string[];
  warnings: string[];
  baseId: string;
  apiKey: string;
  leadsTable: string;
  diagnosticsTable: string;
  clientsTable: string;
  bookingsTable: string;
  filesTable: string;
  engagementRequestsTable: string;
};

const read = (value: string | undefined) => value?.trim() ?? '';

export function getAirtableConfig(options?: {
  bookingFlowEnabled?: boolean;
}): AirtableConfig {
  const apiKey = read(process.env.AIRTABLE_API_KEY);
  const baseId = read(process.env.AIRTABLE_BASE_ID);

  const leadsTable = read(process.env.AIRTABLE_TABLE_NAME) || 'Leads';
  const diagnosticsTable =
    read(process.env.AIRTABLE_DIAGNOSTICS_TABLE) ||
    read(process.env.AIRTABLE_SCAN_TABLE) ||
    'Diagnostics';
  const clientsTable = read(process.env.AIRTABLE_CLIENTS_TABLE) || 'Clients';
  const bookingsTable = read(process.env.AIRTABLE_BOOKINGS_TABLE) || 'Bookings';
  const filesTable = read(process.env.AIRTABLE_FILES_TABLE) || 'Files';
  const engagementRequestsTable = read(process.env.AIRTABLE_ENGAGEMENT_REQUESTS_TABLE) || 'Engagement Requests';

  const missing: string[] = [];
  const warnings: string[] = [];

  if (!apiKey) missing.push('AIRTABLE_API_KEY');
  if (!baseId) missing.push('AIRTABLE_BASE_ID');
  if (!diagnosticsTable) missing.push('AIRTABLE_DIAGNOSTICS_TABLE');
  if (!clientsTable) missing.push('AIRTABLE_CLIENTS_TABLE');
  if (options?.bookingFlowEnabled && !bookingsTable) {
    missing.push('AIRTABLE_BOOKINGS_TABLE');
  }

  if (!read(process.env.AIRTABLE_DIAGNOSTICS_TABLE)) {
    warnings.push(
      'AIRTABLE_DIAGNOSTICS_TABLE not set; using fallback table name.',
    );
  }
  if (!read(process.env.AIRTABLE_CLIENTS_TABLE)) {
    warnings.push('AIRTABLE_CLIENTS_TABLE not set; using default "Clients".');
  }
  if (!read(process.env.AIRTABLE_BOOKINGS_TABLE)) {
    warnings.push('AIRTABLE_BOOKINGS_TABLE not set; using default "Bookings".');
  }
  if (!read(process.env.AIRTABLE_FILES_TABLE)) {
    warnings.push('AIRTABLE_FILES_TABLE not set; using default "Files".');
  }
  if (!read(process.env.AIRTABLE_ENGAGEMENT_REQUESTS_TABLE)) {
    warnings.push('AIRTABLE_ENGAGEMENT_REQUESTS_TABLE not set; using default "Engagement Requests".');
  }

  return {
    configured: missing.length === 0,
    missing,
    warnings,
    baseId,
    apiKey,
    leadsTable,
    diagnosticsTable,
    clientsTable,
    bookingsTable,
    filesTable,
    engagementRequestsTable,
  };
}
