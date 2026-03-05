# Clarity Labs Site

Next.js 14 App Router site for Clarity Labs.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in public values (`NEXT_PUBLIC_*`) for site, booking, forms, resources, analytics, and upload-link UX.
3. Fill in private values for Airtable, Resend, newsletter, health checks, and diagnostic tokens in Vercel project settings.
4. Use Node.js **20.x LTS** (recommended for parity with Vercel builds).

## Clerk setup

1. In `.env.local` (and in Vercel project env vars), set:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/client`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/client`
   - `OWNER_EMAIL` (optional fallback admin check)
2. In the Clerk dashboard, add these redirect URLs for local development:
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
   - `http://localhost:3000/client`
3. To grant admin access, set user public metadata in Clerk to:
   - `{"role":"admin"}`

## Font strategy (build-safe)

This project no longer fetches remote fonts at build time. It uses a premium system font stack via CSS variables in `app/globals.css`.

- Sans: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, ...`
- Display: `Avenir Next, Avenir, Segoe UI, Inter, ...`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, ...`

If you want self-hosted fonts later:

1. Add `.woff2` files under `public/fonts/`.
2. Switch `app/layout.tsx` to `next/font/local` with the same CSS variables (`--font-sans`, `--font-display`, `--font-mono`).
3. Keep `tailwind.config.ts` font family entries unchanged.

## Marketing Architecture

- **Marketing routes** live under `app/(marketing)` so public URLs stay unchanged while marketing code is grouped separately (`/`, `/audit`, `/sample-report`, `/insights`, `/contact`, `/thanks`, `/work-with-me`, `/case-studies/[slug]`).
- **Reusable marketing UI components** live in `components/marketing` (hero, section headers, process/problem/findings blocks, featured insights, and standardized CTA blocks).
- **CSS Modules vs Tailwind utilities**:
  - Use page-level CSS Modules for page-specific layout composition, section dividers, background treatments, and spacing that repeats inside a page.
  - Use Tailwind utility classes for semantic typography, responsive behavior, and one-off visual tweaks inside component markup.
  - Keep color, spacing, and shadows aligned to design tokens in `app/globals.css` and Tailwind theme keys.
- **Naming conventions**:
  - Page files: `app/(marketing)/<route>/page.tsx` + `page.module.css`.
  - Components: `components/marketing/<PascalCase>.tsx` with explicit, purpose-based names (`ProcessSteps`, `NextStepCTA`, etc.).
  - CSS module classes should describe layout intent (`heroContainer`, `gridTwo`, `ctaSection`) not visual trivia.
- **Avoiding duplication**:
  - Reuse `MarketingHero` for top-of-page hero blocks with standardized CTA labels.
  - Reuse `NextStepCTA` + `CalloutCTA` for end-of-page conversion blocks instead of ad-hoc button groups.
  - Reuse `ProblemGrid`, `ProcessSteps`, `FindingsStrip`, and `FeaturedInsights` before introducing new repeated markup.
  - Keep marketing-only refactors scoped to `app/(marketing)` and `components/marketing` unless shared primitives truly need changes.

## Clarity Scan (Lead Screening)

- Public route: `/scan` (interactive 6-step diagnostic).
- Submission endpoint: `POST /api/scan/submit`.
- Persistence is enabled when Airtable core vars + `AIRTABLE_DIAGNOSTICS_TABLE` are set.
- Email delivery is enabled when Resend vars are set (`RESEND_API_KEY`, `EMAIL_FROM`).
- Owner alerts use `DIAGNOSTIC_OWNER_EMAIL` with fallback to `OWNER_EMAIL` then `INTAKE_OWNER_EMAIL`.
- If Airtable/Resend are not configured, submissions still return success and the flow stays available (`manual_delivery` fallback).

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

## Formatting (scoped)

Formatting commands intentionally target active application surfaces only so legacy formatting outside these directories does not block checks.

```bash
npm run format
npm run format:check
```

Scope includes:

- `app/**/*.{ts,tsx,css,md,mdx}`
- `components/**/*.{ts,tsx,css,md,mdx}`
- `content/**/*.{ts,tsx,md,mdx,json}`
- `lib/**/*.{ts,tsx}`
- `middleware.ts`
- `tailwind.config.*`, `next.config.*`, `postcss.config.*`
- `README.md`, `.env.example`, `.eslintrc.json`, `.prettierrc`

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

## Client Vault v1

### Invite and access model

- Vault routes are `/client/*` and `/admin/*`.
- v1 is invite-only via Clerk dashboard invites (admin workflow note included in `/admin/clients`).
- Admin access is determined by Clerk `publicMetadata.role === "admin"`, with `OWNER_EMAIL` as an optional fallback.

### Upload and report flow

1. Client uploads a file from `/client/files`.
2. App requests a short-lived upload URL from `/api/client/files/presign-upload`.
3. Browser uploads directly to the signed endpoint.
4. App records metadata in Airtable via `/api/client/files/record`.
5. Owner receives email notification.
6. Admin uploads reports in `/admin/clients/[clientId]/upload-report`; client gets notified and downloads from `/client/reports`.

### Storage and security model

- Files are private and served via short-lived signed URLs (`FILE_URL_TTL_SECONDS`, default 900s).
- v1 runtime uses a local signed blob handler (`/api/client/files/blob`) so you can keep private access semantics without a custom file server.
- S3/R2 env vars are included for direct provider migration.

### Airtable schema (required)

- `Files`: `client_id`, `client_email`, `uploader_role`, `uploader_user_id`, `category`, `filename`, `storage_key`, `mime_type`, `size_bytes`, `created_at`, `note`.
- `Clients`: `client_id`, `company`, `primary_email`, `status`, `created_at`.

### QA checklist (20 min)

- Admin sign-in and load `/admin/clients`.
- Create or invite test client in auth provider.
- Client uploads file, verify owner email + admin listing.
- Admin uploads report, verify client email + `/client/reports` listing.
- Confirm client cannot download another client file.
- Confirm signed download URLs expire and regenerate.
- Verify reduced-motion preference disables heavy transforms/animations.
- Check `/dev/status` for auth/storage/files table/resend states.
