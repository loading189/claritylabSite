import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';

export default function ClientFilesPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="File vault"
        title="Documents"
        description="Upload working files and keep source material organized for your upcoming recommendations and reviews."
      />
      <FileUploader category="upload" />
      <FileList category="upload" />
    </div>
  );
}
