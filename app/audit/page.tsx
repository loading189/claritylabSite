import { Metadata } from 'next';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { FormEmbed } from '@/components/FormEmbed';
import { LeadForm } from '@/components/LeadForm';
import { Section } from '@/components/Section';
import { runtimeConfig } from '@/content/runtime';
import { notAFit, siteConfig, whoItsFor } from '@/content/site';

export const metadata: Metadata = {
  title: 'Quick Audit',
  description: 'A practical financial + operations audit for established service trade businesses.',
};

export default function AuditPage() {
  return (
    <>
      <Section>
        <Container className="max-w-4xl">
          <Badge>Quick Audit Offer</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Know exactly where your cash and capacity are leaking.</h1>
          <p className="mt-4 text-lg text-slate-700">
            The Clarity Labs Quick Audit is a focused review of your key operating and financial signals, designed for
            service trade owners who need better decisions now.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.calendlyUrl || '/contact'} trackingEvent="booking_click" trackingProps={{ page: 'audit' }}>
              Book a 15-min Clarity Call
            </Button>
            <Button href="/sample-report" variant="ghost">
              Preview sample report
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-4 md:grid-cols-2">
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
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl space-y-4">
          <LeadForm
            source="audit_request"
            title="Request an Audit"
            helperText="No pitch • Just clarity. Best fit for established trades/service teams. Not a fit for accounting/legal advice."
            successMessage="Thanks — your audit request is in. I’ll follow up with the best next step."
          />
          <Card title="Audit form embed (optional)">
            {runtimeConfig.forms.hasAuditForm ? (
              <FormEmbed src={runtimeConfig.forms.auditUrl} title="Request an audit form" />
            ) : (
              <p className="text-sm text-slate-600">
                Add <code>NEXT_PUBLIC_AUDIT_FORM_URL</code> to enable the embedded form. For now, contact us directly at{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            )}
          </Card>
        </Container>
      </Section>

      <CalloutCTA />
    </>
  );
}
