import 'server-only';

export const BOOKING_SOURCES = [
  'direct',
  'business_card_qr',
  'linkedin',
  'google',
  'local',
] as const;

export const BOOKING_STATUSES = ['booked', 'canceled'] as const;

export const CLIENT_STATUSES = ['invited', 'active', 'booked', 'inactive'] as const;

export const ENGAGEMENT_REQUEST_STATUSES = [
  'open',
  'submitted',
  'reviewing',
  'complete',
  'in_progress',
  'blocked',
] as const;

export function normalizeSingleSelect<T extends readonly string[]>(
  value: unknown,
  accepted: T,
  fallback: T[number],
  aliases?: Record<string, T[number]>,
): T[number] {
  const raw = String(value || '').trim();
  if (!raw) return fallback;

  if ((accepted as readonly string[]).includes(raw)) {
    return raw as T[number];
  }

  const lowered = raw.toLowerCase();
  const lowerMatch = accepted.find((option) => option.toLowerCase() === lowered);
  if (lowerMatch) return lowerMatch;

  if (aliases && aliases[raw]) return aliases[raw];
  if (aliases && aliases[lowered]) return aliases[lowered];

  return fallback;
}

export function requireFields(
  fields: Record<string, unknown>,
  required: string[],
): { ok: true } | { ok: false; missing: string[] } {
  const missing = required.filter((key) => {
    const value = fields[key];
    if (typeof value === 'number' || typeof value === 'boolean') return false;
    return !String(value || '').trim();
  });

  if (missing.length) return { ok: false, missing };
  return { ok: true };
}

export function safeJsonString(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    try {
      JSON.parse(trimmed);
      return trimmed;
    } catch {
      return JSON.stringify(trimmed);
    }
  }

  if (value == null) return '';

  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export function safeJoinedText(value: unknown, separator: string): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(separator);
  }

  if (typeof value === 'string') return value;
  return '';
}
