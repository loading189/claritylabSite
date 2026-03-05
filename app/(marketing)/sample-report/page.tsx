import { Metadata } from 'next';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { CountUp } from '@/components/CountUp';
import { DataTable } from '@/components/DataTable';
import { MiniMeter } from '@/components/MiniMeter';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import styles from './page.module.css';

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
            title="Sample Report Preview"
            subtitle="Mock data example showing the scorecards and recommendations included in a Clarity Labs audit deliverable."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className={styles.kpiGrid}>
            <Card title="Total AR">
              <CountUp
                value={198700}
                currency
                className="text-2xl font-semibold text-text"
              />
            </Card>
            <Card title="0–30 bucket">
              <CountUp
                value={112000}
                currency
                className="text-2xl font-semibold text-text"
              />
            </Card>
            <Card title="DSO">
              <CountUp
                value={54}
                suffix=" days"
                className="text-2xl font-semibold text-text"
              />
            </Card>
          </div>
        </Reveal>

        <div className={styles.contentLayout}>
          <aside className={styles.sectionsNavWrap}>
            <div className={styles.sectionsNav}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Sections
              </p>
              <div className="mt-3 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={styles.sectionLink}
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.reportStack}>
            <Reveal variant="fadeIn">
              <Card className={styles.ctaBanner}>
                <NextStepCTA
                  title="Want this for your business?"
                  subtitle="We can build this with your numbers in a focused audit."
                  trackingEvent="sample_report_cta_click"
                  trackingPage="sample_report"
                />
              </Card>
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
                <p className={styles.warnNote}>
                  DSO: 54 days. Recommendation: launch a 90-day collections
                  sprint and tighten payment terms.
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
                  <MiniMeter
                    label="First-time-fix trend"
                    value={76}
                    tone="accent2"
                  />
                </div>
                <p className={styles.accentNote}>
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
                <p className={styles.dangerNote}>
                  Recommendation: standardize closeout checklist and automate
                  post-job follow-up triggers.
                </p>
              </Card>
            </Reveal>

            <Reveal variant="scaleIn">
              <Card className={styles.footerCard}>
                <NextStepCTA
                  trackingEvent="sample_report_cta_click"
                  trackingPage="sample_report_footer"
                />
              </Card>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
