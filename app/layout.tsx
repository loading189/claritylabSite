import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { ChatCrisp } from '@/components/ChatCrisp';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { StickyCTA } from '@/components/StickyCTA';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    description: siteConfig.description,
    areaServed: ['Fargo area', 'Surrounding regional service trade markets'],
    serviceType: ['Operational audits for HVAC, plumbing, electrical, and mechanical businesses'],
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.url,
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
    },
  };

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
        <Analytics />
        <ChatCrisp websiteId={runtimeConfig.chat.crispWebsiteId} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </body>
    </html>
  );
}
