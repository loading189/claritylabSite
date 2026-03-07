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
import { homePageContent } from '@/content/marketing';
import { exampleInsights, howItWorks, problems } from '@/content/site';
import { getAllInsights } from '@/lib/content/insights';
import styles from './page.module.css';

export default function HomePage() {
  const allPosts = getAllInsights();
  const latestPosts = allPosts.slice(0, 3);
  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 3);

  return (
    <>
      <Section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <MarketingHero
            badge={homePageContent.hero.badge}
            title={homePageContent.hero.title}
            description={homePageContent.hero.description}
            withBackdrop
            trackingPage="home_hero"
          />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="problem">
        <Container>
          <SectionHeader
            title={homePageContent.problemSection.title}
            subtitle={homePageContent.problemSection.subtitle}
          />
          <ProblemGrid items={problems.slice(0, 3)} />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="method">
        <Container>
          <SectionHeader
            title={homePageContent.methodSection.title}
            subtitle={homePageContent.methodSection.subtitle}
          />
          <ProcessSteps steps={howItWorks} />
        </Container>
      </Section>

      <Section className={styles.dividerSection} id="findings">
        <Container>
          <SectionHeader
            title={homePageContent.findingsSection.title}
            subtitle={homePageContent.findingsSection.subtitle}
          />
          <div className={styles.proofGrid}>
            {homePageContent.proofPatterns.map((item, index) => (
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
            title={homePageContent.findingsAuditSection.title}
            subtitle={homePageContent.findingsAuditSection.subtitle}
          />
          <FindingsStrip findings={homePageContent.findings} />
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
              <h2 className="heading-lg text-text">
                {homePageContent.sampleReportSection.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                {homePageContent.sampleReportSection.description}
              </p>
              <NextStepCTA
                title={homePageContent.sampleReportSection.ctaTitle}
                subtitle={homePageContent.sampleReportSection.ctaSubtitle}
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
            title={homePageContent.caseStudiesSection.title}
            subtitle={homePageContent.caseStudiesSection.subtitle}
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
            title={homePageContent.operatorNotesSection.title}
            subtitle={homePageContent.operatorNotesSection.subtitle}
          />
          <FeaturedInsights
            posts={featuredPosts.length ? featuredPosts : latestPosts}
          />
        </Container>
      </Section>

      <Section className={styles.dividerSection}>
        <Container>
          <SectionHeader
            title={homePageContent.latestInsightsSection.title}
            subtitle={homePageContent.latestInsightsSection.subtitle}
          />
          <FeaturedInsights posts={latestPosts} />
          <Card className="mt-6" neumorphic>
            <h3 className="heading-md text-text">{homePageContent.checklistCard.title}</h3>
            <p className="mt-2 text-sm text-muted">
              {homePageContent.checklistCard.description}
            </p>
            <Link
              href={homePageContent.checklistCard.href}
              className="mt-4 inline-block text-sm font-semibold no-underline"
            >
              {homePageContent.checklistCard.linkLabel}
            </Link>
          </Card>
        </Container>
      </Section>

      <CalloutCTA trackingPage="home_callout" />
    </>
  );
}
