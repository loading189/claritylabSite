import 'server-only';
import { randomUUID } from 'crypto';
import {
  AirtableRequestError,
  airtableRequest,
  isAirtableRecoverableError,
} from '@/lib/airtableClient';
import { getAirtableConfig } from '@/lib/airtableConfig';

const config = getAirtableConfig();

export type DiagnosticsAnswers = {
  cashFlow?: string;
  capacity?: string;
  systems?: string;
  urgency?: string;
  teamReadiness?: string;
  [key: string]: unknown;
};

export type DiagnosticRecord = {
  id: string;
  created_at: string;
  email: string;
  company?: string;
  score: number;
  tier: string;
  primarySignal: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  answers: DiagnosticsAnswers;
  insights?: string[];
};

type AirtableRecord = { id: string; fields: Record<string, unknown> };

export const diagnosticsReadiness = {
  enabled: config.configured,
  required: [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_DIAGNOSTICS_TABLE',
    'AIRTABLE_CLIENTS_TABLE',
  ],
};

export type DiagnosticLookupResult = {
  record: DiagnosticRecord | null;
  status:
    | 'ok'
    | 'missing_env'
    | 'unauthorized'
    | 'forbidden'
    | 'not_found'
    | 'error';
};

const fallbackListResult = {
  records: [] as DiagnosticRecord[],
  nextOffset: undefined as string | undefined,
};

function parseJsonObject(input: unknown): DiagnosticsAnswers {
  if (!input) return {};
  if (typeof input === 'object') return input as DiagnosticsAnswers;
  if (typeof input !== 'string') return {};
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === 'object')
      return parsed as DiagnosticsAnswers;
  } catch {
    return {};
  }
  return {};
}

function toNumber(input: unknown) {
  if (typeof input === 'number') return input;
  if (typeof input === 'string') {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toDiagnosticRecord(record: AirtableRecord): DiagnosticRecord {
  const fields = record.fields;
  const answers = parseJsonObject(fields.answers_json ?? fields.answers);

  return {
    id: record.id,
    created_at: String(fields.created_at ?? fields.createdAt ?? ''),
    email: String(fields.email ?? '').toLowerCase(),
    company: String(fields.company ?? fields.name ?? '').trim() || undefined,
    score: toNumber(fields.score),
    tier: String(fields.tier ?? 'monitor'),
    primarySignal: String(
      fields.primary_signal ?? fields.primarySignal ?? 'workflow',
    ),
    source: String(fields.source ?? 'direct'),
    utm_source: String(fields.utm_source ?? '').trim() || undefined,
    utm_medium: String(fields.utm_medium ?? '').trim() || undefined,
    utm_campaign: String(fields.utm_campaign ?? '').trim() || undefined,
    answers,
    insights: Array.isArray(fields.insights)
      ? fields.insights.filter(
          (item): item is string => typeof item === 'string',
        )
      : undefined,
  };
}

function esc(value: string) {
  return value.replace(/'/g, "\\'");
}

function toLookupStatus(error: unknown): DiagnosticLookupResult['status'] {
  if (error instanceof AirtableRequestError) {
    if (error.code === 'missing_env') return 'missing_env';
    if (error.code === 'unauthorized') return 'unauthorized';
    if (error.code === 'forbidden') return 'forbidden';
    if (error.code === 'not_found') return 'not_found';
  }
  return 'error';
}

export async function listDiagnostics({
  tier,
  primarySignal,
  source,
  limit = 20,
  offset,
}: {
  tier?: string;
  primarySignal?: string;
  source?: string;
  limit?: number;
  offset?: string;
} = {}) {
  if (!diagnosticsReadiness.enabled) return fallbackListResult;

  const clauses = [
    tier ? `{tier}='${esc(tier)}'` : '',
    primarySignal
      ? `OR({primary_signal}='${esc(primarySignal)}',{primarySignal}='${esc(primarySignal)}')`
      : '',
    source ? `{source}='${esc(source)}'` : '',
  ].filter(Boolean);

  const formula = clauses.length
    ? `&filterByFormula=${encodeURIComponent(clauses.length > 1 ? `AND(${clauses.join(',')})` : clauses[0])}`
    : '';
  const offsetParam = offset ? `&offset=${encodeURIComponent(offset)}` : '';

  try {
    const data = await airtableRequest<{
      records?: AirtableRecord[];
      offset?: string;
    }>({
      table: config.diagnosticsTable,
      path: `?pageSize=${Math.min(Math.max(limit, 1), 100)}&sort[0][field]=created_at&sort[0][direction]=desc${formula}${offsetParam}`,
    });
    return {
      records: (data.records || []).map(toDiagnosticRecord),
      nextOffset: data.offset,
    };
  } catch (error) {
    console.error('Failed to list diagnostics', error);
    return fallbackListResult;
  }
}

export async function getDiagnosticById(id: string) {
  if (!diagnosticsReadiness.enabled || !id) return null;
  try {
    const data = await airtableRequest<AirtableRecord>({
      table: config.diagnosticsTable,
      path: `/${id}`,
    });
    return toDiagnosticRecord(data);
  } catch (error) {
    console.error('Failed to get diagnostic by id', error);
    return null;
  }
}

export async function getLatestDiagnosticByEmail(email: string) {
  const result = await getLatestDiagnosticByEmailWithStatus(email);
  return result.record;
}

export async function getLatestDiagnosticByEmailWithStatus(
  email: string,
): Promise<DiagnosticLookupResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { record: null, status: 'error' };
  if (!diagnosticsReadiness.enabled) {
    return { record: null, status: 'missing_env' };
  }

  const formula = encodeURIComponent(`LOWER({email})='${esc(normalized)}'`);

  try {
    const data = await airtableRequest<{ records?: AirtableRecord[] }>({
      table: config.diagnosticsTable,
      path: `?maxRecords=1&sort[0][field]=created_at&sort[0][direction]=desc&filterByFormula=${formula}`,
    });
    const record = data.records?.[0];
    return { record: record ? toDiagnosticRecord(record) : null, status: 'ok' };
  } catch (error) {
    if (!isAirtableRecoverableError(error)) {
      console.error('Failed to load latest diagnostic', error);
    }
    return { record: null, status: toLookupStatus(error) };
  }
}

export async function ensureClientFromDiagnostic(diagnostic: DiagnosticRecord) {
  if (!config.configured) {
    return { ok: false as const, reason: 'airtable_not_configured' as const };
  }

  try {
    const formula = encodeURIComponent(
      `LOWER({primary_email})='${esc(diagnostic.email)}'`,
    );
    const existing = await airtableRequest<{ records?: AirtableRecord[] }>({
      table: config.clientsTable,
      path: `?maxRecords=1&filterByFormula=${formula}`,
    });

    const payload = {
      primary_email: diagnostic.email,
      company: diagnostic.company || '',
      status: 'invited',
      latest_diagnostic_id: diagnostic.id,
    };

    const first = existing.records?.[0];
    if (first) {
      await airtableRequest<{ id: string }>({
        table: config.clientsTable,
        path: `/${first.id}`,
        method: 'PATCH',
        body: { fields: payload },
      });

      return {
        ok: true as const,
        clientId: String(first.fields.client_id || ''),
        updated: true as const,
      };
    }

    const clientId = randomUUID();
    await airtableRequest<{ id: string }>({
      table: config.clientsTable,
      method: 'POST',
      body: {
        fields: {
          ...payload,
          client_id: clientId,
          created_at: new Date().toISOString(),
        },
      },
    });

    return { ok: true as const, clientId, updated: false as const };
  } catch {
    return { ok: false as const, reason: 'airtable_request_failed' as const };
  }
}
