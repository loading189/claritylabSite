import fs from 'node:fs';
import path from 'node:path';

export type InsightCTA =
  | 'book'
  | 'download_ar'
  | 'download_cashflow'
  | 'contact';

type Frontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  type: 'insight';
  cta: InsightCTA;
  canonicalUrl?: string;
  hero?: string;
  featured?: boolean;
};

type ParsedFrontmatter = Partial<Frontmatter> & { published?: boolean };

export type InsightPost = Frontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

function warnInvalidInsight(filePath: string, reason: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[insights] Skipping ${filePath}: ${reason}`);
  }
}

function parseFrontmatter(raw: string): {
  data: ParsedFrontmatter;
  content: string;
} {
  const match = raw.match(/^\uFEFF?\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error('Missing frontmatter block');

  const [, yaml] = match;
  const content = raw.slice(match[0].length);
  const data: Record<string, unknown> = {};

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...valueParts] = trimmed.split(':');
    const value = valueParts.join(':').trim();

    if (!key) continue;

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      continue;
    }

    if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
      continue;
    }

    data[key] = value.replace(/^['"]|['"]$/g, '');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    throw new Error('Field "tags" must be an array');
  }

  if (data.published === undefined) {
    data.published = false;
  }

  return {
    data: data as ParsedFrontmatter,
    content,
  };
}

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

function toInsightPost(
  filePath: string,
  fileName: string,
  raw: string,
): InsightPost | null {
  const slug = fileName.replace(/\.mdx$/, '');

  let data: ParsedFrontmatter;
  let content: string;

  try {
    ({ data, content } = parseFrontmatter(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnInvalidInsight(filePath, message);
    return null;
  }

  const requiredPublishedFields: (keyof Frontmatter)[] = [
    'title',
    'description',
    'date',
    'tags',
    'type',
    'cta',
  ];

  if (data.published) {
    for (const field of requiredPublishedFields) {
      if (data[field] === undefined) {
        warnInvalidInsight(
          filePath,
          `Missing required field "${field}" for published post`,
        );
        return null;
      }
    }
  }

  if (data.type && data.type !== 'insight') {
    warnInvalidInsight(
      filePath,
      'Only type="insight" is supported for insights content',
    );
    return null;
  }

  const normalized: Frontmatter = {
    title: String(data.title || ''),
    description: String(data.description || ''),
    date: String(data.date || ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: Boolean(data.published),
    type: 'insight',
    cta: (data.cta as Frontmatter['cta']) || 'book',
    canonicalUrl: data.canonicalUrl,
    hero: data.hero,
    featured: Boolean(data.featured),
  };

  return {
    ...normalized,
    slug,
    content,
    readingTime: getReadingTime(content),
  };
}

function loadInsightFile(fileName: string): InsightPost | null {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');
  return toInsightPost(filePath, fileName, raw);
}

export function getAllInsights(includeDrafts = false): InsightPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(loadInsightFile)
    .filter((post): post is InsightPost => Boolean(post))
    .filter((post) => (includeDrafts ? true : post.published))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getInsightBySlug(slug: string): InsightPost | null {
  const post = getAllInsights(true).find((item) => item.slug === slug);
  if (!post || !post.published) return null;
  return post;
}

export function getInsightTags(): string[] {
  return Array.from(
    new Set(getAllInsights().flatMap((post) => post.tags || [])),
  ).sort((a, b) => a.localeCompare(b));
}

export function getRelatedInsights(
  post: InsightPost,
  limit = 3,
): InsightPost[] {
  const tagSet = new Set((post.tags || []).map((tag) => tag.toLowerCase()));

  return getAllInsights()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score: (candidate.tags || []).filter((tag) =>
        tagSet.has(tag.toLowerCase()),
      ).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
