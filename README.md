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

## How to publish an insight

1. Copy `content/templates/insight-template.mdx` to `content/insights/<your-slug>.mdx`.
2. Update frontmatter (`title`, `description`, `date`, `tags`, `published`, `type`, `cta`).
3. Write the content in plain Markdown + optional helper blocks (`<Callout />`, `<Stat />`, `<Table />`, `<MiniCTA />`).
4. Add practical operator-focused tags (for filtering and related posts).
5. Set `published: true` when ready to go live.
6. Commit and push to GitLab. Vercel deploys automatically.
