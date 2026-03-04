import { createHash } from 'crypto';

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

export function checkRateLimit(ip: string, key: string) {
  const hashed = createHash('sha256').update(`${ip}:${key}`).digest('hex');
  const now = Date.now();
  const current = store.get(hashed);

  if (!current || current.resetAt <= now) {
    store.set(hashed, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false };
  }

  current.count += 1;
  store.set(hashed, current);

  if (current.count > MAX_REQUESTS) {
    return { limited: true, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  return { limited: false };
}
