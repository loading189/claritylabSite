const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

type ParsedDsn = {
  key: string;
  host: string;
  projectId: string;
  protocol: string;
};

function parseDsn(value?: string): ParsedDsn | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const projectId = url.pathname.replace(/^\//, '');

    if (!url.username || !projectId) return null;

    return {
      key: url.username,
      host: url.host,
      projectId,
      protocol: url.protocol,
    };
  } catch {
    return null;
  }
}

async function postToSentry(error: unknown, scope: 'server' | 'client', extra?: Record<string, string>) {
  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const body = {
    event_id: crypto.randomUUID().replace(/-/g, '').slice(0, 32),
    message: error instanceof Error ? error.message : String(error),
    level: 'error',
    platform: 'javascript',
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tags: { scope },
    extra,
  };

  const endpoint = `${parsed.protocol}//${parsed.host}/api/${parsed.projectId}/store/?sentry_key=${parsed.key}&sentry_version=7`;
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    keepalive: true,
  });
}

export function initClientSentry() {
  return Boolean(dsn);
}

export function initServerSentry() {
  return Boolean(dsn);
}

export async function captureServerError(error: unknown, extra?: Record<string, string>) {
  if (!dsn) return;
  await postToSentry(error, 'server', extra);
}

export function captureClientError(error: unknown, extra?: Record<string, string>) {
  if (!dsn) return;

  void postToSentry(error, 'client', extra);
}
