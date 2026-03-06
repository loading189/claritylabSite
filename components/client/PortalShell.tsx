'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PortalShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-card border border-border/80 bg-surface p-4 shadow-soft">
        <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Workspace</p>
            <p className="text-sm font-semibold text-text">{title}</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <nav className="space-y-2" aria-label="Portal navigation">
          {nav.map((item) => {
            const active = item.href === '/client' || item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-input px-3 py-2 text-sm no-underline transition ${
                  active
                    ? 'bg-surfaceRaised font-semibold text-text'
                    : 'text-muted hover:bg-surfaceRaised hover:text-text'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
