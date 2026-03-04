export type CaseStudy = {
  slug: string;
  title: string;
  label: string;
  summary: string;
  snapshot: {
    industry: string;
    teamSize?: string;
    revenueRange?: string;
    location?: string;
  };
  symptoms: string[];
  rootCauses: string[];
  actions: string[];
  metrics: Array<{ metric: string; before: string; after: string }>;
  deliverables: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'prairie-mechanical-services-sample-audit-demo',
    title: 'Prairie Mechanical Services — Sample Audit (Demo)',
    label: 'Sample / Demonstration',
    summary:
      'Hypothetical HVAC and mechanical team that improved collections and reduced dispatch drag using a focused 90-day plan.',
    snapshot: {
      industry: 'HVAC + mechanical service',
      teamSize: '18 field + office staff',
      revenueRange: '$3M–$5M annualized',
      location: 'Upper Midwest (sample scenario)',
    },
    symptoms: [
      'Owner was covering payroll stress despite steady booked revenue.',
      'Invoices were often sent days after job completion.',
      'Technician schedule gaps were common during high-demand weeks.',
    ],
    rootCauses: [
      'No weekly AR ownership rhythm across office team.',
      'Dispatch handoffs to billing were inconsistent by technician.',
      'First-time-fix misses created rework and margin leakage.',
    ],
    actions: [
      'Built a weekly AR recovery cadence with role-based accountability.',
      'Implemented a same-day closeout checklist from dispatch to invoice.',
      'Introduced a simple technician utilization scorecard reviewed every Monday.',
    ],
    metrics: [
      { metric: 'Days Sales Outstanding (DSO)', before: '57 days', after: '41 days' },
      { metric: 'Invoice sent within 24 hours', before: '61%', after: '89%' },
      { metric: 'Average weekly schedule gaps', before: '14.5 hours', after: '6.0 hours' },
    ],
    deliverables: [
      'Audit summary with top 5 leaks by cash, time, and margin impact.',
      '90-day execution plan with owner and team assignments.',
      'Weekly KPI template for AR, utilization, and closeout quality.',
    ],
  },
  {
    slug: 'riverbend-plumbing-sample-audit-demo',
    title: 'Riverbend Plumbing — Sample Audit (Demo)',
    label: 'Sample / Demonstration',
    summary:
      'Hypothetical plumbing business that stabilized gross margin by tightening job closeout and follow-up execution.',
    snapshot: {
      industry: 'Residential + light commercial plumbing',
      teamSize: '11 field + office staff',
      revenueRange: '$1.5M–$2.5M annualized',
      location: 'Northern Plains (sample scenario)',
    },
    symptoms: [
      'Busy calendar but uneven cash flow week to week.',
      'Rework calls were trending up and cutting billable capacity.',
      'Follow-up on estimates happened irregularly.',
    ],
    rootCauses: [
      'Closeout checklist was optional and rarely audited.',
      'No consistent owner-level visibility into rework by technician.',
      'Estimate follow-up lacked ownership and timeline standards.',
    ],
    actions: [
      'Rolled out a mandatory closeout standard with office verification.',
      'Created a weekly rework and first-time-fix review with leads.',
      'Assigned estimate follow-up ownership with a 48-hour rule.',
    ],
    metrics: [
      { metric: 'Gross margin consistency (monthly variance)', before: '±11%', after: '±4%' },
      { metric: 'Rework rate', before: '9.1%', after: '5.2%' },
      { metric: 'Estimate follow-up within 48 hours', before: '46%', after: '84%' },
    ],
    deliverables: [
      'Root-cause map across dispatch, closeout, and collections.',
      'Prioritized operating scorecard for weekly leadership review.',
      'Implementation guide for office + field handoff standards.',
    ],
  },
];
