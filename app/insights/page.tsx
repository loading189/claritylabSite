import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { InsightsList } from '@/components/insights-list';
import { Section } from '@/components/Section';
import { getAllInsights, getInsightTags } from '@/lib/content/insights';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Short practical notes on cash flow and operations for service businesses.',
};

export default function InsightsPage() {
  const posts = getAllInsights();
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const fallbackFeatured = featured.length ? featured : posts.slice(0, 3);

  return (
    <Section>
      <Container className="max-w-5xl">
        <div className="rounded-card border border-border bg-surface p-8 shadow-soft">
          <h1 className="text-4xl font-semibold tracking-tight text-text">
            Insights for owner-operators
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Practical notes for teams that want tighter cash flow, better
            utilization, and less workflow chaos.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-text">Featured</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {fallbackFeatured.map((post) => (
              <Card key={post.slug} interactive>
                <Badge>{post.tags[0]}</Badge>
                <h3 className="mt-3 text-lg font-semibold text-text">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
                <Link
                  href={`/insights/${post.slug}`}
                  className="mt-3 inline-block text-sm font-semibold no-underline"
                >
                  Read →
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <InsightsList posts={posts} tags={getInsightTags()} />
      </Container>
    </Section>
  );
}
