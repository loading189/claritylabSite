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
