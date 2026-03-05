import 'server-only';
import { randomUUID } from 'crypto';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const DIAGNOSTICS_TABLE =
  process.env.AIRTABLE_DIAGNOSTICS_TABLE ||
  process.env.AIRTABLE_SCAN_TABLE ||
  'Diagnostics';
const CLIENTS_TABLE = process.env.AIRTABLE_CLIENTS_TABLE || 'Clients';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

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
  enabled: Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && DIAGNOSTICS_TABLE),
  required: [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_DIAGNOSTICS_TABLE',
  ],
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

async function at<T>(tableOrPath: string, init?: RequestInit): Promise<T> {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableOrPath}`,
    {
      ...init,
      headers,
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(`Airtable request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

function esc(value: string) {
  return value.replace(/'/g, "\\'");
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
  const path = `${encodeURIComponent(DIAGNOSTICS_TABLE)}?pageSize=${Math.min(Math.max(limit, 1), 100)}&sort[0][field]=created_at&sort[0][direction]=desc${formula}${offsetParam}`;

  try {
    const data = await at<{ records?: AirtableRecord[]; offset?: string }>(
      path,
    );
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
    const data = await at<AirtableRecord>(
      `${encodeURIComponent(DIAGNOSTICS_TABLE)}/${id}`,
    );
    return toDiagnosticRecord(data);
  } catch (error) {
    console.error('Failed to get diagnostic by id', error);
    return null;
  }
}

export async function getLatestDiagnosticByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!diagnosticsReadiness.enabled || !normalized) return null;

  const formula = encodeURIComponent(`LOWER({email})='${esc(normalized)}'`);
  const path = `${encodeURIComponent(DIAGNOSTICS_TABLE)}?maxRecords=1&sort[0][field]=created_at&sort[0][direction]=desc&filterByFormula=${formula}`;

  try {
    const data = await at<{ records?: AirtableRecord[] }>(path);
    const record = data.records?.[0];
    return record ? toDiagnosticRecord(record) : null;
  } catch (error) {
    console.error('Failed to load latest diagnostic', error);
    return null;
  }
}

export async function ensureClientFromDiagnostic(diagnostic: DiagnosticRecord) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return { ok: false as const, reason: 'airtable_not_configured' as const };
  }

  const formula = encodeURIComponent(
    `LOWER({primary_email})='${esc(diagnostic.email)}'`,
  );
  const existing = await at<{ records?: AirtableRecord[] }>(
    `${encodeURIComponent(CLIENTS_TABLE)}?maxRecords=1&filterByFormula=${formula}`,
  );

  const payload = {
    primary_email: diagnostic.email,
    company: diagnostic.company || '',
    status: 'invited',
    latest_diagnostic_id: diagnostic.id,
  };

  const first = existing.records?.[0];
  if (first) {
    await at<{ id: string }>(
      `${encodeURIComponent(CLIENTS_TABLE)}/${first.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ fields: payload }),
      },
    );

    return {
      ok: true as const,
      clientId: String(first.fields.client_id || ''),
      updated: true as const,
    };
  }

  const clientId = randomUUID();
  await at<{ id: string }>(encodeURIComponent(CLIENTS_TABLE), {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        ...payload,
        client_id: clientId,
        created_at: new Date().toISOString(),
      },
    }),
  });

  return { ok: true as const, clientId, updated: false as const };
}
