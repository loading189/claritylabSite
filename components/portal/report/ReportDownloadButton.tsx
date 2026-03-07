'use client';

export function ReportDownloadButton({ storageKey }: { storageKey: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const response = await fetch('/api/client/files/presign-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storageKey }),
        }).then((r) => r.json());

        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank');
        }
      }}
      className="inline-flex rounded-input border border-border px-4 py-2 text-sm font-semibold text-text"
    >
      Download full report (PDF)
    </button>
  );
}
