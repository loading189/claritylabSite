import {
  Callout,
  Checklist,
  MiniCTA,
  SimpleTable,
  Stat,
} from '@/components/mdx/blocks';
import { Prose } from '@/components/Prose';
import { InsightCTA } from '@/lib/content/insights';

function parseProps(raw: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const match of raw.matchAll(/(\w+)="([^"]*)"/g)) {
    props[match[1]] = match[2];
  }
  return props;
}

export function MdxContent({
  content,
  slug,
}: {
  content: string;
  slug: string;
}) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      nodes.push(
        <h1
          key={`h1-${i}`}
          className="mt-8 text-3xl font-semibold tracking-tight text-slate-900"
        >
          {line.slice(2)}
        </h1>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      nodes.push(
        <h2
          key={`h2-${i}`}
          className="mt-8 text-2xl font-semibold tracking-tight text-slate-900"
        >
          {line.slice(3)}
        </h2>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      nodes.push(<Checklist key={`ul-${i}`} items={items} />);
      continue;
    }

    const calloutMatch = line.match(/^<Callout\s+([^>]*)\/>$/);
    if (calloutMatch) {
      const props = parseProps(calloutMatch[1]);
      nodes.push(
        <Callout key={`callout-${i}`} title={props.title || 'Note'}>
          {props.body || ''}
        </Callout>,
      );
      i += 1;
      continue;
    }

    const statMatch = line.match(/^<Stat\s+([^>]*)\/>$/);
    if (statMatch) {
      const props = parseProps(statMatch[1]);
      nodes.push(
        <Stat
          key={`stat-${i}`}
          label={props.label || ''}
          value={props.value || ''}
        />,
      );
      i += 1;
      continue;
    }

    const tableMatch = line.match(/^<Table\s+([^>]*)\/>$/);
    if (tableMatch) {
      const props = parseProps(tableMatch[1]);
      const rows = (props.rows || '')
        .split('|')
        .map((row) => row.split(';').map((cell) => cell.trim()))
        .filter((row) => row.some(Boolean));
      nodes.push(<SimpleTable key={`table-${i}`} rows={rows} />);
      i += 1;
      continue;
    }

    const ctaMatch = line.match(/^<MiniCTA\s+([^>]*)\/>$/);
    if (ctaMatch) {
      const props = parseProps(ctaMatch[1]);
      nodes.push(
        <MiniCTA
          key={`cta-${i}`}
          cta={(props.cta as InsightCTA) || 'book'}
          slug={slug}
        />,
      );
      i += 1;
      continue;
    }

    nodes.push(
      <p key={`p-${i}`} className="mt-4 leading-7 text-slate-700">
        {line}
      </p>,
    );
    i += 1;
  }

  return <Prose>{nodes}</Prose>;
}
