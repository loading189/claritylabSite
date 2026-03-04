import { captureServerError } from '@/lib/sentry';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export async function onRequestError(error: Error, request: { path?: string }) {
  await captureServerError(error, { path: request.path || 'unknown' });
}
