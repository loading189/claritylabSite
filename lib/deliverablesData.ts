import 'server-only';

import { normalizeReportPublishState, type ReportPublishState } from '@/lib/reportAuthoring';
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
  visibility: ReportPublishState;
  publishedAt: string | null;
  reportContentJson: string | null;
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

function normalizeLegacyVisibility(file: VaultFile): ReportPublishState {
  const publishStateRaw = String(file.report_publish_state || '').trim();
  if (publishStateRaw) return normalizeReportPublishState(publishStateRaw);

  const visibilityRaw = String(file.deliverable_visibility || '').trim();
  if (visibilityRaw) return normalizeReportPublishState(visibilityRaw);

  return parseBoolean(file.visible_to_client, true) ? 'client_visible' : 'internal';
}

export function mapFileToDeliverable(file: VaultFile): DeliverableRecord {
  const id = file.id || file.storage_key;
  const title = file.title || file.filename;
  const visibility = normalizeLegacyVisibility(file);
  const visibleToClient = visibility === 'client_visible' && parseBoolean(file.visible_to_client, true);

  return {
    id,
    deliverableType: file.deliverable_type || 'report',
    title,
    summaryNote: file.summary_note || file.note || null,
    periodCovered: file.period_covered || null,
    createdAt: file.created_at,
    visibleToClient,
    status: file.status || 'delivered',
    visibility,
    publishedAt: file.report_published_at || null,
    reportContentJson: file.report_content_json || null,
  };
}

export function listRecentDeliverables(reportFiles: VaultFile[], limit = 4): DeliverableRecord[] {
  return reportFiles
    .map(mapFileToDeliverable)
    .filter((item) => item.visibleToClient)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
