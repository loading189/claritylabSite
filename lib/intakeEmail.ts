import 'server-only';

import { hasResend } from './email';
import { IntakePayload, IntakeType, QualificationTier } from './intake';
import { siteConfig } from '@/content/site';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;
const INTAKE_OWNER_EMAIL = process.env.INTAKE_OWNER_EMAIL || siteConfig.email;

function nextQuestions(pain: string) {
  const map: Record<string, string[]> = {
    ar_cashflow: ['What is your current DSO?', 'Which customers are 60+ days late?', 'What collection cadence do you currently run?'],
    scheduling: ['Where do schedule gaps show up most often?', 'What percent of jobs run late?', 'Who owns dispatch quality control?'],
    invoicing: ['How long from job complete to invoice sent?', 'Do techs close jobs with complete notes?', 'What percent of invoices are disputed?'],
    tech_productivity: ['What is your billable hour target?', 'Where do callbacks cluster?', 'How are you tracking tech utilization today?'],
    workflow_gaps: ['Which handoff breaks most often?', 'What is undocumented and tribal?', 'Where is the owner still the bottleneck?'],
    other: ['What outcome would make this engagement a win in 90 days?', 'What constraints matter most?', 'What has already been tried?'],
  };
  return map[pain] || map.other;
}

export async function sendIntakeEmails({
  intakeType,
  payload,
  score,
  tier,
  recordUrl,
}: {
  intakeType: IntakeType;
  payload: IntakePayload;
  score: number;
  tier: QualificationTier;
  recordUrl?: string;
}) {
  if (!hasResend) return;

  const bookingLink = siteConfig.calendlyUrl || `${siteConfig.url}/contact`;

  const clientSubject = tier === 'Hot' ? 'You’re booked for clarity' : 'Next steps for your Clarity Call';
  const email = payload.email || '';
  const name = payload.name || 'there';

  const prepItems = [
    'Bring your top 2-3 bottlenecks from the last 30 days.',
    'Share your current workflow or dispatch/invoice flow at a high level.',
    'For audits: prepare AR aging, P&L, and 3 months of transaction exports if possible.',
  ];

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [email],
      reply_to: EMAIL_REPLY_TO,
      subject: clientSubject,
      html: `<p>Hi ${name},</p>
      <p>Thanks for completing the ${intakeType === 'audit' ? 'Audit' : 'Clarity Call'} intake.</p>
      <p><strong>What to prepare:</strong></p>
      <ul>${prepItems.map((item) => `<li>${item}</li>`).join('')}</ul>
      <p>${siteConfig.calendlyUrl ? `If you still need a time, book here: <a href="${bookingLink}">${bookingLink}</a>` : 'If you still need a time, reply to this email and we will coordinate directly.'}</p>
      <p>Direct line: <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>${siteConfig.phone ? ` • <a href="tel:${siteConfig.phone}">${siteConfig.phone}</a>` : ''}</p>
      <p>No pitch • Just clarity.</p>
      <p style="font-size:12px;color:#555;">Operational guidance only. Not legal, tax, or accounting advice.</p>`,
    }),
  });

  const ownerSubject = `${tier === 'Hot' ? 'PRIORITY: ' : ''}New Clarity Intake: ${payload.company} (${tier})`;
  const questions = nextQuestions(payload.biggest_pain || 'other');

  const uploads = (payload.uploaded_files || []).map((url) => `<li><a href="${url}">${url}</a></li>`).join('');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [INTAKE_OWNER_EMAIL],
      reply_to: EMAIL_REPLY_TO,
      subject: ownerSubject,
      html: `<p><strong>Company:</strong> ${payload.company}</p>
      <p><strong>Name:</strong> ${name} (${email})</p>
      <p><strong>Type:</strong> ${intakeType}</p>
      <p><strong>Pain area:</strong> ${payload.biggest_pain}</p>
      <p><strong>Qualification:</strong> ${score}/100 (${tier})</p>
      <p><strong>Urgency:</strong> ${payload.urgency || 'n/a'} | <strong>Decision maker:</strong> ${payload.decision_maker || 'n/a'}</p>
      <p><strong>Problem:</strong> ${payload.problem_description || 'n/a'}</p>
      ${recordUrl ? `<p><a href="${recordUrl}">Open Airtable record</a></p>` : ''}
      ${uploads ? `<p><strong>Uploaded files:</strong></p><ul>${uploads}</ul>` : '<p><strong>Uploaded files:</strong> none provided</p>'}
      <p><strong>Suggested next questions</strong></p>
      <ul>${questions.map((q) => `<li>${q}</li>`).join('')}</ul>`,
    }),
  });
}
