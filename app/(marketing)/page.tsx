import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { FeaturedInsights } from '@/components/marketing/FeaturedInsights';
import { FindingsStrip } from '@/components/marketing/FindingsStrip';
import { InsightHighlight } from '@/components/marketing/InsightHighlight';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { ProblemGrid } from '@/components/marketing/ProblemGrid';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { StatCard } from '@/components/marketing/StatCard';
import { caseStudies } from '@/content/caseStudies';
import { exampleInsights, howItWorks, problems } from '@/content/site';
import { getAllInsights } from '@/lib/content/insights';
import styles from './page.module.css';

const findings = [
  'Revenue concentration: top 3 customers account for 48% of monthly cash inflow.',
  'Invoice lag: average 5.8 days between job completion and invoice send.',
  'Dispatch drag: 11% of technician hours lost to avoidable routing and handoff delays.',
];

const proofPatterns = [
  {
    metric: '$350k AR outstanding',
    note: 'When AR ownership is unclear, old balances linger and payroll weeks get tighter.',
    href: '/case-studies/ar-stalled-350k',
    label: 'Read AR pattern',
  },
  {
    metric: '47% technician utilization',
    note: 'Busy schedules can still hide dead time, overtime drift, and dispatch misses.',
    href: '/case-studies/technician-utilization-47',
    label: 'Read utilization pattern',
  },
  {
    metric: '54-day DSO pattern',
    note: 'Invoice lag plus weak follow-up usually shows up before owners feel it in cash.',
    href: '/sample-report',
    label: 'View sample report',
  },
];

export default function HomePage() {
  const allPosts = getAllInsights();
  const latestPosts = allPosts.slice(0, 3);
  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 3);

  return (
    <>
      <Section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <MarketingHero
            badge="Clarity Labs Audit"
            title="We diagnose exactly where cash, capacity, and execution break down in your service business."
            description="Conversion-focused operational audits for teams that want concrete fixes, stronger margin control, and cleaner execution."
            withBackdrop
            trackingPage="home_hero"
          />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="problem">
        <Container>
          <SectionHeader
            title="Operational problems we find first"
            subtitle="Three common patterns that silently reduce profitability and growth capacity."
          />
          <ProblemGrid items={problems.slice(0, 3)} />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="method">
        <Container>
          <SectionHeader
            title="The Clarity Labs Process"
            subtitle="A four-step method designed for owners who need signal, action, and sustained control."
          />
          <ProcessSteps steps={howItWorks} />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="findings">
        <Container>
          <SectionHeader
            title="Proof patterns we see every week"
            subtitle="Short signals that show where cash, capacity, and execution are breaking down."
          />
          <div className={styles.proofGrid}>
            {proofPatterns.map((item, index) => (
              <Reveal key={item.metric} delay={index * 70}>
                <StatCard
                  label={item.label}
                  value={item.metric}
                  note={item.note}
                />
              </Reveal>
            ))}
          </div>

          <SectionHeader
            title="Example findings from audits"
            subtitle="Real insights that create decisions in days, not months."
          />
          <FindingsStrip findings={findings} />
          <div className={styles.exampleGrid}>
            {exampleInsights.map((insight, index) => (
              <Reveal key={insight.title} delay={index * 70}>
                <Card title={insight.title} neumorphic>
                  <FeatureList items={insight.bullets} />
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="sample-report">
        <Container>
          <Reveal>
            <Card className={styles.sampleCard} neumorphic>
              <h2 className="heading-lg text-text">Sample Report Preview</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Download the sample report to see the structure, scorecards, and
                recommendation format we deliver.
              </p>
              <NextStepCTA
                title="Get the sample report format"
                subtitle="Review the exact structure, scorecards, and recommendation style before you book."
                className={styles.inlineCta}
                trackingPage="home_sample"
              />
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section className={styles.dividerSection}>
        <Container>
          <SectionHeader
            title="Case studies"
            subtitle="Pattern-based examples of what changes after a focused audit."
          />
          <div className={styles.caseStudyGrid}>
            {caseStudies.slice(0, 2).map((study, index) => (
              <Reveal key={study.slug} delay={index * 80}>
                <InsightHighlight
                  title={study.title}
                  detail={study.summary}
                  href={`/case-studies/${study.slug}`}
                />
              </Reveal>
            ))}
          </div>

          <SectionHeader
            title="Start with these operator notes"
            subtitle="Featured operator notes we recommend reading first."
          />
          <FeaturedInsights
            posts={featuredPosts.length ? featuredPosts : latestPosts}
          />
        </Container>
      </Section>

      <Section className={styles.dividerSection}>
        <Container>
          <SectionHeader
            title="Latest insights"
            subtitle="Practical notes from the field on cash, team throughput, and execution systems."
          />
          <FeaturedInsights posts={latestPosts} />
          <Card className="mt-6" neumorphic>
            <h3 className="heading-md text-text">Get the AR checklist</h3>
            <p className="mt-2 text-sm text-muted">
              Use the one-page cadence to tighten collections without creating
              friction.
            </p>
            <Link
              href="/resources/ar-recovery-checklist"
              className="mt-4 inline-block text-sm font-semibold no-underline"
            >
              Get the AR Recovery Checklist →
            </Link>
          </Card>
        </Container>
      </Section>

      <CalloutCTA trackingPage="home_callout" />
    </>
  );
}
