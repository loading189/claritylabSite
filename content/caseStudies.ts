export type CaseStudy = {
  slug: string;
  title: string;
  label: string;
  outcome: string;
  summary: string;
  metricChips: string[];
  before: string[];
  findings: string[];
  fixPlan: Array<{ window: '30 days' | '60 days' | '90 days'; action: string }>;
  result: string[];
  disclaimer: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'ar-stalled-350k',
    title: 'AR Stalled at $350k',
    label: 'Pattern Case Study',
    outcome:
      'Collections stabilized in under 90 days by tightening ownership, invoice timing, and escalation rules.',
    summary:
      'Anonymized service business pattern where AR aged too long despite steady weekly job volume.',
    metricChips: ['$350k AR outstanding', '14-day invoice lag', '31% of AR > 60 days'],
    before: [
      'Cash stress hit payroll weeks even with full technician schedules.',
      'Invoices regularly went out 7–14 days after job completion.',
      'Older receivables had no escalation path and sat untouched.',
      'Owner stepped into collections firefighting each month-end.',
    ],
    findings: [
      'No weekly AR owner with authority to clear blockers.',
      '31% of total AR was over 60 days and concentrated in repeat accounts.',
      'Invoice lag averaged 14 days from closeout to send.',
      'Payment terms were inconsistent by dispatcher and customer type.',
    ],
    fixPlan: [
      {
        window: '30 days',
        action:
          'Assign AR owner, enforce same-day closeout handoff, and launch a weekly aging review.',
      },
      {
        window: '60 days',
        action:
          'Segment high-risk accounts, apply escalation rules, and standardize terms on new work orders.',
      },
      {
        window: '90 days',
        action:
          'Lock cadence into scorecards, train office backup coverage, and audit exceptions monthly.',
      },
    ],
    result: [
      'Over-60-day AR share trended down as collections cadence became predictable.',
      'Invoice cycle time dropped materially, improving near-term cash reliability.',
      'Owner involvement shifted from firefighting to weekly oversight.',
    ],
    disclaimer:
      'This is an anonymized, pattern-based example built from common field conditions. It is not a named client engagement.',
  },
  {
    slug: 'technician-utilization-47',
    title: 'Technician Utilization Stuck at 47%',
    label: 'Pattern Case Study',
    outcome:
      'Capacity improved after dispatch rhythm and closeout standards reduced avoidable downtime.',
    summary:
      'Anonymized field-ops pattern where crews stayed busy but billable utilization remained far below target.',
    metricChips: ['47% utilization', 'Overtime drift', 'Dispatch gaps'],
    before: [
      'Technicians logged overtime while daytime windows still had idle pockets.',
      'Dispatch board looked full, but route sequencing created dead time.',
      'Jobs closed late, delaying invoicing and feedback loops to dispatch.',
      'Rework visits consumed high-value slots each week.',
    ],
    findings: [
      'True billable utilization averaged 47% once travel and non-billable callbacks were isolated.',
      'Dispatch handoffs lacked a same-day exception process, creating route gaps.',
      'Overtime drift climbed while first-time-fix consistency was inconsistent by crew.',
      'Field notes were incomplete, slowing closeout and next-day planning.',
    ],
    fixPlan: [
      {
        window: '30 days',
        action:
          'Implement daily dispatch huddle with route gap review and explicit rework ownership.',
      },
      {
        window: '60 days',
        action:
          'Roll out closeout checklist tied to invoice readiness and crew-level quality metrics.',
      },
      {
        window: '90 days',
        action:
          'Use utilization + rework scorecards in weekly lead meetings to sustain capacity gains.',
      },
    ],
    result: [
      'Utilization trended upward as dispatch gaps and non-billable drift were reduced.',
      'Overtime dependency eased with cleaner sequencing and fewer callbacks.',
      'Leadership gained a repeatable operating rhythm for weekly capacity control.',
    ],
    disclaimer:
      'This is an anonymized, pattern-based example built from common field conditions. It is not a named client engagement.',
  },
];
