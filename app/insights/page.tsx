import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { insightPosts } from '@/content/site';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Short practical notes on cash flow and operations for service businesses.',
};

export default function InsightsPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Insights for owner-operators</h1>
        <p className="mt-4 max-w-2xl text-slate-700">
          Short practical reads about cash flow, technician productivity, and workflow execution.
        </p>

        <div className="mt-8 grid gap-4">
          {insightPosts.map((post) => (
            <Card key={post.slug}>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{post.category}</Badge>
                <p className="text-xs text-slate-500">{post.date}</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{post.excerpt}</p>
              <Link href="/contact" className="mt-4 inline-block text-sm font-semibold no-underline">
                Talk this through →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
