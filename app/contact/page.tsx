import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FormEmbed } from '@/components/FormEmbed';
import { Section } from '@/components/Section';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a short clarity call, use the contact form, or send a direct note.',
};

export default function ContactPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Let’s talk through your next best move.</h1>
        <p className="mt-4 max-w-2xl text-slate-700">
          Keep it simple: book time, send a note, or text/email directly. No pitch • Just clarity.
        </p>

        {runtimeConfig.chat.enabled ? <p className="mt-3 text-sm text-emerald-700">Chat is available if you prefer a quick message.</p> : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="Book a 15-min Clarity Call">
            <p className="mb-4 text-sm text-slate-700">Pick a time directly if booking is enabled.</p>
            {runtimeConfig.booking.enabled ? (
              <iframe
                src={runtimeConfig.booking.calendlyUrl}
                title="Calendly booking"
                className="h-[620px] w-full rounded-lg border border-slate-200"
                loading="lazy"
              />
            ) : (
              <p className="text-sm text-slate-600">Set NEXT_PUBLIC_CALENDLY_URL to enable the embedded calendar.</p>
            )}
          </Card>
          <Card title="Direct contact">
            <p>
              Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            {runtimeConfig.site.hasPhone ? (
              <p className="mt-2">
                Phone/Text: <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </p>
            ) : null}
            <p className="mt-4 text-xs text-slate-500">{siteConfig.trustLine}</p>
            {!runtimeConfig.booking.enabled ? (
              <Button href={`mailto:${siteConfig.email}?subject=Clarity%20Call%20Request`} className="mt-4">
                Request by email
              </Button>
            ) : null}
          </Card>
        </div>

        <Card title="Contact form" className="mt-4">
          {runtimeConfig.forms.hasContactForm ? (
            <FormEmbed src={runtimeConfig.forms.contactUrl} title="Contact form" />
          ) : (
            <p className="text-sm text-slate-600">
              Set <code>NEXT_PUBLIC_CONTACT_FORM_URL</code> to enable the embedded form. Fallback: email{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          )}
        </Card>
      </Container>
    </Section>
  );
}
