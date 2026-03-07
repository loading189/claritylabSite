import 'server-only';

import { getAdvisoryBriefFromDiagnostic } from '@/lib/diagnosticGuidance';
import { getLatestDiagnosticByEmail, type DiagnosticRecord } from '@/lib/diagnosticsData';
import { mapFileToDeliverable } from '@/lib/deliverablesData';
import { parseAuthoredReportContent, type ReportPublishState } from '@/lib/reportAuthoring';
import { listFiles, type VaultFile } from '@/lib/vaultData';

export type ReportVisibility = ReportPublishState;

export type ClientReportSummary = {
  id: string;
  title: string;
  subtitle: string | null;
  reportType: string;
  createdAt: string;
  periodCovered: string | null;
  status: string;
};

export type ReportFinding = {
  area: string;
  finding: string;
  impact: 'high' | 'medium' | 'low';
};

export type ReportPriorityAction = {
  action: string;
  owner: string;
  timing: string;
  priority: 'high' | 'medium' | 'low';
};

export type ReportChartSeries = {
  label: string;
  value: number;
};

export type ReportChart = {
  id: string;
  title: string;
  description: string;
  series: ReportChartSeries[];
};

export type ReportTable = {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
};

export type ReportSection = {
  id: string;
  title: string;
  content: string;
};

export type ClientReportReadModel = {
  id: string;
  clientId: string;
  title: string;
  subtitle: string | null;
  reportType: string;
  createdAt: string;
  publishedAt: string | null;
  periodCovered: string | null;
  primarySignal: string;
  secondarySignal: string | null;
  score: number | null;
  tier: string;
  executiveSummary: string;
  chartNotes: string | null;
  keyFindings: ReportFinding[];
  priorityActions: ReportPriorityAction[];
  charts: ReportChart[];
  tables: ReportTable[];
  sections: ReportSection[];
  pdfFileId: string | null;
  status: string;
  visibility: ReportVisibility;
  storageKey: string;
};

function titleCaseSignal(input?: string | null) {
  if (!input) return 'Operations';
  return input
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function scoreToTier(score: number | null, fallback = 'monitor') {
  if (score === null) return fallback;
  if (score >= 75) return 'critical';
  if (score >= 45) return 'priority';
  return 'monitor';
}

function pressureBreakdown(score: number | null) {
  const normalized = score === null ? 42 : Math.min(Math.max(score, 0), 100);
  const highest = Math.round(Math.min(100, normalized + 15));
  const next = Math.round(Math.max(5, normalized * 0.65));
  const baseline = Math.max(5, 100 - highest - next);
  return { highest, next, baseline };
}

function buildTables(
  primarySignal: string,
  secondarySignal: string | null,
  findings: ReportFinding[],
  actions: ReportPriorityAction[],
): ReportTable[] {
  return [
    {
      id: 'signal-overview',
      title: 'Summary by area',
      columns: ['Area', 'What we found', 'Priority'],
      rows: findings.map((item) => [item.area, item.finding, item.impact]),
    },
    {
      id: 'action-plan',
      title: 'Action plan',
      columns: ['Action', 'Priority', 'Owner', 'Timing'],
      rows: actions.map((item) => [item.action, item.priority, item.owner, item.timing]),
    },
    {
      id: 'signal-breakdown',
      title: 'Signal breakdown',
      columns: ['Signal', 'Role'],
      rows: [
        [primarySignal, 'Primary pressure area'],
        [secondarySignal || 'Operational follow-through', 'Secondary pressure area'],
      ],
    },
  ];
}

function toReportSummary(file: VaultFile): ClientReportSummary | null {
  const deliverable = mapFileToDeliverable(file);
  if (!deliverable.visibleToClient || deliverable.deliverableType !== 'report') return null;
  const authored = parseAuthoredReportContent(deliverable.reportContentJson);

  return {
    id: deliverable.id,
    title: deliverable.title,
    subtitle: authored?.subtitle || authored?.shortSummary || deliverable.summaryNote,
    reportType: deliverable.deliverableType,
    createdAt: deliverable.createdAt,
    periodCovered: deliverable.periodCovered,
    status: deliverable.status,
  };
}

export function buildClientReportReadModel({
  clientId,
  reportFile,
  diagnostic,
}: {
  clientId: string;
  reportFile: VaultFile;
  diagnostic: DiagnosticRecord | null;
}): ClientReportReadModel | null {
  const deliverable = mapFileToDeliverable(reportFile);
  if (!deliverable.visibleToClient) return null;

  const authored = parseAuthoredReportContent(deliverable.reportContentJson);
  const primarySignal = titleCaseSignal(diagnostic?.primarySignal || 'operations');
  const secondarySignal = diagnostic?.secondarySignal ? titleCaseSignal(diagnostic.secondarySignal) : null;
  const score = diagnostic?.score ?? null;
  const tier = diagnostic?.tier || scoreToTier(score, 'monitor');
  const brief = diagnostic ? getAdvisoryBriefFromDiagnostic(diagnostic) : null;

  const defaultFindings: ReportFinding[] = (brief?.whatMayBeHappening || [
    'We reviewed your latest engagement information and focused on the areas creating the most pressure right now.',
    'You have opportunities to reduce day-to-day pressure by tightening follow-through and ownership.',
  ])
    .slice(0, 3)
    .map((finding, index) => ({
      area: index === 0 ? primarySignal : index === 1 ? secondarySignal || 'Operations' : 'Execution rhythm',
      finding,
      impact: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }));

  const defaultActions: ReportPriorityAction[] = (brief?.whereToStart || [
    'Pick one issue causing the most pressure this week and assign a clear owner.',
    'Set a short weekly review rhythm so progress stays visible.',
    'Track one to three numbers that show if pressure is going down.',
  ])
    .slice(0, 3)
    .map((action, index) => ({
      action,
      owner: index === 0 ? 'Owner + Clarity Labs' : 'Operations lead',
      timing: index === 0 ? 'This week' : index === 1 ? 'Next 2 weeks' : 'This month',
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }));

  const keyFindings = authored?.keyFindings?.length ? authored.keyFindings : defaultFindings;
  const priorityActions = authored?.priorityActions?.length ? authored.priorityActions : defaultActions;

  const breakdown = pressureBreakdown(score);

  return {
    id: deliverable.id,
    clientId,
    title: deliverable.title,
    subtitle: authored?.subtitle || authored?.shortSummary || deliverable.summaryNote,
    reportType: deliverable.deliverableType,
    createdAt: deliverable.createdAt,
    publishedAt: deliverable.publishedAt,
    periodCovered: deliverable.periodCovered,
    primarySignal,
    secondarySignal,
    score,
    tier,
    executiveSummary:
      authored?.executiveSummary ||
      deliverable.summaryNote ||
      brief?.shortSummary ||
      'Here’s what we found. You can reduce pressure fastest by starting with one clear issue and a short action plan.',
    chartNotes: authored?.chartNotes || null,
    keyFindings,
    priorityActions,
    charts: authored?.charts?.length
      ? authored.charts
      : [
          {
            id: 'pressure-by-signal',
            title: 'Where pressure is strongest',
            description: 'This view highlights where we see the most pressure so you can focus first steps.',
            series: [
              { label: primarySignal, value: breakdown.highest },
              { label: secondarySignal || 'Follow-through', value: breakdown.next },
              { label: 'Baseline operations', value: breakdown.baseline },
            ],
          },
        ],
    tables: authored?.tables?.length ? authored.tables : buildTables(primarySignal, secondarySignal, keyFindings, priorityActions),
    sections: authored?.sections || [],
    pdfFileId: reportFile.id || null,
    status: deliverable.status,
    visibility: deliverable.visibility,
    storageKey: reportFile.storage_key,
  };
}

export async function listClientReportSummaries(clientId: string) {
  const files = await listFiles(clientId, 'report');
  return files
    .map(toReportSummary)
    .filter((item): item is ClientReportSummary => Boolean(item))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getClientReportReadModel({
  clientId,
  clientEmail,
  reportId,
}: {
  clientId: string;
  clientEmail: string;
  reportId: string;
}): Promise<ClientReportReadModel | null> {
  const [reportFiles, diagnostic] = await Promise.all([listFiles(clientId, 'report'), getLatestDiagnosticByEmail(clientEmail)]);
  const reportFile = reportFiles.find((file) => (file.id || file.storage_key) === reportId);
  if (!reportFile) return null;

  return buildClientReportReadModel({ clientId, reportFile, diagnostic });
}
