# Portfolio: Harsh Vaibhav (Full Stack + AI Engineer)

Personal portfolio site. Polished and professional, never plain black and white.
Dark navy base with warm glowing gradient orbs, a full-page cursor-reactive particle
constellation, warm coral/orange accents with a cyan counterpoint, and 3D tilt cards.
Audience: recruiters and engineering managers who skim fast, often on mobile.

## Stack
- Next.js (App Router) + TypeScript (strict) + Tailwind CSS v4
- 3D: three + @react-three/fiber (no drei unless asked)
- Animation: motion (import from "motion/react")
- Icons: lucide-react (UI icons and skills without a brand logo), react-icons for brand logos
  only: `react-icons/si` (skills, GitHub) and `react-icons/fa6` (LinkedIn, which si lacks)
- Contact: Server Action + zod + Resend, rate limited with Upstash Ratelimit
- Deploy: Vercel

## Commands
- `npm run dev` start dev server
- `npm run build` production build (must pass before any commit)
- `npm run lint` lint

## Folder structure
```
app/
  layout.tsx, page.tsx, globals.css
  actions/contact.ts          # Server Action for the contact form
  icon.tsx, apple-icon.tsx    # generated "HV" icons (next/og)
  opengraph-image.tsx, twitter-image.tsx
  robots.ts, sitemap.ts
components/
  layout/                     # Navbar, Footer, ThemeToggle, ScrollProgress, BackToTop
  background/                 # GradientOrbs, BackgroundCanvasLoader (deferred mount),
                              # BackgroundCanvas (wraps NeuralField)
  sections/                   # Hero, About, Work, Skills, Experience, Achievements,
                              # Contact, ContactForm
  three/NeuralField.tsx       # particle constellation (R3F)
  ui/                         # Section, Button, Badge, Reveal, RotatingText, SkillChip,
                              # SkillIcon, SocialIcon, TiltCard, card-styles.ts
hooks/
  useTilt.ts                  # 3D tilt for project cards
  useMediaQuery.ts            # live media query (useSyncExternalStore)
  useTheme.ts                 # current theme from <html data-theme>
lib/
  content.ts                  # typed, single source of truth for all copy
  schemas/contact.ts          # zod schema shared by form and Server Action
  schemas/contact-form.ts     # zod-free limits, types and form reading (client-safe)
  email/contact-email.ts      # notification email builder (server-only, escapes all input)
  og.tsx                      # shared renderers for OG/Twitter images and icons
  site-url.ts                 # absolute site URL for metadata, sitemap, JSON-LD
  structured-data.ts          # Person JSON-LD
  motion-features.ts          # domAnimation, lazy-loaded by LazyMotion
  utils.ts                    # cn, escapeHtml, isExternal
public/images/harsh.jpg       # profile photo (square)
public/resume.pdf
```
`PORTFOLIO_FACTS.md` and `BUILD_PROMPTS.md` are local working notes: gitignored, not published.

## Hard rules for Claude Code
1. For any multi-file change, show a short plan first. After finishing, summarize what
   changed and the key technical decisions in 8 bullets or fewer.
2. Never hardcode copy inside components. All text, projects, experience, skills and
   links come from `lib/content.ts` via typed exports. `PORTFOLIO_FACTS.md` (local,
   untracked) is the verified source for every date, metric and link. Never invent or
   round numbers.
3. Do not add dependencies beyond the Stack list without asking first and explaining why.
4. Keep diffs small and scoped to the current task. Explain non-obvious decisions.
5. Server Components by default. Add "use client" only where interaction or WebGL needs it.
6. Anything using WebGL or `window` is loaded with `next/dynamic` and `ssr: false`
   from inside a client component.

## Design system

### Colors (CSS variables in globals.css, exposed to Tailwind via @theme)
Default theme is dark. Theme is set by `data-theme` on <html>.

| token          | dark                     | light                  | use |
|----------------|--------------------------|------------------------|-----|
| --bg           | #0F0F1E                  | #FFFFFF                | page background |
| --bg-alt       | #1A1A2E                  | #F8F9FA                | alternating sections, card base |
| --bg-raised    | #252541                  | #E9ECEF                | inputs, hovered surfaces |
| --border       | rgba(255,255,255,0.08)   | rgba(26,26,46,0.10)    | hairlines |
| --text         | #F5F5F7                  | #1A1A2E                | body text |
| --muted        | #B0B0BC                  | #4A5568                | secondary text |
| --accent       | #FF8E53 (warm orange)    | #B43A0A                | primary accent: buttons, links, active states |
| --accent-2     | #00D4FF (cyan)           | #0E7490                | secondary accent: highlights, focus, small details |
| --coral        | #FF6B6B                  | #E03131                | gradients only |
| --gold         | #FFD93D                  | #F59F00                | orbs only, never text |
| --success      | #4ADE80                  | #237032                | form feedback only |
| --danger       | #FF8787                  | #C92A2A                | form errors only |
| --glare        | rgb(255 255 255 / 0.1)   | rgb(217 72 15 / 0.08)  | tilt-card glare |
| --orb-opacity  | 0.28                     | 0.18                   | gradient orbs |
| --gradient-text | accent > coral > accent-2 (theme tokens) | same, light tokens | hero name, logo |

Light-mode accents are darker on purpose so text passes WCAG AA on white and over the orbs
(--accent 5.9:1, --accent-2 5.4:1 on white). Dark --muted is lifted from #A8A8B3 for the same
reason. Contrast is verified by sampling rendered pixels, because axe cannot see through the
orbs, backdrop blur or the canvas. Re-check both themes after changing any token or orb.

Gradients:
- `--gradient-brand`: linear-gradient(135deg, #FF8E53 0%, #FF6B6B 50%, #00D4FF 100%)
  Use ONLY for: photo ring and glow, scroll progress bar, one primary CTA.
- `--gradient-text`: the same three stops built from the theme tokens, for gradient TEXT (hero
  name, "HV" logo). The brand hex values only pass contrast on dark, so text never uses them.
- Cards: background color-mix of --bg-alt at about 60% opacity, 1px --border, backdrop blur 10px.
  Hover: border becomes accent at about 40% opacity, slight lift.

### Background layers (fixed, behind everything)
1. Base: `--bg`
2. Gradient orbs (GradientOrbs, CSS only, `position: fixed`, z below content):
   - orb 1: 500px, cyan gradient (#00D4FF to #0099FF), top -10% right -10%
   - orb 2: 400px, coral to orange (#FF6B6B to #FF8E53), bottom -10% left -10%
   - orb 3: 350px, gold to coral (#FFD93D to #FF6B6B), centered
   - all: border-radius 50%, filter blur(80px), opacity 0.28 (0.18 in light mode; lowered
     from 0.4 / 0.25 so accent labels stay AA where they sit over an orb),
     slow 20s float animation with staggered delays (0s, 7s, 14s)
   - mobile: smaller sizes and blur(60px); reduced motion: no animation
3. Particle constellation (NeuralField via BackgroundCanvas), full viewport, fixed,
   pointer-events none on the canvas, cursor tracked on document.body.
   Dark: additive blending, warm/cyan particles. Light: normal alpha blending, darker particles.

### Typography
Geist Sans for headings and body, Geist Mono for labels, tags, chips and the rotating line.
Hero name about 56px desktop / 36px mobile, section titles about 36px, body 16 to 18px.

### Layout and spacing
Max content width 1200px, side padding 2rem (1rem mobile), sections padded 6rem vertical.
Section header: small mono uppercase label in --accent, title, one-line description.

## Components spec

### Navbar (style of reference site 2)
Fixed, full width, background --bg-alt at 80% with backdrop-filter blur(20px), bottom border
tinted with accent at 10%. On scroll past 20px: background 95% and subtle shadow.
Left: "HV" logo in gradient text. Center/right: links with a small lucide icon + label:
Home, About, Work, Skills, Experience, Contact. Hover: color to --accent and a 2px underline
that grows from 0 to full width. Active section highlighted via IntersectionObserver.
Right: round theme toggle (40px, accent tint background, icon rotates 180deg on hover).
Mobile (<768px): hamburger, accessible disclosure menu (aria-expanded, Esc closes and returns
focus to the button; choosing a link leaves focus with the fragment navigation so the next Tab
continues from that section), icons + labels stacked.

### Hero (structure of reference site 1)
Two columns on desktop (text 1.2fr, photo 1fr), stacked on mobile with photo first and smaller.
Left column, top to bottom:
1. Status pill: "Open to Full Stack + AI Engineer roles" with a small pulsing green dot
2. Name: "Hi, I'm Harsh Vaibhav" with the name in --gradient-text
3. Rotating line in mono: "I build " + cycling words (RAG pipelines, multi-agent systems,
   FastAPI backends, React frontends) with a typing effect and blinking caret
4. One-line description
5. CTAs: View work (gradient, primary), Download resume (outline), Contact (ghost)
6. Location (Bengaluru) + social icon links (GitHub, LinkedIn, Email)
7. Stats row: 3 small stats from content.ts
Right column: circular photo (next/image with `preload` and `fetchPriority="high"`) inside a
rotating conic gradient ring (--gradient-brand colors, 20s linear rotation), subtle glow behind it.
LCP decision: the photo is the LCP element, so it renders immediately and is never faded or
animated in; only the ring and glow fade in (fading the photo delayed LCP by about 1s). In
Next 16 `preload` replaces `priority` but no longer implies high fetch priority, so set both.
Small scroll indicator at the bottom center.

### Skills
Grouped by category (AI/LLM, Backend, Frontend, Databases, Cloud/DevOps, Languages).
Each skill is a compact chip: 18px brand icon + name, mono 13px, --bg-alt at 60% with a 1px
border. No backdrop blur (36 blur layers cost GPU on phones) and no hover state (not interactive).
NO percentages, NO progress bars, NO descriptions.
Icons are server-rendered SVG (zero client JS). Deduplicating them into a sprite was measured
(about 17KB gzipped of HTML) and judged not worth the added asset pipeline.

### Extras
- ScrollProgress: 3px bar fixed at top, --gradient-brand, width = scroll percentage.
- BackToTop: round button bottom right, appears after 600px scroll, `inert` while hidden.
  Activating it moves focus to `#main`, since the button hides itself at the top.
- Print: a print stylesheet forces light tokens, reveals every section and hides decoration.

## Motion and 3D rules
- Respect `prefers-reduced-motion`: static particles, no orb float, no tilt, no reveals,
  no typing effect (show the first word statically).
- Exactly ONE WebGL render loop on the page (the background constellation).
- Canvas: dpr clamped to [1, 2] (1.5 max on mobile), fewer particles on mobile,
  pause when the tab is hidden. It mounts late and fades in: desktop after load + idle,
  phones (<768px or coarse pointer) on the first scroll/touch/key press, because three.js
  startup costs a phone about 250ms of blocking time.
- motion: use `m` components, never `motion.*`. Reveal wraps `m` in `LazyMotion` with
  `domAnimation` loaded from `lib/motion-features.ts`. The full `motion` component ships
  layout/drag/projection code in first-load JS.
- Keep zod out of first-load JS: client code imports `lib/schemas/contact-form.ts` and
  loads `lib/schemas/contact.ts` (the zod schema) with `import()`.
- Tilt cards: disabled on touch devices. Max rotation about 8 degrees, spring-smoothed.
- Section reveals: short fade + 16px translate, once per element, 0.5s.
- Target Lighthouse: Performance 90+ on mobile, Accessibility 95+.

- NeuralField declares its geometry, materials and texture as R3F JSX so the reconciler owns
  and disposes them (Strict Mode safe); `useMemo` holds only plain typed arrays.

## Accessibility
Semantic landmarks, one h1, visible focus rings in --accent-2, color contrast AA,
canvas and orbs aria-hidden, photo has meaningful alt text, everything keyboard reachable.
Links that open a new tab say so to screen readers (`ui.newTab`, inside the aria-label when
there is one).

## Security
- Contact Server Action order: honeypot, zod validation, env check, rate limit, send.
  Never return provider errors to the client.
- The honeypot silently drops a message, so a real visitor must never be able to fill it:
  meaningless field name (`HONEYPOT_FIELD`), neutral label, `inert` (Chrome does not autofill
  unfocusable fields; inert inputs are still submitted), autoComplete off, password-manager
  ignore attributes, placed after the submit row. Never give it a recognizable name (it was
  "website" once and autofill filled it). No timing traps.
- Every visitor value in the email is HTML-escaped; the subject strips control characters and
  uses a replacer function (no `$&` expansion). `lib/email/` imports `server-only`.
- Headers in next.config.ts: a nonce-free CSP (object-src, base-uri, form-action,
  frame-ancestors), nosniff, Referrer-Policy, X-Frame-Options, COOP, Permissions-Policy.
  A script-src CSP would need nonces, which forces dynamic rendering. Vercel adds HSTS.
- Set `NEXT_PUBLIC_SITE_URL` in production; `lib/site-url.ts` falls back to the Vercel
  production domain, never to a protected per-deployment URL on production builds.

## Copy rules
- Plain, specific, human tone. No em dashes. No buzzword stacks.
- Education line: "B.Tech, NIT Jalandhar, 2026" (do not mention the branch).