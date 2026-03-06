const readEnv = (value: string | undefined) => value?.trim() ?? '';
const has = (value: string) => Boolean(value);

const env = {
  siteUrl: readEnv(process.env.NEXT_PUBLIC_SITE_URL),
  siteName: readEnv(process.env.NEXT_PUBLIC_SITE_NAME),
  siteEmail: readEnv(process.env.NEXT_PUBLIC_SITE_EMAIL),
  sitePhone: readEnv(process.env.NEXT_PUBLIC_SITE_PHONE),
  calendlyUrl: readEnv(process.env.NEXT_PUBLIC_CALENDLY_URL),
  auditFormUrl: readEnv(process.env.NEXT_PUBLIC_AUDIT_FORM_URL),
  contactFormUrl: readEnv(process.env.NEXT_PUBLIC_CONTACT_FORM_URL),
  crispWebsiteId: readEnv(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID),
  arUrl: readEnv(process.env.NEXT_PUBLIC_RESOURCE_AR_URL),
  cashflowUrl: readEnv(process.env.NEXT_PUBLIC_RESOURCE_CASHFLOW_URL),
  analyticsProvider: readEnv(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER),
  plausibleDomain: readEnv(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  sentryDsn: readEnv(process.env.NEXT_PUBLIC_SENTRY_DSN),
  uploadUrl: readEnv(process.env.NEXT_PUBLIC_INTAKE_UPLOAD_URL),
  clerkPublishableKey: readEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  clerkSignInUrl: readEnv(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL),
  clerkSignUpUrl: readEnv(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL),
};

export const runtimeConfig = {
  site: {
    name: env.siteName || 'Clarity Labs',
    url: env.siteUrl || 'https://claritylabs.co',
    email: env.siteEmail || 'hello@claritylabs.co',
    phone: env.sitePhone,
    hasPhone: has(env.sitePhone),
  },
  auth: {
    clerkPublishableKey: env.clerkPublishableKey,
    signInUrl: env.clerkSignInUrl || '/sign-in',
    signUpUrl: env.clerkSignUpUrl || '/sign-up',
  },
  booking: { calendlyUrl: env.calendlyUrl },
  forms: { auditFormUrl: env.auditFormUrl, contactFormUrl: env.contactFormUrl },
  chat: { crispWebsiteId: env.crispWebsiteId },
  resources: { arUrl: env.arUrl, cashflowUrl: env.cashflowUrl },
  analytics: { provider: env.analyticsProvider, plausibleDomain: env.plausibleDomain },
  monitoring: { sentryDsn: env.sentryDsn },
  uploads: { intakeUploadUrl: env.uploadUrl },
  featureFlags: {
    isBookingEnabled: has(env.calendlyUrl),
    isChatEnabled: has(env.crispWebsiteId),
    isAnalyticsEnabled: env.analyticsProvider === 'plausible' && has(env.plausibleDomain),
    isAuditFormEnabled: has(env.auditFormUrl),
    isContactFormEnabled: has(env.contactFormUrl),
    isArResourceEnabled: has(env.arUrl),
    isCashflowResourceEnabled: has(env.cashflowUrl),
    isUploadEnabled: has(env.uploadUrl),
    isSentryEnabled: has(env.sentryDsn),
    isClientVaultEnabled: Boolean(process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_API_KEY),
  },
};

export type RuntimeConfig = typeof runtimeConfig;

export function getIntegrationStatus() {
  const server = {
    auth: {
      enabled: Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
      required: ['CLERK_SECRET_KEY', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'],
    },
    storage: {
      enabled: Boolean(process.env.FILE_SIGNING_SECRET),
      required: ['FILE_SIGNING_SECRET', 'FILE_URL_TTL_SECONDS'],
    },
    filesTable: {
      enabled: Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID),
      required: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_FILES_TABLE', 'AIRTABLE_CLIENTS_TABLE'],
    },
    resend: {
      enabled: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      required: ['RESEND_API_KEY', 'EMAIL_FROM'],
    },
    scanPersistence: {
      enabled: Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID && (process.env.AIRTABLE_SCAN_TABLE || 'Scan Diagnostics')),
      required: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_SCAN_TABLE'],
    },
    diagnostics_read: {
      enabled: Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID && (process.env.AIRTABLE_DIAGNOSTICS_TABLE || process.env.AIRTABLE_SCAN_TABLE || 'Diagnostics')),
      required: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_DIAGNOSTICS_TABLE'],
    },
    scanEmail: {
      enabled: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      required: ['RESEND_API_KEY', 'EMAIL_FROM', 'OWNER_EMAIL'],
    },
    sentry: {
      enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
      required: ['NEXT_PUBLIC_SENTRY_DSN'],
    },
    calendly_webhook_configured: {
      enabled: Boolean(process.env.CALENDLY_WEBHOOK_SIGNING_KEY),
      required: ['CALENDLY_WEBHOOK_SIGNING_KEY'],
    },
    bookings_write: {
      enabled: Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_BOOKINGS_TABLE),
      required: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_BOOKINGS_TABLE'],
    },
    booking_emails: {
      enabled: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      required: ['RESEND_API_KEY', 'EMAIL_FROM', 'OWNER_EMAIL'],
    },
    booking_flow_ready: {
      enabled: Boolean(
        process.env.CALENDLY_WEBHOOK_SIGNING_KEY &&
          process.env.AIRTABLE_API_KEY &&
          process.env.AIRTABLE_BASE_ID &&
          process.env.AIRTABLE_BOOKINGS_TABLE &&
          process.env.RESEND_API_KEY &&
          process.env.EMAIL_FROM,
      ),
      required: [
        'CALENDLY_WEBHOOK_SIGNING_KEY',
        'AIRTABLE_API_KEY',
        'AIRTABLE_BASE_ID',
        'AIRTABLE_BOOKINGS_TABLE',
        'RESEND_API_KEY',
        'EMAIL_FROM',
      ],
    },
  };

  const publicEnv = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
    'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
    'NEXT_PUBLIC_CALENDLY_URL',
    'NEXT_PUBLIC_CALENDLY_EVENT_TYPE_URL',
    'NEXT_PUBLIC_AUDIT_FORM_URL',
    'NEXT_PUBLIC_CONTACT_FORM_URL',
    'NEXT_PUBLIC_CRISP_WEBSITE_ID',
    'NEXT_PUBLIC_RESOURCE_AR_URL',
    'NEXT_PUBLIC_RESOURCE_CASHFLOW_URL',
    'NEXT_PUBLIC_ANALYTICS_PROVIDER',
    'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
    'NEXT_PUBLIC_INTAKE_UPLOAD_URL',
    'NEXT_PUBLIC_SENTRY_DSN',
  ] as const;

  return {
    clientFeatures: runtimeConfig.featureFlags,
    server,
    envPresence: Object.fromEntries(publicEnv.map((key) => [key, has(readEnv(process.env[key]))])),
  };
}
