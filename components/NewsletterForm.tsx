'use client';

import { FormEvent, useState } from 'react';

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    setLoading(false);
    setMessage(response.ok ? 'You are on the updates list.' : 'Could not subscribe right now.');
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden defaultValue="" />
      <input name="name" placeholder="Name (optional)" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <button disabled={loading} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
        {loading ? 'Submitting…' : 'Subscribe to updates'}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
