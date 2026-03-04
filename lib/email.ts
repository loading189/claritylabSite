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
  if (!hasResend) return { delivered: false };

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
