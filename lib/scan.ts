export type FitTier = 'high_fit' | 'maybe' | 'not_fit_yet';
export type PrimarySignal = 'cash_flow' | 'workflow' | 'capacity' | 'systems';

export type ScanAnswers = {
  industry:
    | 'service'
    | 'construction_trades'
    | 'professional_services'
    | 'retail'
    | 'other';
  teamSize: '1_5' | '6_15' | '16_40' | '40_plus';
  revenueRange: 'under_1m' | '1_3m' | '3_10m' | '10m_plus';
  cashPredictability: 'strong' | 'mixed' | 'weak';
  invoicingSpeed: 'same_day' | 'weekly' | 'delayed';
  arStatus:
    | 'mostly_current'
    | 'some_overdue'
    | 'backlog_significant'
    | 'not_sure';
  deliveryReliability: 'on_time' | 'occasional_delays' | 'constant_fire_drills';
  systemsCohesion: 'integrated' | 'fragmented' | 'mostly_manual' | 'not_sure';
  mainPain:
    | 'cash_flow'
    | 'workflow'
    | 'capacity'
    | 'systems'
    | 'growth_plateau';
  urgency: '30_days' | '90_days' | '6_months' | 'exploring';
};

export type ScanResult = {
  score: number;
  tier: FitTier;
  primarySignal: PrimarySignal;
  insights: string[];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const scoreMaps = {
  teamSize: { '1_5': 6, '6_15': 9, '16_40': 12, '40_plus': 10 },
  revenueRange: { under_1m: 4, '1_3m': 8, '3_10m': 12, '10m_plus': 10 },
  cashPredictability: { strong: 2, mixed: 8, weak: 14 },
  invoicingSpeed: { same_day: 2, weekly: 7, delayed: 12 },
  arStatus: {
    mostly_current: 2,
    some_overdue: 7,
    backlog_significant: 12,
    not_sure: 9,
  },
  deliveryReliability: {
    on_time: 2,
    occasional_delays: 8,
    constant_fire_drills: 13,
  },
  systemsCohesion: {
    integrated: 2,
    fragmented: 7,
    mostly_manual: 12,
    not_sure: 9,
  },
  urgency: { '30_days': 12, '90_days': 9, '6_months': 6, exploring: 3 },
} as const;

const painSignalMap: Record<ScanAnswers['mainPain'], PrimarySignal> = {
  cash_flow: 'cash_flow',
  workflow: 'workflow',
  capacity: 'capacity',
  systems: 'systems',
  growth_plateau: 'workflow',
};

export function deriveSource(utmSource?: string | null): string {
  if (!utmSource) return 'direct';
  const normalized = utmSource.toLowerCase();
  if (normalized.includes('linkedin')) return 'linkedin';
  if (normalized.includes('google')) return 'google';
  if (normalized.includes('qr')) return 'business_card_qr';
  if (normalized.includes('local')) return 'local';
  return 'direct';
}

/**
 * Deterministic rubric:
 * - Higher points reflect higher operational strain + implementation readiness.
 * - Tier thresholds: 70+ high fit, 45-69 maybe, below 45 not fit yet.
 */
export function scoreScan(answers: ScanAnswers): ScanResult {
  const base =
    scoreMaps.teamSize[answers.teamSize] +
    scoreMaps.revenueRange[answers.revenueRange] +
    scoreMaps.cashPredictability[answers.cashPredictability] +
    scoreMaps.invoicingSpeed[answers.invoicingSpeed] +
    scoreMaps.arStatus[answers.arStatus] +
    scoreMaps.deliveryReliability[answers.deliveryReliability] +
    scoreMaps.systemsCohesion[answers.systemsCohesion] +
    scoreMaps.urgency[answers.urgency];

  const fitBonus =
    answers.industry === 'service' || answers.industry === 'construction_trades'
      ? 10
      : 5;
  const painBonus =
    answers.mainPain === 'cash_flow' || answers.mainPain === 'workflow' ? 8 : 5;

  const score = clamp(base + fitBonus + painBonus, 0, 100);

  const tier: FitTier =
    score >= 70 ? 'high_fit' : score >= 45 ? 'maybe' : 'not_fit_yet';
  const primarySignal = painSignalMap[answers.mainPain];

  const insights: string[] = [];
  if (
    answers.cashPredictability !== 'strong' ||
    answers.arStatus !== 'mostly_current'
  ) {
    insights.push(
      'Cash timing pressure is likely suppressing owner confidence week to week.',
    );
  }
  if (answers.deliveryReliability !== 'on_time') {
    insights.push(
      'Delivery execution friction is creating avoidable margin and trust drag.',
    );
  }
  if (
    answers.systemsCohesion === 'mostly_manual' ||
    answers.systemsCohesion === 'fragmented'
  ) {
    insights.push(
      'System handoff gaps suggest high-value automation and process cleanup opportunities.',
    );
  }
  if (answers.urgency === '30_days' || answers.urgency === '90_days') {
    insights.push(
      'Your urgency profile indicates this is a decision window, not a “someday” issue.',
    );
  }

  if (insights.length < 2) {
    insights.push(
      'Your responses show a stable baseline with targeted leverage points for growth.',
    );
    insights.push(
      'A focused roadmap can likely unlock speed without adding operational noise.',
    );
  }

  return { score, tier, primarySignal, insights: insights.slice(0, 4) };
}
