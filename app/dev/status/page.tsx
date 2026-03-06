import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { getIntegrationStatus } from '@/content/runtime';
import { getDevStatusSummary } from '@/lib/devStatus';

export const dynamic = 'force-dynamic';

export default async function DevStatusPage({ searchParams }: { searchParams: { token?: string } }) {
  const adminToken = process.env.ADMIN_DIAGNOSTIC_TOKEN;
  const allowedInProd = Boolean(adminToken && searchParams.token === adminToken);

  if (process.env.NODE_ENV !== 'development' && !allowedInProd) {
    notFound();
  }

  const status = getIntegrationStatus();
  const devStatus = await getDevStatusSummary();

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

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Airtable probe checks">
            <ul className="space-y-2 text-sm">
              {Object.entries(devStatus.airtableProbes).map(([key, value]) => (
                <li key={key} className="flex justify-between rounded-input border bg-slate-50 px-3 py-2">
                  <span>{key}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Clerk readiness">
            <ul className="space-y-2 text-sm">
              {Object.entries(devStatus.clerk).map(([key, value]) => (
                <li key={key} className="flex justify-between rounded-input border bg-slate-50 px-3 py-2">
                  <span>{key}</span>
                  <strong>{String(value)}</strong>
                </li>
              ))}
            </ul>
          </Card>
        </div>


        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Calendly readiness">
            <ul className="space-y-2 text-sm">
              {Object.entries(devStatus.calendly).map(([key, value]) => (
                <li key={key} className="flex justify-between rounded-input border bg-slate-50 px-3 py-2">
                  <span>{key}</span>
                  <strong>{String(value)}</strong>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Resend readiness">
            <ul className="space-y-2 text-sm">
              {Object.entries(devStatus.resend).map(([key, value]) => (
                <li key={key} className="flex justify-between rounded-input border bg-slate-50 px-3 py-2">
                  <span>{key}</span>
                  <strong>{String(value)}</strong>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Airtable configuration summary">
          <p className="text-sm">
            configured: <strong>{String(devStatus.airtableConfig.configured)}</strong>
          </p>
          <p className="mt-2 text-xs text-muted">missing: {devStatus.airtableConfig.missing.join(', ') || 'none'}</p>
          <p className="text-xs text-muted">warnings: {devStatus.airtableConfig.warnings.join(' | ') || 'none'}</p>
        </Card>

        <Card title="Ops checks">
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/api/health" target="_blank" rel="noreferrer">Open /api/health (shallow)</a>
            </li>
            <li>
              <a href="/api/dev/sentry-test" target="_blank" rel="noreferrer">Trigger Sentry test error</a>
            </li>
            <li className="text-xs text-muted">Deep health checks require <code>HEALTH_TOKEN</code> via <code>/api/health?deep=1&token=...</code>.</li>
          </ul>
        </Card>

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
