import 'server-only';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const FILES_TABLE = process.env.AIRTABLE_FILES_TABLE || 'Files';
const CLIENTS_TABLE = process.env.AIRTABLE_CLIENTS_TABLE || 'Clients';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export type VaultFile = {
  id?: string;
  client_id: string;
  client_email: string;
  uploader_role: 'client' | 'admin';
  uploader_user_id: string;
  category: 'upload' | 'report' | 'contract';
  filename: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  note?: string;
};

export const hasVaultTables = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);

async function at<T>(table: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Airtable ${table} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function ensureClientRecord(clientId: string, email: string) {
  if (!hasVaultTables) return;
  const formula = encodeURIComponent(`{client_id}='${clientId.replace(/'/g, "\\'")}'`);
  const existing = await at<{ records?: { id: string }[] }>(`${CLIENTS_TABLE}?maxRecords=1&filterByFormula=${formula}`);
  if (existing.records?.[0]) return;
  await at(CLIENTS_TABLE, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        client_id: clientId,
        primary_email: email,
        status: 'active',
        created_at: new Date().toISOString(),
      },
    }),
  });
}

export async function createFileRecord(file: VaultFile) {
  if (!hasVaultTables) return;
  await at(FILES_TABLE, {
    method: 'POST',
    body: JSON.stringify({ fields: file }),
  });
}

export async function listFiles(clientId: string, category?: string) {
  if (!hasVaultTables) return [] as VaultFile[];
  const clause = category && category !== 'all' ? `,{category}='${category}'` : '';
  const formula = encodeURIComponent(`AND({client_id}='${clientId.replace(/'/g, "\\'")}'${clause})`);
  const data = await at<{ records?: { id: string; fields: Record<string, unknown> }[] }>(
    `${FILES_TABLE}?sort[0][field]=created_at&sort[0][direction]=desc&filterByFormula=${formula}`,
  );
  return (data.records || []).map((r) => ({ id: r.id, ...(r.fields as unknown as VaultFile) }));
}

export async function findFileByStorageKey(storageKey: string) {
  if (!hasVaultTables) return null;
  const formula = encodeURIComponent(`{storage_key}='${storageKey.replace(/'/g, "\\'")}'`);
  const data = await at<{ records?: { id: string; fields: Record<string, unknown> }[] }>(`${FILES_TABLE}?maxRecords=1&filterByFormula=${formula}`);
  const record = data.records?.[0];
  if (!record) return null;
  return { id: record.id, ...(record.fields as unknown as VaultFile) };
}

export async function listClients() {
  if (!hasVaultTables) return [];
  const data = await at<{ records?: { id: string; fields: Record<string, unknown> }[] }>(`${CLIENTS_TABLE}?sort[0][field]=created_at&sort[0][direction]=desc`);
  return (data.records || []).map((r) => ({ id: r.id, ...(r.fields as Record<string, string>) }));
}
