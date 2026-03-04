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

export type InsightPost = Frontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
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

  const required = [
    'title',
    'description',
    'date',
    'tags',
    'published',
    'type',
    'cta',
  ] as const;
  for (const field of required) {
    if (data[field] === undefined) {
      throw new Error(`Missing required field "${field}"`);
    }
  }

  if (data.type !== 'insight') {
    throw new Error('Only type="insight" is supported for insights content');
  }

  return {
    data: data as Frontmatter,
    content,
  };
}

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

function loadInsightFile(fileName: string): InsightPost {
  const slug = fileName.replace(/\.mdx$/, '');
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');
  let data: Frontmatter;
  let content: string;

  try {
    ({ data, content } = parseFrontmatter(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse frontmatter in ${filePath}: ${message}`);
  }

  return {
    ...data,
    slug,
    content,
    readingTime: getReadingTime(content),
  };
}

export function getAllInsights(includeDrafts = false): InsightPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(loadInsightFile)
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
    new Set(getAllInsights().flatMap((post) => post.tags)),
  ).sort((a, b) => a.localeCompare(b));
}

export function getRelatedInsights(
  post: InsightPost,
  limit = 3,
): InsightPost[] {
  const tagSet = new Set(post.tags.map((tag) => tag.toLowerCase()));

  return getAllInsights()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.tags.filter((tag) => tagSet.has(tag.toLowerCase()))
        .length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
