import { scanQuestions, scoreScan, type ScanAnswers } from '@/lib/scan';
import type { DiagnosticRecord } from '@/lib/diagnosticsData';

export const answerLabels: Record<
  string,
  { step: string; question: string; values: Record<string, string> }
> = Object.fromEntries(
  scanQuestions.map((question) => [
    question.key,
    {
      step: question.category.replaceAll('_', ' '),
      question: question.title,
      values: Object.fromEntries(
        question.options.map((option) => [option.value, option.label]),
      ),
    },
  ]),
);

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
  if (!scanQuestions.every((question) => Boolean(answers[question.key]))) {
    return [];
  }

  return scoreScan(answers).insights;
}
