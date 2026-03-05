export type ScanSource =
  | 'direct'
  | 'business_card_qr'
  | 'linkedin'
  | 'google'
  | 'local';

export type ScanAnswers = {
  cashFlow: 'stable' | 'some_delays' | 'frequent_crunch';
  capacity: 'predictable' | 'inconsistent' | 'chaotic';
  systems: 'documented' | 'partial' | 'owner_dependent';
  urgency: 'exploring' | 'this_quarter' | 'immediate';
  teamReadiness: 'aligned' | 'mixed' | 'stretched';
};

export type ScanResult = {
  score: number;
  tier: 'monitor' | 'priority' | 'critical';
  primarySignal: 'cash' | 'capacity' | 'workflow';
  insights: string[];
  qualified: boolean;
};

const points = {
  cashFlow: { stable: 0, some_delays: 15, frequent_crunch: 30 },
  capacity: { predictable: 0, inconsistent: 15, chaotic: 25 },
  systems: { documented: 0, partial: 12, owner_dependent: 22 },
  urgency: { exploring: 3, this_quarter: 12, immediate: 20 },
  teamReadiness: { aligned: 0, mixed: 8, stretched: 16 },
};

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

export function scoreScan(answers: ScanAnswers): ScanResult {
  const score =
    points.cashFlow[answers.cashFlow] +
    points.capacity[answers.capacity] +
    points.systems[answers.systems] +
    points.urgency[answers.urgency] +
    points.teamReadiness[answers.teamReadiness];

  const weightedSignals = {
    cash: points.cashFlow[answers.cashFlow],
    capacity:
      points.capacity[answers.capacity] +
      points.teamReadiness[answers.teamReadiness],
    workflow: points.systems[answers.systems],
  };

  const primarySignal = (Object.entries(weightedSignals).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0] || 'workflow') as 'cash' | 'capacity' | 'workflow';

  const tier = score >= 75 ? 'critical' : score >= 45 ? 'priority' : 'monitor';

  const insights = [
    primarySignal === 'cash'
      ? 'Cash conversion rhythm is likely your first leverage point.'
      : primarySignal === 'capacity'
        ? 'Capacity drag is likely hiding margin and growth.'
        : 'Workflow handoffs likely need tighter ownership and timing.',
    answers.urgency === 'immediate'
      ? 'Your urgency suggests intervention within 30 days will matter.'
      : 'A focused 90-day plan can reduce pressure without overhauling everything at once.',
  ];

  return {
    score,
    tier,
    primarySignal,
    insights,
    qualified: score >= 45,
  };
}
