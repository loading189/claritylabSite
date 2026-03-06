import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';

export default function ClientFilesPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Uploads"
        title="Uploads and documents"
        description="Share source files, statements, and notes here. You can upload what you already have."
      />
      <FileUploader category="upload" />
      <FileList category="upload" />
    </div>
  );
}
