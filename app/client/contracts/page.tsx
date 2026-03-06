import { PortalPageHeader } from '@/components/portal/PortalPageHeader';

export default function ClientContractsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Agreements"
        title="Contracts"
        description="Store signed agreements and engagement addenda for fast reference during delivery."
      />
      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">No contracts uploaded yet</h2>
        <p className="mt-2 text-sm text-muted">When contracts are available, they will appear here for download and review.</p>
      </section>
    </div>
  );
}
