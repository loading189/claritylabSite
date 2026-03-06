import assert from 'node:assert/strict';
import test from 'node:test';
import { getAirtableConfig } from '@/lib/airtableConfig';

test('getAirtableConfig reports missing env values', () => {
  const original = { ...process.env };
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;

  const config = getAirtableConfig({ bookingFlowEnabled: true });
  assert.equal(config.configured, false);
  assert.ok(config.missing.includes('AIRTABLE_API_KEY'));
  assert.ok(config.missing.includes('AIRTABLE_BASE_ID'));

  process.env = original;
});
