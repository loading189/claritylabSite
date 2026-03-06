import assert from 'node:assert/strict';
import test from 'node:test';

import { listRecentDeliverables, mapFileToDeliverable } from '@/lib/deliverablesData';
import type { VaultFile } from '@/lib/vaultData';

function makeFile(overrides: Partial<VaultFile>): VaultFile {
  return {
    client_id: 'client_1',
    client_email: 'owner@example.com',
    uploader_role: 'admin',
    uploader_user_id: 'admin_1',
    category: 'report',
    filename: 'Delivery Summary.pdf',
    storage_key: 'clients/client_1/reports/x.pdf',
    mime_type: 'application/pdf',
    size_bytes: 100,
    created_at: '2026-01-10T15:00:00.000Z',
    ...overrides,
  };
}

test('mapFileToDeliverable reads richer metadata when present', () => {
  const deliverable = mapFileToDeliverable(
    makeFile({
      title: 'Week 2 Delivery Summary',
      deliverable_type: 'weekly_update',
      summary_note: 'Shared KPI trend and revenue adjustments.',
      period_covered: 'Jan 8 - Jan 14',
      status: 'shared',
    }),
  );

  assert.equal(deliverable.title, 'Week 2 Delivery Summary');
  assert.equal(deliverable.deliverableType, 'weekly_update');
  assert.equal(deliverable.periodCovered, 'Jan 8 - Jan 14');
  assert.equal(deliverable.status, 'shared');
});

test('listRecentDeliverables excludes records hidden from clients', () => {
  const visible = makeFile({ filename: 'Visible.pdf', visible_to_client: 'true' });
  const hidden = makeFile({ filename: 'Hidden.pdf', visible_to_client: 'false', storage_key: 'clients/client_1/reports/y.pdf' });

  const deliverables = listRecentDeliverables([hidden, visible]);

  assert.equal(deliverables.length, 1);
  assert.equal(deliverables[0]?.title, 'Visible.pdf');
});

test('mapFileToDeliverable keeps draft and internal-only deliverables out of portal visibility', () => {
  const draft = mapFileToDeliverable(makeFile({ deliverable_visibility: 'draft', visible_to_client: true }));
  const internalOnly = mapFileToDeliverable(makeFile({ deliverable_visibility: 'internalOnly', visible_to_client: true }));

  assert.equal(draft.visibleToClient, false);
  assert.equal(internalOnly.visibleToClient, false);
  assert.equal(draft.visibility, 'draft');
});
