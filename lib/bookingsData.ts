import 'server-only';
import { randomUUID } from 'crypto';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const BOOKINGS_TABLE = process.env.AIRTABLE_BOOKINGS_TABLE || 'Bookings';
const CLIENTS_TABLE = process.env.AIRTABLE_CLIENTS_TABLE || 'Clients';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export type BookingRecord = {
  id?: string;
  booking_id: string;
  client_email: string;
  client_id?: string;
  status: 'booked' | 'canceled';
  start_time?: string | null;
  end_time?: string | null;
  timezone?: string | null;
  calendly_event_uri?: string;
  calendly_invitee_uri?: string;
  source: 'direct' | 'business_card_qr' | 'linkedin' | 'google' | 'local';
  created_at: string;
};

export type ClientBookingState = {
  status: 'invited' | 'active' | 'booked' | 'inactive';
  booked_start_time?: string | null;
  booked_end_time?: string | null;
  booked_timezone?: string | null;
  last_booking_id?: string;
  last_booking_status?: 'booked' | 'canceled';
};

type AirtableRecord = { id: string; fields: Record<string, unknown> };

const hasBookingsTables = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);

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

function toClientRecord(record: AirtableRecord) {
  const fields = record.fields;

  return {
    id: record.id,
    client_id: String(fields.client_id ?? ''),
    primary_email: String(fields.primary_email ?? '').toLowerCase(),
    status: String(fields.status ?? 'invited'),
    booked_start_time: String(fields.booked_start_time ?? '').trim() || null,
    booked_end_time: String(fields.booked_end_time ?? '').trim() || null,
    booked_timezone: String(fields.booked_timezone ?? '').trim() || null,
    last_booking_id: String(fields.last_booking_id ?? '').trim() || null,
    last_booking_status:
      String(fields.last_booking_status ?? '').trim() || null,
  };
}

export async function getBookingById(bookingId: string) {
  if (!hasBookingsTables || !bookingId) return null;

  try {
    const formula = encodeURIComponent(`{booking_id}='${esc(bookingId)}'`);
    const data = await at<{ records?: AirtableRecord[] }>(
      `${encodeURIComponent(BOOKINGS_TABLE)}?maxRecords=1&filterByFormula=${formula}`,
    );
    return data.records?.[0] || null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[bookingsData] getBookingById failed', error);
    }
    return null;
  }
}

export async function upsertBooking(booking: BookingRecord) {
  if (!hasBookingsTables) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[bookingsData] Airtable not configured; skipping upsertBooking',
      );
    }
    return { ok: true as const, skipped: 'no_airtable' as const };
  }

  const existing = await getBookingById(booking.booking_id);
  const fields = {
    ...booking,
    created_at: booking.created_at || new Date().toISOString(),
  };

  try {
    if (existing) {
      await at<{ id: string }>(
        `${encodeURIComponent(BOOKINGS_TABLE)}/${existing.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ fields }),
        },
      );
      return { ok: true as const, id: existing.id, created: false as const };
    }

    const created = await at<{ id: string }>(
      encodeURIComponent(BOOKINGS_TABLE),
      {
        method: 'POST',
        body: JSON.stringify({ fields }),
      },
    );

    return { ok: true as const, id: created.id, created: true as const };
  } catch (error) {
    console.error('[bookingsData] upsertBooking failed', error);
    return { ok: false as const, reason: 'upsert_failed' as const };
  }
}

export async function getClientByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!hasBookingsTables || !normalized) return null;

  try {
    const formula = encodeURIComponent(
      `LOWER({primary_email})='${esc(normalized)}'`,
    );
    const data = await at<{ records?: AirtableRecord[] }>(
      `${encodeURIComponent(CLIENTS_TABLE)}?maxRecords=1&filterByFormula=${formula}`,
    );

    const record = data.records?.[0];
    return record ? toClientRecord(record) : null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[bookingsData] getClientByEmail failed', error);
    }
    return null;
  }
}

export async function updateClientBookingState(
  email: string,
  bookingSummary: ClientBookingState,
) {
  if (!hasBookingsTables) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[bookingsData] Airtable not configured; skipping updateClientBookingState',
      );
    }
    return { ok: true as const, skipped: 'no_airtable' as const };
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized)
    return { ok: false as const, reason: 'missing_email' as const };

  try {
    const existing = await getClientByEmail(normalized);
    const fields: Record<string, string | null> = {
      primary_email: normalized,
      status: bookingSummary.status,
      booked_start_time: bookingSummary.booked_start_time || null,
      booked_end_time: bookingSummary.booked_end_time || null,
      booked_timezone: bookingSummary.booked_timezone || null,
      last_booking_id: bookingSummary.last_booking_id || null,
      last_booking_status: bookingSummary.last_booking_status || null,
    };

    if (existing?.id) {
      await at<{ id: string }>(
        `${encodeURIComponent(CLIENTS_TABLE)}/${existing.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ fields }),
        },
      );

      return {
        ok: true as const,
        clientId: existing.client_id || undefined,
        created: false as const,
      };
    }

    const clientId = randomUUID();
    await at<{ id: string }>(encodeURIComponent(CLIENTS_TABLE), {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          ...fields,
          client_id: clientId,
          created_at: new Date().toISOString(),
          status: bookingSummary.status === 'booked' ? 'booked' : 'active',
        },
      }),
    });

    return { ok: true as const, clientId, created: true as const };
  } catch (error) {
    console.error('[bookingsData] updateClientBookingState failed', error);
    return { ok: false as const, reason: 'client_update_failed' as const };
  }
}
