const readEnv = (value: string | undefined) => value?.trim() ?? '';

const siteUrl = readEnv(process.env.NEXT_PUBLIC_SITE_URL) || 'https://claritylabs.co';
const siteName = readEnv(process.env.NEXT_PUBLIC_SITE_NAME) || 'Clarity Labs';
const siteEmail = readEnv(process.env.NEXT_PUBLIC_SITE_EMAIL) || 'hello@claritylabs.co';
const sitePhone = readEnv(process.env.NEXT_PUBLIC_SITE_PHONE) || '';

const calendlyUrl = readEnv(process.env.NEXT_PUBLIC_CALENDLY_URL);
const auditFormUrl = readEnv(process.env.NEXT_PUBLIC_AUDIT_FORM_URL);
const contactFormUrl = readEnv(process.env.NEXT_PUBLIC_CONTACT_FORM_URL);
const crispWebsiteId = readEnv(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID);
const resourceArUrl = readEnv(process.env.NEXT_PUBLIC_RESOURCE_AR_URL);
const resourceCashflowUrl = readEnv(process.env.NEXT_PUBLIC_RESOURCE_CASHFLOW_URL);
const analyticsProvider = readEnv(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER);
const plausibleDomain = readEnv(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

export const runtimeConfig = {
  site: {
    url: siteUrl,
    name: siteName,
    email: siteEmail,
    phone: sitePhone,
    hasPhone: Boolean(sitePhone),
  },
  booking: {
    calendlyUrl,
    enabled: Boolean(calendlyUrl),
  },
  forms: {
    auditUrl: auditFormUrl,
    contactUrl: contactFormUrl,
    hasAuditForm: Boolean(auditFormUrl),
    hasContactForm: Boolean(contactFormUrl),
  },
  chat: {
    crispWebsiteId,
    enabled: Boolean(crispWebsiteId),
  },
  resources: {
    arRecoveryUrl: resourceArUrl,
    cashflowSnapshotUrl: resourceCashflowUrl,
    hasArRecovery: Boolean(resourceArUrl),
    hasCashflowSnapshot: Boolean(resourceCashflowUrl),
  },
  analytics: {
    provider: analyticsProvider,
    plausibleDomain,
    enabled: Boolean(analyticsProvider),
  },
};
