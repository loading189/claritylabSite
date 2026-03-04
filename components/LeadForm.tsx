'use client';

import { FormEvent, useState } from 'react';
import { track } from '@/lib/track';

type LeadFormProps = {
  source: 'contact_form' | 'audit_request';
  title: string;
  helperText?: string;
  successMessage: string;
};

export function LeadForm({ source, title, helperText, successMessage }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        source,
        interest: source === 'audit_request' ? 'audit' : 'implementation',
        pain_area: source === 'audit_request' ? 'workflow_gaps' : 'other',
        consent: true,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error || 'Could not submit right now. Please email directly.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    event.currentTarget.reset();
    track(source === 'audit_request' ? 'audit_request_submit' : 'contact_submit', { page: window.location.pathname });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {helperText ? <p className="mt-2 text-sm text-slate-600">{helperText}</p> : null}

      {success ? <p className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-800">{successMessage}</p> : null}
      {error ? (
        <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-800">
          {error} Fallback: <a href="mailto:hello@claritylabs.co">email me directly</a>.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden defaultValue="" />
        <input name="name" placeholder="Name" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="phone" placeholder="Phone (optional)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <input name="company" placeholder="Company (optional)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <textarea name="message" placeholder="Message" rows={4} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <p className="text-xs text-slate-500">Not a fit if you’re looking for accounting/legal advice or a DIY software install. This is operator support for service trades.</p>
        <button disabled={loading} className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
