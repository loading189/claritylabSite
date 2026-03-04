# Clarity Labs Site

Next.js 14 App Router site for Clarity Labs.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in public values (`NEXT_PUBLIC_*`) for site, booking, forms, resources, analytics, and upload-link UX.
3. Fill in private values for Airtable, Resend, newsletter, health checks, and diagnostic tokens in Vercel project settings.
4. Use Node.js **20.x LTS** (recommended for parity with Vercel builds).

## Font strategy (build-safe)

This project no longer fetches remote fonts at build time. It uses a premium system font stack via CSS variables in `app/globals.css`.

- Sans: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, ...`
- Display: `Avenir Next, Avenir, Segoe UI, Inter, ...`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, ...`

If you want self-hosted fonts later:

1. Add `.woff2` files under `public/fonts/`.
2. Switch `app/layout.tsx` to `next/font/local` with the same CSS variables (`--font-sans`, `--font-display`, `--font-mono`).
3. Keep `tailwind.config.ts` font family entries unchanged.

## Integrations

All integrations are configured through `content/runtime.ts` and server env vars.

- **Calendly**: booking CTA/embed when `NEXT_PUBLIC_CALENDLY_URL` is set.
- **Embedded forms (Tally or equivalent)**: contact/audit embeds use `NEXT_PUBLIC_CONTACT_FORM_URL` and `NEXT_PUBLIC_AUDIT_FORM_URL`.
- **Crisp chat**: client chat widget enabled by `NEXT_PUBLIC_CRISP_WEBSITE_ID`.
- **Airtable writes**: lead + intake persistence via `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, table vars.
- **Resend emails**: resource delivery and intake notifications use `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`.
- **Newsletter webhook**: optional provider sync via `NEWSLETTER_PROVIDER`, `NEWSLETTER_ENDPOINT_URL`, `NEWSLETTER_API_KEY`, `NEWSLETTER_LIST_ID`.
- **Analytics**: Plausible enabled when `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- **Upload link**: audit intake upload UX uses `NEXT_PUBLIC_INTAKE_UPLOAD_URL`.
- **Sentry (env-gated)**: enabled only when `NEXT_PUBLIC_SENTRY_DSN` is set. Optional source-map upload vars: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
- **Health checks**: `/api/health` shallow check; `/api/health?deep=1&token=...` runs minimal live checks when `HEALTH_TOKEN` is configured.
- **Developer diagnostics**: `/dev/status` is available in development or when `ADMIN_DIAGNOSTIC_TOKEN` is provided as `?token=...`.

## Production checklist (Vercel)

- Set required env vars in Vercel (Production + Preview where needed).
- Deploy and verify `/api/health` returns expected statuses.
- Verify booking CTA and contact + intake forms submit correctly.
- Verify resource request sends delivery email.
- Verify Airtable lead/intake rows are created.
- Verify Crisp widget loads when enabled.
- Verify analytics events fire (`booking_click`, `contact_submit`, `audit_submit`, `resource_request_submit`, `intake_submit`).
- Verify Sentry captures a deliberate test error via `/api/dev/sentry-test` (dev/token-gated).

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
