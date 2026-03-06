import 'server-only';

import type { VaultFile } from '@/lib/vaultData';

export type DeliverableRecord = {
  id: string;
  deliverableType: string;
  title: string;
  summaryNote: string | null;
  periodCovered: string | null;
  createdAt: string;
  visibleToClient: boolean;
  status: string;
};

function parseBoolean(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === 'yes' || normalized === '1') return true;
    if (normalized === 'false' || normalized === 'no' || normalized === '0') return false;
  }
  return fallback;
}

export function mapFileToDeliverable(file: VaultFile): DeliverableRecord {
  const id = file.id || file.storage_key;
  const title = file.title || file.filename;

  return {
    id,
    deliverableType: file.deliverable_type || 'report',
    title,
    summaryNote: file.summary_note || file.note || null,
    periodCovered: file.period_covered || null,
    createdAt: file.created_at,
    visibleToClient: parseBoolean(file.visible_to_client, true),
    status: file.status || 'delivered',
  };
}

export function listRecentDeliverables(reportFiles: VaultFile[], limit = 4): DeliverableRecord[] {
  return reportFiles
    .map(mapFileToDeliverable)
    .filter((item) => item.visibleToClient)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
