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
    'border border-accent bg-accent text-black shadow-soft hover:-translate-y-px hover:border-accent2/70 hover:shadow-raised active:translate-y-px active:shadow-pressed',
  secondary:
    'border border-accent2/45 bg-accent2/15 text-white shadow-soft hover:-translate-y-px hover:bg-accent2/25 hover:shadow-raised active:translate-y-px active:shadow-pressed',
  ghost:
    'border border-border bg-surface text-white shadow-soft hover:-translate-y-px hover:border-accent2/60 hover:bg-surfaceRaised hover:text-accent2 hover:shadow-raised active:translate-y-px active:shadow-pressed',
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
      className={`hover-lift button-glow inline-flex h-11 items-center justify-center rounded-button px-4 text-sm font-semibold no-underline transition duration-200 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
