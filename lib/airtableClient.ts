import 'server-only';
import { getAirtableConfig } from '@/lib/airtableConfig';

type AirtableErrorCode =
  | 'missing_env'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
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
  return 'request_failed';
}

function logAirtableIssue(status: number, path: string, table: string) {
  if (process.env.NODE_ENV === 'production') return;

  const hint =
    status === 401
      ? 'Airtable token is missing or invalid.'
      : status === 403
        ? 'Airtable token lacks scope or base/table access.'
        : status === 404
          ? 'Airtable base, table, or record path is incorrect.'
          : 'Airtable request failed.';

  console.warn(
    `[airtable] ${status} for table "${table}" at path "${path}". ${hint}`,
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
    logAirtableIssue(response.status, options.path || '', options.table);
    const code = toErrorCode(response.status);
    throw new AirtableRequestError(
      code,
      `Airtable request failed (${response.status})`,
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
