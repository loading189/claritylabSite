import assert from 'node:assert/strict';
import test from 'node:test';
import { createScanDiagnostic, upsertLead } from '@/lib/airtable';

function restoreEnv(originalEnv: NodeJS.ProcessEnv) {
  process.env = originalEnv;
}

test('createScanDiagnostic returns id and uses diagnostics table when configured', async () => {
  const originalEnv = { ...process.env };
  process.env.AIRTABLE_API_KEY = 'pat_test';
  process.env.AIRTABLE_BASE_ID = 'app_test';
  process.env.AIRTABLE_DIAGNOSTICS_TABLE = 'Scan Diagnostics';
  process.env.AIRTABLE_TABLE_NAME = 'Leads';

  let requestedUrl = '';
  global.fetch = async (input: RequestInfo | URL) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({ id: 'rec_diag_123' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const created = await createScanDiagnostic({ email: 'ceo@example.com' });

  assert.equal(created.id, 'rec_diag_123');
  assert.match(requestedUrl, /\/Scan%20Diagnostics$/);

  restoreEnv(originalEnv);
});

test('createScanDiagnostic falls back with diagnostics-specific message when Airtable is not configured', async () => {
  const originalEnv = { ...process.env };
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;

  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    throw new Error('fetch should not be called when diagnostics readiness is false');
  };

  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(' '));
  };

  const created = await createScanDiagnostic({ email: 'ceo@example.com' });

  console.warn = originalWarn;
  restoreEnv(originalEnv);

  assert.equal(created.id, undefined);
  assert.equal(fetchCalled, false);
  assert.ok(
    warnings.some((message) =>
      message.includes('Scan diagnostics fallback (diagnostics Airtable table not configured):'),
    ),
  );
});

test('upsertLead still uses lead-table readiness fallback when Airtable is not configured', async () => {
  const originalEnv = { ...process.env };
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;

  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    throw new Error('fetch should not be called when lead readiness is false');
  };

  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(' '));
  };

  await upsertLead({
    created_at: new Date().toISOString(),
    source: 'contact_form',
    name: 'Test Lead',
    email: 'lead@example.com',
    phone: '',
    company: '',
    industry: '',
    interest: 'unknown',
    pain_area: 'other',
    resource_slug: '',
    status: 'New',
    consent: false,
    message: 'help',
  });

  console.log = originalLog;
  restoreEnv(originalEnv);

  assert.equal(fetchCalled, false);
  assert.ok(
    logs.some((message) =>
      message.includes('Lead capture fallback (no Airtable configured):'),
    ),
  );
});
