import Link from 'next/link';
import { Card } from '@/components/Card';
import { listDiagnostics } from '@/lib/diagnosticsData';

type PageProps = {
  searchParams: {
    tier?: string;
    primarySignal?: string;
    source?: string;
  };
};

const filterValues = {
  tiers: ['monitor', 'priority', 'critical'],
  primarySignals: ['cashflow', 'capacity', 'pricing', 'visibility', 'founder'],
  sources: ['direct', 'business_card_qr', 'linkedin', 'google', 'local'],
};

function FilterSelect({ name, value, options }: { name: string; value?: string; options: string[] }) {
  return (
    <label className="text-sm text-muted">
      <span className="mb-1 block font-medium text-text">{name}</span>
      <select name={name} defaultValue={value || ''} className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text">
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function AdminDiagnosticsPage({ searchParams }: PageProps) {
  const diagnostics = await listDiagnostics({
    tier: searchParams.tier,
    primarySignal: searchParams.primarySignal,
    source: searchParams.source,
    limit: 50,
  });

  return (
    <div className="space-y-4">
      <Card title="Diagnostics">
        <form className="grid gap-3 md:grid-cols-4" action="/admin/diagnostics">
          <FilterSelect name="tier" value={searchParams.tier} options={filterValues.tiers} />
          <FilterSelect name="primarySignal" value={searchParams.primarySignal} options={filterValues.primarySignals} />
          <FilterSelect name="source" value={searchParams.source} options={filterValues.sources} />
          <button type="submit" className="self-end rounded-button border border-border bg-surfaceRaised px-4 py-2 text-sm font-semibold text-text">
            Apply filters
          </button>
        </form>
      </Card>

      <Card>
        {diagnostics.records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted">
                  <th className="px-2 py-2">Created</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Company</th>
                  <th className="px-2 py-2">Score</th>
                  <th className="px-2 py-2">Tier</th>
                  <th className="px-2 py-2">Primary signal</th>
                  <th className="px-2 py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.records.map((record) => (
                  <tr key={record.id} className="border-t border-border/70">
                    <td className="px-2 py-2">{new Date(record.created_at).toLocaleString()}</td>
                    <td className="px-2 py-2">
                      <Link href={`/admin/diagnostics/${record.id}`} className="font-semibold text-accent2">
                        {record.email}
                      </Link>
                    </td>
                    <td className="px-2 py-2">{record.company || '—'}</td>
                    <td className="px-2 py-2">{record.score}</td>
                    <td className="px-2 py-2 capitalize">{record.tier}</td>
                    <td className="px-2 py-2 capitalize">{record.primarySignal}</td>
                    <td className="px-2 py-2">{record.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No diagnostics found for current filters.</p>
        )}
      </Card>
    </div>
  );
}
