import assert from 'node:assert/strict';
import test from 'node:test';
import { getAdvisoryBriefFromDiagnostic, getDiagnosticGuidance } from '@/lib/diagnosticGuidance';
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

test('getAdvisoryBriefFromDiagnostic returns deterministic action plan fields for cash signals', () => {
  const brief = getAdvisoryBriefFromDiagnostic(baseDiagnostic);

  assert.ok(brief.shortSummary.includes('do not need to fix everything at once'));
  assert.equal(brief.whereToStart.length, 3);
  assert.equal(brief.firstStep, brief.whereToStart[0]);
  assert.deepEqual(brief.nextTwoSteps, brief.whereToStart.slice(1, 3));
  assert.equal(brief.resources[0]?.href, '/resources/ar-recovery-checklist');
  assert.equal(brief.keyResponses.length, 3);
});

test('getAdvisoryBriefFromDiagnostic falls back to systems profile for unknown signal', () => {
  const brief = getAdvisoryBriefFromDiagnostic({
    ...baseDiagnostic,
    primarySignal: 'mystery',
    tier: 'Cool',
  });

  assert.ok(brief.shortSummary.includes('manageable right now'));
  assert.ok(brief.whatMayBeHappening[0]?.includes('memory instead of a repeatable process'));
  assert.ok(brief.discussionPoints[0]?.includes('owner-dependent'));
});

test('getDiagnosticGuidance keeps compatibility shape while using advisory brief values', () => {
  const guidance = getDiagnosticGuidance(baseDiagnostic);
  const brief = getAdvisoryBriefFromDiagnostic(baseDiagnostic);

  assert.deepEqual(guidance.nextSteps, brief.whereToStart);
  assert.deepEqual(guidance.prepSuggestions, brief.prepItems);
  assert.deepEqual(guidance.discussionPoints, brief.discussionPoints);
  assert.equal(guidance.summaryBullets[0], brief.keyResponses[0]);
});
