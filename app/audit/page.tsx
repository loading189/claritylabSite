import { Metadata } from 'next';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Section } from '@/components/Section';
import { notAFit, siteConfig, whoItsFor } from '@/content/site';

export const metadata: Metadata = {
  title: 'Quick Audit',
  description: 'A practical financial + operations audit for established service businesses.',
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
            small service businesses that need better decisions now.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.calendlyUrl}>Book a 15-minute coffee chat</Button>
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

      <CalloutCTA />
    </>
  );
}
