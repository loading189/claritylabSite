'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { navItems, siteConfig } from '@/content/site';
import { Button } from './Button';
import { Container } from './Container';

type NavLink = { href: string; label: string };

const clientNav: NavLink[] = [
  { href: '/client', label: 'Dashboard' },
  { href: '/client/scan', label: 'Diagnostic' },
  { href: '/client/prep', label: 'Prep' },
  { href: '/client/files', label: 'Files' },
  { href: '/client/reports', label: 'Reports' },
];

const adminNav: NavLink[] = [
  { href: '/admin/diagnostics', label: 'Diagnostics' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin', label: 'Dashboard' },
  { href: '/', label: 'Public Site' },
];

function NavItems({
  items,
  onClick,
}: {
  items: NavLink[];
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return items.map((item) => {
    const active =
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`rounded-button px-3 py-2 text-sm no-underline transition ${
          active
            ? 'bg-surfaceRaised text-accent shadow-soft'
            : 'text-muted hover:bg-surfaceRaised hover:text-text'
        }`}
        onClick={onClick}
      >
        {item.label}
      </Link>
    );
  });
}

function SignedOutNav({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <NavItems items={navItems} />
      <Button
        href="/scan"
        trackingEvent="scan_cta_click"
        trackingProps={{ page: mobile ? 'header_mobile' : 'header' }}
        className={mobile ? '' : 'ml-2'}
      >
        Start Diagnostic
      </Button>
      <Button href="/sign-in" variant="ghost" className={mobile ? '' : 'ml-1'}>
        Sign In
      </Button>
    </>
  );
}

const isClerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routeContext = useMemo(() => {
    if (pathname.startsWith('/client')) return 'client';
    if (pathname.startsWith('/admin')) return 'admin';
    return 'marketing';
  }, [pathname]);

  const signedInMarketingLink = routeContext === 'admin' ? '/admin' : '/client';

  const signedInNav = (
    <>
      {routeContext === 'client' ? <NavItems items={clientNav} /> : null}
      {routeContext === 'admin' ? <NavItems items={adminNav} /> : null}
      {routeContext === 'marketing' ? (
        <>
          <NavItems items={navItems.slice(0, 4)} />
          <Button
            href={signedInMarketingLink}
            variant="secondary"
            className="ml-2"
          >
            Go to Dashboard
          </Button>
        </>
      ) : null}
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'h-9 w-9 border border-border shadow-soft',
            userButtonPopoverCard: 'bg-surface border border-border',
            userButtonPopoverActionButton: 'text-text',
          },
        }}
      />
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-xl">
      <Container className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
        <Link href="/" className="no-underline">
          <p className="text-sm font-bold uppercase leading-none tracking-[0.12em] text-accent">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-xs leading-tight text-muted">
            {siteConfig.subTagline}
          </p>
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
          {!isClerkEnabled ? (
            <SignedOutNav />
          ) : (
            <>
              <SignedOut>
                <SignedOutNav />
              </SignedOut>
              <SignedIn>{signedInNav}</SignedIn>
            </>
          )}
        </nav>
      </Container>

      <div
        id="mobile-nav"
        className={`grid transition-all duration-200 md:hidden ${open ? 'grid-rows-[1fr] border-t border-border bg-surface/95' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-2 py-4">
            {!isClerkEnabled ? (
              <SignedOutNav mobile />
            ) : (
              <>
                <SignedOut>
                  <SignedOutNav mobile />
                </SignedOut>
                <SignedIn>
                  {routeContext === 'client' ? (
                    <NavItems
                      items={clientNav}
                      onClick={() => setOpen(false)}
                    />
                  ) : null}
                  {routeContext === 'admin' ? (
                    <NavItems items={adminNav} onClick={() => setOpen(false)} />
                  ) : null}
                  {routeContext === 'marketing' ? (
                    <>
                      <NavItems
                        items={navItems.slice(0, 4)}
                        onClick={() => setOpen(false)}
                      />
                      <Button href={signedInMarketingLink} variant="secondary">
                        Go to Dashboard
                      </Button>
                    </>
                  ) : null}
                  <div className="pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </>
            )}
          </Container>
        </div>
      </div>
    </header>
  );
}
