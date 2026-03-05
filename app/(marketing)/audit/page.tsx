import { Metadata } from 'next';
import Link from 'next/link';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { FormEmbed } from '@/components/FormEmbed';
import { LeadForm } from '@/components/LeadForm';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { Section } from '@/components/Section';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig, whoItsFor, notAFit } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Audit',
  description:
    'A practical financial + operations audit for established service trade businesses.',
};

const examples = [
  {
    title: 'AR stalled at $350k',
    href: '/case-studies/ar-stalled-350k',
    detail:
      'How cadence, ownership, and escalation patterns tightened collections.',
  },
  {
    title: 'Technician utilization at 47%',
    href: '/case-studies/technician-utilization-47',
    detail: 'How dispatch and closeout rhythms recovered billable capacity.',
  },
  {
    title: 'Sample report preview',
    href: '/sample-report',
    detail:
      'See the exact scorecard and recommendation structure before booking.',
  },
];

export default function AuditPage() {
  return (
    <>
      <Section>
        <Container className={styles.heroContainer}>
          <MarketingHero
            badge="Audit Offer"
            title="Know exactly where your cash and capacity are leaking."
            description="The Clarity Labs Audit is a focused review of your key operating and financial signals, designed for service trade owners who need better decisions now."
            trackingEvent="audit_cta_click"
            trackingPage="audit"
          />
        </Container>
      </Section>

      <Section>
        <Container className={styles.gridTwo}>
          <Card title="What you get">
            <FeatureList
              items={[
                'A short diagnostic summary in plain English',
                'Priority-ranked issues by impact on cash, time, and margin',
                'A 90-day action plan with clear ownership recommendations',
                'A review call to align on next steps',
              ]}
            />
          </Card>
          <Card title="Typical focus areas">
            <FeatureList
              items={[
                'AR aging and collection speed',
                'Technician utilization and rework drag',
                'Dispatch-to-invoice workflow delays',
                'Follow-up consistency and closeout quality',
              ]}
            />
          </Card>
          <Card title="Who it’s for">
            <FeatureList items={whoItsFor} />
          </Card>
          <Card title="Not a fit (yet)">
            <FeatureList items={notAFit} />
          </Card>

          <Card title="Get the AR checklist">
            <p className="text-sm text-muted">
              Want a practical AR cadence before the full audit? Start with the
              one-page checklist and run it with your office lead this week.
            </p>
            <Link
              href="/resources/ar-recovery-checklist"
              className="mt-3 inline-block text-sm font-semibold no-underline"
            >
              Get the AR Recovery Checklist →
            </Link>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container className={styles.examplesWrap}>
          <h2 className="text-2xl font-semibold text-text">Examples</h2>
          <p className="mt-2 text-sm text-muted">
            See patterns similar to what your audit could uncover.
          </p>
          <div className={styles.examplesGrid}>
            {examples.map((example) => (
              <Card key={example.href} interactive>
                <h3 className="text-lg font-semibold text-text">
                  {example.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{example.detail}</p>
                <Link
                  href={example.href}
                  className="mt-4 inline-block text-sm font-semibold no-underline"
                >
                  Open example →
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.formStack}>
          <LeadForm
            source="audit_request"
            title="Request an Audit"
            helperText="No pitch • Just clarity. Best fit for established trades/service teams. Not a fit for accounting/legal advice."
            successMessage="Thanks — your audit request is in. I’ll follow up with the best next step."
          />
          <Card title="Audit form embed (optional)">
            {runtimeConfig.featureFlags.isAuditFormEnabled ? (
              <FormEmbed
                src={runtimeConfig.forms.auditFormUrl}
                title="Request an audit form"
              />
            ) : (
              <p className="text-sm text-muted">
                Add <code>NEXT_PUBLIC_AUDIT_FORM_URL</code> to enable the
                embedded form. For now, contact us directly at{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            )}
          </Card>
        </Container>
      </Section>

      <CalloutCTA
        trackingEvent="audit_cta_click"
        trackingPage="audit_callout"
      />
    </>
  );
}
