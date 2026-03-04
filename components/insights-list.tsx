'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { track } from '@/lib/track';
import { InsightPost } from '@/lib/content/insights';

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
      <div className="mt-8 space-y-4 rounded-xl border border-slate-200 p-4">
        <input
          aria-label="Search insights"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeTag === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setActiveTag('all')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                activeTag === tag
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
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
        {filteredPosts.map((post) => (
          <Card key={post.slug}>
            <div className="flex flex-wrap items-center gap-3">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              <p className="text-xs text-slate-500">
                {post.date} · {post.readingTime} min read
              </p>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-slate-700">{post.description}</p>
            <Link
              href={`/insights/${post.slug}`}
              className="mt-4 inline-block text-sm font-semibold no-underline"
            >
              Read insight →
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
