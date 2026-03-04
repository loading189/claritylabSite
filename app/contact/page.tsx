import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a short chat with Clarity Labs or send a direct note.',
};

export default function ContactPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Let’s talk through your next best move.</h1>
        <p className="mt-4 max-w-2xl text-slate-700">
          Keep it simple: book time, send an email, or text me directly. If there is a fit, we map the next step. If
          there is not, you still leave with clarity.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="Book a coffee chat">
            <p className="mb-4">Primary CTA: 15 minutes, zero pitch pressure.</p>
            <Button href={siteConfig.calendlyUrl}>Open Calendly</Button>
          </Card>
          <Card title="Direct contact">
            <p>
              Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            <p className="mt-2">
              Phone/Text: <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
            </p>
            <p className="mt-4 text-xs text-slate-500">{siteConfig.trustLine}</p>
          </Card>
        </div>

        <Card title="Send a quick note" className="mt-4">
          <form action={`mailto:${siteConfig.email}`} method="post" encType="text/plain" className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="business" className="mb-1 block text-sm font-medium text-slate-700">
                Business
              </label>
              <input
                id="business"
                name="business"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Company name"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
                What would you like to improve?
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Brief context"
              />
            </div>
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Send via email app
            </button>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
