import 'server-only';

import { airtableRequest } from '@/lib/airtableClient';
import { getAirtableConfig } from '@/lib/airtableConfig';
import { requireFields } from '@/lib/airtableSchema';

const config = getAirtableConfig();

export type EngagementRequestStatus =
  | 'open'
  | 'submitted'
  | 'reviewing'
  | 'complete'
  | 'in_progress'
  | 'done'
  | 'blocked';

export type EngagementRequestRecord = {
  id: string;
  clientId: string;
  title: string;
  category: string;
  status: EngagementRequestStatus;
  dueDate: string | null;
  owner: string | null;
  notes: string | null;
  createdAt: string;
};

export const hasEngagementRequestsTable = Boolean(config.apiKey && config.baseId && config.engagementRequestsTable);

function sanitize(value: string) {
  return value.replace(/'/g, "\\'");
}

function parseStatus(value: unknown): EngagementRequestStatus {
  return normalizeEngagementRequestStatus(value);
}

export function normalizeEngagementRequestStatus(value: unknown): EngagementRequestStatus {
  const status = String(value || '').trim().toLowerCase();
  if (status === 'complete' || status === 'done') return 'complete';
  if (status === 'reviewing' || status === 'in_review') return 'reviewing';
  if (status === 'submitted') return 'submitted';
  if (status === 'open') return 'open';
  if (status === 'in_progress' || status === 'blocked') return status;
  return 'open';
}

export function mapEngagementRequestRecord(
  record: { id: string; fields: Record<string, unknown> },
): EngagementRequestRecord | null {
  const fields = record.fields;
  const clientId = String(fields.client_id || fields.clientId || '').trim();
  const title = String(fields.title || '').trim();
  if (!clientId || !title) return null;

  return {
    id: record.id,
    clientId,
    title,
    category: String(fields.category || 'general').trim() || 'general',
    status: parseStatus(fields.status),
    dueDate: (fields.due_date || fields.dueDate ? String(fields.due_date || fields.dueDate) : null) || null,
    owner: (fields.owner ? String(fields.owner) : null) || null,
    notes: (fields.notes ? String(fields.notes) : null) || null,
    createdAt: String(fields.created_at || fields.createdAt || new Date().toISOString()),
  };
}

export async function listEngagementRequests(clientId: string) {
  if (!hasEngagementRequestsTable) return [] as EngagementRequestRecord[];

  try {
    const formula = encodeURIComponent(`{client_id}='${sanitize(clientId)}'`);
    const data = await airtableRequest<{ records?: { id: string; fields: Record<string, unknown> }[] }>({
      table: config.engagementRequestsTable,
      path: `?sort[0][field]=created_at&sort[0][direction]=desc&filterByFormula=${formula}`,
    });

    return (data.records || []).map(mapEngagementRequestRecord).filter((item): item is EngagementRequestRecord => Boolean(item));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[engagementRequestsData] listEngagementRequests failed', error);
    }
    return [];
  }
}

export async function createEngagementRequest(
  request: Omit<EngagementRequestRecord, 'id' | 'createdAt'> & { createdAt?: string },
) {
  if (!hasEngagementRequestsTable) return;

  const required = requireFields(request as unknown as Record<string, unknown>, ['clientId', 'title']);
  if (!required.ok) {
    console.error('[engagementRequestsData] createEngagementRequest missing required fields', {
      missing: required.missing,
      clientId: request.clientId,
      title: request.title,
    });
    return;
  }

  await airtableRequest({
    table: config.engagementRequestsTable,
    method: 'POST',
    body: {
      fields: {
        client_id: request.clientId,
        title: request.title,
        category: request.category,
        status: normalizeEngagementRequestStatus(request.status),
        due_date: request.dueDate,
        owner: request.owner,
        notes: request.notes,
        created_at: request.createdAt || new Date().toISOString(),
      },
    },
  });
}

export async function updateEngagementRequestStatus(requestId: string, status: EngagementRequestStatus) {
  if (!hasEngagementRequestsTable) return;
  await airtableRequest({
    table: config.engagementRequestsTable,
    path: `/${requestId}`,
    method: 'PATCH',
    body: {
      fields: {
        status: normalizeEngagementRequestStatus(status),
      },
    },
  });
}
