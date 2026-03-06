import 'server-only';

type EmailDeliveryResult =
  | { delivered: true; id?: string }
  | { delivered: false; skipped: 'no_email' | 'invalid_to' | 'missing_content' }
  | { delivered: false; error: string; status?: number; resendCode?: string };

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;

export const hasResend = Boolean(RESEND_API_KEY && EMAIL_FROM);

function escapeHtml(input: unknown): string {
  const value = typeof input === 'string' ? input : String(input ?? '');
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeRecipients(to: string | string[]) {
  const values = Array.isArray(to) ? to : [to];
  return values
    .map((entry) => (typeof entry === 'string' ? entry.trim().toLowerCase() : ''))
    .filter(Boolean);
}

function toAbsoluteUrl(url: string) {
  const value = url.trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return '';
}

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}): Promise<EmailDeliveryResult> {
  if (!hasResend) return { delivered: false, skipped: 'no_email' };

  const recipients = normalizeRecipients(to);
  if (!recipients.length) return { delivered: false, skipped: 'invalid_to' };

  const htmlBody = (html || '').trim();
  const textBody = (text || '').trim();
  if (!htmlBody && !textBody) {
    return { delivered: false, skipped: 'missing_content' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: recipients,
      reply_to: EMAIL_REPLY_TO || undefined,
      subject,
      html: htmlBody || undefined,
      text: textBody || undefined,
    }),
  });

  let payload: { id?: string; error?: { code?: string; message?: string } } | null = null;
  try {
    payload = (await response.json()) as { id?: string; error?: { code?: string; message?: string } };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const resendCode = payload?.error?.code;
    const resendMessage = payload?.error?.message || `Email send failed (${response.status})`;
    console.error('[email] resend send failed', {
      status: response.status,
      resendCode,
      resendMessage,
      recipientCount: recipients.length,
    });

    return {
      delivered: false,
      error: resendMessage,
      status: response.status,
      resendCode,
    };
  }

  return { delivered: true, id: payload?.id };
}

function formatDateTime(startTime?: string | null, timezone?: string | null) {
  if (!startTime) return 'Time pending';
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone || 'UTC',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export async function sendResourceEmail({
  to,
  name,
  resourceTitle,
  downloadUrl,
}: {
  to: string;
  name?: string;
  resourceTitle: string;
  downloadUrl?: string;
}) {
  const safeName = escapeHtml(name || '');
  const safeTitle = escapeHtml(resourceTitle);
  const safeDownloadUrl = toAbsoluteUrl(downloadUrl || '');

  if (!safeDownloadUrl) {
    return { delivered: false, skipped: 'missing_content' as const };
  }

  const greeting = safeName ? `Hi ${safeName},` : 'Hi there,';

  return sendEmail({
    to,
    subject: `${resourceTitle} — download link`,
    text: `${greeting}\n\nThanks for requesting ${resourceTitle}.\nDownload your resource: ${safeDownloadUrl}\n\nNo pitch. Just clarity.`,
    html: `<p>${greeting}</p><p>Thanks for requesting <strong>${safeTitle}</strong>.</p><p><a href="${safeDownloadUrl}">Download your resource</a></p><p>No pitch • Just clarity.</p><p style="font-size:12px;color:#555;">Not accounting or legal advice; operational guidance.</p>`,
  });
}

export async function sendClientUploadNotification(params: {
  clientEmail: string;
  filename: string;
  clientId: string;
}) {
  const owner = process.env.OWNER_EMAIL;
  if (!owner) return { delivered: false as const, skipped: 'invalid_to' as const };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const safeClientEmail = escapeHtml(params.clientEmail);
  const safeFilename = escapeHtml(params.filename);
  const adminUrl = `${siteUrl}/admin/clients/${encodeURIComponent(params.clientId)}`;

  return sendEmail({
    to: owner,
    subject: `Client upload: ${params.clientEmail} — ${params.filename}`,
    text: `A new client file was uploaded.\nClient: ${params.clientEmail}\nFile: ${params.filename}\nOpen client record: ${adminUrl}`,
    html: `<p>A new client file was uploaded.</p><ul><li>Client: ${safeClientEmail}</li><li>File: ${safeFilename}</li></ul><p><a href="${adminUrl}">Open client record</a></p>`,
  });
}

export async function sendReportReadyNotification(params: { to: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const reportUrl = `${siteUrl}/client/reports`;

  return sendEmail({
    to: params.to,
    subject: 'Your Clarity Report is ready',
    text: `Your Clarity report is now ready in your portal.\nView your report: ${reportUrl}\n\nNext step: book your review call.`,
    html: `<p>Your Clarity report is now ready in your portal.</p><p><a href="${reportUrl}">View your report</a></p><p>Next step: book your review call.</p>`,
  });
}

export async function sendScanNotifications(params: {
  ownerEmail?: string;
  userEmail: string;
  name?: string;
  score: number;
  tier: string;
  qualified: boolean;
  primarySignal: string;
}) {
  const ownerEmail = params.ownerEmail || process.env.OWNER_EMAIL;
  const safeName = escapeHtml(params.name || 'Unknown');
  const safeUserEmail = escapeHtml(params.userEmail);
  const safeTier = escapeHtml(params.tier);
  const safePrimarySignal = escapeHtml(params.primarySignal);

  const ownerPromise = ownerEmail
    ? sendEmail({
        to: ownerEmail,
        subject: `New Clarity Scan: ${params.userEmail} (${params.tier})`,
        text: `New scan submission received.\nName: ${params.name || 'Unknown'}\nEmail: ${params.userEmail}\nScore: ${params.score}\nTier: ${params.tier}\nPrimary signal: ${params.primarySignal}\nQualified: ${params.qualified ? 'Yes' : 'No'}`,
        html: `<p>New scan submission received.</p><ul><li>Name: ${safeName}</li><li>Email: ${safeUserEmail}</li><li>Score: ${params.score}</li><li>Tier: ${safeTier}</li><li>Primary signal: ${safePrimarySignal}</li><li>Qualified: ${params.qualified ? 'Yes' : 'No'}</li></ul>`,
      })
    : Promise.resolve({ delivered: false as const, skipped: 'invalid_to' as const });

  const userPromise = sendEmail({
    to: params.userEmail,
    subject: 'Your Clarity Scan result',
    text: `Thanks for running the Clarity Scan.\nYour current result: ${params.tier} (score ${params.score}).\nPrimary signal: ${params.primarySignal}.\nWe will follow up with tailored next steps.`,
    html: `<p>Thanks for running the Clarity Scan.</p><p>Your current result: <strong>${safeTier}</strong> (score ${params.score}).</p><p>Primary signal: ${safePrimarySignal}.</p><p>We will follow up with tailored next steps.</p>`,
  });

  const [owner, user] = await Promise.all([ownerPromise, userPromise]);
  return { owner, user };
}

export async function sendOwnerBookedBrief(params: {
  booking: {
    bookingId: string;
    email: string;
    inviteeName?: string;
    company?: string;
    startTime?: string | null;
    endTime?: string | null;
    timezone?: string | null;
    source?: string;
    diagnosticId?: string;
  };
  diagnosticSummary: {
    score?: number;
    tier?: string;
    primarySignal?: string;
    keyAnswers: string[];
    insights: string[];
  };
}) {
  const owner = process.env.OWNER_EMAIL;
  if (!owner || !hasResend) return { delivered: false as const, skipped: 'no_email' as const };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const diagnosticsTableUrl = process.env.AIRTABLE_DIAGNOSTICS_TABLE_URL;
  const bookingsTableUrl = process.env.AIRTABLE_BOOKINGS_TABLE_URL;
  const adminDiagnosticLink = params.booking.diagnosticId
    ? `${siteUrl}/admin/diagnostics/${params.booking.diagnosticId}`
    : undefined;
  const diagnosticsAirtableLink = params.booking.diagnosticId
    ? diagnosticsTableUrl
      ? `${diagnosticsTableUrl}${diagnosticsTableUrl.includes('?') ? '&' : '?'}recordId=${params.booking.diagnosticId}`
      : undefined
    : undefined;
  const bookingsAirtableLink = bookingsTableUrl
    ? `${bookingsTableUrl}${bookingsTableUrl.includes('?') ? '&' : '?'}booking_id=${encodeURIComponent(params.booking.bookingId)}`
    : undefined;

  const keyAnswers = params.diagnosticSummary.keyAnswers
    .map((answer) => `<li>${escapeHtml(answer)}</li>`)
    .join('');
  const insights = params.diagnosticSummary.insights
    .map((insight) => `<li>${escapeHtml(insight)}</li>`)
    .join('');

  return sendEmail({
    to: owner,
    subject: `Booked call: ${params.booking.email}`,
    text: `New booked call received.\nName: ${params.booking.inviteeName || 'Unknown'}\nEmail: ${params.booking.email}\nCompany: ${params.booking.company || 'Unknown'}\nBooking time: ${formatDateTime(params.booking.startTime, params.booking.timezone)} (${params.booking.timezone || 'timezone not set'})\nSource: ${params.booking.source || 'direct'}\nScore/Tier/Signal: ${params.diagnosticSummary.score ?? 'n/a'} / ${params.diagnosticSummary.tier || 'n/a'} / ${params.diagnosticSummary.primarySignal || 'n/a'}`,
    html: `<p>New booked call received.</p>
    <ul>
      <li>Name: ${escapeHtml(params.booking.inviteeName || 'Unknown')}</li>
      <li>Email: ${escapeHtml(params.booking.email)}</li>
      <li>Company: ${escapeHtml(params.booking.company || 'Unknown')}</li>
      <li>Booking time: ${escapeHtml(formatDateTime(params.booking.startTime, params.booking.timezone))} (${escapeHtml(params.booking.timezone || 'timezone not set')})</li>
      <li>Source: ${escapeHtml(params.booking.source || 'direct')}</li>
      <li>Score/Tier/Signal: ${escapeHtml(String(params.diagnosticSummary.score ?? 'n/a'))} / ${escapeHtml(params.diagnosticSummary.tier || 'n/a')} / ${escapeHtml(params.diagnosticSummary.primarySignal || 'n/a')}</li>
    </ul>
    <p><strong>Key answers</strong></p>
    <ul>${keyAnswers}</ul>
    <p><strong>Derived insights</strong></p>
    <ul>${insights}</ul>
    <p>${adminDiagnosticLink ? `<a href="${adminDiagnosticLink}">Open admin diagnostic</a><br/>` : ''}
    ${diagnosticsAirtableLink ? `<a href="${diagnosticsAirtableLink}">Open Airtable diagnostic record</a><br/>` : ''}
    ${bookingsAirtableLink ? `<a href="${bookingsAirtableLink}">Open Airtable bookings view</a>` : ''}</p>`,
  });
}

export async function sendClientBookedConfirm(params: {
  to: string;
  booking: {
    startTime?: string | null;
    endTime?: string | null;
    timezone?: string | null;
  };
  portalUrl: string;
  prepUrl: string;
}) {
  if (!hasResend) return { delivered: false as const, skipped: 'no_email' as const };

  const scheduled = `${formatDateTime(params.booking.startTime, params.booking.timezone)} (${params.booking.timezone || 'timezone pending'})`;

  return sendEmail({
    to: params.to,
    subject: `You're booked — Clarity Call confirmation`,
    text: `You're booked. Your Clarity Call is confirmed.\nScheduled: ${scheduled}\n\nBefore we meet, please complete a short prep checklist:\n- Your top 2–3 bottlenecks from the last 30 days\n- Current cash/capacity/system pressure points\n- Any KPI snapshot or workflow report you already use\n\nPrep for your call: ${params.prepUrl}\nOpen your client portal: ${params.portalUrl}`,
    html: `<p>You’re booked. Your Clarity Call is confirmed.</p>
    <p><strong>Scheduled:</strong> ${escapeHtml(scheduled)}</p>
    <p>Before we meet, please complete a short prep checklist:</p>
    <ul>
      <li>Your top 2–3 bottlenecks from the last 30 days</li>
      <li>Current cash/capacity/system pressure points</li>
      <li>Any KPI snapshot or workflow report you already use</li>
    </ul>
    <p><a href="${escapeHtml(params.prepUrl)}">Prep for your call</a></p>
    <p><a href="${escapeHtml(params.portalUrl)}">Open your client portal</a></p>`,
  });
}

export { escapeHtml, sendEmail };
export type { EmailDeliveryResult };
