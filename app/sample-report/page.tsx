import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { CountUp } from '@/components/CountUp';
import { DataTable } from '@/components/DataTable';
import { MiniMeter } from '@/components/MiniMeter';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Sample Report',
  description:
    'A lightweight preview of Clarity Labs audit outputs and what you can get for your business.',
};

const sections = [
  { id: 'ar-cashflow', label: 'AR & cash flow' },
  { id: 'tech-productivity', label: 'Tech productivity' },
  { id: 'workflow-gaps', label: 'Workflow gaps' },
];

export default function SampleReportPage() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Sample"
            title="Sample audit preview"
            subtitle="Mock data example showing the scorecards and recommendations included in a Clarity Labs audit deliverable."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card title="Total AR">
              <CountUp value={198700} currency className="text-2xl font-semibold text-text" />
            </Card>
            <Card title="0–30 bucket">
              <CountUp value={112000} currency className="text-2xl font-semibold text-text" />
            </Card>
            <Card title="DSO">
              <CountUp value={54} suffix=" days" className="text-2xl font-semibold text-text" />
            </Card>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-card border border-border bg-surface p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Sections
              </p>
              <div className="mt-3 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-button px-2 py-1.5 text-sm text-muted no-underline hover:bg-surfaceRaised hover:text-text"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <Reveal variant="fadeIn">
              <div className="rounded-card border border-accent/25 bg-gradient-subtle p-4 shadow-soft">
                <p className="text-sm text-text">
                  Want this for your business? We can build this with your numbers
                  in a focused audit.
                </p>
                <Button
                  href={siteConfig.calendlyUrl || '/contact'}
                  className="mt-3"
                  trackingEvent="booking_click"
                  trackingProps={{ page: 'sample_report' }}
                >
                  Book a 15-min Clarity Call
                </Button>
              </div>
            </Reveal>

            <Reveal>
              <Card
                title="AR & cash flow"
                className="scroll-mt-28"
                interactive
                id="ar-cashflow"
              >
                <DataTable
                  headers={['Bucket', 'Amount']}
                  animateRows
                  rows={[
                    ['0–30 days', '$112,000'],
                    ['31–60 days', '$48,000'],
                    ['61–90 days', '$21,500'],
                    ['90+ days', '$17,200'],
                  ]}
                />
                <div className="mt-4 space-y-2">
                  <MiniMeter label="0–30 days" value={56} />
                  <MiniMeter label="31–60 days" value={24} tone="accent2" />
                  <MiniMeter label="61–90 days" value={11} tone="warn" />
                </div>
                <p className="mt-4 rounded-input border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-text">
                  DSO: 54 days. Recommendation: launch a 90-day collections sprint
                  and tighten payment terms.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card
                title="Technician productivity"
                className="scroll-mt-28"
                interactive
                id="tech-productivity"
              >
                <DataTable
                  headers={['Metric', 'Current']}
                  animateRows
                  rows={[
                    ['Utilization', '68%'],
                    ['Revenue per tech/day', '$1,040'],
                    ['Rework rate', '8.4%'],
                  ]}
                />
                <div className="mt-4 space-y-2">
                  <MiniMeter label="Utilization" value={68} tone="success" />
                  <MiniMeter label="First-time-fix trend" value={76} tone="accent2" />
                </div>
                <p className="mt-4 rounded-input border border-accent2/40 bg-accent2/10 px-3 py-2 text-sm text-text">
                  Recommendation: close dispatch gaps and track first-time-fix
                  consistency weekly.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={120}>
              <Card
                title="Workflow gaps"
                className="scroll-mt-28"
                interactive
                id="workflow-gaps"
              >
                <DataTable
                  headers={['Checkpoint', 'Status']}
                  animateRows
                  rows={[
                    ['Card on file at booking', 'Partial'],
                    ['Invoice sent within 24h', '63%'],
                    ['Follow-up cadence', 'Inconsistent'],
                  ]}
                />
                <p className="mt-4 rounded-input border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-text">
                  Recommendation: standardize closeout checklist and automate
                  post-job follow-up triggers.
                </p>
              </Card>
            </Reveal>

            <Reveal variant="scaleIn">
              <div className="rounded-card border border-border bg-surface p-8 shadow-soft">
                <SectionHeader
                  title="Get this for your business"
                  subtitle="Bring your data, and you’ll get a deliverable-driven audit with clear next actions and optional implementation support."
                />
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={siteConfig.calendlyUrl || '/contact'}
                    trackingEvent="booking_click"
                    trackingProps={{ page: 'sample_report_footer' }}
                  >
                    Book a 15-min Clarity Call
                  </Button>
                  <Button href="/audit" variant="ghost">
                    Request an audit
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
