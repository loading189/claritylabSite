import { ReactNode } from 'react';

export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`prose-shell ${className}`}>{children}</div>;
}
