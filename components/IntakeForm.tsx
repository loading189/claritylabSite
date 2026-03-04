'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@/lib/track';

type IntakeFormProps = {
  type: 'call' | 'audit';
};

const tools = ['QuickBooks', 'Xero', 'ServiceTitan', 'Housecall Pro', 'Jobber', 'Excel', 'Other'];

export function IntakeForm({ type }: IntakeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('t') || '';
  const uploadLink = process.env.NEXT_PUBLIC_INTAKE_UPLOAD_URL || '';

  useEffect(() => {
    track('intake_view', { type });
  }, [type]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      token,
      consent: formData.get('consent') === 'on',
      current_tools: formData.getAll('current_tools').map(String),
      uploaded_files: (formData.get('uploaded_files')?.toString() || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      uploaded_file_names: (formData.get('uploaded_file_names')?.toString() || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const response = await fetch(`/api/intake/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { ok?: boolean; error?: string; tier?: string };

    if (!response.ok || !data.ok) {
      setError(data.error || 'Could not submit intake right now.');
      setLoading(false);
      return;
    }

    track('intake_submit', { type, tier: data.tier || 'unknown' });
    router.push(`/intake/success?intake_type=${type}&tier=${data.tier || 'Warm'}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden defaultValue="" />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Name" className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="email" required type="email" placeholder="Email" className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="phone" placeholder="Phone (optional)" className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="company" required placeholder="Company" className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="company_website" placeholder="Website (optional)" className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="location" placeholder="City / State" className="rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <select name="industry" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
        <option value="" disabled>
          Industry
        </option>
        <option>HVAC</option>
        <option>Plumbing</option>
        <option>Electrical</option>
        <option>Other service</option>
      </select>

      <div className="grid gap-3 md:grid-cols-2">
        <select name="team_size" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
          <option value="" disabled>
            Team size
          </option>
          <option value="1">1</option>
          <option value="2-5">2–5</option>
          <option value="6-15">6–15</option>
          <option value="16+">16+</option>
        </select>
        <select name="annual_revenue_range" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
          <option value="" disabled>
            Annual revenue range
          </option>
          <option value="under_250k">Under $250k</option>
          <option value="250k_750k">$250k–$750k</option>
          <option value="750k_2m">$750k–$2M</option>
          <option value="2m_5m">$2M–$5M</option>
          <option value="5m_plus">$5M+</option>
        </select>
      </div>

      <fieldset className="rounded border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium text-slate-700">Current tools</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {tools.map((tool) => (
            <label key={tool} className="flex items-center gap-2">
              <input type="checkbox" name="current_tools" value={tool} /> {tool}
            </label>
          ))}
        </div>
      </fieldset>

      <select name="biggest_pain" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
        <option value="" disabled>
          Biggest pain
        </option>
        <option value="ar_cashflow">AR / cash flow</option>
        <option value="scheduling">Scheduling</option>
        <option value="invoicing">Invoicing</option>
        <option value="tech_productivity">Tech productivity</option>
        <option value="workflow_gaps">Workflow gaps</option>
        <option value="other">Other</option>
      </select>

      <textarea name="problem_description" required rows={4} placeholder="Describe the problem in your words" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />

      <div className="grid gap-3 md:grid-cols-2">
        <select name="urgency" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
          <option value="" disabled>
            Urgency
          </option>
          <option value="this_week">This week</option>
          <option value="this_month">This month</option>
          <option value="this_quarter">This quarter</option>
          <option value="someday">Someday</option>
        </select>
        <select name="decision_maker" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
          <option value="" disabled>
            Are you the decision maker?
          </option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {type === 'audit' ? (
        <>
          <input name="audit_goal" placeholder="Audit goal" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          <select name="share_data" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
            <option value="" disabled>
              Will you share AR aging + P&L + last 3 months transactions?
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <select name="upload_preference" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="upload_link">
            <option value="upload_link">Upload here (via secure link)</option>
            <option value="email_later">Email later</option>
          </select>
          {uploadLink ? (
            <p className="rounded bg-slate-50 p-3 text-sm text-slate-700">
              Use secure upload link: <a href={uploadLink} target="_blank" rel="noreferrer" onClick={() => track('intake_upload', { type })}>{uploadLink}</a>
            </p>
          ) : null}
          <textarea name="uploaded_files" rows={3} placeholder="Paste uploaded file URLs (one per line)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          <input name="uploaded_file_names" placeholder="Uploaded file names (comma-separated)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          <textarea name="notes" rows={3} placeholder="Notes / constraints" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        </>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input name="consent" type="checkbox" required /> I consent to being contacted about this intake.
      </label>

      {error ? <p className="rounded bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

      <button disabled={loading} className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? 'Submitting…' : 'Submit intake'}
      </button>
      <p className="text-xs text-slate-500">No pitch • Just clarity. Not legal/tax advice.</p>
    </form>
  );
}
