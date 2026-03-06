import 'server-only';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;

export const hasResend = Boolean(RESEND_API_KEY && EMAIL_FROM);

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
  if (!hasResend || !downloadUrl) {
    return { delivered: false };
  }

  const greeting = name ? `Hi ${name},` : 'Hi there,';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      reply_to: EMAIL_REPLY_TO,
      subject: `${resourceTitle} — download link`,
      html: `<p>${greeting}</p><p>Thanks for requesting <strong>${resourceTitle}</strong>.</p><p><a href="${downloadUrl}">Download your resource</a></p><p>No pitch • Just clarity.</p><p style="font-size:12px;color:#555;">Not accounting or legal advice; operational guidance.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error('Email send failed.');
  }

  return { delivered: true };
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!hasResend) return { delivered: false, skipped: 'no_email' as const };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      reply_to: EMAIL_REPLY_TO,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error('Email send failed.');
  }

  return { delivered: true };
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

export async function sendClientUploadNotification(params: { clientEmail: string; filename: string; clientId: string }) {
  const owner = process.env.OWNER_EMAIL;
  if (!owner) return { delivered: false };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return sendEmail({
    to: owner,
    subject: `Client upload: ${params.clientEmail} — ${params.filename}`,
    html: `<p>A new client file was uploaded.</p><ul><li>Client: ${params.clientEmail}</li><li>File: ${params.filename}</li></ul><p><a href="${siteUrl}/admin/clients/${params.clientId}">Open client record</a></p>`,
  });
}

export async function sendReportReadyNotification(params: { to: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return sendEmail({
    to: params.to,
    subject: 'Your Clarity Report is ready',
    html: `<p>Your Clarity report is now ready in your portal.</p><p><a href="${siteUrl}/client/reports">View your report</a></p><p>Next step: book your review call.</p>`,
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

  const ownerPromise = ownerEmail
    ? sendEmail({
        to: ownerEmail,
        subject: `New Clarity Scan: ${params.userEmail} (${params.tier})`,
        html: `<p>New scan submission received.</p><ul><li>Name: ${params.name || 'Unknown'}</li><li>Email: ${params.userEmail}</li><li>Score: ${params.score}</li><li>Tier: ${params.tier}</li><li>Primary signal: ${params.primarySignal}</li><li>Qualified: ${params.qualified ? 'Yes' : 'No'}</li></ul>`,
      })
    : Promise.resolve({ delivered: false });

  const userPromise = sendEmail({
    to: params.userEmail,
    subject: 'Your Clarity Scan result',
    html: `<p>Thanks for running the Clarity Scan.</p><p>Your current result: <strong>${params.tier}</strong> (score ${params.score}).</p><p>Primary signal: ${params.primarySignal}.</p><p>We will follow up with tailored next steps.</p>`,
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
  if (!owner || !hasResend) return { ok: true as const, skipped: 'no_email' as const };

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

  return sendEmail({
    to: owner,
    subject: `Booked call: ${params.booking.email}`,
    html: `<p>New booked call received.</p>
    <ul>
      <li>Name: ${params.booking.inviteeName || 'Unknown'}</li>
      <li>Email: ${params.booking.email}</li>
      <li>Company: ${params.booking.company || 'Unknown'}</li>
      <li>Booking time: ${formatDateTime(params.booking.startTime, params.booking.timezone)} (${params.booking.timezone || 'timezone not set'})</li>
      <li>Source: ${params.booking.source || 'direct'}</li>
      <li>Score/Tier/Signal: ${params.diagnosticSummary.score ?? 'n/a'} / ${params.diagnosticSummary.tier || 'n/a'} / ${params.diagnosticSummary.primarySignal || 'n/a'}</li>
    </ul>
    <p><strong>Key answers</strong></p>
    <ul>${params.diagnosticSummary.keyAnswers.map((answer) => `<li>${answer}</li>`).join('')}</ul>
    <p><strong>Derived insights</strong></p>
    <ul>${params.diagnosticSummary.insights.map((insight) => `<li>${insight}</li>`).join('')}</ul>
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
  if (!hasResend) return { ok: true as const, skipped: 'no_email' as const };

  return sendEmail({
    to: params.to,
    subject: `You're booked — Clarity Call confirmation`,
    html: `<p>You’re booked. Your Clarity Call is confirmed.</p>
    <p><strong>Scheduled:</strong> ${formatDateTime(params.booking.startTime, params.booking.timezone)} (${params.booking.timezone || 'timezone pending'})</p>
    <p>Before we meet, please complete a short prep checklist:</p>
    <ul>
      <li>Your top 2–3 bottlenecks from the last 30 days</li>
      <li>Current cash/capacity/system pressure points</li>
      <li>Any KPI snapshot or workflow report you already use</li>
    </ul>
    <p><a href="${params.prepUrl}">Prep for your call</a></p>
    <p><a href="${params.portalUrl}">Open your client portal</a></p>`,
  });
}
