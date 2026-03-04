'use client';

import { FormEvent, useState } from 'react';
import { track } from '@/lib/track';

type Props = {
  resourceSlug: 'ar-recovery-checklist' | 'cash-flow-snapshot';
  fallbackDownloadUrl?: string;
  siteEmail: string;
};

export function ResourceRequestForm({ resourceSlug, fallbackDownloadUrl, siteEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/resources/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource_slug: resourceSlug,
        email: formData.get('email'),
        name: formData.get('name'),
        website: formData.get('website'),
      }),
    });

    const data = (await response.json()) as { ok: boolean; delivered?: boolean; error?: string };

    if (!response.ok || !data.ok) {
      setError(data.error || 'Could not process request right now.');
      setLoading(false);
      return;
    }

    setSuccess(
      data.delivered
        ? 'Check your email for the download.'
        : 'Downloads are currently delivered manually — email us and we’ll send it.',
    );
    setLoading(false);
    event.currentTarget.reset();
    track('resource_request_submit', { resource_slug: resourceSlug });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden defaultValue="" />
      <input name="name" placeholder="Name (optional)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <p className="text-xs text-slate-500">No pitch • Just clarity. We’ll send one resource and practical follow-up ideas for trades/service businesses.</p>
      <button disabled={loading} className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? 'Submitting…' : 'Email me the resource'}
      </button>
      {success ? <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p> : null}
      {error ? (
        <p className="rounded bg-rose-50 p-3 text-sm text-rose-800">
          {error} Fallback: <a href={`mailto:${siteEmail}`}>email me directly</a>.
        </p>
      ) : null}
      {fallbackDownloadUrl ? (
        <p className="text-sm text-slate-600">
          Prefer manual download? <a href={fallbackDownloadUrl}>Use this direct link</a>.
        </p>
      ) : null}
    </form>
  );
}
