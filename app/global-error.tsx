'use client';

import { useEffect } from 'react';
import { captureClientError } from '@/lib/sentry';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    captureClientError(error, { digest: error.digest || 'none' });
  }, [error]);

  return (
    <html>
      <body className="p-6">
        <h2 className="text-xl font-semibold">Something went wrong.</h2>
        <button className="mt-3 rounded bg-slate-900 px-3 py-2 text-white" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
