import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return <span className="inline-flex items-center rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{children}</span>;
}
