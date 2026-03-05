import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FormEmbed } from '@/components/FormEmbed';
import { LeadForm } from '@/components/LeadForm';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { Section } from '@/components/Section';
import { StartIntakeSection } from '@/components/StartIntakeSection';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a short clarity call, use the contact form, or send a direct note.',
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { portal?: string };
}) {
  const showPortalSetup = searchParams?.portal === 'setup';

  return (
    <Section>
      <Container className={styles.container}>
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

        {showPortalSetup ? (
          <div className="bg-card mt-4 rounded-lg border border-border p-4 text-sm text-muted">
            <p className="font-medium text-text">
              Portal setup is in progress.
            </p>
            <p className="mt-1">
              Client/admin access is not enabled in this environment yet. Reach
              out here and we’ll help you get the access you need.
            </p>
          </div>
        ) : null}

        {runtimeConfig.featureFlags.isChatEnabled ? (
          <p className="mt-3 text-sm text-accent">
            Chat is available if you prefer a quick message.
          </p>
        ) : null}

        <div className={styles.gridTwo}>
          <Card title="Start Diagnostic" neumorphic>
            <p className="mb-4 text-sm text-muted">
              Run the 2-minute Clarity Scan first. You can book directly
              afterward.
            </p>
            <Button
              href="/scan"
              trackingEvent="scan_cta_click"
              trackingProps={{ page: 'contact_primary' }}
            >
              Start Diagnostic
            </Button>
            <p className="mt-3 text-xs text-muted">
              Primary path: scan first, then receive next-step guidance.
            </p>
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={runtimeConfig.booking.calendlyUrl}
                variant="ghost"
                className="mt-3"
                trackingEvent="booking_click"
                trackingProps={{ page: 'contact_secondary' }}
              >
                Book Audit (secondary)
              </Button>
            ) : null}
          </Card>
          <Card title="Direct contact" neumorphic>
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

        <div className={styles.gridTwo}>
          <LeadForm
            source="contact_form"
            title="Send a message"
            helperText="Not a fit for tax/legal advice or software shopping. Best fit: owners in trades/service businesses who want practical operational guidance."
            successMessage="Thanks — I’ll reply within 1 business day. If you want faster, book the call."
          />
          <Card title="Contact form embed (optional)" neumorphic>
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

        <Card className={styles.nextCard} title="Next step" neumorphic>
          <NextStepCTA
            title="Prefer to move now?"
            subtitle="Book your audit or review the sample deliverable before we talk."
            trackingPage="contact_next_step"
          />
        </Card>
      </Container>
    </Section>
  );
}
