import { Metadata } from 'next';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Container } from '@/components/Container';
import { InsightsList } from '@/components/insights-list';
import { FeaturedInsights } from '@/components/marketing/FeaturedInsights';
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
            <div className={styles.heroCard}>
              <h1 className="text-4xl font-semibold tracking-tight text-text">
                Clarity Labs Insights
              </h1>
              <p className="mt-4 max-w-2xl text-muted">
                Operator-level notes on cash flow, team utilization, and process
                design for service businesses.
              </p>
            </div>
          </Reveal>

          <div className={styles.featuredSection}>
            <h2 className="text-xl font-semibold text-text">Start here</h2>
            <FeaturedInsights posts={fallbackFeatured} />
          </div>

          <InsightsList posts={posts} tags={tags} />
        </Container>
      </Section>
      <CalloutCTA trackingPage="insights_callout" />
    </>
  );
}
