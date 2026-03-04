export type Resource = {
  slug: 'ar-recovery-checklist' | 'cash-flow-snapshot';
  title: string;
  summary: string;
  valueProp: string;
  includes: string[];
  followUpSubject: string;
};

export const resources: Resource[] = [
  {
    slug: 'ar-recovery-checklist',
    title: 'AR Recovery Checklist for Service Trades',
    summary: 'A practical checklist to tighten collections without adding another software stack.',
    valueProp:
      'Use this to reduce receivables drag and build a weekly AR rhythm your office team can execute.',
    includes: [
      'Aging bucket triage workflow for 0–30, 31–60, 61+ day invoices',
      'Call and email cadence templates in plain English',
      'Owner review checklist for weekly accountability',
    ],
    followUpSubject: 'Requesting AR Recovery Checklist',
  },
  {
    slug: 'cash-flow-snapshot',
    title: 'Cash-Flow Snapshot Template',
    summary: 'A one-page scorecard to spot where cash gets stuck in HVAC, plumbing, and electrical operations.',
    valueProp: 'Use this snapshot to connect operations and cash performance in one weekly owner view.',
    includes: [
      'Simple KPI set for DSO, invoice speed, and gross margin trend',
      'Weekly review prompts to prioritize the next action',
      'Implementation notes for field + office handoffs',
    ],
    followUpSubject: 'Requesting Cash-Flow Snapshot Template',
  },
];
