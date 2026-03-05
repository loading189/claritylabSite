import { Metadata } from 'next';
import { BrandedBackdrop } from '@/components/brand/BrandedBackdrop';
import { BrandIcon } from '@/components/brand/iconMap';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { InsightsList } from '@/components/insights-list';
import { FeaturedInsights } from '@/components/marketing/FeaturedInsights';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { getAllInsights, getInsightTags } from '@/lib/content/insights';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Short practical notes on cash flow and operations for service businesses.',
};

export default function InsightsPage() {
  const posts = getAllInsights();
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const fallbackFeatured = featured.length ? featured : posts.slice(0, 3);
  const tags = getInsightTags();

  return (
    <>
      <Section>
        <Container className={styles.container}>
          <Reveal>
            <div
              className={`${styles.heroCard} neu-card relative isolate overflow-hidden`}
            >
              <BrandedBackdrop withScan />
              <h1 className="heading-lg relative z-10 text-text">
                Clarity Labs Insights
              </h1>
              <p className="relative z-10 mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
                <BrandIcon concept="signal" size={14} />
                Lab notes
              </p>
              <p className="relative z-10 mt-4 max-w-2xl text-muted">
                Operator-level notes on cash flow, team utilization, and process
                design for service businesses.
              </p>
            </div>
          </Reveal>

          <Card className={styles.inlineCta} neumorphic>
            <NextStepCTA
              title="Need direct guidance?"
              subtitle="Book your audit, review the sample report, or start with the AR checklist."
              trackingPage="insights_inline"
            />
          </Card>

          <div className={styles.featuredSection}>
            <h2 className="heading-md text-text">Start here</h2>
            <FeaturedInsights posts={fallbackFeatured} />
          </div>

          <InsightsList posts={posts} tags={tags} />
        </Container>
      </Section>
      <CalloutCTA trackingPage="insights_callout" />
    </>
  );
}
