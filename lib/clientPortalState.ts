import 'server-only';

export function shouldShowUnavailableRecordsState(
  status: string,
  hasDiagnostic: boolean,
) {
  if (hasDiagnostic) return false;
  return ['missing_env', 'unauthorized', 'forbidden', 'not_found'].includes(
    status,
  );
}

type PortalEngagementInputs = {
  hasDiagnostic: boolean;
  isSessionBooked: boolean;
};

// Transitional read model for portal UI copy and section emphasis.
// This keeps diagnostic records available while we shift toward engagement delivery.
export function getPortalEngagementStage({
  hasDiagnostic,
  isSessionBooked,
}: PortalEngagementInputs) {
  if (isSessionBooked) return 'active_engagement' as const;
  if (hasDiagnostic) return 'qualified_lead' as const;
  return 'early_access' as const;
}
