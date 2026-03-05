import { ReactNode } from 'react';
import { Icon } from './Icon';

export const iconMap = {
  diagnose: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20L16.8 16.8" />
    </>
  ),
  analyze: (
    <>
      <path d="M4 19V11" />
      <path d="M10 19V6" />
      <path d="M16 19V9" />
      <path d="M22 19V4" />
    </>
  ),
  optimize: (
    <>
      <path d="M12 3v18" />
      <path d="M7 8l5-5 5 5" />
      <path d="M7 16l5 5 5-5" />
    </>
  ),
  stabilize: (
    <>
      <path d="M4 12h16" />
      <path d="M7 8l-3 4 3 4" />
      <path d="M17 8l3 4-3 4" />
    </>
  ),
  cashflow: (
    <>
      <path d="M3 12h18" />
      <path d="M15 6l6 6-6 6" />
      <circle cx="8" cy="8" r="2" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="4" width="7" height="6" rx="1" />
      <rect x="14" y="14" width="7" height="6" rx="1" />
      <path d="M10 7h4v10" />
    </>
  ),
  signal: (
    <>
      <path d="M3 12h2" />
      <path d="M7 12h2" />
      <path d="M11 12h2" />
      <path d="M15 12h6" />
    </>
  ),
  proof: (
    <>
      <path d="M5 13l4 4L19 7" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  report: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  lead: (
    <>
      <path d="M4 7h16v10H4z" />
      <path d="M4 8l8 6 8-6" />
    </>
  ),
} as const;

export type BrandConcept = keyof typeof iconMap;

export function BrandIcon({
  concept,
  className,
  variant,
  size,
  title,
}: {
  concept: BrandConcept;
  className?: string;
  variant?: 'muted' | 'accent' | 'magenta' | 'yellow';
  size?: number;
  title?: string;
}) {
  return (
    <Icon className={className} variant={variant} size={size} title={title}>
      {iconMap[concept] as ReactNode}
    </Icon>
  );
}
