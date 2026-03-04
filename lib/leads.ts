export type LeadSource = 'contact_form' | 'audit_request' | 'resource_download' | 'chat' | 'newsletter';
export type LeadInterest = 'audit' | 'implementation' | 'ongoing_support' | 'unknown';
export type LeadPainArea =
  | 'ar_cashflow'
  | 'scheduling'
  | 'invoicing'
  | 'tech_productivity'
  | 'workflow_gaps'
  | 'other';

export type LeadInput = {
  created_at?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  source: LeadSource;
  interest?: LeadInterest;
  pain_area?: LeadPainArea;
  message?: string;
  resource_slug?: string;
  status?: string;
  consent?: boolean;
  website?: string;
};

export type NormalizedLead = {
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  source: LeadSource;
  interest: LeadInterest;
  pain_area: LeadPainArea;
  message: string;
  resource_slug: string;
  status: string;
  consent: boolean;
};

const validSources = new Set<LeadSource>(['contact_form', 'audit_request', 'resource_download', 'chat', 'newsletter']);
const validInterests = new Set<LeadInterest>(['audit', 'implementation', 'ongoing_support', 'unknown']);
const validPainAreas = new Set<LeadPainArea>(['ar_cashflow', 'scheduling', 'invoicing', 'tech_productivity', 'workflow_gaps', 'other']);

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export function validateLead(input: LeadInput): { lead?: NormalizedLead; error?: string; honeypotTriggered?: boolean } {
  if (clean(input.website)) {
    return { honeypotTriggered: true };
  }

  if (!validSources.has(input.source)) {
    return { error: 'Invalid lead source.' };
  }

  const email = clean(input.email).toLowerCase();
  const phone = clean(input.phone);

  if (!email && !phone) {
    return { error: 'Please provide at least an email or phone number.' };
  }

  if (email && !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  const interest = validInterests.has(input.interest ?? 'unknown') ? (input.interest ?? 'unknown') : 'unknown';
  const pain_area = validPainAreas.has(input.pain_area ?? 'other') ? (input.pain_area ?? 'other') : 'other';

  return {
    lead: {
      created_at: input.created_at || new Date().toISOString(),
      name: clean(input.name),
      email,
      phone,
      company: clean(input.company),
      industry: clean(input.industry),
      source: input.source,
      interest,
      pain_area,
      message: clean(input.message),
      resource_slug: clean(input.resource_slug),
      status: clean(input.status) || 'New',
      consent: Boolean(input.consent),
    },
  };
}
