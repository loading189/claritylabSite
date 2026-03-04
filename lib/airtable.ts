import 'server-only';
import { NormalizedLead } from './leads';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Leads';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export const hasAirtable = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME);

const dateOnly = (iso: string) => iso.slice(0, 10);

async function findExistingLead(lead: NormalizedLead) {
  if (!lead.email) return null;

  const formula = encodeURIComponent(
    `AND({email}='${lead.email.replace(/'/g, "\\'")}',{source}='${lead.source}',DATETIME_FORMAT({created_at},'YYYY-MM-DD')='${dateOnly(lead.created_at)}')`,
  );
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?maxRecords=1&filterByFormula=${formula}`;
  const response = await fetch(url, { headers, cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Airtable lookup failed: ${response.status}`);
  }

  const data = (await response.json()) as { records?: { id: string; fields: Record<string, string> }[] };
  return data.records?.[0] || null;
}

export async function upsertLead(lead: NormalizedLead) {
  if (!hasAirtable) {
    console.log('Lead capture fallback (no Airtable configured):', lead);
    return;
  }

  const existing = await findExistingLead(lead);

  if (existing) {
    const priorMessage = typeof existing.fields.message === 'string' ? existing.fields.message : '';
    const mergedMessage = [priorMessage, lead.message].filter(Boolean).join('\n---\n');
    const updateResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${existing.id}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields: { ...lead, message: mergedMessage || priorMessage } }),
      },
    );

    if (!updateResponse.ok) {
      throw new Error(`Airtable update failed: ${updateResponse.status}`);
    }
    return;
  }

  const createResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields: lead }),
  });

  if (!createResponse.ok) {
    throw new Error(`Airtable create failed: ${createResponse.status}`);
  }
}
