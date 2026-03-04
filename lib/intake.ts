import 'server-only';

import { upsertLead } from './airtable';
import { sendIntakeEmails } from './intakeEmail';
import { checkRateLimit } from '@/app/api/_utils/rateLimit';
import { LeadInput, LeadPainArea, LeadSource, validateLead } from './leads';

export type IntakeType = 'call' | 'audit';
export type TeamSize = '1' | '2-5' | '6-15' | '16+';
export type RevenueRange = 'under_250k' | '250k_750k' | '750k_2m' | '2m_5m' | '5m_plus';
export type Urgency = 'this_week' | 'this_month' | 'this_quarter' | 'someday';

export type IntakePayload = {
  website?: string;
  company_website?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
  industry?: string;
  team_size?: TeamSize;
  annual_revenue_range?: RevenueRange;
  current_tools?: string[];
  biggest_pain?: LeadPainArea;
  problem_description?: string;
  urgency?: Urgency;
  decision_maker?: 'yes' | 'no';
  consent?: boolean;
  audit_goal?: string;
  share_data?: 'yes' | 'no';
  upload_preference?: 'upload_link' | 'email_later';
  uploaded_files?: string[];
  uploaded_file_names?: string[];
  notes?: string;
  token?: string;
};

export type QualificationTier = 'Hot' | 'Warm' | 'Cold';

export function scoreIntake(payload: IntakePayload): { score: number; tier: QualificationTier; status: string } {
  let score = 0;

  if (['750k_2m', '2m_5m', '5m_plus'].includes(payload.annual_revenue_range || '')) score += 20;
  if (['6-15', '16+'].includes(payload.team_size || '')) score += 15;
  if (payload.biggest_pain === 'ar_cashflow') score += 10;
  if (payload.current_tools?.some((tool) => ['QuickBooks', 'ServiceTitan'].includes(tool))) score += 10;
  if (payload.urgency === 'this_month') score += 10;
  if (payload.decision_maker === 'yes') score += 15;
  if (payload.share_data === 'yes') score += 10;

  const problem = (payload.problem_description || '').toLowerCase();
  if (problem.includes('bookkeeping')) score -= 25;
  if (problem.includes('brand new') || problem.includes('no volume')) score -= 15;

  score = Math.max(0, Math.min(100, score));

  const tier: QualificationTier = score >= 70 ? 'Hot' : score >= 40 ? 'Warm' : 'Cold';
  const status = tier === 'Hot' ? 'New (Priority)' : tier === 'Warm' ? 'New' : 'New (Low Fit)';

  return { score, tier, status };
}

const intakeToken = process.env.INTAKE_TOKEN;
const hasAirtable = Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID);
const airtableTable = process.env.AIRTABLE_INTAKES_TABLE || 'Intakes';

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export function validateToken(token?: string) {
  if (!intakeToken) return true;
  return Boolean(token && token === intakeToken);
}

export function readIp(headersIn: Headers) {
  return headersIn.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function validateIntake(payload: IntakePayload, type: IntakeType): { valid?: IntakePayload; error?: string; honeypotTriggered?: boolean } {
  if (clean(payload.website)) return { honeypotTriggered: true };

  const required = ['name', 'email', 'company'];
  for (const field of required) {
    if (!clean(payload[field as keyof IntakePayload])) {
      return { error: `${field} is required.` };
    }
  }

  if (!String(payload.email).includes('@')) return { error: 'Valid email is required.' };
  if (!payload.consent) return { error: 'Consent is required.' };

  if (type === 'audit' && !validateToken(payload.token)) {
    return { error: 'Invalid intake token.' };
  }

  return { valid: payload };
}

async function createIntakeRecord(intakeType: IntakeType, payload: IntakePayload, score: number, tier: QualificationTier, status: string) {
  if (!hasAirtable) return { recordId: '', recordUrl: '' };

  const baseId = process.env.AIRTABLE_BASE_ID;
  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(airtableTable)}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        created_at: new Date().toISOString(),
        intake_type: intakeType,
        lead_email: clean(payload.email).toLowerCase(),
        lead_name: clean(payload.name),
        company: clean(payload.company),
        phone: clean(payload.phone),
        website: clean(payload.company_website),
        location: clean(payload.location),
        industry: clean(payload.industry),
        team_size: clean(payload.team_size),
        annual_revenue_range: clean(payload.annual_revenue_range),
        current_tools: (payload.current_tools || []).join(', '),
        biggest_pain: clean(payload.biggest_pain),
        problem_description: clean(payload.problem_description),
        urgency: clean(payload.urgency),
        decision_maker: clean(payload.decision_maker),
        audit_goal: clean(payload.audit_goal),
        share_data: clean(payload.share_data),
        upload_preference: clean(payload.upload_preference),
        uploaded_files: (payload.uploaded_files || []).join('\n'),
        uploaded_file_names: (payload.uploaded_file_names || []).join(', '),
        notes: clean(payload.notes),
        qualification_score: score,
        qualification_tier: tier,
        status,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Airtable intake create failed: ${response.status}`);
  }

  const data = (await response.json()) as { id: string };
  const tableUrl = process.env.AIRTABLE_INTAKES_TABLE_URL;

  return {
    recordId: data.id,
    recordUrl: tableUrl ? `${tableUrl}/${data.id}` : '',
  };
}

function buildLead(payload: IntakePayload, intakeType: IntakeType, status: string): LeadInput {
  return {
    name: clean(payload.name),
    email: clean(payload.email).toLowerCase(),
    phone: clean(payload.phone),
    company: clean(payload.company),
    industry: clean(payload.industry),
    source: intakeType === 'audit' ? ('audit_request' as LeadSource) : ('contact_form' as LeadSource),
    interest: intakeType === 'audit' ? 'audit' : 'implementation',
    pain_area: (payload.biggest_pain || 'other') as LeadPainArea,
    message: clean(payload.problem_description),
    status,
    consent: Boolean(payload.consent),
  };
}

export async function handleIntake(payload: IntakePayload, intakeType: IntakeType, ip: string) {
  const limit = checkRateLimit(ip, `intake:${intakeType}`);
  if (limit.limited) return { error: 'Too many requests. Please try again shortly.', status: 429 };

  const validated = validateIntake(payload, intakeType);
  if (validated.honeypotTriggered) return { ok: true, tier: 'Cold' as QualificationTier };
  if (!validated.valid) return { error: validated.error || 'Invalid input.', status: 400 };

  const { score, tier, status } = scoreIntake(validated.valid);
  const { recordUrl } = await createIntakeRecord(intakeType, validated.valid, score, tier, status);

  const leadResult = validateLead(buildLead(validated.valid, intakeType, status));
  if (leadResult.lead) {
    await upsertLead(leadResult.lead);
  }

  await sendIntakeEmails({ intakeType, payload: validated.valid, score, tier, recordUrl });

  return { ok: true, tier, score };
}
