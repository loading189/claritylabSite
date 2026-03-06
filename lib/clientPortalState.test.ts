import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';

test('shouldShowUnavailableRecordsState returns true for Airtable unavailability', () => {
  assert.equal(shouldShowUnavailableRecordsState('forbidden', false), true);
  assert.equal(shouldShowUnavailableRecordsState('missing_env', false), true);
  assert.equal(shouldShowUnavailableRecordsState('ok', false), false);
  assert.equal(shouldShowUnavailableRecordsState('forbidden', true), false);
});
