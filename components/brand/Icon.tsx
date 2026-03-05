import { ReactNode } from 'react';

type IconVariant = 'muted' | 'accent' | 'magenta' | 'yellow';

type IconProps = {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: IconVariant;
  title?: string;
};

const variantClassMap: Record<IconVariant, string> = {
  muted: 'text-muted',
  accent: 'text-accent2',
  magenta: 'text-accent2',
  yellow: 'text-accent',
};

export function Icon({
  children,
  size = 20,
  strokeWidth = 1.75,
  className = '',
  variant = 'muted',
  title,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={`${variantClassMap[variant]} ${className}`}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
