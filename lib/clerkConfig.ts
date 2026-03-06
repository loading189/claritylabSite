import 'server-only';

const read = (value: string | undefined) => value?.trim() ?? '';

export function getClerkConfig() {
  const publishableKey = read(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const secretKey = read(process.env.CLERK_SECRET_KEY);
  const ownerEmail = read(process.env.OWNER_EMAIL).toLowerCase();

  const clerkEnvPresent = Boolean(publishableKey && secretKey);
  const clerkProviderEnabled = Boolean(publishableKey);

  return {
    publishableKey,
    secretKey,
    ownerEmail,
    clerkEnvPresent,
    clerkProviderEnabled,
    middlewareProtectedMode: clerkEnvPresent ? 'clerk' : 'marketing_safe',
    adminRoleSource: ownerEmail ? 'metadata_or_owner_email' : 'metadata_only',
  };
}
