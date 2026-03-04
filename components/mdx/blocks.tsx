import Link from 'next/link';
import { siteConfig } from '@/content/site';
import { InsightCTA } from '@/lib/content/insights';
import { TrackEventLink } from '@/components/mdx/track-event-link';

export function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-card border border-border bg-surfaceRaised p-4 shadow-soft">
      <p className="text-sm font-semibold text-text">{title}</p>
      <div className="mt-2 text-sm text-muted">{children}</div>
    </div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="my-5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-text">
          <span className="mt-1 text-success">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="my-6 rounded-card border border-border bg-surfaceRaised p-5 shadow-soft">
      <p className="text-3xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export function SimpleTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;

  return (
    <div className="my-6 overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gradient-subtle">
          <tr>
            {header.map((cell) => (
              <th
                key={cell}
                className="border-b border-border p-2.5 font-semibold text-text"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, index) => (
            <tr
              key={`${row[0]}-${index}`}
              className="odd:bg-surface even:bg-surfaceRaised"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className="border-b border-border/60 p-2.5 text-muted"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CTA_COPY: Record<InsightCTA, { label: string; href: string }> = {
  book: {
    label: 'Book a 15-minute clarity call',
    href: siteConfig.calendlyUrl,
  },
  download_ar: {
    label: 'Download the AR Recovery Checklist',
    href: '/resources/ar-recovery-checklist',
  },
  download_cashflow: {
    label: 'Download the Cash Flow Snapshot',
    href: '/resources/cash-flow-snapshot',
  },
  contact: { label: 'Talk through your current bottleneck', href: '/contact' },
};

export function MiniCTA({ cta, slug }: { cta: InsightCTA; slug: string }) {
  const target = CTA_COPY[cta];

  return (
    <div className="my-8 rounded-card border border-accent/30 bg-gradient-subtle p-6 shadow-raised">
      <p className="text-lg font-semibold text-text">
        Want help applying this in your shop?
      </p>
      <p className="mt-1 text-sm text-muted">
        No hype, no dashboard theater—just practical next steps.
      </p>
      <TrackEventLink
        eventName="insight_cta_click"
        props={{ slug, cta_type: cta }}
        href={target.href}
        className="mt-4 inline-block rounded-button border border-accent/30 bg-accent px-4 py-2 text-sm font-semibold text-white no-underline shadow-soft"
      >
        {target.label}
      </TrackEventLink>
    </div>
  );
}

export function AuthorBlock() {
  return (
    <div className="mt-10 rounded-card border border-border bg-surface p-4 shadow-soft">
      <p className="text-sm font-semibold text-text">Christopher Taylor</p>
      <p className="text-sm text-muted">Founder, Clarity Labs</p>
      <p className="mt-2 text-sm text-muted">
        I help trade service operators find where time and cash leak, then turn
        that into a practical action plan.
      </p>
      <Link
        href="/about"
        className="mt-2 inline-block text-sm font-semibold no-underline"
      >
        Learn more about the approach →
      </Link>
    </div>
  );
}
