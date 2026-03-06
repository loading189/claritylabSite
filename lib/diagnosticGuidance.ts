import type { DiagnosticRecord } from '@/lib/diagnosticsData';
import { getGroupedAnswers } from '@/lib/diagnosticsPresentation';

type GuidanceResource = {
  title: string;
  href: string;
};

export type DiagnosticGuidance = {
  explanations: string[];
  nextSteps: string[];
  resources: GuidanceResource[];
  prepSuggestions: string[];
  discussionPoints: string[];
  summaryBullets: string[];
};

type SignalProfile = {
  explanations: string[];
  nextSteps: string[];
  resources: GuidanceResource[];
  prepSuggestions: string[];
  discussionPoints: string[];
};

const signalProfiles: Record<string, SignalProfile> = {
  cashflow: {
    explanations: [
      'Money may be coming in, but too much of it is getting stuck in invoicing or collections.',
      'The team can stay busy while cash still feels tight week to week.',
      'This usually points to timing gaps between work done and cash received.',
    ],
    nextSteps: [
      'Start a weekly review of open invoices by age: current, 31–60 days, and 61+ days.',
      'Pick one owner for collections follow-up so nothing falls through.',
      'Set a 24-hour target for sending invoices after work is complete.',
    ],
    resources: [
      { title: 'AR Recovery Checklist', href: '/resources/ar-recovery-checklist' },
      { title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' },
    ],
    prepSuggestions: [
      'Bring your current A/R aging report or a simple overdue invoice list.',
      'Bring one recent example where work was completed but cash was delayed.',
    ],
    discussionPoints: [
      'Where does the invoice-to-cash handoff break most often?',
      'What is the current follow-up cadence for overdue invoices?',
      'What could the office team do this week that would free up cash fastest?',
    ],
  },
  capacity: {
    explanations: [
      'Workload is likely outpacing your team rhythm, so small delays turn into larger backlogs.',
      'The business may be growing faster than scheduling and handoffs can keep up.',
      'People are often working hard, but priorities are unclear day to day.',
    ],
    nextSteps: [
      'Set one short daily planning touchpoint for dispatch, field, and office leads.',
      'Choose one bottleneck to fix first instead of trying to fix every delay at once.',
      'Track one weekly number for on-time completion so progress is visible.',
    ],
    resources: [{ title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' }],
    prepSuggestions: [
      'Bring last week’s schedule misses or carry-over work list.',
      'Bring examples of where jobs stalled between teams.',
    ],
    discussionPoints: [
      'What type of work is getting pushed most often?',
      'Where do handoffs break between dispatch, field, and invoicing?',
      'Which one process change would give the team breathing room quickly?',
    ],
  },
  systems: {
    explanations: [
      'Important work may depend on memory instead of a repeatable process.',
      'Results can vary by person, which creates avoidable rework.',
      'As volume grows, undocumented steps usually create more stress and mistakes.',
    ],
    nextSteps: [
      'Document one core workflow this week, starting with the most expensive breakdown.',
      'Assign clear owners for each step so handoffs are predictable.',
      'Create a short weekly review to catch issues before they compound.',
    ],
    resources: [{ title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' }],
    prepSuggestions: [
      'Bring one workflow your team handles differently depending on who is on shift.',
      'Bring a recent issue caused by a missed handoff or undocumented step.',
    ],
    discussionPoints: [
      'Which process is most owner-dependent right now?',
      'Where do errors show up most often in delivery or billing?',
      'Which workflow is small enough to document and stabilize this month?',
    ],
  },
};

function normalizeSignal(primarySignal: string) {
  const normalized = primarySignal.trim().toLowerCase().replace(/[_\s-]+/g, '');
  if (normalized.includes('cash')) return 'cashflow';
  if (normalized.includes('cap')) return 'capacity';
  if (normalized.includes('system') || normalized.includes('workflow')) return 'systems';
  return normalized;
}

function getTierNote(tier: string) {
  const normalized = tier.trim().toLowerCase();
  if (normalized === 'hot') {
    return 'You do not need to fix everything at once. We should start with the one issue that will reduce pressure fastest.';
  }
  if (normalized === 'warm') {
    return 'You have room to make steady progress. A short, focused plan will likely create quick wins.';
  }
  return 'This looks manageable right now. Small fixes now can prevent bigger slowdowns later.';
}

export function getDiagnosticGuidance(diagnostic: DiagnosticRecord): DiagnosticGuidance {
  const profile = signalProfiles[normalizeSignal(diagnostic.primarySignal)] || signalProfiles.systems;
  const tierNote = getTierNote(diagnostic.tier);
  const groupedAnswers = getGroupedAnswers(diagnostic.answers);

  const keyAnswers = groupedAnswers
    .filter((answer) => answer.value !== 'Not answered')
    .slice(0, 3)
    .map((answer) => `${answer.step}: ${answer.value}`);

  return {
    explanations: [tierNote, ...profile.explanations].slice(0, 4),
    nextSteps: profile.nextSteps.slice(0, 4),
    resources: profile.resources,
    prepSuggestions: profile.prepSuggestions,
    discussionPoints: profile.discussionPoints,
    summaryBullets: keyAnswers,
  };
}
