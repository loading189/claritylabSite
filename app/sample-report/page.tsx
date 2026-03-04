import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { DataTable } from '@/components/DataTable';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Sample Report',
  description: 'A lightweight preview of Clarity Labs audit outputs and what you can get for your business.',
};

export default function SampleReportPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Sample"
            title="Sample audit preview"
            subtitle="Mock data example showing the type of scorecards and recommendations included in a Clarity Labs audit."
          />

          <div className="mt-6 rounded-card border border-accent/20 bg-accent/5 p-4">
            <p className="text-sm text-text">Want this for your business? We can build this with your numbers in a focused audit.</p>
            <Button href={siteConfig.calendlyUrl || '/contact'} className="mt-3" trackingEvent="booking_click" trackingProps={{ page: 'sample_report' }}>
              Book a 15-min Clarity Call
            </Button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Card title="AR & cash flow">
              <DataTable headers={['Bucket', 'Amount']} rows={[['0–30 days', '$112,000'], ['31–60 days', '$48,000'], ['61–90 days', '$21,500'], ['90+ days', '$17,200']]} />
              <p className="mt-4">DSO: 54 days. Recommendation: launch a 90-day collections sprint and tighten payment terms.</p>
            </Card>

            <Card title="Technician productivity">
              <DataTable headers={['Metric', 'Current']} rows={[['Utilization', '68%'], ['Revenue per tech/day', '$1,040'], ['Rework rate', '8.4%']]} />
              <p className="mt-4">Recommendation: close dispatch gaps and track first-time-fix consistency weekly.</p>
            </Card>

            <Card title="Workflow gaps">
              <DataTable headers={['Checkpoint', 'Status']} rows={[['Card on file at booking', 'Partial'], ['Invoice sent within 24h', '63%'], ['Follow-up cadence', 'Inconsistent']]} />
              <p className="mt-4">Recommendation: standardize closeout checklist and automate post-job follow-up triggers.</p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="rounded-card border bg-bg p-8">
          <SectionHeader
            title="Get this for your business"
            subtitle="Bring your own data, and you’ll get a deliverable-driven audit with clear next actions and optional implementation support."
          />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.calendlyUrl || '/contact'} trackingEvent="booking_click" trackingProps={{ page: 'sample_report_footer' }}>Book a 15-min Clarity Call</Button>
            <Button href="/audit" variant="ghost">
              Request an audit
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
