# Clarity Labs Website (Next.js + Tailwind)

Production-ready marketing site focused on credibility and booked conversations for Clarity Labs.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (local build)
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
Set these in `.env.local` and in Vercel project settings:
- `CALENDLY_URL` - Booking link for primary CTA.
- `SITE_EMAIL` - Contact email shown in CTA and footer.
- `SITE_PHONE` - Contact phone/text line.
- `NEXT_PUBLIC_ANALYTICS_PROVIDER` - Optional placeholder hook (`plausible`, `posthog`, etc.) for later vendor script integration.

## Content updates
Single source of truth lives in:
- `content/site.ts`

Update navigation, messaging, cards, problem lists, CTAs, and insight post summaries there.

## Deploying on Vercel with GitLab
1. Push repo to GitLab.
2. In Vercel, **Add New Project** → **Import Git Repository**.
3. Connect GitLab account and select this repo.
4. Framework preset should auto-detect Next.js.
5. Add required env vars (`CALENDLY_URL`, `SITE_EMAIL`, `SITE_PHONE`).
6. Deploy.
7. Add custom domain in Vercel and configure DNS records at your registrar.

## Launch checklist
- [ ] Buy/confirm final domain.
- [ ] Connect DNS in Vercel and verify SSL.
- [ ] Set production `CALENDLY_URL`.
- [ ] Set production contact email/phone.
- [ ] Decide analytics provider and wire vendor script.
- [ ] Add 2–3 real testimonials.
- [ ] Add downloadable PDF sample later (optional).
