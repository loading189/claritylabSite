'use client';

import { useCallback, useEffect, useState } from 'react';

type FileRow = {
  id?: string;
  filename: string;
  created_at: string;
  size_bytes: number;
  storage_key: string;
  category: string;
};

export function FileList({ category, clientId }: { category: 'upload' | 'report' | 'all'; clientId?: string }) {
  const [rows, setRows] = useState<FileRow[]>([]);

  const load = useCallback(async () => {
    const query = new URLSearchParams({ category, ...(clientId ? { clientId } : {}) });
    const res = await fetch(`/api/client/files/list?${query.toString()}`).then((r) => r.json());
    setRows(res.files || []);
  }, [category, clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">{category === 'report' ? 'Report files' : 'Uploaded files'}</h2>
        <button className="rounded-input border border-border px-3 py-1.5 text-xs text-muted" onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id || row.storage_key} className="flex items-center justify-between gap-4 rounded-input border border-border/70 bg-surfaceRaised px-3 py-3 text-sm">
            <div>
              <p className="font-medium text-text">{row.filename}</p>
              <p className="text-xs text-muted">{new Date(row.created_at).toLocaleString()} · {(row.size_bytes / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={async () => {
                const data = await fetch('/api/client/files/presign-download', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ storageKey: row.storage_key }),
                }).then((r) => r.json());
                if (data.downloadUrl) window.open(data.downloadUrl, '_blank');
              }}
              className="rounded-input border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-text"
            >
              Download
            </button>
          </div>
        ))}
        {!rows.length ? <p className="rounded-input border border-dashed border-border px-3 py-6 text-center text-sm text-muted">No files available yet.</p> : null}
      </div>
    </section>
  );
}
