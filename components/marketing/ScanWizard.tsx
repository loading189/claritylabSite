'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/lib/track';
import { deriveScanSource, scoreScan, type ScanAnswers } from '@/lib/scan';
import { OptionCard } from './OptionCard';
import { ResultCard } from './ResultCard';
import { ScanProgress } from './ScanProgress';

const totalSteps = 6;

type StepKey = keyof ScanAnswers;

const stepConfig: Array<{
  key: StepKey;
  title: string;
  options: Array<{ value: string; label: string; description: string }>;
}> = [
  {
    key: 'cashFlow',
    title: 'How would you describe cash flow right now?',
    options: [
      {
        value: 'stable',
        label: 'Stable',
        description: 'Predictable and manageable.',
      },
      {
        value: 'some_delays',
        label: 'Some delays',
        description: 'Occasional pressure windows.',
      },
      {
        value: 'frequent_crunch',
        label: 'Frequent crunch',
        description: 'Regular stress around pay cycles.',
      },
    ],
  },
  {
    key: 'capacity',
    title: 'How consistent is your team capacity?',
    options: [
      {
        value: 'predictable',
        label: 'Predictable',
        description: 'Workload is balanced most weeks.',
      },
      {
        value: 'inconsistent',
        label: 'Inconsistent',
        description: 'Frequent spikes and dips.',
      },
      {
        value: 'chaotic',
        label: 'Chaotic',
        description: 'Daily firefighting and rework.',
      },
    ],
  },
  {
    key: 'systems',
    title: 'How documented are your core workflows?',
    options: [
      {
        value: 'documented',
        label: 'Documented',
        description: 'Team can run without bottlenecks.',
      },
      {
        value: 'partial',
        label: 'Partial',
        description: 'Some SOPs, uneven adoption.',
      },
      {
        value: 'owner_dependent',
        label: 'Owner dependent',
        description: 'Key work depends on one person.',
      },
    ],
  },
  {
    key: 'urgency',
    title: 'What is your urgency level?',
    options: [
      {
        value: 'exploring',
        label: 'Exploring',
        description: 'Learning options.',
      },
      {
        value: 'this_quarter',
        label: 'This quarter',
        description: 'Need plan in 90 days.',
      },
      {
        value: 'immediate',
        label: 'Immediate',
        description: 'Need action now.',
      },
    ],
  },
  {
    key: 'teamReadiness',
    title: 'How ready is your team to execute changes?',
    options: [
      {
        value: 'aligned',
        label: 'Aligned',
        description: 'Clear ownership and capacity.',
      },
      {
        value: 'mixed',
        label: 'Mixed',
        description: 'Some buy-in, uneven follow-through.',
      },
      {
        value: 'stretched',
        label: 'Stretched',
        description: 'Limited bandwidth.',
      },
    ],
  },
];

export function ScanWizard() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<ScanAnswers>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const source = useMemo(
    () => deriveScanSource(params.get('utm_source') || undefined),
    [params],
  );

  const result = useMemo(() => {
    if (
      step < totalSteps ||
      !answers.cashFlow ||
      !answers.capacity ||
      !answers.systems ||
      !answers.urgency ||
      !answers.teamReadiness
    ) {
      return null;
    }
    return scoreScan(answers as ScanAnswers);
  }, [answers, step]);

  const current = stepConfig[step - 1];

  function choose(value: string) {
    if (!current) return;
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    track('scan_option_selected', {
      step: String(step),
      key: current.key,
      value,
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!result || !email || !consent) return;

    setSubmitting(true);
    track('scan_submit_attempt', { tier: result.tier, source });

    const response = await fetch('/api/scan/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        consent,
        answers,
        result,
        source,
        utmSource: params.get('utm_source') || '',
      }),
    });

    setSubmitting(false);
    if (response.ok) {
      setSubmitted(true);
      track('scan_submitted', {
        tier: result.tier,
        qualified: String(result.qualified),
      });
    }
  }

  return (
    <div className="space-y-6">
      <ScanProgress step={Math.min(step, totalSteps)} total={totalSteps} />

      {current ? (
        <div>
          <h2 className="text-2xl font-semibold text-text">{current.title}</h2>
          <div className="mt-4 grid gap-3">
            {current.options.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={answers[current.key] === option.value}
                onClick={() => choose(option.value)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!answers[current.key]}
              className="rounded-button border border-border bg-surfaceRaised px-4 py-2 text-sm font-semibold text-text disabled:opacity-50"
              onClick={() => {
                setStep((s) => s + 1);
                track('scan_step_advanced', { step: String(step) });
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === totalSteps && result ? (
        <form onSubmit={submit} className="space-y-4">
          <ResultCard result={result} />
          <div>
            <label className="text-sm text-muted">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-button border border-border bg-surface px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-muted">Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-button border border-border bg-surface px-3 py-2"
            />
          </div>
          <label className="flex items-start gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            I agree to be contacted about my diagnostic result.
          </label>
          <button
            type="submit"
            disabled={!consent || !email || submitting || submitted}
            className="rounded-button border border-accent/30 bg-accent px-4 py-2 font-semibold text-black disabled:opacity-50"
          >
            {submitted
              ? 'Submitted'
              : submitting
                ? 'Submitting...'
                : 'Get My Diagnostic Summary'}
          </button>
        </form>
      ) : null}
    </div>
  );
}
