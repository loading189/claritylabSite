# Clarity Labs Site

Next.js 14 App Router site for Clarity Labs.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in public values (`NEXT_PUBLIC_*`) for site, booking, forms, resources, and analytics.
3. Fill in private values for Airtable, Resend, and newsletter provider in Vercel project settings.

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

curl -X POST http://localhost:3000/api/resources/request \
  -H 'Content-Type: application/json' \
  -d '{"resource_slug":"ar-recovery-checklist","email":"owner@example.com","name":"Owner","website":""}'

curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"owner@example.com","name":"Owner","website":""}'
```

## Notes

- Secrets (`AIRTABLE_API_KEY`, `RESEND_API_KEY`, `NEWSLETTER_API_KEY`) are server-only and never exposed to the browser.
- Lead capture uses lightweight in-memory rate limiting + honeypot protection.
- If Airtable or Resend is not configured, endpoints still return graceful success and fallback messaging.
