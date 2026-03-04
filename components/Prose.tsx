import { ReactNode } from 'react';

export function Prose({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`prose-shell rounded-card border border-border/70 bg-surface px-5 py-7 shadow-soft sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
