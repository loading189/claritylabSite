'use client';

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track(eventName: string, props?: Record<string, string>) {
  if (typeof window === 'undefined') return;

  if (window.plausible) {
    window.plausible(eventName, props ? { props } : undefined);
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[track]', eventName, props || {});
  }
}
