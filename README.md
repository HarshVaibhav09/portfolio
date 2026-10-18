# Harsh Vaibhav: Portfolio

Personal site of Harsh Vaibhav, Full Stack + AI Engineer in Bengaluru. One page: projects with
the numbers behind them, skills, experience and a working contact form.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript (strict) · Tailwind CSS v4 ·
React Three Fiber · motion · zod · Resend · Upstash Ratelimit · deployed on Vercel

## Engineering notes

- **Content as data.** Every line of copy, project, metric and link comes from one typed module,
  `lib/content.ts`. Components contain no hardcoded text.
- **Contact form.** A Server Action that runs a honeypot check, the same zod schema the browser
  uses, an env check, then a sliding-window rate limit (3 per 10 minutes per IP) before sending.
  Every visitor value in the notification email is HTML-escaped, with a plain-text fallback.
  zod loads on demand, so it is not in the page's first-load JavaScript.
- **Background.** A single WebGL render loop over typed arrays allocated once, with no per-frame
  allocations and partial buffer uploads. It mounts after load on desktop and on the first
  interaction on phones, pauses in background tabs, and renders one static frame under
  reduced motion.
- **Theme.** Dark and light themes with no flash: an inline script sets the theme before first
  paint, and React reads it through `useSyncExternalStore`, so there is no hydration mismatch.
- **Accessibility.** Skip link, one h1, keyboard paths with focus management, live form feedback,
  reduced motion respected everywhere (including without JavaScript), and color contrast checked
  by sampling rendered pixels in both themes.
- **Performance.** The hero photo is the LCP element and is never animated in. Lighthouse
  (production build): Performance 92 mobile and 100 desktop; Accessibility, Best Practices and
  SEO 100.

## Run locally

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Environment variables

Create `.env.local` in the project root. The contact form needs the first four; without them it
shows a friendly "unavailable" message.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends the contact notification email |
| `CONTACT_TO_EMAIL` | Address that receives contact messages |
| `UPSTASH_REDIS_REST_URL` | Rate limiter storage |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiter storage |
| `NEXT_PUBLIC_SITE_URL` | Production URL for canonical links, social previews and the sitemap (set it in production) |
