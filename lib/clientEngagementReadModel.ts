import 'server-only';

import { getClientByEmail } from '@/lib/bookingsData';
import { shouldShowUnavailableRecordsState } from '@/lib/clientPortalState';
import { getAdvisoryBriefFromDiagnostic } from '@/lib/diagnosticGuidance';
import { getLatestDiagnosticByEmailWithStatus, type DiagnosticRecord } from '@/lib/diagnosticsData';
import { getDiagnosticInsights } from '@/lib/diagnosticsPresentation';
import { listFiles, type VaultFile } from '@/lib/vaultData';

export type LifecycleStage =
  | 'early_access'
  | 'scan_completed'
  | 'call_booked'
  | 'engagement_active';

export type EngagementMilestone = {
  key:
    | 'scan_completed'
    | 'call_booked'
    | 'engagement_active'
    | 'documents_requested'
    | 'report_in_progress'
    | 'report_delivered';
  label: string;
  completed: boolean;
};

export type EngagementRequest = {
  id: string;
  title: string;
  source: 'booking' | 'diagnostic' | 'delivery';
  href: string;
};

export type EngagementDeliverable = {
  id: string;
  title: string;
  createdAt: string;
};

export type ClientEngagementReadModel = {
  lifecycleStage: LifecycleStage;
  engagementStatusLabel: string;
  nextAction: {
    label: string;
    description: string;
    href: string;
  };
  outstandingRequests: EngagementRequest[];
  recentDeliverables: EngagementDeliverable[];
  nextMilestone: string;
  milestones: EngagementMilestone[];
  diagnosticContext: {
    hasDiagnostic: boolean;
    score: number | null;
    tier: string | null;
    primarySignal: string | null;
    summary: string;
  };
  latestReportSummary: string;
  latestUploadSummary: string;
  recordsUnavailable: boolean;
  bookedSessionSummary: string;
};

type ReadModelInputs = {
  diagnosticStatus: string;
  diagnostic: DiagnosticRecord | null;
  bookedStartTime?: string | null;
  bookedTimezone?: string | null;
  isSessionBooked: boolean;
  reportFiles: VaultFile[];
  uploadFiles: VaultFile[];
  calendlyUrl: string;
};

function formatDateTime(startTime?: string | null, timezone?: string | null) {
  if (!startTime) return 'Scheduling details will appear soon.';
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone || 'UTC',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function summarizeFile(file: VaultFile | undefined, emptyLabel: string) {
  if (!file) return emptyLabel;
  const when = formatDateTime(file.created_at);
  return `${file.filename} shared ${when}.`;
}

export function buildClientEngagementReadModel(inputs: ReadModelInputs): ClientEngagementReadModel {
  const { diagnosticStatus, diagnostic, bookedStartTime, bookedTimezone, isSessionBooked, reportFiles, uploadFiles, calendlyUrl } =
    inputs;

  const brief = diagnostic ? getAdvisoryBriefFromDiagnostic(diagnostic) : null;
  const insights = diagnostic ? getDiagnosticInsights(diagnostic) : [];

  const lifecycleStage: LifecycleStage = isSessionBooked
    ? reportFiles.length > 0
      ? 'engagement_active'
      : 'call_booked'
    : diagnostic
      ? 'scan_completed'
      : 'early_access';

  const engagementStatusLabel =
    lifecycleStage === 'engagement_active'
      ? 'Engagement active'
      : lifecycleStage === 'call_booked'
        ? 'Call booked'
        : lifecycleStage === 'scan_completed'
          ? 'Scan complete'
          : 'Getting started';

  const nextAction = isSessionBooked
    ? {
        label: 'Share prep details',
        description: 'Please add your prep notes and any current reports before our session.',
        href: '/client/prep',
      }
    : {
        label: 'Book your kickoff call',
        description: 'Once your call is booked, we can move into active delivery work.',
        href: calendlyUrl,
      };

  const outstandingRequests: EngagementRequest[] = [];

  if (!isSessionBooked) {
    outstandingRequests.push({
      id: 'book-call',
      title: 'Book your kickoff call so we can begin delivery.',
      source: 'booking',
      href: calendlyUrl,
    });
  }

  if (!uploadFiles.length) {
    outstandingRequests.push({
      id: 'upload-files',
      title: 'Upload any current reports, exports, or screenshots you already have.',
      source: 'delivery',
      href: '/client/files',
    });
  }

  const prepItems = brief?.prepItems?.slice(0, 3) || [];
  prepItems.forEach((item, index) => {
    outstandingRequests.push({
      id: `prep-${index + 1}`,
      title: item,
      source: 'diagnostic',
      href: '/client/prep',
    });
  });

  const recentDeliverables = reportFiles.slice(0, 4).map((file) => ({
    id: file.id || file.storage_key,
    title: file.filename,
    createdAt: file.created_at,
  }));

  const milestones: EngagementMilestone[] = [
    { key: 'scan_completed', label: 'Scan completed', completed: Boolean(diagnostic) },
    { key: 'call_booked', label: 'Call booked', completed: isSessionBooked },
    { key: 'engagement_active', label: 'Engagement active', completed: isSessionBooked },
    { key: 'documents_requested', label: 'Documents requested', completed: Boolean(diagnostic) || isSessionBooked },
    {
      key: 'report_in_progress',
      label: 'Report in progress',
      completed: isSessionBooked && (uploadFiles.length > 0 || Boolean(diagnostic)),
    },
    { key: 'report_delivered', label: 'Report delivered', completed: reportFiles.length > 0 },
  ];

  const nextMilestone = milestones.find((item) => !item.completed)?.label || 'Report delivered';

  return {
    lifecycleStage,
    engagementStatusLabel,
    nextAction,
    outstandingRequests: outstandingRequests.slice(0, 5),
    recentDeliverables,
    nextMilestone,
    milestones,
    diagnosticContext: {
      hasDiagnostic: Boolean(diagnostic),
      score: diagnostic?.score || null,
      tier: diagnostic?.tier || null,
      primarySignal: diagnostic?.primarySignal || null,
      summary: insights[0] || brief?.shortSummary || 'Your earlier scan is still here for reference.',
    },
    latestReportSummary: summarizeFile(reportFiles[0], 'No report has been delivered yet.'),
    latestUploadSummary: summarizeFile(uploadFiles[0], 'No files uploaded yet.'),
    recordsUnavailable: shouldShowUnavailableRecordsState(diagnosticStatus, Boolean(diagnostic)),
    bookedSessionSummary: isSessionBooked
      ? `Session scheduled for ${formatDateTime(bookedStartTime, bookedTimezone)}.`
      : 'No session is booked yet.',
  };
}

export async function getClientEngagementReadModel({
  email,
  userId,
}: {
  email: string;
  userId: string;
}): Promise<ClientEngagementReadModel> {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';

  const [diagnosticResult, client, reportFiles, uploadFiles] = await Promise.all([
    getLatestDiagnosticByEmailWithStatus(email),
    getClientByEmail(email),
    listFiles(userId, 'report'),
    listFiles(userId, 'upload'),
  ]);

  return buildClientEngagementReadModel({
    diagnosticStatus: diagnosticResult.status,
    diagnostic: diagnosticResult.record,
    bookedStartTime: client?.booked_start_time,
    bookedTimezone: client?.booked_timezone,
    isSessionBooked: client?.status === 'booked',
    reportFiles,
    uploadFiles,
    calendlyUrl,
  });
}
