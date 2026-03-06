import { scoreScan, type ScanAnswers } from '@/lib/scan';
import type { DiagnosticRecord } from '@/lib/diagnosticsData';

export const answerLabels: Record<
  string,
  { step: string; question: string; values: Record<string, string> }
> = {
  cashFlow: {
    step: 'Cash Flow',
    question: 'How would you describe cash flow right now?',
    values: {
      stable: 'Stable',
      some_delays: 'Some delays',
      frequent_crunch: 'Frequent crunch',
    },
  },
  capacity: {
    step: 'Capacity',
    question: 'How consistent is your team capacity?',
    values: {
      predictable: 'Predictable',
      inconsistent: 'Inconsistent',
      chaotic: 'Chaotic',
    },
  },
  systems: {
    step: 'Systems',
    question: 'How documented are your core workflows?',
    values: {
      documented: 'Documented',
      partial: 'Partial',
      owner_dependent: 'Owner dependent',
    },
  },
  urgency: {
    step: 'Urgency',
    question: 'What is your urgency level?',
    values: {
      exploring: 'Exploring',
      this_quarter: 'This quarter',
      immediate: 'Immediate',
    },
  },
  teamReadiness: {
    step: 'Team Readiness',
    question: 'How ready is your team to execute changes?',
    values: {
      aligned: 'Aligned',
      mixed: 'Mixed',
      stretched: 'Stretched',
    },
  },
};

export function getGroupedAnswers(answers: DiagnosticRecord['answers']) {
  return Object.entries(answerLabels).map(([key, config]) => ({
    key,
    step: config.step,
    question: config.question,
    value: config.values[String(answers[key] || '')] || 'Not answered',
  }));
}

export function getDiagnosticInsights(diagnostic: DiagnosticRecord) {
  if (diagnostic.insights?.length) return diagnostic.insights;

  const answers = diagnostic.answers as ScanAnswers;
  if (
    !answers.cashFlow ||
    !answers.capacity ||
    !answers.systems ||
    !answers.urgency ||
    !answers.teamReadiness
  ) {
    return [];
  }

  return scoreScan(answers).insights;
}
