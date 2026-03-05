'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Reveal } from '@/components/Reveal';
import { InsightPost } from '@/lib/content/insights';
import { track } from '@/lib/track';

type Props = {
  posts: InsightPost[];
  tags: string[];
};

export function InsightsList({ posts, tags }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = activeTag === 'all' || post.tags.includes(activeTag);
      const matchesQuery =
        !needle ||
        post.title.toLowerCase().includes(needle) ||
        post.description.toLowerCase().includes(needle) ||
        post.tags.some((tag) => tag.toLowerCase().includes(needle));

      return matchesTag && matchesQuery;
    });
  }, [activeTag, posts, query]);

  return (
    <>
      <div className="mt-8 space-y-4 rounded-card border border-border bg-surface p-4 shadow-soft">
        <input
          aria-label="Search insights"
          className="w-full"
          placeholder="Search by topic, title, or tag"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            track('insight_search', { query_length: String(nextQuery.length) });
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${activeTag === 'all' ? 'border-accent/30 bg-accent text-white' : 'border-border bg-surfaceRaised text-muted'}`}
            onClick={() => setActiveTag('all')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${activeTag === tag ? 'border-accent/30 bg-accent text-white' : 'border-border bg-surfaceRaised text-muted'}`}
              onClick={() => {
                setActiveTag(tag);
                track('tag_filter_click', { tag });
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">
              No insights match this filter yet. Try another tag or search term.
            </p>
          </Card>
        ) : (
          filteredPosts.map((post, index) => (
            <Reveal
              key={post.slug}
              variant="fadeIn"
              delay={Math.min(index, 8) * 45}
            >
              <Card interactive>
                <div className="flex flex-wrap items-center gap-3">
                  {(post.tags || []).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                  <p className="text-xs text-muted">
                    {post.date} · {post.readingTime} min read
                  </p>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-text">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
                <Link
                  href={`/insights/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold no-underline"
                >
                  Read insight →
                </Link>
              </Card>
            </Reveal>
          ))
        )}
      </div>
    </>
  );
}
