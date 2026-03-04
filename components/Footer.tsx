import Link from 'next/link';
import { navItems, siteConfig } from '@/content/site';
import { runtimeConfig } from '@/content/runtime';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <Container className="grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-sm font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">{siteConfig.description}</p>
          <p className="mt-3 text-xs text-slate-500">{siteConfig.trustLine}</p>
        </div>
        <div className="md:text-right">
          <div className="flex flex-wrap gap-4 md:justify-end">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slate-600 no-underline hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-700">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            {runtimeConfig.site.hasPhone ? (
              <>
                {' '}
                • <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </>
            ) : null}
          </p>
        </div>
      </Container>
    </footer>
  );
}
