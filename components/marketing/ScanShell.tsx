import { ReactNode } from 'react';

export function ScanShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-card border border-border bg-bg p-5 shadow-raised sm:p-8">
      {children}
    </div>
  );
}
