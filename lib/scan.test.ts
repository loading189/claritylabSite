import assert from 'node:assert/strict';
import test from 'node:test';
import { scoreScan, type ScanAnswers } from '@/lib/scan';

test('scoreScan returns deterministic primary and secondary signals', () => {
  const answers: ScanAnswers = {
    businessStage: 'resetting',
    monthlyRevenueConsistency: 'hard_to_predict',
    cashBuffer: 'often_stressed',
    receivablesRhythm: 'often_late',
    workloadControl: 'constant_firefighting',
    hiringCoverage: 'major_gaps',
    processOwnership: 'owner_or_key_person_dependent',
    pricingConfidence: 'guessing_or_reacting',
    marginVisibility: 'not_clear',
    decisionCadence: 'mostly_reactive',
    reportingClarity: 'hard_to_trust',
    founderLoad: 'overloaded',
    strategicPressure: 'urgent',
  };

  const result = scoreScan(answers);
  assert.equal(result.tier, 'critical');
  assert.equal(result.primarySignal, 'founder');
  assert.equal(result.secondarySignal, 'visibility');
  assert.ok(result.score >= 70);
  assert.ok(result.whereToStart.length > 0);
});


test('scoreScan produces monitor tier for low-pressure answers', () => {
  const answers: ScanAnswers = {
    businessStage: 'steady',
    monthlyRevenueConsistency: 'predictable',
    cashBuffer: 'comfortable',
    receivablesRhythm: 'on_time',
    workloadControl: 'mostly_in_control',
    hiringCoverage: 'roles_covered',
    processOwnership: 'clear_and_repeatable',
    pricingConfidence: 'clear_and_consistent',
    marginVisibility: 'clear_enough',
    decisionCadence: 'weekly_or_better',
    reportingClarity: 'simple_and_trusted',
    founderLoad: 'sustainable',
    strategicPressure: 'manageable',
  };

  const result = scoreScan(answers);
  assert.equal(result.tier, 'monitor');
  assert.equal(result.score, 0);
});
