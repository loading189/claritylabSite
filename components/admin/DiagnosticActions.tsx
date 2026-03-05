'use client';

import { useState, useTransition } from 'react';

type DiagnosticActionsProps = {
  diagnosticId: string;
  email: string;
  airtableUrl?: string;
};

export function DiagnosticActions({
  diagnosticId,
  email,
  airtableUrl,
}: DiagnosticActionsProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );
  const [inviteMessage, setInviteMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const followUp = `Subject: Your Clarity Scan results\n\nHi,\n\nThanks again for completing your Clarity Scan. I'd like to invite you into your client portal so we can prep efficiently for your Clarity Call.\n\nReply here if anything changed since your submission, and we’ll align the agenda before the call.\n\n— Clarity Labs`;

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(followUp);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
    }
  }

  function inviteClient() {
    startTransition(async () => {
      const res = await fetch('/api/admin/clients/invite-from-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosticId }),
      });
      const data = (await res.json()) as {
        message?: string;
        instructions?: string;
        error?: string;
      };
      setInviteMessage(
        data.message || data.instructions || data.error || 'Invite processed.',
      );
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={inviteClient}
          disabled={isPending}
          className="rounded-button border border-accent bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-70"
        >
          {isPending ? 'Inviting...' : 'Invite to Portal'}
        </button>
        <button
          type="button"
          onClick={copyTemplate}
          className="rounded-button border border-border bg-surfaceRaised px-4 py-2 text-sm font-semibold text-text"
        >
          Copy follow-up email
        </button>
        {airtableUrl ? (
          <a
            href={airtableUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text no-underline"
          >
            Open in Airtable
          </a>
        ) : null}
      </div>
      {copyState === 'copied' ? (
        <p className="text-xs text-emerald-700">
          Follow-up email copied for {email}.
        </p>
      ) : null}
      {copyState === 'error' ? (
        <p className="text-xs text-rose-700">
          Could not copy to clipboard in this browser.
        </p>
      ) : null}
      {inviteMessage ? (
        <p className="text-xs text-muted">{inviteMessage}</p>
      ) : null}
    </div>
  );
}
