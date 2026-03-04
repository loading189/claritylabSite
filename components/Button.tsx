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
  primary: 'bg-accent text-white shadow-subtle hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0',
  secondary: 'bg-text text-white shadow-subtle hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0',
  ghost: 'border border-border bg-surface text-muted hover:bg-slate-100 hover:text-text',
};

export function Button({ href, children, variant = 'primary', className = '', trackingEvent, trackingProps }: ButtonProps) {
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
