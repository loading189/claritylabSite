export type ScanSource =
  | 'direct'
  | 'business_card_qr'
  | 'linkedin'
  | 'google'
  | 'local';

export type SignalKey =
  | 'cashflow'
  | 'capacity'
  | 'pricing'
  | 'visibility'
  | 'founder';

export type ScanAnswers = {
  businessStage: 'steady' | 'changing_fast' | 'resetting';
  monthlyRevenueConsistency: 'predictable' | 'up_and_down' | 'hard_to_predict';
  cashBuffer: 'comfortable' | 'tight_some_months' | 'often_stressed';
  receivablesRhythm: 'on_time' | 'mixed_timing' | 'often_late';
  workloadControl: 'mostly_in_control' | 'frequent_fire_drills' | 'constant_firefighting';
  hiringCoverage: 'roles_covered' | 'few_gaps' | 'major_gaps';
  processOwnership: 'clear_and_repeatable' | 'partly_documented' | 'owner_or_key_person_dependent';
  pricingConfidence: 'clear_and_consistent' | 'some_discounting' | 'guessing_or_reacting';
  marginVisibility: 'clear_enough' | 'partial_view' | 'not_clear';
  decisionCadence: 'weekly_or_better' | 'irregular' | 'mostly_reactive';
  reportingClarity: 'simple_and_trusted' | 'fragmented' | 'hard_to_trust';
  founderLoad: 'sustainable' | 'heavy' | 'overloaded';
  strategicPressure: 'manageable' | 'rising' | 'urgent';
};

export type ScanResult = {
  score: number;
  tier: 'monitor' | 'priority' | 'critical';
  primarySignal: SignalKey;
  secondarySignal: SignalKey;
  signalScores: Record<SignalKey, number>;
  explanation: string;
  whereToStart: string;
  insights: string[];
  qualified: boolean;
};

type QuestionConfig = {
  key: keyof ScanAnswers;
  category:
    | 'business_basics'
    | 'cashflow_signals'
    | 'operational_capacity'
    | 'pricing_confidence'
    | 'decision_visibility'
    | 'strategic_pressure';
  title: string;
  options: Array<{ value: string; label: string; description: string }>;
  weights: Record<string, Partial<Record<SignalKey, number>>>;
};

export const scanQuestions: QuestionConfig[] = [
  {
    key: 'businessStage',
    category: 'business_basics',
    title: 'Which best describes your business right now?',
    options: [
      { value: 'steady', label: 'Steady', description: 'Mostly stable with normal changes.' },
      { value: 'changing_fast', label: 'Changing fast', description: 'Growth or change is stretching the business.' },
      { value: 'resetting', label: 'Resetting', description: 'Recent shifts mean you are rebuilding rhythm.' },
    ],
    weights: {
      steady: { visibility: 0, founder: 0 },
      changing_fast: { capacity: 3, visibility: 2, founder: 2 },
      resetting: { cashflow: 3, visibility: 3, founder: 3 },
    },
  },
  {
    key: 'monthlyRevenueConsistency',
    category: 'business_basics',
    title: 'How predictable is monthly revenue?',
    options: [
      { value: 'predictable', label: 'Predictable', description: 'Most months are within a normal range.' },
      { value: 'up_and_down', label: 'Up and down', description: 'Some swings, but not extreme.' },
      { value: 'hard_to_predict', label: 'Hard to predict', description: 'Big swings or no clear pattern.' },
    ],
    weights: {
      predictable: { cashflow: 0, visibility: 0 },
      up_and_down: { cashflow: 4, visibility: 2 },
      hard_to_predict: { cashflow: 7, visibility: 4 },
    },
  },
  {
    key: 'cashBuffer',
    category: 'cashflow_signals',
    title: 'How often does cash feel tight?',
    options: [
      { value: 'comfortable', label: 'Rarely', description: 'Cash buffer usually feels comfortable.' },
      { value: 'tight_some_months', label: 'Some months', description: 'You feel pressure during certain cycles.' },
      { value: 'often_stressed', label: 'Often', description: 'Cash stress shows up most months.' },
    ],
    weights: {
      comfortable: { cashflow: 0 },
      tight_some_months: { cashflow: 7, founder: 2 },
      often_stressed: { cashflow: 11, founder: 3 },
    },
  },
  {
    key: 'receivablesRhythm',
    category: 'cashflow_signals',
    title: 'How consistent are customer payments?',
    options: [
      { value: 'on_time', label: 'Mostly on time', description: 'Collections are generally predictable.' },
      { value: 'mixed_timing', label: 'Mixed timing', description: 'Some delays create occasional friction.' },
      { value: 'often_late', label: 'Often late', description: 'Late payments regularly affect planning.' },
    ],
    weights: {
      on_time: { cashflow: 0 },
      mixed_timing: { cashflow: 6, visibility: 1 },
      often_late: { cashflow: 10, visibility: 2 },
    },
  },
  {
    key: 'workloadControl',
    category: 'operational_capacity',
    title: 'How would you describe day-to-day workload?',
    options: [
      { value: 'mostly_in_control', label: 'Mostly in control', description: 'Team can handle normal demand.' },
      { value: 'frequent_fire_drills', label: 'Frequent fire drills', description: 'Urgent issues interrupt planned work.' },
      { value: 'constant_firefighting', label: 'Constant firefighting', description: 'Most days are reactive.' },
    ],
    weights: {
      mostly_in_control: { capacity: 0 },
      frequent_fire_drills: { capacity: 7, founder: 2 },
      constant_firefighting: { capacity: 11, founder: 4 },
    },
  },
  {
    key: 'hiringCoverage',
    category: 'operational_capacity',
    title: 'Are key roles adequately covered?',
    options: [
      { value: 'roles_covered', label: 'Yes, mostly covered', description: 'Only minor role strain.' },
      { value: 'few_gaps', label: 'A few gaps', description: 'Important roles have partial coverage.' },
      { value: 'major_gaps', label: 'Major gaps', description: 'Critical roles are under-covered.' },
    ],
    weights: {
      roles_covered: { capacity: 0 },
      few_gaps: { capacity: 5, founder: 2 },
      major_gaps: { capacity: 9, founder: 3 },
    },
  },
  {
    key: 'processOwnership',
    category: 'operational_capacity',
    title: 'How repeatable are your core processes?',
    options: [
      { value: 'clear_and_repeatable', label: 'Clear and repeatable', description: 'Handoffs are mostly reliable.' },
      { value: 'partly_documented', label: 'Partly documented', description: 'Some handoffs still depend on memory.' },
      { value: 'owner_or_key_person_dependent', label: 'Owner/key person dependent', description: 'Too much depends on one person.' },
    ],
    weights: {
      clear_and_repeatable: { capacity: 0, visibility: 0 },
      partly_documented: { capacity: 5, visibility: 3 },
      owner_or_key_person_dependent: { capacity: 7, founder: 4, visibility: 3 },
    },
  },
  {
    key: 'pricingConfidence',
    category: 'pricing_confidence',
    title: 'How confident are you in pricing?',
    options: [
      { value: 'clear_and_consistent', label: 'Clear and consistent', description: 'Pricing supports value and margin.' },
      { value: 'some_discounting', label: 'Some discounting', description: 'Price pressure shows up in some deals.' },
      { value: 'guessing_or_reacting', label: 'Guessing/reacting', description: 'Pricing feels like a negotiation every time.' },
    ],
    weights: {
      clear_and_consistent: { pricing: 0 },
      some_discounting: { pricing: 7, cashflow: 2 },
      guessing_or_reacting: { pricing: 12, cashflow: 3 },
    },
  },
  {
    key: 'marginVisibility',
    category: 'pricing_confidence',
    title: 'How clear is your margin by work type or customer?',
    options: [
      { value: 'clear_enough', label: 'Clear enough', description: 'You can spot profitable work quickly.' },
      { value: 'partial_view', label: 'Partial view', description: 'Some margin visibility, not consistent.' },
      { value: 'not_clear', label: 'Not clear', description: 'Hard to know which work creates profit.' },
    ],
    weights: {
      clear_enough: { pricing: 0, visibility: 0 },
      partial_view: { pricing: 6, visibility: 4 },
      not_clear: { pricing: 10, visibility: 7 },
    },
  },
  {
    key: 'decisionCadence',
    category: 'decision_visibility',
    title: 'How often do you review priorities and make adjustments?',
    options: [
      { value: 'weekly_or_better', label: 'Weekly or better', description: 'Decisions happen on a regular cadence.' },
      { value: 'irregular', label: 'Irregular', description: 'Reviews happen, but not consistently.' },
      { value: 'mostly_reactive', label: 'Mostly reactive', description: 'Decisions happen after issues escalate.' },
    ],
    weights: {
      weekly_or_better: { visibility: 0 },
      irregular: { visibility: 6, founder: 2 },
      mostly_reactive: { visibility: 10, founder: 3 },
    },
  },
  {
    key: 'reportingClarity',
    category: 'decision_visibility',
    title: 'How usable is your reporting for decisions?',
    options: [
      { value: 'simple_and_trusted', label: 'Simple and trusted', description: 'Reports are clear enough to act on.' },
      { value: 'fragmented', label: 'Fragmented', description: 'Data exists, but lives in too many places.' },
      { value: 'hard_to_trust', label: 'Hard to trust', description: 'Data quality or timing causes hesitation.' },
    ],
    weights: {
      simple_and_trusted: { visibility: 0 },
      fragmented: { visibility: 7 },
      hard_to_trust: { visibility: 11, founder: 2 },
    },
  },
  {
    key: 'founderLoad',
    category: 'strategic_pressure',
    title: 'How dependent is execution on you personally?',
    options: [
      { value: 'sustainable', label: 'Sustainable', description: 'You can step away without major disruption.' },
      { value: 'heavy', label: 'Heavy', description: 'You are involved in many key decisions.' },
      { value: 'overloaded', label: 'Overloaded', description: 'Business stalls when you are unavailable.' },
    ],
    weights: {
      sustainable: { founder: 0 },
      heavy: { founder: 8, capacity: 2 },
      overloaded: { founder: 13, capacity: 3 },
    },
  },
  {
    key: 'strategicPressure',
    category: 'strategic_pressure',
    title: 'How urgent is it to improve operations in the next 90 days?',
    options: [
      { value: 'manageable', label: 'Manageable', description: 'Important but not urgent.' },
      { value: 'rising', label: 'Rising', description: 'Pressure is increasing and needs a plan.' },
      { value: 'urgent', label: 'Urgent', description: 'Delay will likely hurt performance.' },
    ],
    weights: {
      manageable: { founder: 0, visibility: 0 },
      rising: { founder: 5, visibility: 2 },
      urgent: { founder: 9, visibility: 3, cashflow: 2 },
    },
  },
];

export const totalScanSteps = scanQuestions.length + 1;

export function isValidScanAnswers(input: unknown): input is ScanAnswers {
  if (!input || typeof input !== 'object') return false;
  const candidate = input as Record<string, string>;
  return scanQuestions.every((question) => {
    const value = candidate[question.key];
    return question.options.some((option) => option.value === value);
  });
}

export function deriveScanSource(utmSource?: string): ScanSource {
  const normalized = (utmSource || '').trim().toLowerCase();
  if (!normalized) return 'direct';
  if (normalized.includes('qr') || normalized.includes('card'))
    return 'business_card_qr';
  if (normalized.includes('linkedin')) return 'linkedin';
  if (normalized.includes('google')) return 'google';
  if (normalized.includes('local')) return 'local';
  return 'direct';
}

const signalLabel: Record<SignalKey, string> = {
  cashflow: 'cash flow',
  capacity: 'capacity',
  pricing: 'pricing',
  visibility: 'decision visibility',
  founder: 'founder load',
};

export function scoreScan(answers: ScanAnswers): ScanResult {
  const signalScores: Record<SignalKey, number> = {
    cashflow: 0,
    capacity: 0,
    pricing: 0,
    visibility: 0,
    founder: 0,
  };

  for (const question of scanQuestions) {
    const value = answers[question.key];
    const weights = question.weights[value] || {};
    for (const signal of Object.keys(signalScores) as SignalKey[]) {
      signalScores[signal] += weights[signal] || 0;
    }
  }

  const orderedSignals = (Object.entries(signalScores) as Array<
    [SignalKey, number]
  >).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const primarySignal = orderedSignals[0]?.[0] || 'visibility';
  const secondarySignal = orderedSignals[1]?.[0] || 'capacity';

  const score = Math.min(
    100,
    Math.round(
      (Object.values(signalScores).reduce((sum, value) => sum + value, 0) /
        110) *
        100,
    ),
  );

  const tier = score >= 70 ? 'critical' : score >= 40 ? 'priority' : 'monitor';

  const explanation = `Your strongest signal is ${signalLabel[primarySignal]}. That usually means this is the pressure point creating the most day-to-day friction right now.`;
  const whereToStart =
    primarySignal === 'cashflow'
      ? 'Start by tightening receivables follow-up and weekly cash planning.'
      : primarySignal === 'capacity'
        ? 'Start by reducing rework and assigning clear ownership for bottleneck tasks.'
        : primarySignal === 'pricing'
          ? 'Start by reviewing recent jobs: where margin slipped and why pricing changed.'
          : primarySignal === 'visibility'
            ? 'Start with one simple weekly dashboard you trust for cash, work-in-progress, and bottlenecks.'
            : 'Start by moving one recurring founder decision to a documented team-owned process.';

  const insights = [
    explanation,
    `Secondary signal: ${signalLabel[secondarySignal]}. This is likely reinforcing the main issue.`,
    whereToStart,
  ];

  return {
    score,
    tier,
    primarySignal,
    secondarySignal,
    signalScores,
    explanation,
    whereToStart,
    insights,
    qualified: score >= 40,
  };
}
