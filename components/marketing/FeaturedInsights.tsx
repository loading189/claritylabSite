import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Reveal } from '@/components/Reveal';
type InsightSummary = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

type FeaturedInsightsProps = {
  posts: InsightSummary[];
};

export function FeaturedInsights({ posts }: FeaturedInsightsProps) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {posts.map((post, index) => (
        <Reveal key={post.slug} delay={index * 70}>
          <Card interactive neumorphic>
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
        </Reveal>
      ))}
    </div>
  );
}
