import type { DiagnosticRecord } from '@/lib/diagnosticsData';
import { getGroupedAnswers } from '@/lib/diagnosticsPresentation';

export type GuidanceResource = {
  title: string;
  href: string;
};

export type AdvisoryBrief = {
  shortSummary: string;
  whatMayBeHappening: string[];
  whereToStart: string[];
  firstStep: string;
  nextTwoSteps: string[];
  watchFor: string[];
  prepItems: string[];
  discussionPoints: string[];
  resources: GuidanceResource[];
  keyResponses: string[];
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
  shortSummary: string;
  whatMayBeHappening: string[];
  whereToStart: string[];
  watchFor: string[];
  prepItems: string[];
  discussionPoints: string[];
  resources: GuidanceResource[];
};

const signalProfiles: Record<string, SignalProfile> = {
  cashflow: {
    shortSummary: 'Cash pressure is likely tied to invoice timing and collections follow-through.',
    whatMayBeHappening: [
      'Money may be coming in, but too much of it is getting stuck in invoicing or collections.',
      'The team can stay busy while cash still feels tight week to week.',
      'This usually points to timing gaps between work done and cash received.',
    ],
    whereToStart: [
      'Review open invoices each week by age: current, 31–60 days, and 61+ days.',
      'Pick one owner for collections follow-up so nothing slips.',
      'Set a 24-hour target for sending invoices after work is complete.',
    ],
    watchFor: [
      'Invoices over 30 days are growing week to week.',
      'Collections follow-up is not assigned to one clear owner.',
      'Job closeout happens, but invoices are still delayed.',
    ],
    prepItems: [
      'Your current A/R aging report, or a simple list of overdue invoices.',
      'One recent example where work was done but cash came in late.',
      'Any notes on where invoicing or collections got stuck.',
    ],
    discussionPoints: [
      'Where does the invoice-to-cash handoff break most often?',
      'What is your current follow-up cadence for overdue invoices?',
      'What can the office team change this week to free up cash faster?',
    ],
    resources: [
      { title: 'AR Recovery Checklist', href: '/resources/ar-recovery-checklist' },
      { title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' },
    ],
  },
  capacity: {
    shortSummary: 'Team workload likely outpaced planning rhythm, so delays are compounding.',
    whatMayBeHappening: [
      'Workload is likely outpacing your team rhythm, so small delays turn into larger backlogs.',
      'The business may be growing faster than scheduling and handoffs can keep up.',
      'People are working hard, but daily priorities are not always clear.',
    ],
    whereToStart: [
      'Set one short daily planning touchpoint for dispatch, field, and office leads.',
      'Choose one bottleneck to fix first instead of trying to fix every delay at once.',
      'Track one weekly number for on-time completion so progress is visible.',
    ],
    watchFor: [
      'Carry-over work keeps growing from one week to the next.',
      'Jobs are rescheduled because scope, parts, or timing were unclear.',
      'Team members are solving the same handoff issues repeatedly.',
    ],
    prepItems: [
      'Last week’s schedule misses or carry-over work list.',
      'Two examples where jobs stalled between teams.',
      'Your current dispatch or scheduling view, even if it is simple.',
    ],
    discussionPoints: [
      'What type of work gets pushed most often?',
      'Where do handoffs break between dispatch, field, and invoicing?',
      'Which one process change would give the team breathing room quickly?',
    ],
    resources: [{ title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' }],
  },
  systems: {
    shortSummary: 'Core work likely depends too much on memory, which causes avoidable rework.',
    whatMayBeHappening: [
      'Important work may depend on memory instead of a repeatable process.',
      'Results can vary by person, which creates avoidable rework.',
      'As volume grows, undocumented steps usually create more stress and mistakes.',
    ],
    whereToStart: [
      'Document one core workflow this week, starting with the most expensive breakdown.',
      'Assign clear owners for each step so handoffs are predictable.',
      'Create a short weekly review to catch issues before they compound.',
    ],
    watchFor: [
      'Different team members complete the same work in different ways.',
      'Problems only surface after billing delays or client complaints.',
      'Fixes are discussed, but they are not captured as a shared process.',
    ],
    prepItems: [
      'One workflow your team handles differently depending on who is on shift.',
      'A recent issue caused by a missed handoff or undocumented step.',
      'Any checklist, SOP, or notes the team already uses today.',
    ],
    discussionPoints: [
      'Which process is most owner-dependent right now?',
      'Where do errors show up most often in delivery or billing?',
      'Which workflow is small enough to document and stabilize this month?',
    ],
    resources: [{ title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' }],
  },
};

function normalizeSignal(primarySignal: string) {
  const normalized = primarySignal.trim().toLowerCase().replace(/[_\s-]+/g, '');
  if (normalized.includes('cash')) return 'cashflow';
  if (normalized.includes('cap')) return 'capacity';
  if (normalized.includes('system') || normalized.includes('workflow')) return 'systems';
  return normalized;
}

function getTierLead(tier: string) {
  const normalized = tier.trim().toLowerCase();
  if (normalized === 'hot') {
    return 'You do not need to fix everything at once. We should start with the one issue that reduces pressure fastest.';
  }
  if (normalized === 'warm') {
    return 'You have room to make steady progress. A short, focused plan should create quick wins.';
  }
  return 'This looks manageable right now. Small fixes now can prevent bigger slowdowns later.';
}

function toActionPlanSteps(whereToStart: string[]) {
  const [firstStep = 'Start with one clear issue this week and assign an owner.', ...remaining] = whereToStart;
  return {
    firstStep,
    nextTwoSteps: remaining.slice(0, 2),
  };
}

export function getAdvisoryBriefFromDiagnostic(diagnostic: DiagnosticRecord): AdvisoryBrief {
  const profile = signalProfiles[normalizeSignal(diagnostic.primarySignal)] || signalProfiles.systems;
  const groupedAnswers = getGroupedAnswers(diagnostic.answers);
  const keyResponses = groupedAnswers
    .filter((answer) => answer.value !== 'Not answered')
    .slice(0, 3)
    .map((answer) => `${answer.step}: ${answer.value}`);

  const plan = toActionPlanSteps(profile.whereToStart);

  return {
    shortSummary: `${getTierLead(diagnostic.tier)} ${profile.shortSummary}`,
    whatMayBeHappening: profile.whatMayBeHappening,
    whereToStart: profile.whereToStart,
    firstStep: plan.firstStep,
    nextTwoSteps: plan.nextTwoSteps,
    watchFor: profile.watchFor,
    prepItems: profile.prepItems,
    discussionPoints: profile.discussionPoints,
    resources: profile.resources,
    keyResponses,
  };
}

// Backward-compatible shape for existing consumers during rollout.
export function getDiagnosticGuidance(diagnostic: DiagnosticRecord): DiagnosticGuidance {
  const brief = getAdvisoryBriefFromDiagnostic(diagnostic);
  return {
    explanations: [brief.shortSummary, ...brief.whatMayBeHappening].slice(0, 4),
    nextSteps: brief.whereToStart,
    resources: brief.resources,
    prepSuggestions: brief.prepItems,
    discussionPoints: brief.discussionPoints,
    summaryBullets: brief.keyResponses,
  };
}
