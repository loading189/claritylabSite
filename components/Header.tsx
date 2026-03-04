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
    <header className="sticky top-0 z-40 border-b bg-bg/95 backdrop-blur">
      <Container className="flex min-h-[4.5rem] items-center justify-between py-3">
        <Link href="/" className="no-underline">
          <p className="text-sm font-semibold text-text">{siteConfig.name}</p>
          <p className="text-xs text-muted">{siteConfig.subTagline}</p>
        </Link>

        <button
          type="button"
          className="rounded-button border px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`rounded-button px-3 py-2 text-sm no-underline transition ${active ? 'bg-accent/10 font-semibold text-accent' : 'text-muted hover:bg-slate-100 hover:text-text'}`}>
                {item.label}
              </Link>
            );
          })}
          {runtimeConfig.featureFlags.isBookingEnabled ? (
            <Button href={siteConfig.calendlyUrl} trackingEvent="booking_click" trackingProps={{ page: 'header' }} className="ml-2">
              Book a 15-min Clarity Call
            </Button>
          ) : null}
        </nav>
      </Container>

      <div id="mobile-nav" className={`grid transition-all duration-200 md:hidden ${open ? 'grid-rows-[1fr] border-t bg-surface' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-button px-2 py-1.5 text-sm text-muted no-underline" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button href={siteConfig.calendlyUrl} trackingEvent="booking_click" trackingProps={{ page: 'header_mobile' }}>
                Book a 15-min Clarity Call
              </Button>
            ) : null}
          </Container>
        </div>
      </div>
    </header>
  );
}
