import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FormEmbed } from '@/components/FormEmbed';
import { LeadForm } from '@/components/LeadForm';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Section } from '@/components/Section';
import { StartIntakeSection } from '@/components/StartIntakeSection';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start with Clarity Scan, then email us or send a direct note if needed.',
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
        <SectionHeader
          title="Let’s talk through your next best move."
          subtitle="Keep it simple: book time, send a note, or text/email directly. No pitch • Just clarity."
        />

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
          <p className="mt-3 text-sm text-accent2">
            Chat is available if you prefer a quick message.
          </p>
        ) : null}

        <div className={styles.gridTwo}>
          <Card title="Start Diagnostic" neumorphic>
            <p className="mb-4 text-sm text-muted">
              Run the Clarity Scan first so we can route you to the right next
              step.
            </p>
            <Button
              href="/scan"
              trackingEvent="scan_click"
              trackingProps={{ page: 'contact_primary' }}
            >
              Start Diagnostic
            </Button>
            <p className="mt-3 text-xs text-muted">
              Prefer context first?{' '}
              <Link href="/sample-report">View Sample Report</Link> or{' '}
              <Link href="/insights">Read Insights</Link>.
            </p>
            {runtimeConfig.featureFlags.isBookingEnabled ? (
              <Button
                href={runtimeConfig.booking.calendlyUrl}
                variant="ghost"
                className="mt-4"
                trackingEvent="booking_click"
                trackingProps={{ page: 'contact_secondary' }}
              >
                Book a 20-minute Clarity Call
              </Button>
            ) : null}
          </Card>
          <Card title="Email us" neumorphic>
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
            subtitle="Start your diagnostic or review the sample deliverable before we talk."
            trackingPage="contact_next_step"
          />
        </Card>
      </Container>
    </Section>
  );
}
