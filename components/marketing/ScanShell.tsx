import { ReactNode } from 'react';
import { Container } from '@/components/Container';

type ScanShellProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export function ScanShell({ children, title, subtitle }: ScanShellProps) {
  return (
    <Container className="max-w-4xl py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/95 p-6 shadow-raised sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top_right,hsla(var(--accent),0.15),transparent_45%),radial-gradient(circle_at_bottom_left,hsla(var(--accent2),0.14),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(hsla(var(--text),0.14)_1px,transparent_1px),linear-gradient(90deg,hsla(var(--text),0.14)_1px,transparent_1px)] [background-size:36px_36px]"
        />
        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Clarity Scan
            </p>
            <h1 className="heading-lg text-balance text-text">{title}</h1>
            <p className="max-w-2xl text-sm text-muted sm:text-base">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </Container>
  );
}
