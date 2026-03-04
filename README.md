# Clarity Labs Site

Next.js 14 App Router site for Clarity Labs.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in public values (`NEXT_PUBLIC_*`) for site, booking, forms, resources, analytics, and upload-link UX.
3. Fill in private values for Airtable, Resend, and intake token in Vercel project settings.

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

## Verification checklist

- Submit call intake and verify Airtable `Intakes` + `Leads` updates.
- Submit audit intake with valid token and verify success.
- Submit audit intake without token and verify rejection.
- Verify both emails send: client confirmation + owner pre-call brief.
- Verify upload-link workflow: URL is shown in audit intake and stored links are saved.
- Verify success page copy changes by tier (Hot/Warm vs Cold).
- Verify analytics events fire: `onboarding_view`, `intake_view`, `intake_submit`, `intake_upload`, `intake_cta_click`.

## Notes

- Secrets (`AIRTABLE_API_KEY`, `RESEND_API_KEY`, `NEWSLETTER_API_KEY`, `INTAKE_TOKEN`) are server-only.
- Lead/intake capture uses in-memory rate limiting + honeypot protection.
- If Airtable or Resend is not configured, graceful fallbacks still prevent hard crashes.

## How to publish an insight

1. Copy `content/templates/insight-template.mdx` to `content/insights/<your-slug>.mdx`.
2. Update frontmatter (`title`, `description`, `date`, `tags`, `published`, `type`, `cta`).
3. Write the content in plain Markdown + optional helper blocks (`<Callout />`, `<Stat />`, `<Table />`, `<MiniCTA />`).
4. Add practical operator-focused tags (for filtering and related posts).
5. Set `published: true` when ready to go live.
6. Commit and push to GitLab. Vercel deploys automatically.
