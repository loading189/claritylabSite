import { VariantContent } from './variants';

type CtaLink = {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost' | 'secondary';
};

export const sharedMarketingContent = {
  hero: {
    ctas: {
      default: [
        {
          label: 'Get the AR Checklist',
          href: '/resources/ar-recovery-checklist',
          variant: 'primary',
        },
        {
          label: 'View Sample Report',
          href: '/sample-report',
          variant: 'ghost',
        },
        {
          label: 'Take the Diagnostic',
          href: '/scan',
          variant: 'secondary',
        },
      ],
    } satisfies VariantContent<CtaLink[]>,
  },
  callout: {
    title: 'Start with a practical resource',
    description:
      'Grab the AR checklist or sample report first. If you want help after that, we can walk through your situation together on a call.',
  },
  nextStep: {
    title: 'Pick your next step',
    subtitle:
      'Start with a sample report or checklist. The diagnostic is available when you want a deeper read.',
  },
} as const;

export const homePageContent = {
  hero: {
    badge: 'Clarity Labs',
    title:
      'We help you see what is slowing cash flow and execution in your service business.',
    description:
      'Get practical guidance you can act on. Start with a free resource, then decide if a deeper diagnostic and call make sense.',
  },
  problemSection: {
    title: 'Operational problems we find first',
    subtitle:
      'Three common patterns that silently reduce profitability and growth capacity.',
  },
  methodSection: {
    title: 'How we work',
    subtitle:
      'Simple steps: learn what is happening, decide what to fix first, and move forward.',
  },
  findingsSection: {
    title: 'Proof patterns we see every week',
    subtitle:
      'Short signals that show where cash, capacity, and execution are breaking down.',
  },
  proofPatterns: [
    {
      metric: '$350k AR outstanding',
      note: 'When AR ownership is unclear, old balances linger and payroll weeks get tighter.',
      href: '/case-studies/ar-stalled-350k',
      label: 'Read AR pattern',
    },
    {
      metric: '47% technician utilization',
      note: 'Busy schedules can still hide dead time, overtime drift, and dispatch misses.',
      href: '/case-studies/technician-utilization-47',
      label: 'Read utilization pattern',
    },
    {
      metric: '54-day DSO pattern',
      note: 'Invoice lag plus weak follow-up usually shows up before owners feel it in cash.',
      href: '/sample-report',
      label: 'View sample report',
    },
  ],
  findingsAuditSection: {
    title: 'Example findings from audits',
    subtitle: 'Real insights that create decisions in days, not months.',
  },
  findings: [
    'Revenue concentration: top 3 customers account for 48% of monthly cash inflow.',
    'Invoice lag: average 5.8 days between job completion and invoice send.',
    'Dispatch drag: 11% of technician hours lost to avoidable routing and handoff delays.',
  ],
  sampleReportSection: {
    heading: 'Sample Report Preview',
    description:
      'Download the sample report to see the structure, scorecards, and recommendation format we deliver.',
    ctaTitle: 'Get the sample report format',
    ctaSubtitle:
      'Review the exact structure, scorecards, and recommendation style before you book.',
  },
  caseStudiesSection: {
    title: 'Case studies',
    subtitle:
      'Pattern-based examples of what changes after focused work together.',
  },
  operatorNotesSection: {
    title: 'Start with these operator notes',
    subtitle: 'Featured operator notes we recommend reading first.',
  },
  latestInsightsSection: {
    title: 'Latest insights',
    subtitle:
      'Practical notes from the field on cash, team throughput, and execution systems.',
  },
  checklistCard: {
    title: 'Get the AR checklist',
    description:
      'Use the one-page cadence to tighten collections without creating friction.',
    linkLabel: 'Get the AR Recovery Checklist →',
    href: '/resources/ar-recovery-checklist',
  },
} as const;

export const startHereContent = {
  metadataDescription:
    'New here? Start with a practical resource, then choose the next step that fits your situation.',
  heading: 'Start here',
  intro:
    'This page is for service business owners who know something is leaking but want a clean next step. Pick one path below and move immediately: grab a resource, review the sample output, or take the diagnostic when you want a deeper read.',
  actions: [
    {
      title: 'View Sample Report',
      description:
        'See the exact deliverable format before you decide to engage.',
      href: '/sample-report',
      event: 'start_here_sample_report_click',
    },
    {
      title: 'Get the AR Checklist',
      description:
        'Run the one-page collections cadence with your team this week.',
      href: '/resources/ar-recovery-checklist',
      event: 'start_here_checklist_click',
    },
    {
      title: 'Take the Diagnostic',
      description:
        'Use this when you want a quick read on where cash, capacity, and execution may be getting stuck.',
      href: '/scan',
      event: 'start_here_scan_click',
    },
  ],
  contactPrefix: 'Prefer email?',
} as const;
