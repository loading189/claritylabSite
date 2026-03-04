import { runtimeConfig } from './runtime';

export const siteConfig = {
  name: runtimeConfig.site.name,
  founder: 'Christopher Taylor',
  tagline: 'Less chaos. More time.',
  subTagline: 'Audit-grade clarity for service trades.',
  location: 'Fargo area',
  trustLine: 'No pitch • Just clarity',
  description:
    'Clarity Labs helps HVAC, plumbing, electrical, and mechanical service business owners find where cash, time, and margin leak, then turn that into a practical action plan.',
  url: runtimeConfig.site.url,
  calendlyUrl: runtimeConfig.booking.calendlyUrl,
  email: runtimeConfig.site.email,
  phone: runtimeConfig.site.phone,
};

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Audit', href: '/audit' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sample Report', href: '/sample-report' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export const waysIHelp = [
  {
    title: 'Owner-friendly financial clarity',
    description:
      'Translate your numbers into plain-English decisions: what to fix first, what to ignore, and where cash is getting stuck.',
  },
  {
    title: 'Operations bottleneck detection',
    description:
      'Spot handoff issues, scheduling drag, and invoicing slowdowns that quietly eat capacity every week.',
  },
  {
    title: '90-day action plans',
    description:
      'Leave with practical priorities your team can execute without buying another software stack.',
  },
];

export const problems = [
  'Revenue looks okay, but cash still feels tight.',
  'Technicians stay busy but gross margin is inconsistent.',
  'Invoicing, follow-up, and collections happen too slowly.',
  'The owner is still the glue holding every process together.',
];

export const fifteenMinuteBreakdown = [
  {
    title: 'Quick context',
    detail: 'You share where the business feels heavy right now.',
  },
  {
    title: 'Signal scan',
    detail:
      'We identify 2-3 likely leaks in cash flow, productivity, or workflow.',
  },
  {
    title: 'Right next step',
    detail: 'You leave with a clear recommendation to move forward or pause.',
  },
];

export const exampleInsights = [
  {
    title: 'AR & cash flow clarity',
    bullets: [
      'Aging table by customer',
      'DSO trend snapshot',
      '90-day recovery plan',
    ],
  },
  {
    title: 'Technician productivity',
    bullets: [
      'Utilization and billable hour mix',
      'Revenue per tech trend',
      'Rework and schedule gap indicators',
    ],
  },
  {
    title: 'Workflow gaps',
    bullets: [
      'Dispatch to invoice handoff speed',
      'Deposit and card-on-file consistency',
      'Follow-up and closeout checklist misses',
    ],
  },
];

export const howItWorks = [
  {
    step: 'Discover',
    description:
      'Short call to understand goals, constraints, and where pressure shows up.',
  },
  {
    step: 'Audit',
    description:
      'Review financial and operational signals to surface the highest-impact gaps.',
  },
  {
    step: 'Action Plan',
    description:
      'Get a concise roadmap with owner-level priorities and team-level actions.',
  },
  {
    step: 'Optional Implement',
    description:
      'If useful, I can help your team execute the first phase and measure traction.',
  },
];

export const whoItsFor = [
  'Established HVAC, plumbing, electrical, and mechanical service businesses.',
  'Owner-operators and leadership teams who want practical decisions, not generic advice.',
  'Teams with enough weekly job volume to benefit from process and cash-flow optimization.',
];

export const notAFit = [
  'Brand-new one-person operations still proving base demand.',
  'Teams only looking for bookkeeping cleanup with no operations follow-through.',
  'Owners who want a dashboard but do not plan to act on recommendations.',
];

export const insightPosts = [
  {
    slug: 'why-dso-matters-for-trades',
    title: 'Why DSO matters more than top-line growth in service trades',
    excerpt:
      'If receivables stretch, growth can increase stress instead of freedom.',
    date: '2026-02-10',
    category: 'Cash Flow',
  },
  {
    slug: 'schedule-gaps-that-kill-margin',
    title: 'Schedule gaps that quietly kill technician margin',
    excerpt:
      'Small dispatch misses create expensive idle windows across the week.',
    date: '2026-01-28',
    category: 'Operations',
  },
  {
    slug: 'handoffs-before-you-buy-software',
    title: 'Fix handoffs before buying another software tool',
    excerpt:
      'Workflow friction usually starts in process clarity, not tool selection.',
    date: '2026-01-15',
    category: 'Workflow',
  },
];
