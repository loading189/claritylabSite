import assert from 'node:assert/strict';
import test from 'node:test';

import { mapEngagementRequestRecord } from '@/lib/engagementRequestsData';

test('mapEngagementRequestRecord normalizes a persisted request record', () => {
  const mapped = mapEngagementRequestRecord({
    id: 'rec_1',
    fields: {
      client_id: 'client_1',
      title: 'Upload January P&L',
      category: 'files',
      status: 'in_progress',
      due_date: '2026-01-18',
      owner: 'Owner',
      notes: 'CSV export is fine.',
      created_at: '2026-01-12T10:00:00.000Z',
    },
  });

  assert.equal(mapped?.id, 'rec_1');
  assert.equal(mapped?.clientId, 'client_1');
  assert.equal(mapped?.status, 'in_progress');
  assert.equal(mapped?.dueDate, '2026-01-18');
});

test('mapEngagementRequestRecord returns null when required fields are missing', () => {
  const mapped = mapEngagementRequestRecord({
    id: 'rec_2',
    fields: {
      client_id: 'client_1',
    },
  });

  assert.equal(mapped, null);
});
