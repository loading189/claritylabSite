'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/lib/track';
import {
  deriveScanSource,
  isValidScanAnswers,
  scanQuestions,
  scoreScan,
  totalScanSteps,
  type ScanAnswers,
} from '@/lib/scan';
import { buildDiagnosticBookingUrl } from '@/lib/bookingUrl';
import { OptionCard } from './OptionCard';
import { ResultCard } from './ResultCard';
import { ScanProgress } from './ScanProgress';

type StepKey = keyof ScanAnswers;

export function ScanWizard() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<ScanAnswers>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const source = useMemo(
    () => deriveScanSource(params.get('utm_source') || undefined),
    [params],
  );

  const result = useMemo(() => {
    if (step < totalScanSteps || !isValidScanAnswers(answers)) {
      return null;
    }
    return scoreScan(answers);
  }, [answers, step]);

  const current = scanQuestions[step - 1];

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
    if (!result || !email || !consent || !isValidScanAnswers(answers)) return;

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
        source,
        utmSource: params.get('utm_source') || '',
      }),
    });

    setSubmitting(false);
    if (response.ok) {
      const payload = (await response.json()) as {
        diagnosticId?: string;
      };
      setDiagnosticId(payload.diagnosticId || null);
      setSubmitted(true);
      track('scan_submitted', {
        tier: result.tier,
        qualified: String(result.qualified),
      });
    }
  }

  const bookingBase = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';
  const bookingHref =
    submitted && result
      ? buildDiagnosticBookingUrl(bookingBase, {
          id: diagnosticId || 'pending_diagnostic',
          primarySignal: result.primarySignal,
          secondarySignal: result.secondarySignal,
          score: result.score,
          tier: result.tier,
        })
      : null;

  return (
    <div className="space-y-6">
      <ScanProgress step={Math.min(step, totalScanSteps)} total={totalScanSteps} />

      {current ? (
        <div>
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            {current.category.replaceAll('_', ' ')}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-text">{current.title}</h2>
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

      {step === totalScanSteps && result ? (
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
          {bookingHref ? (
            <div className="rounded-card border border-border bg-surfaceRaised p-4">
              <p className="text-sm text-muted">Ready for a practical walkthrough of this result?</p>
              <Link href={bookingHref} className="mt-2 inline-flex font-semibold text-accent underline-offset-2 hover:underline">
                Book your call
              </Link>
            </div>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
