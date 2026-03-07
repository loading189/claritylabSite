import 'server-only';
import { getAirtableConfig } from '@/lib/airtableConfig';

type AirtableErrorCode =
  | 'missing_env'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'unprocessable'
  | 'request_failed';

export class AirtableRequestError extends Error {
  code: AirtableErrorCode;
  status?: number;

  constructor(code: AirtableErrorCode, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function toErrorCode(status: number): AirtableErrorCode {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 422) return 'unprocessable';
  return 'request_failed';
}

async function readAirtableError(response: Response) {
  const text = await response.text();
  if (!text.trim()) return '';

  try {
    const parsed = JSON.parse(text) as {
      error?: { type?: string; message?: string };
    };
    const type = parsed.error?.type ? `[${parsed.error.type}] ` : '';
    return `${type}${parsed.error?.message || text}`;
  } catch {
    return text;
  }
}

function logAirtableIssue(
  status: number,
  path: string,
  table: string,
  method: string,
  details: string,
) {
  if (process.env.NODE_ENV === 'production') return;

  const hint =
    status === 401
      ? 'Airtable token is missing or invalid.'
      : status === 403
        ? 'Airtable token lacks scope or base/table access.'
        : status === 404
          ? 'Airtable base, table, or record path is incorrect.'
          : status === 422
            ? 'Airtable rejected the payload. Check field names/types/select options.'
            : 'Airtable request failed.';

  console.warn(
    `[airtable] ${method} ${status} for table "${table}" at path "${path}". ${hint}${details ? ` Details: ${details}` : ''}`,
  );
}

export async function airtableRequest<T>(options: {
  table: string;
  path?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
}): Promise<T> {
  const config = getAirtableConfig();
  if (!config.apiKey || !config.baseId) {
    throw new AirtableRequestError(
      'missing_env',
      'Airtable credentials are not configured.',
    );
  }

  const safeTable = encodeURIComponent(options.table);
  const routePath = options.path
    ? options.path.startsWith('?') || options.path.startsWith('/')
      ? options.path
      : `/${options.path}`
    : '';
  const url = `https://api.airtable.com/v0/${config.baseId}/${safeTable}${routePath}`;

  const response = await fetch(url, {
    method: options.method || (options.body ? 'POST' : 'GET'),
    cache: options.cache || 'no-store',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const details = await readAirtableError(response);
    logAirtableIssue(
      response.status,
      options.path || '',
      options.table,
      options.method || (options.body ? 'POST' : 'GET'),
      details,
    );
    const code = toErrorCode(response.status);
    throw new AirtableRequestError(
      code,
      `Airtable request failed (${response.status})${details ? `: ${details}` : ''}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export function isAirtableRecoverableError(error: unknown) {
  return (
    error instanceof AirtableRequestError &&
    (error.code === 'missing_env' ||
      error.code === 'unauthorized' ||
      error.code === 'forbidden' ||
      error.code === 'not_found')
  );
}
