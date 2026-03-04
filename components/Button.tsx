'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { track } from '@/lib/track';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  trackingEvent?: string;
  trackingProps?: Record<string, string>;
};

const variants = {
  primary:
    'border border-accent/30 bg-accent text-white shadow-soft hover:-translate-y-0.5 hover:shadow-raised active:translate-y-px active:shadow-pressed',
  secondary:
    'border border-border bg-text text-bg shadow-soft hover:-translate-y-0.5 hover:shadow-raised active:translate-y-px active:shadow-pressed',
  ghost:
    'border border-border bg-surface text-muted shadow-soft hover:-translate-y-0.5 hover:bg-surfaceRaised hover:text-text hover:shadow-raised active:translate-y-px active:shadow-pressed',
};

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  trackingEvent,
  trackingProps,
}: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        if (trackingEvent) track(trackingEvent, trackingProps);
      }}
      className={`inline-flex h-11 items-center justify-center rounded-button px-4 text-sm font-semibold no-underline transition duration-200 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
