import { FileList } from '@/components/client/FileList';
import { FileUploader } from '@/components/client/FileUploader';

export default function ClientFilesPage() {
  return (
    <div className="space-y-4">
      <FileUploader category="upload" />
      <FileList category="upload" />
    </div>
  );
}
