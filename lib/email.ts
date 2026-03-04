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
