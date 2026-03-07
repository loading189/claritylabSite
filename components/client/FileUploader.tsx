'use client';

import { useState } from 'react';

type RequestOption = { id: string; title: string };

type Props = {
  category: 'upload' | 'report';
  clientId?: string;
  clientEmail?: string;
  onDone?: () => void;
  enableDeliverableMetadata?: boolean;
  requestOptions?: RequestOption[];
};

export function FileUploader({
  category,
  clientId,
  clientEmail,
  onDone,
  enableDeliverableMetadata = false,
  requestOptions = [],
}: Props) {
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [deliverableType, setDeliverableType] = useState('report');
  const [summaryNote, setSummaryNote] = useState('');
  const [periodCovered, setPeriodCovered] = useState('');
  const [deliverableStatus, setDeliverableStatus] = useState('draft');
  const [visibility, setVisibility] = useState<'draft' | 'internal' | 'client_visible'>('draft');
  const [relatedRequestId, setRelatedRequestId] = useState('');
  const [markRelatedRequestSubmitted, setMarkRelatedRequestSubmitted] = useState(false);

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
        title,
        deliverableType,
        summaryNote,
        periodCovered,
        visibility,
        visibleToClient: visibility === 'client_visible',
        status: deliverableStatus,
        relatedRequestId: relatedRequestId || undefined,
        markRelatedRequestSubmitted,
      }),
    });
    setStatus('Uploaded successfully.');
    onDone?.();
  }

  return (
    <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
      <label className="mb-2 block text-sm font-semibold text-text">Upload {category === 'report' ? 'report' : 'document'}</label>
      <p className="mb-3 text-xs text-muted">Files are stored in your secure vault for your delivery work.</p>
      {enableDeliverableMetadata && category === 'report' ? (
        <div className="mb-4 grid gap-2 text-xs text-muted sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            Deliverable title
            <input className="rounded border border-border px-2 py-1 text-sm text-text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Deliverable type
            <input
              className="rounded border border-border px-2 py-1 text-sm text-text"
              value={deliverableType}
              onChange={(e) => setDeliverableType(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            Summary note
            <input
              className="rounded border border-border px-2 py-1 text-sm text-text"
              value={summaryNote}
              onChange={(e) => setSummaryNote(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Period covered
            <input
              className="rounded border border-border px-2 py-1 text-sm text-text"
              value={periodCovered}
              onChange={(e) => setPeriodCovered(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Deliverable status
            <select
              className="rounded border border-border px-2 py-1 text-sm text-text"
              value={deliverableStatus}
              onChange={(e) => setDeliverableStatus(e.target.value)}
            >
              <option value="draft">draft</option>
              <option value="submitted">submitted</option>
              <option value="reviewing">reviewing</option>
              <option value="delivered">delivered</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Visibility
            <select className="rounded border border-border px-2 py-1 text-sm text-text" value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)}>
              <option value="draft">draft</option>
              <option value="internal">internal</option>
              <option value="client_visible">client_visible</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Related request
            <select className="rounded border border-border px-2 py-1 text-sm text-text" value={relatedRequestId} onChange={(e) => setRelatedRequestId(e.target.value)}>
              <option value="">None</option>
              {requestOptions.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-2 flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={markRelatedRequestSubmitted}
              onChange={(e) => setMarkRelatedRequestSubmitted(e.target.checked)}
              disabled={!relatedRequestId}
            />
            Mark related request as submitted after upload
          </label>
        </div>
      ) : null}
      <input type="file" className="text-sm" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      <p className="mt-3 text-xs text-muted">{status}</p>
    </section>
  );
}
