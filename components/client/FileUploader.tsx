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
    <div className="rounded-card border border-border bg-surface p-4 shadow-soft">
      <label className="mb-2 block text-sm font-semibold text-text">Upload {category === 'report' ? 'report file' : 'document'}</label>
      <input type="file" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      <p className="mt-2 text-xs text-muted">{status}</p>
    </div>
  );
}
