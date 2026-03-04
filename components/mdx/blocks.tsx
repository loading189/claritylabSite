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
    <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="my-5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-slate-800">
          <span className="mt-1 text-emerald-600">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="my-6 rounded-xl border border-slate-200 p-5">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export function SimpleTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {header.map((cell) => (
              <th
                key={cell}
                className="border-b border-slate-300 p-2 font-semibold text-slate-900"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className="border-b border-slate-100 p-2 text-slate-700"
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
    <div className="my-8 rounded-2xl bg-slate-900 p-6 text-white">
      <p className="text-lg font-semibold">
        Want help applying this in your shop?
      </p>
      <p className="mt-1 text-sm text-slate-200">
        No hype, no dashboard theater—just practical next steps.
      </p>
      <TrackEventLink
        eventName="insight_cta_click"
        props={{ slug, cta_type: cta }}
        href={target.href}
        className="mt-4 inline-block rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 no-underline"
      >
        {target.label}
      </TrackEventLink>
    </div>
  );
}

export function AuthorBlock() {
  return (
    <div className="mt-10 rounded-xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-900">Christopher Taylor</p>
      <p className="text-sm text-slate-600">Founder, Clarity Labs</p>
      <p className="mt-2 text-sm text-slate-700">
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
