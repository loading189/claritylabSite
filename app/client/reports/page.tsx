import { FileList } from '@/components/client/FileList';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';

export default function ClientReportsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Reports"
        title="Delivery reports"
        description="This is where we share reports, updates, and review-ready outputs for your active engagement."
      />
      <FileList category="report" />
    </div>
  );
}
