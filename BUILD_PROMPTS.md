# Portfolio build: fast track with Claude Code

## How to run every phase
1. `/clear` in Claude Code before starting a phase.
2. Paste the phase prompt. For phases 1, 3, 4, 5, 6 use plan mode (Shift+Tab) and approve
   the plan; for small phases you can use auto-accept edits.
3. Keep `npm run dev` running in a second terminal and check the result in the browser.
4. Read Claude's end-of-phase summary. If any bullet is unclear, ask "explain X simply".
5. `npm run build` passes, then commit with the message given.

Manual-only steps are marked **[YOU]**.

---

## Phase 1: Foundation (theme, background orbs, content)

**[YOU]** Photo at `public/images/harsh.jpg`, resume at `public/resume.pdf`.

```
Read CLAUDE.md and PORTFOLIO_FACTS.md. Phase 1: foundation.

1. Install lucide-react and react-icons.
2. app/globals.css: define every color token from CLAUDE.md for dark (default) and light,
   switched by data-theme on <html>. Expose them with Tailwind v4 @theme so I can use
   bg-bg, bg-bg-alt, bg-bg-raised, text-text, text-muted, text-accent, text-accent-2,
   border-border. Add --gradient-brand. Base styles: body background and text, smooth
   scrolling with scroll-padding-top for the fixed navbar, ::selection, a focus-visible
   ring in accent-2, and a prefers-reduced-motion block that disables animations.
3. app/layout.tsx: Geist Sans and Geist Mono via next/font, metadata (title
   "Harsh Vaibhav | Full Stack + AI Engineer", description from content), and a small
   inline script in <head> that reads the saved theme from localStorage (inside try/catch)
   and sets data-theme before first paint so there is no theme flash.
   Add suppressHydrationWarning on <html>.
4. components/background/GradientOrbs.tsx exactly per the CLAUDE.md orb spec (CSS only,
   Server Component, aria-hidden, fixed behind content).
5. components/layout/ScrollProgress.tsx and BackToTop.tsx per CLAUDE.md (client
   components, passive scroll listeners, throttled with requestAnimationFrame).
6. components/ui/Section.tsx (props: id, label, title, description, children) and
   components/ui/Button.tsx (variants: gradient, outline, ghost; renders a link when
   href is given, external links get rel="noopener noreferrer").
7. lib/content.ts: TypeScript types (Profile, Stat, Project, Experience, SkillGroup,
   Achievement, SocialLink) and data copied exactly from PORTFOLIO_FACTS.md. Store skill
   and social icons as string keys, not components, so the data stays serializable.
8. app/page.tsx: render GradientOrbs, ScrollProgress, BackToTop, and placeholder
   Sections with ids home, about, work, skills, experience, contact.

Run npm run build, fix any errors, then give me the summary.
```
Commit: `feat: design tokens, theme, background orbs and content model`

---

## Phase 2: Navbar and theme toggle

```
Read CLAUDE.md. Phase 2: build the Navbar and ThemeToggle exactly per the "Navbar" spec
in CLAUDE.md.

- Links come from content.ts; icons from lucide-react.
- Active link highlights the section in view (IntersectionObserver, rootMargin tuned
  for the fixed navbar).
- ThemeToggle flips data-theme on <html>, saves to localStorage in try/catch, and has
  an accessible label that says which theme it switches to.
- Mobile menu: aria-expanded, aria-controls, closes on Esc, on link click and on outside
  click, returns focus to the hamburger, locks body scroll while open.
- Logo "HV" scrolls to top.
Mount Navbar in app/layout.tsx. Run npm run build and summarize.
```
**[YOU]** Test at 375px width (DevTools device mode) and with keyboard only (Tab, Enter, Esc).

Commit: `feat: navbar with active section, theme toggle and mobile menu`

---

## Phase 3: Particle constellation background (the 3D)

```
Read CLAUDE.md. Phase 3: the full-page particle constellation.

Create components/three/NeuralField.tsx and components/background/BackgroundCanvas.tsx.

NeuralField requirements:
- Allocate Float32Array positions, velocities, line positions and line colors once in
  useMemo. Mutate them inside useFrame. Never use React state for animation.
- About 120 particles on desktop, 50 on mobile (max-width 768px).
- Particles drift slowly, bounce at the visible viewport bounds (use useThree viewport),
  and are pushed away from the cursor within a radius, with force growing as distance
  shrinks. Clamp delta so a background tab does not cause a jump.
- Draw a line between any two particles closer than a link distance; line brightness
  fades with distance. Use setDrawRange and needsUpdate on the changed attributes.
- Colors: particles alternate between accent (#FF8E53) and accent-2 (#00D4FF).
  Dark theme: AdditiveBlending. Light theme: NormalBlending with the darker light-mode
  accents and lower opacity, because additive blending is invisible on white.
  React to theme changes with a MutationObserver on <html> data-theme.

BackgroundCanvas requirements:
- Client component, fixed full viewport, behind content, aria-hidden, pointer-events none.
- R3F Canvas with dpr [1, 2] (max 1.5 on mobile), alpha true, eventSource document.body
  and eventPrefix "client" so the cursor is tracked over page content.
- Pause rendering when the tab is hidden (visibilitychange) using frameloop.
- prefers-reduced-motion: render a single static frame (frameloop "demand"), no motion.
- Load it with next/dynamic and ssr false from a small client wrapper, mount it once
  in app/layout.tsx.

Explain the per-frame cost (pair checks per frame) and why typed arrays plus useFrame
avoid re-renders. Run npm run build and summarize.
```
**[YOU]** Check: smooth on your laptop, visible in both themes, text still readable.

Commit: `feat: cursor-reactive particle constellation background`

---

## Phase 4: Hero and About

```
Read CLAUDE.md and lib/content.ts. Phase 4: build components/sections/Hero.tsx and
About.tsx, then place them in app/page.tsx.

Hero exactly per the "Hero" spec in CLAUDE.md: status pill with pulsing dot, name in
gradient, mono rotating "I build ..." line with typing effect and blinking caret
(static first word under reduced motion), one-line description, three CTAs
(View work -> #work, Download resume -> /resume.pdf with download attribute,
Contact -> #contact), location and social icons, stats row from content.
Right column: /images/harsh.jpg via next/image with priority and correct sizes,
circular, inside a rotating conic-gradient ring and a soft glow. Mobile: photo on top,
smaller. Staggered fade-up entrance with motion, once.

About: short 2 to 3 paragraph story from content (who I am, what I build across AI and
full stack, what I am looking for), plus a compact facts card: education
("B.Tech, NIT Jalandhar, 2026"), location, focus areas, AWS certification.

Run npm run build and summarize.
```
**[YOU]** Read every line of copy on screen. Fix any wording in `lib/content.ts` yourself if it does not sound like you.

Commit: `feat: hero with photo and rotating line, about section`

---

## Phase 5: Work, Skills, Experience, Achievements

```
Read CLAUDE.md and lib/content.ts. Phase 5.

1. hooks/useTilt.ts: pointer-based 3D tilt (max about 8 degrees, perspective, spring
   smoothing with motion), plus a moving light glare. Disabled on touch devices and under
   reduced motion.
2. components/ui/TiltCard.tsx using useTilt.
3. Work section: OpsPilot as a large featured card (one-liner, 3 to 4 metric highlights,
   stack tags, Live and Code buttons). MailWarden, BookWise and NyayaSetu as a grid of
   tilt cards. Only show Live buttons where a live URL exists. Use the honest-framing
   notes from PORTFOLIO_FACTS.md where relevant.
4. Skills section exactly per the "Skills" spec: grouped compact chips, 18px brand icons
   mapped from string keys (react-icons/si, lucide fallback), no percentages.
5. Experience section: vertical timeline, role, company, dates, mode, 2 to 3 bullets each.
6. Achievements: small cards for SIH 2025, 850+ problems, AWS Cloud Practitioner.
7. components/ui/Reveal.tsx: fade-up on scroll with motion whileInView, once, respects
   reduced motion. Wrap section contents with it.

Run npm run build and summarize.
```
Commit: `feat: projects with tilt cards, skills, experience and achievements`

---

## Phase 6: Contact form (backend) and Footer

**[YOU] before starting:**
1. Create a free Resend account, create an API key. For testing you can send from
   `onboarding@resend.dev` to your own account email.
2. Create a free Upstash Redis database, copy the REST URL and REST token.
3. Create `.env.local` in the project root:
   ```
   RESEND_API_KEY=...
   CONTACT_TO_EMAIL=vaibhavharsh08@gmail.com
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
4. Restart `npm run dev` (env files are read at startup).

```
Read CLAUDE.md. Phase 6: contact form and footer.

1. lib/schemas/contact.ts: zod schema (name 2-80 chars, valid email, message 10-2000
   chars, optional honeypot field that must be empty). Export the inferred type.
2. app/actions/contact.ts: Server Action. Validate with the same schema, silently accept
   and drop honeypot submissions, rate limit with @upstash/ratelimit sliding window
   (3 requests per 10 minutes per IP from x-forwarded-for), send the email with Resend
   (reply-to set to the sender), and return a typed result { ok, fieldErrors, message }.
   Never expose API errors or keys to the client. If env vars are missing, log a clear
   server error and return a friendly message.
3. Contact section: form on one side using useActionState, inline field errors, pending
   state on the button, success and error messages announced with aria-live. Direct
   email and LinkedIn links on the other side.
4. Footer: name, short line, social links, "Built with Next.js, React Three Fiber and
   Tailwind", current year.

Run npm run build and summarize, including how the rate limiter keys requests.
```
**[YOU]** Send yourself a test message. Submit 4 times quickly and confirm the 4th is blocked.

Commit: `feat: contact form with validation, rate limiting and email delivery`

---

## Phase 7: Polish, SEO, performance

```
Read CLAUDE.md. Phase 7: polish.

1. SEO: metadataBase, Open Graph and Twitter metadata, app/opengraph-image.tsx built with
   next/og (name, role, gradient), app/sitemap.ts, app/robots.ts, app/icon.tsx favicon
   ("HV" monogram), and JSON-LD Person schema in the layout.
2. Security headers in next.config.ts (X-Content-Type-Options, Referrer-Policy,
   X-Frame-Options, Permissions-Policy).
3. Audit the whole site for: color contrast in both themes, heading order (one h1),
   alt text, keyboard focus order, layout at 375px, 768px and 1440px, and no horizontal
   scroll. Fix what you find.
4. Performance: confirm the canvas is lazy loaded and not in the critical path, images
   use correct sizes, no unnecessary "use client". Report anything that would hurt
   Lighthouse.
Run npm run build and list what you fixed.
```
**[YOU]** Run Lighthouse in Chrome DevTools (mobile). Paste the scores and any red items back into Claude Code to fix.

Commit: `chore: seo, security headers, accessibility and performance fixes`

---

## Phase 8: Deploy [YOU]
1. `git push` to GitHub.
2. vercel.com, Add New Project, import the `portfolio` repo (framework auto-detected).
3. Add the four env vars from `.env.local` in Project Settings, Environment Variables.
4. Deploy. Open the live URL, test the contact form, both themes, and your phone.
5. Optional: add a custom domain in Vercel and set `metadataBase` to it.
6. Put the live link on your resume, LinkedIn and GitHub profile README.

---

## Interview prep (10 minutes after you finish)
Ask Claude Code:
```
Act as an interviewer. Ask me 8 questions about this codebase (architecture, the
particle system, theme handling without flash, the contact Server Action and rate
limiting, performance choices). After each answer, tell me what I missed.
```