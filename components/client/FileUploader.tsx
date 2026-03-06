'use client';

import { useState } from 'react';

type Props = { category: 'upload' | 'report'; clientId?: string; clientEmail?: string; onDone?: () => void };

export function FileUploader({ category, clientId, clientEmail, onDone }: Props) {
  const [status, setStatus] = useState('');

  async function onPick(file: File) {
    setStatus('Preparing upload...');
    const presign = await fetch('/api/client/files/presign-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, clientId, filename: file.name, mimeType: file.type, sizeBytes: file.size }),
    }).then((r) => r.json());

    if (!presign.uploadUrl) {
      setStatus(presign.error || 'Upload blocked');
      return;
    }

    setStatus('Uploading...');
    await fetch(presign.uploadUrl, { method: 'PUT', body: file });

    await fetch('/api/client/files/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storageKey: presign.storageKey,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        category,
        clientId,
        clientEmail,
      }),
    });
    setStatus('Uploaded successfully.');
    onDone?.();
  }

  return (
    <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
      <label className="mb-2 block text-sm font-semibold text-text">Upload {category === 'report' ? 'report file' : 'document'}</label>
      <p className="mb-3 text-xs text-muted">Files are stored in your secure vault and available to your delivery team.</p>
      <input type="file" className="text-sm" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      <p className="mt-3 text-xs text-muted">{status}</p>
    </section>
  );
}
