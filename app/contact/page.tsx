import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FormEmbed } from '@/components/FormEmbed';
import { LeadForm } from '@/components/LeadForm';
import { Section } from '@/components/Section';
import { StartIntakeSection } from '@/components/StartIntakeSection';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a short clarity call, use the contact form, or send a direct note.',
};

export default function ContactPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text">
          Let’s talk through your next best move.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Keep it simple: book time, send a note, or text/email directly. No
          pitch • Just clarity.
        </p>
        <p className="mt-2 text-sm text-muted">
          I’m local to Fargo; if you book a call you’ll get the fastest
          response.
        </p>

        {runtimeConfig.featureFlags.isChatEnabled ? (
          <p className="mt-3 text-sm text-accent">
            Chat is available if you prefer a quick message.
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="Book Audit">
            <p className="mb-4 text-sm text-muted">
              Pick a time directly if booking is enabled.
            </p>
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <iframe
                src={runtimeConfig.booking.calendlyUrl}
                title="Calendly booking"
                className="h-[620px] w-full rounded-lg border border-border"
                loading="lazy"
              />
            ) : (
              <p className="text-sm text-muted">
                Set NEXT_PUBLIC_CALENDLY_URL to enable the embedded calendar.
              </p>
            )}
          </Card>
          <Card title="Direct contact">
            <p>
              Email:{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            {runtimeConfig.site.hasPhone ? (
              <p className="mt-2">
                Phone/Text:{' '}
                <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </p>
            ) : null}
            <p className="mt-4 text-xs text-muted">{siteConfig.trustLine}</p>
            {!runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={`mailto:${siteConfig.email}?subject=Clarity%20Call%20Request`}
                className="mt-4"
              >
                Request by email
              </Button>
            ) : null}
          </Card>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <LeadForm
            source="contact_form"
            title="Send a message"
            helperText="Not a fit for tax/legal advice or software shopping. Best fit: owners in trades/service businesses who want practical operational guidance."
            successMessage="Thanks — I’ll reply within 1 business day. If you want faster, book the call."
          />
          <Card title="Contact form embed (optional)">
            {runtimeConfig.featureFlags.isContactFormEnabled ? (
              <FormEmbed
                src={runtimeConfig.forms.contactFormUrl}
                title="Contact form"
              />
            ) : (
              <p className="text-sm text-muted">
                Set <code>NEXT_PUBLIC_CONTACT_FORM_URL</code> to enable the
                embedded form. Fallback: email{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            )}
          </Card>
        </div>

        <StartIntakeSection where="contact" />

        <Card
          className="mt-8 border-accent/35 bg-gradient-subtle"
          title="Next step"
        >
          <p className="text-sm text-muted">
            Prefer to move now? Book your audit, review the sample deliverable,
            or read practical insights before we talk.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              href={siteConfig.calendlyUrl || '/contact'}
              trackingEvent="booking_click"
              trackingProps={{ page: 'contact_next_step' }}
            >
              Book Audit
            </Button>
            <Button href="/sample-report" variant="ghost">
              View Sample Report
            </Button>
            <Button href="/insights" variant="secondary">
              Read Insights
            </Button>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
