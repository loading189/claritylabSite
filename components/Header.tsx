'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems, siteConfig } from '@/content/site';
import { runtimeConfig } from '@/content/runtime';
import { Button } from './Button';
import { Container } from './Container';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-xl">
      <Container className="flex min-h-[4.5rem] items-center justify-between py-3">
        <Link href="/" className="no-underline">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent">
            {siteConfig.name}
          </p>
          <p className="text-xs text-muted">{siteConfig.subTagline}</p>
        </Link>

        <button
          type="button"
          className="rounded-button border border-border bg-surface px-3 py-2 text-sm text-text shadow-soft md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link rounded-button px-3 py-2 text-sm no-underline transition ${
                  active
                    ? 'bg-accent text-black shadow-soft'
                    : 'text-muted hover:bg-surfaceRaised hover:text-text'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          {runtimeConfig.featureFlags.isBookingEnabled ? (
            <Button
              href={siteConfig.calendlyUrl}
              trackingEvent="booking_click"
              trackingProps={{ page: 'header' }}
              className="ml-2"
            >
              Book Audit
            </Button>
          ) : null}
        </nav>
      </Container>

      <div
        id="mobile-nav"
        className={`grid transition-all duration-200 md:hidden ${open ? 'grid-rows-[1fr] border-t border-border bg-surface/95' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-button px-3 py-2 text-sm text-muted no-underline hover:bg-surfaceRaised hover:text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={siteConfig.calendlyUrl}
                trackingEvent="booking_click"
                trackingProps={{ page: 'header_mobile' }}
              >
                Book Audit
              </Button>
            ) : null}
          </Container>
        </div>
      </div>
    </header>
  );
}
