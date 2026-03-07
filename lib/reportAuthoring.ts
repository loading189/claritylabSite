import 'server-only';

export type ReportPublishState = 'draft' | 'internal' | 'client_visible';

export type AuthoredReportFinding = {
  area: string;
  finding: string;
  impact: 'high' | 'medium' | 'low';
};

export type AuthoredReportPriorityAction = {
  action: string;
  owner: string;
  timing: string;
  priority: 'high' | 'medium' | 'low';
};

export type AuthoredReportSection = {
  id: string;
  title: string;
  content: string;
};

export type AuthoredReportChart = {
  id: string;
  title: string;
  description: string;
  series: { label: string; value: number }[];
};

export type AuthoredReportTable = {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
};

export type AuthoredReportContent = {
  subtitle?: string;
  shortSummary?: string;
  executiveSummary?: string;
  keyFindings?: AuthoredReportFinding[];
  priorityActions?: AuthoredReportPriorityAction[];
  chartNotes?: string;
  charts?: AuthoredReportChart[];
  tables?: AuthoredReportTable[];
  sections?: AuthoredReportSection[];
};

function normalizeImpact(value: unknown): 'high' | 'medium' | 'low' {
  return value === 'high' || value === 'medium' || value === 'low' ? value : 'medium';
}

export function normalizeReportPublishState(value: unknown): ReportPublishState {
  const raw = String(value || '').trim();
  if (raw === 'draft' || raw === 'internal' || raw === 'client_visible') return raw;
  if (raw === 'internalOnly') return 'internal';
  if (raw === 'visibleToClient') return 'client_visible';
  return 'draft';
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseAuthoredReportContent(value: unknown): AuthoredReportContent | null {
  if (!value) return null;

  let raw: unknown = value;
  if (typeof value === 'string') {
    try {
      raw = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const keyFindings = Array.isArray(obj.keyFindings)
    ? obj.keyFindings
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const finding = item as Record<string, unknown>;
          return {
            area: asString(finding.area),
            finding: asString(finding.finding),
            impact: normalizeImpact(finding.impact),
          };
        })
        .filter((item): item is AuthoredReportFinding => Boolean(item?.finding))
    : undefined;

  const priorityActions = Array.isArray(obj.priorityActions)
    ? obj.priorityActions
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const action = item as Record<string, unknown>;
          return {
            action: asString(action.action),
            owner: asString(action.owner),
            timing: asString(action.timing),
            priority: normalizeImpact(action.priority),
          };
        })
        .filter((item): item is AuthoredReportPriorityAction => Boolean(item?.action))
    : undefined;

  const sections = Array.isArray(obj.sections)
    ? obj.sections
        .map((item, index) => {
          if (!item || typeof item !== 'object') return null;
          const section = item as Record<string, unknown>;
          const content = asString(section.content);
          if (!content) return null;
          return {
            id: asString(section.id) || `section-${index + 1}`,
            title: asString(section.title) || 'Additional notes',
            content,
          };
        })
        .filter((item): item is AuthoredReportSection => Boolean(item))
    : undefined;

  const charts = Array.isArray(obj.charts)
    ? (obj.charts.filter((item): item is AuthoredReportChart => Boolean(item && typeof item === 'object')) as AuthoredReportChart[])
    : undefined;

  const tables = Array.isArray(obj.tables)
    ? (obj.tables.filter((item): item is AuthoredReportTable => Boolean(item && typeof item === 'object')) as AuthoredReportTable[])
    : undefined;

  const content: AuthoredReportContent = {
    subtitle: asString(obj.subtitle) || undefined,
    shortSummary: asString(obj.shortSummary) || undefined,
    executiveSummary: asString(obj.executiveSummary) || undefined,
    chartNotes: asString(obj.chartNotes) || undefined,
    keyFindings: keyFindings?.length ? keyFindings : undefined,
    priorityActions: priorityActions?.length ? priorityActions : undefined,
    sections: sections?.length ? sections : undefined,
    charts: charts?.length ? charts : undefined,
    tables: tables?.length ? tables : undefined,
  };

  if (!Object.values(content).some(Boolean)) return null;
  return content;
}
