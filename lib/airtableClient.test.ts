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
