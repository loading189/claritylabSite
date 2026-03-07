import { DataTable } from '@/components/DataTable';
import type { ReportFinding } from '@/lib/clientReportReadModel';

export function ReportFindingsTable({ findings }: { findings: ReportFinding[] }) {
  return <DataTable headers={['Area', 'Finding', 'Priority']} rows={findings.map((item) => [item.area, item.finding, item.impact])} />;
}
