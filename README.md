# Clarity Labs Website (Next.js + Tailwind)

Production-ready operator site focused on booked calls, lead capture, proof (case studies), and practical resources for service trades.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- ESLint + Prettier

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

## Environment variables
Set these in `.env.local` and in Vercel project settings.

### Site + booking
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL.
- `NEXT_PUBLIC_SITE_NAME` - Site display name.
- `NEXT_PUBLIC_SITE_EMAIL` - Primary contact email.
- `NEXT_PUBLIC_SITE_PHONE` - Optional phone/text line.
- `NEXT_PUBLIC_CALENDLY_URL` - Booking URL (used in CTA buttons and contact embed).

### Forms
- `NEXT_PUBLIC_AUDIT_FORM_URL` - Embedded audit request form (Tally or similar).
- `NEXT_PUBLIC_CONTACT_FORM_URL` - Embedded contact/resource capture form.

### Chat
- `NEXT_PUBLIC_CRISP_WEBSITE_ID` - Crisp website ID; chat loads only when set.

### Resources
- `NEXT_PUBLIC_RESOURCE_AR_URL` - Hosted file URL for AR Recovery Checklist.
- `NEXT_PUBLIC_RESOURCE_CASHFLOW_URL` - Hosted file URL for Cash-Flow Snapshot.

### Analytics
- `NEXT_PUBLIC_ANALYTICS_PROVIDER` - Optional analytics provider key.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Optional Plausible domain.

## How to enable integrations

### Calendly embed
1. Set `NEXT_PUBLIC_CALENDLY_URL`.
2. Confirm contact page shows embedded booking.
3. Validate all “Book a 15-min Clarity Call” CTAs open correctly.

### Forms (Tally)
1. Set `NEXT_PUBLIC_AUDIT_FORM_URL` and/or `NEXT_PUBLIC_CONTACT_FORM_URL`.
2. Confirm `/audit` and `/contact` form embeds render.
3. Confirm resources pages show form + download flow.

### Resources file hosting
1. Upload final PDFs (Vercel Blob, S3, or any static file host).
2. Set `NEXT_PUBLIC_RESOURCE_AR_URL` and `NEXT_PUBLIC_RESOURCE_CASHFLOW_URL`.
3. Confirm “Get the download” buttons open the files.

### Crisp chat
1. Set `NEXT_PUBLIC_CRISP_WEBSITE_ID`.
2. Load site and verify chat bubble appears.
3. Check `/contact` displays “Chat is available.”

## Operator checklist
- [ ] Set all env vars in Vercel.
- [ ] Test booking flow from home and contact pages.
- [ ] Test audit and contact forms submit correctly.
- [ ] Test resource download links and mailto fallback.
- [ ] Confirm mobile sticky CTA does not block content.

## Deploying on Vercel with GitLab
1. Push repo to GitLab.
2. In Vercel, **Add New Project** → **Import Git Repository**.
3. Connect GitLab account and select this repo.
4. Framework preset should auto-detect Next.js.
5. Add required env vars before deploy.
6. Deploy and verify routing + integrations.
