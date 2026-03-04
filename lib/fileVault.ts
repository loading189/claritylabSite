import 'server-only';
import { createHmac, randomUUID } from 'crypto';

const secret = process.env.FILE_SIGNING_SECRET || process.env.CLERK_SECRET_KEY || 'dev-secret';
const ttlDefault = Number(process.env.FILE_URL_TTL_SECONDS || '900');

export const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'image/png',
  'image/jpeg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const maxFileSizeBytes = 25 * 1024 * 1024;

export function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
}

export function makeStorageKey(clientId: string, category: 'upload' | 'report' | 'contract', filename: string) {
  const month = new Date().toISOString().slice(0, 7);
  const safe = sanitizeFilename(filename || 'file.bin');
  return `clients/${clientId}/${category === 'upload' ? 'uploads' : category + 's'}/${month}/${randomUUID()}-${safe}`;
}

function sign(payload: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function createLocalPresignedUrl({
  key,
  action,
  expiresInSeconds = ttlDefault,
}: {
  key: string;
  action: 'put' | 'get';
  expiresInSeconds?: number;
}) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${action}:${key}:${exp}`;
  const sig = sign(payload);
  return `/api/client/files/blob?action=${action}&key=${encodeURIComponent(key)}&exp=${exp}&sig=${sig}`;
}

export function verifyLocalSignature(action: string, key: string, exp: string, sig: string) {
  if (!action || !key || !exp || !sig) return false;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(`${action}:${key}:${expNum}`);
  return expected === sig;
}
