import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { FeaturedInsights } from '@/components/marketing/FeaturedInsights';
import { FindingsStrip } from '@/components/marketing/FindingsStrip';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { ProblemGrid } from '@/components/marketing/ProblemGrid';
import { ProcessSteps } from '@/components/marketing/ProcessSteps';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { exampleInsights, howItWorks, problems } from '@/content/site';
import { getAllInsights } from '@/lib/content/insights';
import styles from './page.module.css';

const findings = [
  'Revenue concentration: top 3 customers account for 48% of monthly cash inflow.',
  'Invoice lag: average 5.8 days between job completion and invoice send.',
  'Dispatch drag: 11% of technician hours lost to avoidable routing and handoff delays.',
];

export default function HomePage() {
  const posts = getAllInsights().slice(0, 3);

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
            title="Example findings from audits"
            subtitle="Real insights that create decisions in days, not months."
          />
          <FindingsStrip findings={findings} />
          <div className={styles.exampleGrid}>
            {exampleInsights.map((insight, index) => (
              <Reveal key={insight.title} delay={index * 70}>
                <Card title={insight.title}>
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
            <Card className={styles.sampleCard}>
              <h2 className="text-3xl font-bold text-text">
                Sample Report Preview
              </h2>
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
            title="Latest insights"
            subtitle="Practical notes from the field on cash, team throughput, and execution systems."
          />
          <FeaturedInsights posts={posts} />
        </Container>
      </Section>

      <CalloutCTA trackingPage="home_callout" />
    </>
  );
}
