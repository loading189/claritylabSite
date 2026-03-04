import { Card } from '@/components/Card';
import { FileList } from '@/components/client/FileList';

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <Card title="Welcome to your Client Vault">
        <p>Upload your operational files and download your Clarity reports in one secure place.</p>
      </Card>
      <Card title="HVAC audit upload checklist">
        <ul className="list-disc pl-5">
          <li>Last 90 days of AR aging exports</li>
          <li>Service revenue by technician</li>
          <li>Membership and maintenance renewal report</li>
        </ul>
      </Card>
      <FileList category="report" />
    </div>
  );
}
