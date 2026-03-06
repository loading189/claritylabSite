import { FileList } from '@/components/client/FileList';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';

export default function ClientReportsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Reporting"
        title="Reports"
        description="Access generated outputs and shared review artifacts in one secure place."
      />
      <FileList category="report" />
    </div>
  );
}
