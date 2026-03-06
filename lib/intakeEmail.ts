import 'server-only';

import {
  escapeHtml,
  hasResend,
  sendEmail,
  type EmailDeliveryResult,
} from './email';
import { IntakePayload, IntakeType, QualificationTier } from './intake';
import { siteConfig } from '@/content/site';

const INTAKE_OWNER_EMAIL = process.env.INTAKE_OWNER_EMAIL || siteConfig.email;

function nextQuestions(pain: string) {
  const map: Record<string, string[]> = {
    ar_cashflow: [
      'What is your current DSO?',
      'Which customers are 60+ days late?',
      'What collection cadence do you currently run?',
    ],
    scheduling: [
      'Where do schedule gaps show up most often?',
      'What percent of jobs run late?',
      'Who owns dispatch quality control?',
    ],
    invoicing: [
      'How long from job complete to invoice sent?',
      'Do techs close jobs with complete notes?',
      'What percent of invoices are disputed?',
    ],
    tech_productivity: [
      'What is your billable hour target?',
      'Where do callbacks cluster?',
      'How are you tracking tech utilization today?',
    ],
    workflow_gaps: [
      'Which handoff breaks most often?',
      'What is undocumented and tribal?',
      'Where is the owner still the bottleneck?',
    ],
    other: [
      'What outcome would make this engagement a win in 90 days?',
      'What constraints matter most?',
      'What has already been tried?',
    ],
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
}): Promise<{ client: EmailDeliveryResult; owner: EmailDeliveryResult } | undefined> {
  if (!hasResend) return undefined;

  const bookingLink = siteConfig.calendlyUrl || `${siteConfig.url}/contact`;
  const bookingLine = siteConfig.calendlyUrl
    ? `If you still need a time, book here: ${bookingLink}`
    : 'If you still need a time, reply to this email and we will coordinate directly.';

  const clientSubject =
    tier === 'Hot' ? 'You’re booked for clarity' : 'Next steps for your Clarity Call';
  const email = (payload.email || '').trim().toLowerCase();
  const name = payload.name || 'there';

  const prepItems = [
    'Bring your top 2-3 bottlenecks from the last 30 days.',
    'Share your current workflow or dispatch/invoice flow at a high level.',
    'For audits: prepare AR aging, P&L, and 3 months of transaction exports if possible.',
  ];

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(payload.company || 'Unknown');

  const clientPromise = sendEmail({
    to: email,
    subject: clientSubject,
    text: `Hi ${name},\n\nThanks for completing the ${
      intakeType === 'audit' ? 'Audit' : 'Clarity Call'
    } intake.\n\nWhat to prepare:\n- ${prepItems.join('\n- ')}\n\n${bookingLine}`,
    html: `<p>Hi ${safeName},</p>
      <p>Thanks for completing the ${
        intakeType === 'audit' ? 'Audit' : 'Clarity Call'
      } intake.</p>
      <p><strong>What to prepare:</strong></p>
      <ul>${prepItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <p>${
        siteConfig.calendlyUrl
          ? `If you still need a time, book here: <a href="${bookingLink}">${escapeHtml(
              bookingLink,
            )}</a>`
          : 'If you still need a time, reply to this email and we will coordinate directly.'
      }</p>
      <p>Direct line: <a href="mailto:${siteConfig.email}">${escapeHtml(
      siteConfig.email,
    )}</a>${
      siteConfig.phone
        ? ` • <a href="tel:${siteConfig.phone}">${escapeHtml(siteConfig.phone)}</a>`
        : ''
    }</p>
      <p>No pitch • Just clarity.</p>
      <p style="font-size:12px;color:#555;">Operational guidance only. Not legal, tax, or accounting advice.</p>`,
  });

  const ownerSubject = `${tier === 'Hot' ? 'PRIORITY: ' : ''}New Clarity Intake: ${payload.company} (${tier})`;
  const questions = nextQuestions(payload.biggest_pain || 'other');
  const uploads = (payload.uploaded_files || [])
    .map((url) => `<li><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></li>`)
    .join('');

  const ownerPromise = sendEmail({
    to: INTAKE_OWNER_EMAIL,
    subject: ownerSubject,
    text: `Company: ${payload.company}\nName: ${name} (${email})\nType: ${intakeType}\nPain area: ${
      payload.biggest_pain
    }\nQualification: ${score}/100 (${tier})\nUrgency: ${
      payload.urgency || 'n/a'
    } | Decision maker: ${payload.decision_maker || 'n/a'}\nProblem: ${
      payload.problem_description || 'n/a'
    }${recordUrl ? `\nOpen Airtable record: ${recordUrl}` : ''}`,
    html: `<p><strong>Company:</strong> ${safeCompany}</p>
      <p><strong>Name:</strong> ${safeName} (${safeEmail})</p>
      <p><strong>Type:</strong> ${escapeHtml(intakeType)}</p>
      <p><strong>Pain area:</strong> ${escapeHtml(payload.biggest_pain || 'n/a')}</p>
      <p><strong>Qualification:</strong> ${score}/100 (${escapeHtml(tier)})</p>
      <p><strong>Urgency:</strong> ${escapeHtml(payload.urgency || 'n/a')} | <strong>Decision maker:</strong> ${escapeHtml(payload.decision_maker || 'n/a')}</p>
      <p><strong>Problem:</strong> ${escapeHtml(payload.problem_description || 'n/a')}</p>
      ${recordUrl ? `<p><a href="${escapeHtml(recordUrl)}">Open Airtable record</a></p>` : ''}
      ${
        uploads
          ? `<p><strong>Uploaded files:</strong></p><ul>${uploads}</ul>`
          : '<p><strong>Uploaded files:</strong> none provided</p>'
      }
      <p><strong>Suggested next questions</strong></p>
      <ul>${questions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>`,
  });

  const [client, owner] = await Promise.all([clientPromise, ownerPromise]);
  return { client, owner };
}
