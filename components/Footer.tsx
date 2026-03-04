import Link from 'next/link';
import { navItems, siteConfig } from '@/content/site';
import { runtimeConfig } from '@/content/runtime';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t bg-surface py-12">
      <Container className="grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-sm font-semibold text-text">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm text-muted">{siteConfig.description}</p>
          <p className="mt-4 text-xs text-muted/80">{siteConfig.trustLine}</p>
        </div>
        <div className="md:text-right">
          <div className="flex flex-wrap gap-3 md:justify-end">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted no-underline hover:text-text">
                {item.label}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-text">
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
