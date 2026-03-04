import { FileList } from '@/components/client/FileList';

export default function ClientReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Reports</h1>
      <FileList category="report" />
    </div>
  );
}
