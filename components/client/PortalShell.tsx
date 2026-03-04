import Link from 'next/link';

export function PortalShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-[220px_1fr]">
      <aside className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <nav className="space-y-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-input px-3 py-2 text-sm no-underline hover:bg-surfaceRaised hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
