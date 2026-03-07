import assert from 'node:assert/strict';
import test from 'node:test';
import { AirtableRequestError, airtableRequest } from '@/lib/airtableClient';

function mockFetchStatus(status: number) {
  global.fetch = async () =>
    new Response('{}', {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
}

test('airtableRequest maps 401/403/404 errors', async () => {
  const originalEnv = { ...process.env };
  process.env.AIRTABLE_API_KEY = 'pat_test';
  process.env.AIRTABLE_BASE_ID = 'app_test';

  mockFetchStatus(401);
  await assert.rejects(
    () => airtableRequest({ table: 'Clients' }),
    (error: unknown) => {
      return (
        error instanceof AirtableRequestError && error.code === 'unauthorized'
      );
    },
  );

  mockFetchStatus(403);
  await assert.rejects(
    () => airtableRequest({ table: 'Clients' }),
    (error: unknown) => {
      return (
        error instanceof AirtableRequestError && error.code === 'forbidden'
      );
    },
  );

  mockFetchStatus(404);
  await assert.rejects(
    () => airtableRequest({ table: 'Clients' }),
    (error: unknown) => {
      return (
        error instanceof AirtableRequestError && error.code === 'not_found'
      );
    },
  );

  process.env = originalEnv;
});


test('airtableRequest maps 422 errors and includes airtable details', async () => {
  const originalEnv = { ...process.env };
  process.env.AIRTABLE_API_KEY = 'pat_test';
  process.env.AIRTABLE_BASE_ID = 'app_test';

  global.fetch = async () =>
    new Response(JSON.stringify({ error: { type: 'INVALID_VALUE_FOR_COLUMN', message: 'tier is invalid' } }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });

  await assert.rejects(
    () => airtableRequest({ table: 'Diagnostics', method: 'POST', body: { fields: { tier: 'bad' } } }),
    (error: unknown) => {
      return (
        error instanceof AirtableRequestError &&
        error.code === 'unprocessable' &&
        error.message.includes('tier is invalid')
      );
    },
  );

  process.env = originalEnv;
});
