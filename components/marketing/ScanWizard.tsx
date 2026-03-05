'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { runtimeConfig } from '@/content/runtime';
import { track } from '@/lib/track';
import { deriveSource, FitTier, scoreScan, ScanAnswers } from '@/lib/scan';
import { OptionCard } from './OptionCard';
import { ResultCard } from './ResultCard';
import { ScanProgress } from './ScanProgress';

type UtmData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type ScanWizardProps = {
  utm: UtmData;
};

const totalSteps = 6;

type FormState = Partial<ScanAnswers> & {
  email?: string;
  company?: string;
  consent?: boolean;
};

const tierCopy: Record<FitTier, string> = {
  high_fit: 'You look like a strong fit for a focused Clarity Call.',
  maybe:
    'You may be a fit. A short Clarity Call can confirm the best next move.',
  not_fit_yet:
    'You are early for direct engagement. Start with practical resources first.',
};

function getScanAnswers(form: FormState): ScanAnswers {
  return {
    industry: form.industry as ScanAnswers['industry'],
    teamSize: form.teamSize as ScanAnswers['teamSize'],
    revenueRange: form.revenueRange as ScanAnswers['revenueRange'],
    cashPredictability:
      form.cashPredictability as ScanAnswers['cashPredictability'],
    invoicingSpeed: form.invoicingSpeed as ScanAnswers['invoicingSpeed'],
    arStatus: form.arStatus as ScanAnswers['arStatus'],
    deliveryReliability:
      form.deliveryReliability as ScanAnswers['deliveryReliability'],
    systemsCohesion: form.systemsCohesion as ScanAnswers['systemsCohesion'],
    mainPain: form.mainPain as ScanAnswers['mainPain'],
    urgency: form.urgency as ScanAnswers['urgency'],
  };
}

function isStepComplete(step: number, form: FormState) {
  switch (step) {
    case 1:
      return Boolean(form.industry && form.teamSize && form.revenueRange);
    case 2:
      return Boolean(form.cashPredictability && form.invoicingSpeed);
    case 3:
      return Boolean(form.arStatus);
    case 4:
      return Boolean(form.deliveryReliability);
    case 5:
      return Boolean(form.systemsCohesion);
    case 6:
      return Boolean(
        form.mainPain && form.urgency && form.email && form.consent,
      );
    default:
      return false;
  }
}

export function ScanWizard({ utm }: ScanWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const source = deriveSource(utm.utm_source);
  const result = useMemo(() => {
    if (!done) return null;
    return scoreScan(getScanAnswers(form));
  }, [done, form]);

  useEffect(() => {
    track('scan_start', { source });
  }, [source]);

  const setAnswer = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onNext = () => {
    if (!isStepComplete(step, form)) return;

    const answerLog: Record<number, string> = {
      1: `${form.industry}|${form.teamSize}|${form.revenueRange}`,
      2: `${form.cashPredictability}|${form.invoicingSpeed}`,
      3: `${form.arStatus}`,
      4: `${form.deliveryReliability}`,
      5: `${form.systemsCohesion}`,
      6: `${form.mainPain}|${form.urgency}`,
    };

    track('scan_step_complete', {
      step_index: String(step),
      key_answer: answerLog[step] || 'unknown',
    });

    if (step === totalSteps) {
      void onSubmit();
      return;
    }

    setStep((current) => Math.min(totalSteps, current + 1));
  };

  const onBack = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const computed = scoreScan(getScanAnswers(form));

    track('scan_submit', { source });

    try {
      const response = await fetch('/api/scan/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: getScanAnswers(form),
          score: computed.score,
          tier: computed.tier,
          primarySignal: computed.primarySignal,
          email: form.email,
          company: form.company,
          consent: form.consent,
          source,
          utm,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not submit scan right now.');
      }

      setDone(true);
      track('scan_result_view', {
        score: String(computed.score),
        tier: computed.tier,
        primary_signal: computed.primarySignal,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done && result) {
    const bookingHref = runtimeConfig.booking.calendlyUrl || '/contact';

    return (
      <div className="space-y-6">
        <ResultCard
          score={result.score}
          tier={result.tier}
          primarySignal={result.primarySignal}
          insights={result.insights}
        />
        <p className="text-sm text-muted">{tierCopy[result.tier]}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {result.tier === 'not_fit_yet' ? (
            <>
              <Link
                href="/resources/ar-recovery-checklist"
                className="inline-flex h-11 items-center justify-center rounded-button border border-accent bg-accent px-4 text-sm font-semibold text-black no-underline"
                onClick={() =>
                  track('scan_resources_click', { tier: result.tier })
                }
              >
                Get the AR Checklist
              </Link>
              <Link
                href="/insights"
                className="inline-flex h-11 items-center justify-center rounded-button border border-border bg-surface px-4 text-sm font-semibold text-text no-underline"
              >
                Read Insights
              </Link>
            </>
          ) : (
            <Link
              href={bookingHref}
              className="inline-flex h-11 items-center justify-center rounded-button border border-accent bg-accent px-4 text-sm font-semibold text-black no-underline"
              onClick={() => track('scan_book_click', { tier: result.tier })}
            >
              Book a 20-minute Clarity Call
            </Link>
          )}
          <Link
            href="/sample-report"
            className="inline-flex h-11 items-center justify-center rounded-button border border-border bg-surface px-4 text-sm font-semibold text-text no-underline"
          >
            View Sample Report
          </Link>
          <Link
            href="/start-here"
            className="inline-flex h-11 items-center justify-center rounded-button border border-border bg-surface px-4 text-sm font-semibold text-text no-underline"
          >
            Start Here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScanProgress currentStep={step} totalSteps={totalSteps} />
      <div className="rounded-card border border-border bg-surfaceRaised p-4 transition-all duration-300 motion-reduce:transition-none sm:p-5">
        {step === 1 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">
              Business snapshot
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label="Service"
                selected={form.industry === 'service'}
                onSelect={() => setAnswer('industry', 'service')}
              />
              <OptionCard
                label="Construction & Trades"
                selected={form.industry === 'construction_trades'}
                onSelect={() => setAnswer('industry', 'construction_trades')}
              />
              <OptionCard
                label="Professional services"
                selected={form.industry === 'professional_services'}
                onSelect={() => setAnswer('industry', 'professional_services')}
              />
              <OptionCard
                label="Retail"
                selected={form.industry === 'retail'}
                onSelect={() => setAnswer('industry', 'retail')}
              />
              <OptionCard
                label="Other"
                selected={form.industry === 'other'}
                onSelect={() => setAnswer('industry', 'other')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label="Team: 1–5"
                selected={form.teamSize === '1_5'}
                onSelect={() => setAnswer('teamSize', '1_5')}
              />
              <OptionCard
                label="Team: 6–15"
                selected={form.teamSize === '6_15'}
                onSelect={() => setAnswer('teamSize', '6_15')}
              />
              <OptionCard
                label="Team: 16–40"
                selected={form.teamSize === '16_40'}
                onSelect={() => setAnswer('teamSize', '16_40')}
              />
              <OptionCard
                label="Team: 40+"
                selected={form.teamSize === '40_plus'}
                onSelect={() => setAnswer('teamSize', '40_plus')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label="Revenue <1M"
                selected={form.revenueRange === 'under_1m'}
                onSelect={() => setAnswer('revenueRange', 'under_1m')}
              />
              <OptionCard
                label="Revenue 1–3M"
                selected={form.revenueRange === '1_3m'}
                onSelect={() => setAnswer('revenueRange', '1_3m')}
              />
              <OptionCard
                label="Revenue 3–10M"
                selected={form.revenueRange === '3_10m'}
                onSelect={() => setAnswer('revenueRange', '3_10m')}
              />
              <OptionCard
                label="Revenue 10M+"
                selected={form.revenueRange === '10m_plus'}
                onSelect={() => setAnswer('revenueRange', '10m_plus')}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">
              Cash flow visibility
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard
                label="Predictability: Strong"
                selected={form.cashPredictability === 'strong'}
                onSelect={() => setAnswer('cashPredictability', 'strong')}
              />
              <OptionCard
                label="Predictability: Mixed"
                selected={form.cashPredictability === 'mixed'}
                onSelect={() => setAnswer('cashPredictability', 'mixed')}
              />
              <OptionCard
                label="Predictability: Weak"
                selected={form.cashPredictability === 'weak'}
                onSelect={() => setAnswer('cashPredictability', 'weak')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard
                label="Invoicing: Same day"
                selected={form.invoicingSpeed === 'same_day'}
                onSelect={() => setAnswer('invoicingSpeed', 'same_day')}
              />
              <OptionCard
                label="Invoicing: Weekly"
                selected={form.invoicingSpeed === 'weekly'}
                onSelect={() => setAnswer('invoicingSpeed', 'weekly')}
              />
              <OptionCard
                label="Invoicing: Delayed"
                selected={form.invoicingSpeed === 'delayed'}
                onSelect={() => setAnswer('invoicingSpeed', 'delayed')}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">
              Receivables & timing
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label="Mostly current"
                selected={form.arStatus === 'mostly_current'}
                onSelect={() => setAnswer('arStatus', 'mostly_current')}
              />
              <OptionCard
                label="Some overdue"
                selected={form.arStatus === 'some_overdue'}
                onSelect={() => setAnswer('arStatus', 'some_overdue')}
              />
              <OptionCard
                label="Backlog significant"
                selected={form.arStatus === 'backlog_significant'}
                onSelect={() => setAnswer('arStatus', 'backlog_significant')}
              />
              <OptionCard
                label="Not sure"
                selected={form.arStatus === 'not_sure'}
                onSelect={() => setAnswer('arStatus', 'not_sure')}
              />
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">
              Operations & delivery
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard
                label="On time"
                selected={form.deliveryReliability === 'on_time'}
                onSelect={() => setAnswer('deliveryReliability', 'on_time')}
              />
              <OptionCard
                label="Occasional delays"
                selected={form.deliveryReliability === 'occasional_delays'}
                onSelect={() =>
                  setAnswer('deliveryReliability', 'occasional_delays')
                }
              />
              <OptionCard
                label="Constant fire drills"
                selected={form.deliveryReliability === 'constant_fire_drills'}
                onSelect={() =>
                  setAnswer('deliveryReliability', 'constant_fire_drills')
                }
              />
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">Systems</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label="Integrated"
                selected={form.systemsCohesion === 'integrated'}
                onSelect={() => setAnswer('systemsCohesion', 'integrated')}
              />
              <OptionCard
                label="Fragmented"
                selected={form.systemsCohesion === 'fragmented'}
                onSelect={() => setAnswer('systemsCohesion', 'fragmented')}
              />
              <OptionCard
                label="Mostly manual"
                selected={form.systemsCohesion === 'mostly_manual'}
                onSelect={() => setAnswer('systemsCohesion', 'mostly_manual')}
              />
              <OptionCard
                label="Not sure"
                selected={form.systemsCohesion === 'not_sure'}
                onSelect={() => setAnswer('systemsCohesion', 'not_sure')}
              />
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-text">
              Primary pain + intent
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard
                label="Cash flow"
                selected={form.mainPain === 'cash_flow'}
                onSelect={() => setAnswer('mainPain', 'cash_flow')}
              />
              <OptionCard
                label="Workflow"
                selected={form.mainPain === 'workflow'}
                onSelect={() => setAnswer('mainPain', 'workflow')}
              />
              <OptionCard
                label="Capacity"
                selected={form.mainPain === 'capacity'}
                onSelect={() => setAnswer('mainPain', 'capacity')}
              />
              <OptionCard
                label="Systems"
                selected={form.mainPain === 'systems'}
                onSelect={() => setAnswer('mainPain', 'systems')}
              />
              <OptionCard
                label="Growth plateau"
                selected={form.mainPain === 'growth_plateau'}
                onSelect={() => setAnswer('mainPain', 'growth_plateau')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <OptionCard
                label="30 days"
                selected={form.urgency === '30_days'}
                onSelect={() => setAnswer('urgency', '30_days')}
              />
              <OptionCard
                label="90 days"
                selected={form.urgency === '90_days'}
                onSelect={() => setAnswer('urgency', '90_days')}
              />
              <OptionCard
                label="6 months"
                selected={form.urgency === '6_months'}
                onSelect={() => setAnswer('urgency', '6_months')}
              />
              <OptionCard
                label="Exploring"
                selected={form.urgency === 'exploring'}
                onSelect={() => setAnswer('urgency', 'exploring')}
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted">
                We’ll send you a copy of the results and recommended next step.
              </p>
              <label className="block text-sm text-muted" htmlFor="scan-email">
                Email (required)
              </label>
              <input
                id="scan-email"
                type="email"
                required
                value={form.email || ''}
                onChange={(event) => setAnswer('email', event.target.value)}
                className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text"
              />
              <label
                className="block text-sm text-muted"
                htmlFor="scan-company"
              >
                Company (optional)
              </label>
              <input
                id="scan-company"
                type="text"
                value={form.company || ''}
                onChange={(event) => setAnswer('company', event.target.value)}
                className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text"
              />
              <label
                className="flex items-start gap-2 text-sm text-muted"
                htmlFor="scan-consent"
              >
                <input
                  id="scan-consent"
                  type="checkbox"
                  checked={Boolean(form.consent)}
                  onChange={(event) =>
                    setAnswer('consent', event.target.checked)
                  }
                  className="mt-1"
                />
                <span>
                  I consent to Clarity Labs emailing my diagnostic summary and
                  next-step recommendations.
                </span>
              </label>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 1 || submitting}
          className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepComplete(step, form) || submitting}
          className="rounded-button border border-accent bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {step === totalSteps
            ? submitting
              ? 'Submitting…'
              : 'Get results'
            : 'Next'}
        </button>
      </div>
      {submitError ? (
        <p className="text-sm text-rose-300">{submitError}</p>
      ) : null}
    </div>
  );
}
