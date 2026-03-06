type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | undefined {
  return typeof value === 'object' && value !== null
    ? (value as UnknownRecord)
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getNestedString(
  input: unknown,
  parentKey: string,
  childKey: string,
): string | undefined {
  const record = asRecord(input);
  const nested = record ? asRecord(record[parentKey]) : undefined;
  return nested ? asString(nested[childKey]) : undefined;
}

export function resolveClerkRole(input: unknown): string | undefined {
  const record = asRecord(input);
  if (!record) return undefined;

  return (
    asString(record.role) ??
    getNestedString(record, 'public_metadata', 'role') ??
    getNestedString(record, 'publicMetadata', 'role')
  );
}

export function resolveClerkEmail(input: unknown): string {
  const record = asRecord(input);
  if (!record) return '';

  return (
    asString(record.email) ??
    asString(record.primary_email_address) ??
    asString(record.email_address) ??
    ''
  ).toLowerCase();
}

export function resolveAppRole(
  input: unknown,
  ownerEmail: string,
): 'admin' | 'client' {
  const resolvedRole = resolveClerkRole(input);
  const resolvedEmail = resolveClerkEmail(input);

  return resolvedRole === 'admin' ||
    (ownerEmail && resolvedEmail === ownerEmail)
    ? 'admin'
    : 'client';
}
