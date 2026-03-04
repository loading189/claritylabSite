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
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-700',
  ghost: 'border border-slate-300 text-slate-700 hover:bg-white',
};

export function Button({ href, children, variant = 'primary', className = '', trackingEvent, trackingProps }: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        if (trackingEvent) {
          track(trackingEvent, trackingProps);
        }
      }}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold no-underline transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
