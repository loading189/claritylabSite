import assert from 'node:assert/strict';
import test from 'node:test';
import { getDiagnosticGuidance } from '@/lib/diagnosticGuidance';
import type { DiagnosticRecord } from '@/lib/diagnosticsData';

const baseDiagnostic: DiagnosticRecord = {
  id: 'diag_123',
  created_at: new Date().toISOString(),
  email: 'owner@example.com',
  score: 35,
  tier: 'Hot',
  primarySignal: 'cash_flow',
  source: 'scan',
  answers: {
    cashFlow: 'frequent_crunch',
    capacity: 'chaotic',
    systems: 'owner_dependent',
    urgency: 'immediate',
    teamReadiness: 'mixed',
  },
};

test('getDiagnosticGuidance returns cashflow recommendations for cash signals', () => {
  const guidance = getDiagnosticGuidance(baseDiagnostic);

  assert.equal(guidance.explanations.length, 4);
  assert.ok(guidance.explanations[0]?.includes('do not need to fix everything at once'));
  assert.ok(guidance.nextSteps[0]?.includes('weekly review of open invoices'));
  assert.equal(guidance.resources[0]?.href, '/resources/ar-recovery-checklist');
  assert.equal(guidance.summaryBullets.length, 3);
});

test('getDiagnosticGuidance falls back to systems profile for unknown signal', () => {
  const guidance = getDiagnosticGuidance({
    ...baseDiagnostic,
    primarySignal: 'mystery',
    tier: 'Cool',
  });

  assert.ok(guidance.explanations[0]?.includes('manageable right now'));
  assert.ok(guidance.discussionPoints[0]?.includes('owner-dependent'));
});
