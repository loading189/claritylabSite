import assert from 'node:assert/strict';
import test from 'node:test';
import { getPortalEngagementStage, shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';

test('shouldShowUnavailableRecordsState returns true for Airtable unavailability', () => {
  assert.equal(shouldShowUnavailableRecordsState('forbidden', false), true);
  assert.equal(shouldShowUnavailableRecordsState('missing_env', false), true);
  assert.equal(shouldShowUnavailableRecordsState('ok', false), false);
  assert.equal(shouldShowUnavailableRecordsState('forbidden', true), false);
});

test('getPortalEngagementStage uses engagement-first ordering', () => {
  assert.equal(getPortalEngagementStage({ hasDiagnostic: true, isSessionBooked: true }), 'active_engagement');
  assert.equal(getPortalEngagementStage({ hasDiagnostic: true, isSessionBooked: false }), 'qualified_lead');
  assert.equal(getPortalEngagementStage({ hasDiagnostic: false, isSessionBooked: false }), 'early_access');
});
