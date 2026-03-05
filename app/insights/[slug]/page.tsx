import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandIcon } from '@/components/brand/iconMap';
import { Badge } from '@/components/Badge';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { TrackOnMount } from '@/components/TrackOnMount';
import { AuthorBlock, MiniCTA } from '@/components/mdx/blocks';
import { MdxContent } from '@/components/mdx/mdx-content';
import { TrackEventLink } from '@/components/mdx/track-event-link';
import { siteConfig } from '@/content/site';
import {
  getAllInsights,
  getInsightBySlug,
  getRelatedInsights,
} from '@/lib/content/insights';

export async function generateStaticParams() {
  return getAllInsights().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getInsightBySlug(params.slug);
  if (!post) return {};

  const canonical =
    post.canonicalUrl || `${siteConfig.url}/insights/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
      images: [`/insights/${post.slug}/opengraph-image`],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`/insights/${post.slug}/opengraph-image`],
    },
  };
}

export default function InsightDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getInsightBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedInsights(post, 3);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.founder,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage:
      post.canonicalUrl || `${siteConfig.url}/insights/${post.slug}`,
  };

  return (
    <Section>
      <TrackOnMount eventName="insight_view" props={{ slug: post.slug }} />
      <Container className="max-w-3xl">
        <div className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <BrandIcon concept="report" size={14} />
            Lab note
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text">
            {post.title}
          </h1>
          <p className="mt-4 text-muted">{post.description}</p>
          <p className="mt-4 text-sm text-muted/85">
            Published {post.date} · {post.readingTime} min read
          </p>
        </div>

        <div className="mt-6">
          <DataMotif variant="signal" />
        </div>
        <article className="mt-4">
          <MdxContent content={post.content} slug={post.slug} />
        </article>

        <div className="mt-8 border-t border-border/70 pt-6">
          <DataMotif variant="ticks" />
        </div>
        <AuthorBlock />
        <MiniCTA cta={post.cta} slug={post.slug} />

        {related.length > 0 && (
          <div className="mt-12 rounded-card border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-text">
              Related insights
            </h2>
            <div className="mt-3 space-y-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  className="block rounded-button px-2 py-1.5 text-sm font-semibold text-accent no-underline hover:bg-surfaceRaised"
                >
                  {item.title} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface p-3 md:hidden">
        <TrackEventLink
          href={siteConfig.calendlyUrl}
          eventName="insight_cta_click"
          props={{ slug: post.slug, cta_type: 'book' }}
          className="block rounded-button border border-accent/30 bg-accent px-4 py-3 text-center text-sm font-semibold text-white no-underline shadow-soft"
        >
          Book Audit
        </TrackEventLink>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </Section>
  );
}
