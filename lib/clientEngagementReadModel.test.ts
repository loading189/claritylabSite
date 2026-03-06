import assert from 'node:assert/strict';
import test from 'node:test';

import { buildClientEngagementReadModel } from '@/lib/clientEngagementReadModel';
import type { DiagnosticRecord } from '@/lib/diagnosticsData';
import type { VaultFile } from '@/lib/vaultData';

const diagnostic: DiagnosticRecord = {
  id: 'diag_1',
  created_at: '2026-01-03T10:00:00.000Z',
  email: 'owner@example.com',
  score: 61,
  tier: 'stabilize',
  primarySignal: 'cashflow',
  source: 'direct',
  answers: {
    cashFlow: 'tight',
  },
};

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
    created_at: '2026-01-05T15:00:00.000Z',
    ...overrides,
  };
}

test('buildClientEngagementReadModel infers active delivery and report progress', () => {
  const report = makeFile({ category: 'report', filename: 'Week 1 Plan.pdf' });
  const upload = makeFile({ category: 'upload', filename: 'Bank Export.csv' });

  const model = buildClientEngagementReadModel({
    diagnosticStatus: 'ok',
    diagnostic,
    bookedStartTime: '2026-01-04T14:00:00.000Z',
    bookedTimezone: 'UTC',
    isSessionBooked: true,
    reportFiles: [report],
    uploadFiles: [upload],
    calendlyUrl: '/book',
  });

  assert.equal(model.lifecycleStage, 'engagement_active');
  assert.equal(model.engagementStatusLabel, 'Engagement active');
  assert.equal(model.nextMilestone, 'Report delivered');
  assert.equal(model.recentDeliverables.length, 1);
  assert.equal(model.recentDeliverables[0]?.title, 'Week 1 Plan.pdf');
  assert.equal(model.milestones.every((item) => item.completed), true);
  assert.equal(model.recordsUnavailable, false);
});

test('buildClientEngagementReadModel keeps next actions clear before booking', () => {
  const model = buildClientEngagementReadModel({
    diagnosticStatus: 'ok',
    diagnostic,
    bookedStartTime: null,
    bookedTimezone: null,
    isSessionBooked: false,
    reportFiles: [],
    uploadFiles: [],
    calendlyUrl: '/book',
  });

  assert.equal(model.lifecycleStage, 'scan_completed');
  assert.equal(model.nextAction.label, 'Book your kickoff call');
  assert.equal(model.outstandingRequests[0]?.id, 'book-call');
  assert.equal(model.nextMilestone, 'Call booked');
  assert.equal(model.latestReportSummary, 'No report has been delivered yet.');
  assert.equal(model.latestUploadSummary, 'No files uploaded yet.');
});

test('buildClientEngagementReadModel returns unavailable state when diagnostics are inaccessible', () => {
  const model = buildClientEngagementReadModel({
    diagnosticStatus: 'forbidden',
    diagnostic: null,
    bookedStartTime: null,
    bookedTimezone: null,
    isSessionBooked: false,
    reportFiles: [],
    uploadFiles: [],
    calendlyUrl: '/book',
  });

  assert.equal(model.recordsUnavailable, true);
  assert.equal(model.diagnosticContext.hasDiagnostic, false);
  assert.equal(model.lifecycleStage, 'early_access');
});
