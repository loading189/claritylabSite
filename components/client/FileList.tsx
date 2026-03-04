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
    <div className="rounded-card border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Files</h3>
        <button className="text-xs" onClick={() => void load()}>Refresh</button>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id || row.storage_key} className="flex items-center justify-between rounded-input border border-border px-3 py-2 text-sm">
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
              className="rounded-input border border-border px-3 py-1.5 text-xs"
            >
              Download
            </button>
          </div>
        ))}
        {!rows.length ? <p className="text-sm text-muted">No files yet.</p> : null}
      </div>
    </div>
  );
}
