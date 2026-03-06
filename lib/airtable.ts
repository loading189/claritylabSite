import 'server-only';
import { NormalizedLead } from './leads';
import { airtableRequest } from '@/lib/airtableClient';
import { getAirtableConfig } from '@/lib/airtableConfig';

const dateOnly = (iso: string) => iso.slice(0, 10);

function getLeadConfig() {
  const config = getAirtableConfig();
  return {
    ...config,
    hasLeadTable: Boolean(config.apiKey && config.baseId && config.leadsTable),
  };
}

export const hasAirtable = getLeadConfig().hasLeadTable;

async function findExistingLead(lead: NormalizedLead) {
  if (!lead.email) return null;

  const formula = encodeURIComponent(
    `AND({email}='${lead.email.replace(/'/g, "\\'")}',{source}='${lead.source}',DATETIME_FORMAT({created_at},'YYYY-MM-DD')='${dateOnly(lead.created_at)}')`,
  );

  const data = await airtableRequest<{ records?: { id: string; fields: Record<string, string> }[] }>({
    table: getLeadConfig().leadsTable,
    path: `?maxRecords=1&filterByFormula=${formula}`,
  });

  return data.records?.[0] || null;
}

export async function upsertLead(lead: NormalizedLead) {
  if (!getLeadConfig().hasLeadTable) {
    console.log('Lead capture fallback (no Airtable configured):', lead);
    return;
  }

  const table = getLeadConfig().leadsTable;
  const existing = await findExistingLead(lead);

  if (existing) {
    const priorMessage = typeof existing.fields.message === 'string' ? existing.fields.message : '';
    const mergedMessage = [priorMessage, lead.message].filter(Boolean).join('\n---\n');

    await airtableRequest({
      table,
      path: `/${existing.id}`,
      method: 'PATCH',
      body: { fields: { ...lead, message: mergedMessage || priorMessage } },
    });
    return;
  }

  await airtableRequest({
    table,
    method: 'POST',
    body: { fields: lead },
  });
}

export async function createScanDiagnostic(record: Record<string, unknown>) {
  const config = getLeadConfig();
  if (!config.hasLeadTable) {
    console.log('Scan capture fallback (no Airtable configured):', record);
    return;
  }

  await airtableRequest({
    table: config.diagnosticsTable,
    method: 'POST',
    body: { fields: record },
  });
}
