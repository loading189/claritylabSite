# Clarity Labs Site

Next.js 14 App Router site for Clarity Labs.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in public values (`NEXT_PUBLIC_*`) for site, booking, forms, resources, analytics, and upload-link UX.
3. Fill in private values for Airtable, Resend, newsletter, monitoring, and intake token in Vercel project settings.

## Microservices & integrations

All integrations are configured through `content/runtime.ts` and server env vars.

- **Calendly**: booking CTA/embed when `NEXT_PUBLIC_CALENDLY_URL` is set.
- **Embedded forms (Tally or equivalent)**: contact/audit embeds use `NEXT_PUBLIC_CONTACT_FORM_URL` and `NEXT_PUBLIC_AUDIT_FORM_URL`.
- **Crisp chat**: client chat widget enabled by `NEXT_PUBLIC_CRISP_WEBSITE_ID`.
- **Airtable writes**: lead + intake persistence via `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, table vars.
- **Resend emails**: resource delivery and intake notifications use `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`.
- **Newsletter webhook**: optional provider sync via `NEWSLETTER_PROVIDER`, `NEWSLETTER_ENDPOINT_URL`, `NEWSLETTER_API_KEY`, `NEWSLETTER_LIST_ID`.
- **Analytics**: Plausible enabled when `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- **Upload link**: audit intake upload UX uses `NEXT_PUBLIC_INTAKE_UPLOAD_URL`.
- **Sentry (env-gated)**: client DSN `NEXT_PUBLIC_SENTRY_DSN`, server DSN `SENTRY_DSN`.
- **Developer diagnostics**: `/dev/status` is available in development or when `ADMIN_DIAGNOSTIC_TOKEN` is provided as `?token=...`.

## Go-live checklist

- Set all required env vars in Vercel.
- Test booking CTA + Calendly embed.
- Test contact form submit + audit form submit.
- Test resource request email delivery.
- Test intake submit and upload-link flow.
- Test analytics events (`booking_click`, `contact_submit`, `audit_submit`, `resource_request_submit`, `intake_submit`).
- Test error monitoring DSNs (client/server).
- Open `/dev/status` and confirm no expected integration is disabled.

## Intake onboarding system

### Routes

- `/onboarding`
- `/intake/call`
- `/intake/audit?t=INTAKE_TOKEN`
- `/intake/success?intake_type=call&tier=Hot`

### Generate intake links

- Audit intake invite link format: `/intake/audit?t=INTAKE_TOKEN`
- Share token privately only.
- If token is missing or invalid, users are routed to a friendly error state and directed to `/contact`.

### Required env vars (Vercel)

- `INTAKE_TOKEN` (server-only)
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_INTAKES_TABLE` (default: `Intakes`)
- `AIRTABLE_TABLE_NAME` (default: `Leads`)
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `INTAKE_OWNER_EMAIL` (optional; defaults to site email)
- `NEXT_PUBLIC_INTAKE_UPLOAD_URL` (optional secure upload form/folder link)

Optional helper:

- `AIRTABLE_INTAKES_TABLE_URL` for generating direct Airtable record links in owner pre-call brief emails.

## Local dev

```bash
npm install
npm run dev
```

## API smoke tests (curl)

```bash
curl -X POST http://localhost:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"source":"contact_form","email":"owner@example.com","name":"Owner","message":"Need operational clarity","website":""}'

curl -X POST http://localhost:3000/api/intake/call \
  -H 'Content-Type: application/json' \
  -d '{"name":"Owner","email":"owner@example.com","company":"Demo HVAC","consent":true,"problem_description":"AR is slow","current_tools":["QuickBooks"],"urgency":"this_month","decision_maker":"yes","website":""}'

curl -X POST http://localhost:3000/api/intake/audit \
  -H 'Content-Type: application/json' \
  -d '{"name":"Owner","email":"owner@example.com","company":"Demo HVAC","consent":true,"problem_description":"Workflow gaps","share_data":"yes","token":"INTAKE_TOKEN","website":""}'

curl -X POST http://localhost:3000/api/resources/request \
  -H 'Content-Type: application/json' \
  -d '{"resource_slug":"ar-recovery-checklist","email":"owner@example.com","name":"Owner","website":""}'
```
