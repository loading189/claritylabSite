'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const current =
      saved === 'light' || saved === 'dark'
        ? (saved as Theme)
        : systemDark
          ? 'dark'
          : 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  function applyTheme(next: Theme) {
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  }

  if (!mounted) {
    return (
      <span
        className="inline-flex h-10 w-10 rounded-button border border-border bg-surface"
        aria-hidden
      />
    );
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => applyTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-muted shadow-soft hover:-translate-y-0.5 hover:bg-surfaceRaised hover:text-text hover:shadow-raised active:translate-y-px active:shadow-pressed"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden>{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
}
