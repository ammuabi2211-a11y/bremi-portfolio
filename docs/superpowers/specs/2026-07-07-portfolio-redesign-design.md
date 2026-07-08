# Design Spec — Bremi Maruthaiyan PMM Portfolio Redesign

**Date:** 2026-07-07
**Status:** Approved (pending final spec review)
**Author:** Frontend redesign engagement

## Goal

Completely redesign the existing single-file portfolio (`bremi_portfolio (7).html`) into a
**creative-yet-professional Modern SaaS** aesthetic, split into separate HTML/CSS/JS files,
mobile-friendly, using an industry-standard token-based color system and standard components.

**Hard constraint:** Do NOT alter the copy, numbers, sections, or their order. This is a
visual/UX redesign only. The three explicitly-approved corrections below are the sole
exceptions.

## Approved decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Art direction | Modern SaaS / Product (Stripe / Linear / Vercel family) |
| Accent color | Plum / violet, on a neutral white/gray base |
| Theme | Light-first, with a dark-mode toggle (remembered via localStorage) |
| Motion | Tasteful & subtle (scroll reveal, metric count-up, hover lifts), reduced-motion safe |
| Contact buttons | WhatsApp, Email (mailto), LinkedIn, Download CV |
| Typography | Space Grotesk (headings/metrics) + Inter (body/UI) |
| Case studies | Option A — upgraded tabs (keyboard/ARIA + URL deep-linking) |
| Content changes | Apply the 3 fixes below only; otherwise content is untouched |

### Approved content corrections (the only content touches)
1. **Spelling:** normalize all `greyHR` → `greytHR` (currently mixed 18 vs 22 instances).
2. **SEO/a11y additions:** add `alt` text to all images, a `<meta name="description">`,
   Open Graph tags, and a favicon. (Additions only — no visible copy change.)
3. **Battlecard link:** convert the editable Google Slides URL (`/edit?usp=sharing`) to
   Google's `/preview` (view-only) mode. NOTE: user must ALSO set the doc's Drive sharing to
   "Viewer" for full protection — this is a user follow-up action outside the code.

## File architecture

```
Bremi Portfolio/
├─ index.html                 # semantic markup, all 11 sections, same content/order
├─ css/
│   └─ styles.css             # design tokens + components + responsive
├─ js/
│   └─ main.js                # theme toggle, tabs+deeplink, scroll reveal, count-up, mobile nav
├─ assets/
│   ├─ img/
│   │   ├─ bremi-portrait.jpg # extracted from base64 (was 600x643)
│   │   ├─ pms-results.jpg    # extracted (was 600x120)
│   │   ├─ unite-results.jpg  # extracted (was 800x272)
│   │   ├─ recruit-results.jpg# extracted (was 800x208)
│   │   └─ og-cover.jpg       # social share image = a copy of the portrait (decided)
│   ├─ favicon.svg
│   └─ resume.pdf             # PLACEHOLDER — user provides the real CV
├─ docs/superpowers/specs/    # this spec
└─ bremi_portfolio (7).html   # ORIGINAL — left untouched as backup
```

The 4 base64 images are extracted to real files (already decoded to the scratchpad during
exploration; will be copied into `assets/img/`). This is core to the "separate files"
requirement and cuts the HTML from ~212 KB to ~20 KB; below-the-fold case-study images use
`loading="lazy"`.

## Color system (CSS custom properties)

Neutral base + one disciplined plum accent. Dark theme = token swap on `:root[data-theme="dark"]`.
Default theme is light; `prefers-color-scheme` respected on first visit, then localStorage wins.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0D0B16` |
| `--bg-subtle` | `#FAF9FC` | `#141120` |
| `--surface` | `#FFFFFF` | `#1A1726` |
| `--border` | `#EAE7F2` | `rgba(255,255,255,0.09)` |
| `--text` | `#161320` | `#F5F3FA` |
| `--muted` | `#565170` (AA-verified on bg) | `#ABA6C0` |
| `--accent` | `#5B4BD6` | `#8B7CF0` |
| `--accent-hover` | `#4A3BC0` | `#9D8FF5` |
| `--accent-soft` | `#F1EFFC` | `rgba(139,124,240,0.14)` |
| hero highlight gradient | `#6D5DE8 → #8B7CF0` | same |

Accent used only for: buttons, links, metric numbers, one gradient-highlighted hero word.
All `--muted`/text-on-color combinations must pass WCAG AA (>=4.5:1 for body text); verify
during build.

## Typography

- Headings & large metrics: **Space Grotesk** (Google Fonts), weights 500/700.
- Body & UI: **Inter** (Google Fonts), weights 400/500/600.
- System fallbacks: `-apple-system, "Segoe UI", Roboto, sans-serif`.
- `<link rel="preconnect">` to fonts.googleapis / gstatic; `display=swap`.
- Fluid type via `clamp()`; tighter letter-spacing on display sizes.

## Components

- **Nav:** sticky, backdrop-blur; logo · anchor links · theme toggle (sun/moon) · primary CTA.
  Collapses to a **hamburger + slide-in menu** below 960px (fixes current site where nav links
  simply `display:none` with no replacement).
- **Buttons:** `.btn-primary` (filled accent), `.btn-secondary` (outline), `.btn-ghost`;
  radius ~10px; hover translateY(-1px). Contact buttons carry brand-appropriate icons.
- **Cards:** radius ~18px, border + subtle shadow, hover lift.
- **Metric tiles:** Space Grotesk numerals with count-up on scroll-in.
- **Tabs:** ARIA `role=tablist/tab/tabpanel`, arrow-key nav, `aria-selected`, and URL hash
  deep-linking (e.g. `#pms`, `#unite`, `#recruit`, `#battlecards`, `#nvidia`) — read on load.
- **Timeline** (career), **badge/pills** (tags/tools), **testimonial cards**,
  **auto-fit link-card grid** (work samples).

## Section plan (all 11 kept, same content & order)

nav → hero → about → career → case studies → framework → recommendations → work samples →
tool stack → contact → footer.

- **Hero:** two-column (copy + CTAs + stat strip | portrait card w/ floating stat). Photo
  **remains visible on mobile** (stacks above copy) — currently hidden; it's personal brand.
- **About:** two-column; philosophy in accent-tinted card.
- **Career:** vertical timeline, metric chips, award pills.
- **Case studies:** upgraded tabs (Option A) — 5 panels, deep-linkable.
- **Framework:** 9 numbered cards, 3-col → 2-col → 1-col, hover states.
- **Recommendations:** 2 quote cards.
- **Work samples:** responsive auto-fit link grid, opens in new tabs (`rel="noopener"`).
- **Tool stack:** 4 category cards of pills.
- **Contact:** headline + 4 action buttons (below). Phone as click-to-call, de-emphasized.
- **Footer:** unchanged text.

## Contact actions

- WhatsApp: `https://wa.me/971508632125?text=<prefilled greeting>`
- Email: `mailto:bremimaruthaiyan777@gmail.com?subject=<prefilled>`
- LinkedIn: `https://www.linkedin.com/in/bremimaruthaiyan/` (new tab, noopener)
- Download CV: `assets/resume.pdf`
- Optional mobile sticky "WhatsApp me" so contact is always one tap away.

## Responsive / motion / a11y

- Mobile-first; breakpoints ~640 / 960px. No horizontal page scroll; wide rows stack or
  scroll in their own container; tap targets >=44px.
- Motion via IntersectionObserver (fade+rise), metric count-up, hover lifts, smooth tab/theme
  transitions — all gated by `@media (prefers-reduced-motion: reduce)`.
- A11y: image alt text, ARIA tabs, visible focus rings, skip-link, semantic headings, AA
  contrast pass.

## Out of scope / user follow-ups

- Providing the real `resume.pdf`.
- Setting Google Drive sharing on the battlecard to "Viewer".
- Any copy rewriting, section add/remove/reorder, or metric changes.
- Backend, forms, analytics, hosting/deploy config.

## Success criteria

1. Three separate files (HTML/CSS/JS) + organized assets; original file preserved.
2. Modern SaaS look with plum accent; light + working dark toggle (persisted).
3. Fully mobile-friendly incl. working mobile nav and visible hero photo.
4. All 11 sections present with identical content/order (bar the 3 approved fixes).
5. Working WhatsApp/Email/LinkedIn/CV direct-action buttons.
6. Subtle motion, reduced-motion safe; AA contrast; deep-linkable case-study tabs.
