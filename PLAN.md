# Nervosa Cafe — Website Implementation Plan
**Cluj-Napoca · 2026 · "Overthinking Fuel."**

> *"Cafea bună, oameni interesanți, gânduri necenzurate."*
> *"Aici, toată lumea e puțin nevrotică (și e ok)."*
> *"Făcută cu grijă. Servită cu sclipici."*

---

## Overview

A full-stack brand website for **Nervosa Cafe** — a sanctuary for the neurotic, the emo, and the beautifully restless. The site functions as both a digital storefront and an expressive art object: equal parts usable and unhinged.

**Tech stack:** Astro 5.x · Tailwind CSS 4 · TypeScript · Vercel (KV + Cron + Analytics)

---

## 01 — Site Architecture

### Verdict: One-Page Zine Scroll with Route Islands

A single-page layout navigated via deep anchor links — not a traditional multi-page site. Each section feels like a torn page in a sketchbook being revealed as you scroll. Astro's zero-JS-by-default keeps the page fast; `client:visible` islands hydrate only what needs interaction (the Vent Wall, menu hover states).

### Page "Chapters" (scroll order)

| # | Section | Purpose |
|---|---------|---------|
| ① | Hero / Catchphrase | First impression. Typewriter headline. Brand voice. |
| ② | Manifesto | The three core Romanian messages. Brand soul. |
| ③ | Menu | Coffee, refreshing drinks, protein drinks. |
| ④ | Vent Wall | Anonymous ephemeral thought board. |
| ⑤ | Vibe / Location | Dark map. Address. Hours. |
| ⑥ | Footer | Socials. Easter eggs. Hours. |

### Routes

```
/               → Main zine scroll (SSG)
/menu           → Full menu standalone page (SSG, shareable)
/manifesto      → Brand manifesto standalone (SSG, shareable)
/api/vents      → Vent Wall API endpoint (SSR, Vercel Edge)
/og.png         → Generated Open Graph image (SSG at build)
```

### Rendering Model

- **SSG** for all content pages (menu, hero, manifesto, location) — built once, served from CDN edge.
- **SSR** for `/api/vents` only — keeps cold-start cost minimal on Vercel Edge Functions.
- Vent Wall UI uses `client:idle` hydration — loads after critical content, never blocks render.
- Astro adapter: `@astrojs/vercel` in **hybrid mode**.

---

## 02 — UI/UX Philosophy

### The Core Principle

The design system should feel like someone assembled it at 2am with scissors, a stapler, and too much espresso. Every deliberate imperfection is intentional. Asymmetry is a feature, not a bug.

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Sepia | `#c9a96e` | Primary accent, links, highlights |
| Deep Black | `#1a1814` | Backgrounds, dominant text |
| Paper White | `#f5f0e8` | Body background, light sections |
| Ink Rust | `#8b4513` | Secondary accent, borders |
| Ash | `#4a4542` | Muted text, secondary labels |

### Typography

- **Headings:** `Special Elite` (Google Fonts) — typewriter aesthetic, worn and human.
- **UI Labels / Metadata:** `Share Tech Mono` — monospace, clinical, slightly cold.
- **Body text:** System serif stack (`Georgia, 'Times New Roman', serif`) — familiar, readable.
- **Line-height:** 1.9 on body (deliberately loose, like a handwritten journal).
- **Rotation:** Some headings rotated `±2–4deg` via `transform: rotate()` for the "clipped" collage look.

### Navigation

No traditional navbar. Instead:

- A **persistent sidebar scribble** — a vertical line of hand-drawn anchor dots on the left edge, slightly rotated.
- Active section highlighted by a hand-drawn SVG arrow that tracks scroll position via `IntersectionObserver`.
- **Mobile:** a "crumpled paper" hamburger toggle that reveals anchor links in a full-screen dark overlay.

### Layout Grid

Reject the standard 12-column grid. Use **CSS Grid with named areas** where content intentionally bleeds outside expected boundaries:

- A text block starts at column 1 but an image starts at `column -1`, overlapping by `2rem`.
- Intentional whitespace used as "breath" between sections — not filled with content.
- Section dividers are SVG torn-paper edges, not `<hr>` tags.

### Interactions & Micro-animations

| Trigger | Effect | Implementation |
|---------|--------|----------------|
| Hover on links | SVG scribble underline animates in | `stroke-dashoffset` transition |
| Scroll into section | Section "tears in" from top | `clip-path: polygon()` animation |
| Click on logo (×7) | Easter egg: owner's Spotify playlist | JS counter, `localStorage` |
| Any async action | "Overthinking" loading phrases cycle | `setInterval`, monospace font |
| Reduced motion | All animations disabled | `@media (prefers-reduced-motion)` |

### The "Overthinking" Loading State

While any async action runs (posting a vent, loading the map), display cycling typewriter phrases instead of a spinner:

```
"Procesăm anxietatea ta..."
→ "Salvăm gândul în cosmos..."
→ "Aproape. Sau poate nu. De fapt da."
```

*("Processing your anxiety..." → "Saving thought to the cosmos..." → "Almost. Or maybe not. Actually yes.")*

Implemented as a cycling `setInterval` inside an Astro island — monospace font, blinking `_` cursor.

### Texture System (CSS-only, zero image cost)

Grain and paper textures entirely via CSS — no PNG texture files:

```css
/* Defined once in BaseLayout.astro */
<filter id="grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>

/* Applied anywhere */
.section { filter: url(#grain); }
```

A dark `mix-blend-mode: multiply` sepia wash on top gives the aged paper feel globally.

---

## 03 — Key Features

### Feature A: The Vent Wall

An anonymous thought-posting board. Looks like sticky notes pinned to a corkboard — each note slightly rotated at random. Posts auto-delete after 24 hours.

#### Frontend (Astro Island, `client:idle`)

- Textarea styled as torn paper, max **140 characters**.
- "Overthinking" submit animation (see loading state above).
- Notes rendered with random `rotate(±5deg)` and sepia tone variations.
- Each note shows a countdown timer: "dispare în 14h 23m" ("disappears in 14h 23m").
- One-click reaction with hand-drawn ❤ or ✗ icons.
- Optimistic UI — note appears immediately, rolls back on error.

#### Backend (Astro Actions + Vercel KV)

```
POST /api/vents     → Create vent (rate-limited: 5/IP/day)
GET  /api/vents     → Returns last 20 live vents (sorted by createdAt desc)
```

- **Storage:** Vercel KV (Redis). Free tier is sufficient (~10,000 writes/day).
- **Expiry:** Redis native TTL set to 86400 seconds (24h) on write. Zero cron needed for deletion.
- **Rate limiting:** IP-based, stored in KV with 24h TTL.
- **Profanity filter:** `leo-profanity` npm package, configured for Romanian + English.
- **GDPR note:** Posts are fully anonymous. No user accounts. State this clearly in a footer note.

#### Data Schema

```typescript
interface Vent {
  id: string;          // nanoid(8)
  text: string;        // max 140 chars, sanitized
  createdAt: number;   // Unix timestamp (ms)
  expiresAt: number;   // createdAt + 86400000
  reactions: {
    heart: number;
    x: number;
  };
}
```

---

### Feature B: The Menu

Three categories, each styled as a different "piece of paper" clipped to the page.

#### Data Source

All menu data lives in `/src/data/menu.json` — editable by non-developers, no database needed. Astro renders it statically at build time.

```json
{
  "seasonal_special": { "name": "...", "description": "...", "price": "..." },
  "specialty_coffee": [ { "name": "...", "description": "...", "price": "..." } ],
  "refreshing_drinks": [ ... ],
  "protein_drinks": [ ... ]
}
```

#### Card Styles

**Specialty Coffee — "Aged Graph Paper"**
- Background: light sepia with faint grid lines via CSS `background-image: linear-gradient`.
- Items set in `Special Elite` font.
- SVG "ink blot" decorative element next to each item name.
- Prices in a slightly larger, bolder weight — like someone circled them.

**Refreshing Drinks — "Index Card"**
- Light blue-white tinted background.
- SVG torn edge at the top of the card.
- Items listed loosely, not in a rigid table — like a casual list on a napkin.
- A hand-drawn "✓" next to any seasonal or limited item.

**Protein Drinks — "Dark Card"**
- Near-black (`#1a1814`) background.
- White ink lettering effect via CSS `text-shadow: 0 0 1px rgba(255,255,255,0.8)`.
- "Smudge" decorative SVG elements between items.
- Feels like a note left on a dark counter.

---

### Feature C: Location / Vibe Section

Dark, moody map integration for Cluj-Napoca.

#### Map Integration Options (ranked)

**Option A — Recommended: MapLibre GL JS + Stadia Maps**
- Custom dark basemap: Stadia Maps "Alidade Smooth Dark" theme (free tier).
- Self-contained, no Google account needed.
- Apply CSS `filter: sepia(0.4) contrast(1.1) brightness(0.85)` on the map canvas.
- A custom SVG map pin shaped like a coffee cup with animated steam on load.

**Option B — Fallback: Mapbox Static API**
- Single static map image URL, generated once, cached at build.
- Apply CSS grain + sepia filter on top.
- Zero runtime JS. Fastest possible. Less interactive.

#### Around the Map

- **Address block:** Hand-drawn-style layout with SVG street sketch elements.
- **Hours:** "Torn sticky note" component, pinned at a slight angle.
- **CTA:** "Rătăcește-te pe drum" ("Get lost finding us") button → links to Google Maps.
- **Vibe copy:** 2–3 sentences about the space. Written in brand voice — not marketing-speak.

---

## 04 — Asset Strategy

### SVG Scribbles (inline, zero extra requests)

All hand-drawn elements — hearts, eyes, anatomical sketches, underlines, arrow doodles — are **inline SVGs** embedded in Astro components. Each is a thin `stroke`-only path with no fill, averaging 0.5–2kb each.

Animation approach:
```css
.scribble path {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  transition: stroke-dashoffset 0.8s ease;
}
.scribble.visible path {
  stroke-dashoffset: 0;
}
```

Triggered via `IntersectionObserver` when the element enters the viewport.

### Photography / Collage Images

- Maximum **3–4 real photos** total (cafe space, coffee details, texture shots).
- All processed through Astro's built-in `<Image>` component: AVIF primary, WebP fallback, with responsive `sizes` attribute.
- Sepia treatment via CSS only — no Photoshop preprocessing needed:
  ```css
  .photo { filter: sepia(0.7) contrast(1.2) brightness(0.9); }
  ```
- Masked with `clip-path: polygon(...)` for irregular, torn-paper shapes — no masking images needed.

### Grain Texture System

One shared SVG `feTurbulence` filter defined in `BaseLayout.astro`, referenced site-wide:

```html
<!-- In BaseLayout.astro, hidden SVG -->
<svg class="hidden" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>
```

Different sections use different `baseFrequency` values via CSS custom properties for intensity variation.

### Fonts

- `Special Elite` + `Share Tech Mono` via Google Fonts with `display=swap` and `preconnect`.
- **Subset** to Romanian + Latin characters only using `glyphhanger` CLI tool — reduces weight ~60%.
- **Self-host** the subsetted `.woff2` files in `/public/fonts/` — eliminates runtime Google Fonts requests (GDPR compliance, no third-party tracking).
- Estimated total font payload: ~18kb gzip.

### Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 1.8s |
| TBT | < 50ms |
| CLS | 0 |
| Lighthouse Score | 95+ |
| Total JS (gzip) | < 20kb |

Astro's zero-JS islands strategy makes this achievable. The Vent Wall is the only meaningful JS payload (~12kb gzip).

---

## 05 — Development Roadmap

### Phase 1 — Foundation & Identity *(Week 1–2)*

- [ ] Init Astro project: `npm create astro@latest`, add `@astrojs/tailwind`, `@astrojs/vercel`, configure hybrid rendering mode.
- [ ] Build the design token system: CSS custom properties for palette, grain filter SVG, font stack, spacing scale.
- [ ] Create `BaseLayout.astro` with grain filter, font preloads, OG meta tags, and Romanian `lang="ro"` locale.
- [ ] Design and build the **Hero section**: typewriter headline animation, catchphrase reveal, scroll CTA ("coboară · scroll").
- [ ] Commission or generate the core SVG scribble asset set: anatomical heart, eye, underlines, corner flourishes, ink blots.
- [ ] Set up Vercel project, connect GitHub repo, configure preview deployments on every PR.

**Deliverable:** Live preview URL with Hero section deployed. Brand direction locked.

---

### Phase 2 — Core Content Sections *(Week 3–4)*

- [ ] Build **Manifesto section**: all three core Romanian messages, animated SVG scribble reveals, asymmetric layout with intentional overflow.
- [ ] Populate `menu.json`, build **Menu section** with all three card styles (graph paper / index card / dark card).
- [ ] Integrate MapLibre + Stadia dark basemap, build custom SVG coffee-cup pin with animated steam, add address block and hours component.
- [ ] Build **Footer**: hours, socials, GDPR vent-wall notice, Easter egg (×7 logo click → Spotify playlist).
- [ ] Implement scroll-driven **sidebar navigation** (IntersectionObserver, animated SVG arrow indicator).
- [ ] Add scroll-triggered `clip-path` "tear-in" transitions for each section entering the viewport.

**Deliverable:** Full static site visually complete. All content sections reviewed by owner.

---

### Phase 3 — Vent Wall + Polish *(Week 5–6)*

- [ ] Provision **Vercel KV**, implement `POST` + `GET` Astro Actions with IP rate limiting and profanity filtering.
- [ ] Build the **Vent Wall island**: corkboard layout, random rotation, countdown timers, reaction buttons, optimistic UI.
- [ ] Implement "Overthinking" loading state with cycling Romanian phrases.
- [ ] **Accessibility pass:** keyboard navigation, ARIA labels, `prefers-reduced-motion` disables all animations.
- [ ] **Cross-browser QA:** Firefox, Safari, Chrome. Verify `clip-path` and SVG filters render correctly on all.
- [ ] Font subsetting with `glyphhanger`, move to self-hosted `.woff2` files, validate no Google Fonts runtime requests.
- [ ] Lighthouse audit, fix any remaining CLS / LCP issues. Validate OG image previews on Twitter/WhatsApp/Facebook.

**Deliverable:** Fully interactive site. Vent Wall live in staging. QA sign-off.

---

### Phase 4 — "Opening Soon" Launch *(Week 7)*

- [ ] Deploy **"Opening Soon" variant**: hide Vent Wall, show countdown to opening day, display full manifesto and menu.
- [ ] Add **email capture**: plain `<form>` → Astro Action → Resend API (free tier) → notify subscribers on opening day.
- [ ] Connect **custom domain** via Cloudflare. Configure DNS, SSL, edge cache rules. Point `www` and apex.
- [ ] Enable **Vercel Analytics + Speed Insights** (free tier, no cookies, GDPR-safe by default).
- [ ] Add **`LocalBusiness` schema.org structured data** for Google local search:
  ```json
  {
    "@type": "CafeOrCoffeeShop",
    "name": "Nervosa Cafe",
    "address": { "@type": "PostalAddress", "addressLocality": "Cluj-Napoca", "addressCountry": "RO" },
    "servesCuisine": "Coffee",
    "geo": { "@type": "GeoCoordinates", "latitude": "...", "longitude": "..." }
  }
  ```
- [ ] Submit to **Google Search Console**. Submit sitemap.
- [ ] Final content review with owner: all Romanian copy, prices, hours, social links verified. **Publish.**

**Deliverable:** Live site at production domain. Owner notified. Champagne (or espresso).

---

## Appendix — Secret Route

Consider adding a hidden `/sob` route — just a black page, blinking cursor, and the text:

> *"ne înțelegem."*

("we understand.")

It's very on-brand. Leave it undocumented. Let people find it.

---

## Full Tech Stack Reference

| Category | Technology | Notes |
|----------|-----------|-------|
| Framework | Astro 5.x | Hybrid SSG/SSR, zero-JS default |
| Styling | Tailwind CSS 4 | Layout only; gritty details in custom CSS |
| Language | TypeScript | Strict mode |
| Database | Vercel KV (Redis) | Vent Wall storage, rate limiting |
| Cron | Vercel Cron | Not needed if using Redis TTL natively |
| Map | MapLibre GL + Stadia Maps | Dark theme, sepia-filtered |
| Email | Resend | Opening-soon email capture |
| Profanity | leo-profanity | RO + EN word lists |
| Fonts | Special Elite + Share Tech Mono | Self-hosted, subsetted |
| Hosting | Vercel | Free tier covers full scope |
| DNS / CDN | Cloudflare | DDoS protection, cache |
| Analytics | Vercel Analytics | No cookies, GDPR-safe |
| SEO | schema.org LocalBusiness | Google local search ranking |
| ID generation | nanoid | For vent IDs |

---

*Document version 1.0 — generated for Nervosa Cafe, Cluj-Napoca.*
*"Overthinking Fuel." ☕*
