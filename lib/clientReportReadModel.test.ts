import assert from 'node:assert/strict';
import test from 'node:test';

import { buildClientReportReadModel } from '@/lib/clientReportReadModel';
import type { DiagnosticRecord } from '@/lib/diagnosticsData';
import type { VaultFile } from '@/lib/vaultData';

function makeFile(overrides: Partial<VaultFile> = {}): VaultFile {
  return {
    id: 'file_1',
    client_id: 'client_1',
    client_email: 'owner@example.com',
    uploader_role: 'admin',
    uploader_user_id: 'admin_1',
    category: 'report',
    filename: 'Q1 Clarity Report.pdf',
    storage_key: 'clients/client_1/reports/q1.pdf',
    mime_type: 'application/pdf',
    size_bytes: 200,
    created_at: '2026-02-10T10:00:00.000Z',
    title: 'Q1 Clarity Report',
    deliverable_type: 'report',
    summary_note: 'Here’s what we found. Collections follow-through is the main cash pressure point.',
    period_covered: 'Jan 1 - Mar 31',
    visible_to_client: true,
    report_publish_state: 'client_visible',
    status: 'delivered',
    ...overrides,
  };
}

function makeDiagnostic(overrides: Partial<DiagnosticRecord> = {}): DiagnosticRecord {
  return {
    id: 'diag_1',
    created_at: '2026-02-09T10:00:00.000Z',
    email: 'owner@example.com',
    score: 78,
    tier: 'critical',
    primarySignal: 'cashflow',
    secondarySignal: 'capacity',
    source: 'direct',
    answers: {},
    ...overrides,
  };
}

test('buildClientReportReadModel maps report and diagnostic into deterministic sections', () => {
  const report = buildClientReportReadModel({
    clientId: 'client_1',
    reportFile: makeFile(),
    diagnostic: makeDiagnostic(),
  });

  assert.ok(report);
  assert.equal(report?.title, 'Q1 Clarity Report');
  assert.equal(report?.primarySignal, 'Cashflow');
  assert.equal(report?.secondarySignal, 'Capacity');
  assert.equal(report?.charts[0]?.id, 'pressure-by-signal');
  assert.equal(report?.tables[1]?.id, 'action-plan');
});

test('buildClientReportReadModel excludes non-client-visible files', () => {
  const report = buildClientReportReadModel({
    clientId: 'client_1',
    reportFile: makeFile({ visible_to_client: false, report_publish_state: 'internal' }),
    diagnostic: makeDiagnostic(),
  });

  assert.equal(report, null);
});

test('buildClientReportReadModel uses authored content when available', () => {
  const report = buildClientReportReadModel({
    clientId: 'client_1',
    reportFile: makeFile({
      report_content_json: JSON.stringify({
        subtitle: 'Q1 review for your leadership team',
        executiveSummary: 'Here’s what we found. The largest pressure is in delayed follow-through.',
        keyFindings: [{ area: 'Cash flow', finding: 'Collections lag by 18 days.', impact: 'high' }],
        priorityActions: [{ action: 'Set weekly collections review.', owner: 'Owner', timing: 'This week', priority: 'high' }],
        sections: [{ id: 's1', title: 'Context', content: 'Sales held steady while collections slowed.' }],
      }),
    }),
    diagnostic: makeDiagnostic(),
  });

  assert.ok(report);
  assert.equal(report?.subtitle, 'Q1 review for your leadership team');
  assert.equal(report?.keyFindings[0]?.finding, 'Collections lag by 18 days.');
  assert.equal(report?.sections[0]?.title, 'Context');
});
