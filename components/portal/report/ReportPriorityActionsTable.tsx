import { DataTable } from '@/components/DataTable';
import type { ReportPriorityAction } from '@/lib/clientReportReadModel';

export function ReportPriorityActionsTable({ actions }: { actions: ReportPriorityAction[] }) {
  return <DataTable headers={['Action', 'Priority', 'Owner', 'Timing']} rows={actions.map((item) => [item.action, item.priority, item.owner, item.timing])} />;
}
