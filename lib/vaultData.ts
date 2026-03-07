import 'server-only';
import { airtableRequest } from '@/lib/airtableClient';
import { getAirtableConfig } from '@/lib/airtableConfig';
import { normalizeReportPublishState } from '@/lib/reportAuthoring';
import { requireFields, safeJsonString } from '@/lib/airtableSchema';

const config = getAirtableConfig();

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
  deliverable_type?: string;
  title?: string;
  summary_note?: string;
  period_covered?: string;
  visible_to_client?: boolean | string;
  deliverable_visibility?: 'draft' | 'internal' | 'client_visible' | 'visibleToClient' | 'internalOnly';
  report_publish_state?: 'draft' | 'internal' | 'client_visible';
  report_published_at?: string;
  report_content_json?: string;
  status?: string;
};

export const hasVaultTables = Boolean(config.apiKey && config.baseId);

export async function ensureClientRecord(clientId: string, email: string) {
  if (!hasVaultTables) return { ok: false as const, skipped: 'no_airtable' as const };

  try {
    const formula = encodeURIComponent(`{client_id}='${clientId.replace(/'/g, "\\'")}'`);
    const existing = await airtableRequest<{ records?: { id: string }[] }>({
      table: config.clientsTable,
      path: `?maxRecords=1&filterByFormula=${formula}`,
    });

    if (existing.records?.[0]) return { ok: true as const, created: false as const };

    await airtableRequest({
      table: config.clientsTable,
      method: 'POST',
      body: {
        fields: {
          client_id: clientId,
          primary_email: email,
          status: 'active',
          created_at: new Date().toISOString(),
        },
      },
    });

    return { ok: true as const, created: true as const };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[vaultData] ensureClientRecord failed', error);
    }
    return { ok: false as const, reason: 'request_failed' as const };
  }
}

export async function createFileRecord(file: VaultFile) {
  if (!hasVaultTables) return;

  const required = requireFields(file as unknown as Record<string, unknown>, [
    'client_id',
    'client_email',
    'uploader_role',
    'uploader_user_id',
    'category',
    'filename',
    'storage_key',
    'mime_type',
    'size_bytes',
  ]);

  if (!required.ok) {
    console.error('[vaultData] createFileRecord missing required fields', {
      missing: required.missing,
      storageKey: file.storage_key,
      category: file.category,
    });
    return;
  }

  const publishState = normalizeReportPublishState(
    file.report_publish_state || file.deliverable_visibility || (file.visible_to_client ? 'client_visible' : 'internal'),
  );

  const normalizedFile: VaultFile = {
    ...file,
    client_email: String(file.client_email || '').trim().toLowerCase(),
    report_publish_state: publishState,
    deliverable_visibility: publishState,
    report_content_json: safeJsonString(file.report_content_json),
  };

  await airtableRequest({
    table: config.filesTable,
    method: 'POST',
    body: { fields: normalizedFile },
  });
}

export async function listFiles(clientId: string, category?: string) {
  if (!hasVaultTables) return [] as VaultFile[];

  try {
    const clause = category && category !== 'all' ? `,{category}='${category}'` : '';
    const formula = encodeURIComponent(`AND({client_id}='${clientId.replace(/'/g, "\\'")}'${clause})`);
    const data = await airtableRequest<{ records?: { id: string; fields: Record<string, unknown> }[] }>({
      table: config.filesTable,
      path: `?sort[0][field]=created_at&sort[0][direction]=desc&filterByFormula=${formula}`,
    });

    return (data.records || []).map((r) => ({ id: r.id, ...(r.fields as unknown as VaultFile) }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[vaultData] listFiles failed', error);
    }
    return [];
  }
}

export async function findFileByStorageKey(storageKey: string) {
  if (!hasVaultTables) return null;

  try {
    const formula = encodeURIComponent(`{storage_key}='${storageKey.replace(/'/g, "\\'")}'`);
    const data = await airtableRequest<{ records?: { id: string; fields: Record<string, unknown> }[] }>({
      table: config.filesTable,
      path: `?maxRecords=1&filterByFormula=${formula}`,
    });
    const record = data.records?.[0];
    if (!record) return null;
    return { id: record.id, ...(record.fields as unknown as VaultFile) };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[vaultData] findFileByStorageKey failed', error);
    }
    return null;
  }
}

export async function findFileById(recordId: string) {
  if (!hasVaultTables) return null;

  try {
    const data = await airtableRequest<{ id: string; fields: Record<string, unknown> }>({
      table: config.filesTable,
      path: `/${recordId}`,
    });
    return { id: data.id, ...(data.fields as unknown as VaultFile) };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[vaultData] findFileById failed', error);
    }
    return null;
  }
}

export async function updateFileRecord(recordId: string, fields: Partial<VaultFile>) {
  if (!hasVaultTables) return;
  await airtableRequest({
    table: config.filesTable,
    method: 'PATCH',
    path: `/${recordId}`,
    body: { fields },
  });
}

export async function listClients() {
  if (!hasVaultTables) return [];

  try {
    const data = await airtableRequest<{ records?: { id: string; fields: Record<string, unknown> }[] }>({
      table: config.clientsTable,
      path: '?sort[0][field]=created_at&sort[0][direction]=desc',
    });
    return (data.records || []).map((r) => ({ id: r.id, ...(r.fields as Record<string, string>) }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[vaultData] listClients failed', error);
    }
    return [];
  }
}
