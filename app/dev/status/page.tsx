import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { getIntegrationStatus } from '@/content/runtime';

export const dynamic = 'force-dynamic';

export default function DevStatusPage({ searchParams }: { searchParams: { token?: string } }) {
  const adminToken = process.env.ADMIN_DIAGNOSTIC_TOKEN;
  const allowedInProd = Boolean(adminToken && searchParams.token === adminToken);

  if (process.env.NODE_ENV !== 'development' && !allowedInProd) {
    notFound();
  }

  const status = getIntegrationStatus();

  return (
    <Section>
      <Container className="max-w-5xl space-y-6">
        <SectionHeader eyebrow="Developer" title="Integration Status" subtitle="Shows set/not-set diagnostics only. No secrets are displayed." />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Client feature flags">
            <ul className="space-y-2">
              {Object.entries(status.clientFeatures).map(([key, enabled]) => (
                <li key={key} className="flex justify-between text-sm">
                  <span>{key}</span>
                  <strong className={enabled ? 'text-emerald-700' : 'text-amber-700'}>{enabled ? 'enabled' : 'disabled'}</strong>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Server integrations">
            <ul className="space-y-3 text-sm">
              {Object.entries(status.server).map(([name, value]) => (
                <li key={name}>
                  <p className="font-semibold text-text">{name}</p>
                  <p className={value.enabled ? 'text-emerald-700' : 'text-amber-700'}>{value.enabled ? 'enabled' : 'disabled'}</p>
                  <p className="text-xs text-muted">required: {value.required.join(', ')}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <Card title="Public env var presence">
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            {Object.entries(status.envPresence).map(([key, isSet]) => (
              <li key={key} className="flex items-center justify-between rounded-input border bg-slate-50 px-3 py-2">
                <code>{key}</code>
                <span className={isSet ? 'text-emerald-700' : 'text-rose-700'}>{isSet ? 'set' : 'missing'}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}
