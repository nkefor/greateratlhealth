# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A static telehealth practice website for **Greater ATL Health — Lyna Ashu, FNP-C**. No build step, no framework, no package manager. Pure HTML/CSS/JS deployed via Vercel as a static site.

## Deployment

```bash
# Deploy to production (always from greateratlhealth/ directory)
vercel --prod --scope greater-atlanta-home-health-services --yes

# Preview deployment (no --prod flag)
vercel --scope greater-atlanta-home-health-services --yes
```

There is no local dev server. Open HTML files directly in a browser, or use:
```bash
npx serve .
```

## Key Constants — Never Change Without Updating All Files

| Constant | Value | Used In |
|---|---|---|
| `BOOKING_URL` | `https://calendly.com/lynaashu/telehealth` | app.js, index.html, landing.html |
| `DOXY_ROOM_URL` | `https://doxy.me/lynanp` | app.js, index.html, landing.html |
| `PHONE` | `(678) 570-7587` | Every HTML file, app.js, structured data |
| `EMAIL` | `lyna.ashu@greateratlhealth.com` | Every HTML file (14 total occurrences) |
| `FORMSPREE` | `https://formspree.io/f/xabcdefg` | contact.html, landing.html |

When changing the email or phone, run a global search — they appear in `<a href="mailto:">`, `<a href="tel:">`, JSON-LD structured data, and plain text across all 9 HTML files.

## Architecture

### CSS System (`styles.css`)
All colors, spacing, and shadows are CSS custom properties defined in `:root`. Never hardcode a color — always use a variable. Core palette:

```css
--accent: #0e8c77      /* primary teal — brand color */
--accent-dark: #09705f  /* hover state */
--accent-light: #e6f4f1 /* tinted backgrounds */
--accent-mid: #b3dfd8   /* borders, dividers */
--bg: #f7f6f4           /* page background (off-white) */
--text: #131313         /* primary text */
--text-2: #4b5563       /* secondary text */
--nav-h: 70px           /* nav height — used in padding calc throughout */
```

`landing.html` has its own self-contained `<style>` block that duplicates the variable system with slightly different names (`--teal`, `--teal-dk`, etc.) because it is a standalone file that can be shared independently.

### JavaScript Architecture (`app.js`)
`app.js` is a single flat IIFE-style file. Features are implemented in this order:

1. **Constants** — `BOOKING_URL`, `DOXY_ROOM_URL` at the top
2. **Nav** — scroll shadow, hamburger toggle, mobile menu, active link tracking
3. **GSAP animations** — wrapped in a try/catch; if GSAP isn't loaded, falls back to IntersectionObserver `.reveal` class toggling
4. **FAQ accordion + search** — search filters `.faq-item` elements by text content
5. **Visit type radio selection** — booking widget pre-selects a visit type when clicking a service card link (`data-visit-type` attribute bridges service cards to booking widget)
6. **Book Now handler** — opens Calendly in new tab
7. **Back-to-top button** — appears after 400px scroll
8. **Doxy.me join buttons** — checks `DOXY_ROOM_URL` isn't a placeholder before rendering
9. **Scroll progress bar** — top-of-viewport percentage bar
10. **Toast system** — `showToast(msg, type)` utility used throughout
11. **Sticky booking bar** — appears after user scrolls past `.hero`
12. **Review carousel** — desktop: 3-column CSS grid; mobile: JS-driven slider with touch/swipe
13. **Service card expand/collapse** — toggles `.collapsed` class; CSS handles animation
14. **Email capture form** — async Formspree POST

### Page Structure

`index.html` is the primary page. Sections in scroll order:
`Hero → WhyChooseUs → Services → HowItWorks → About → Reviews → FAQ → BookingCTA → EmailCapture → Footer`

`landing.html` is a **standalone, self-contained** social landing page (all CSS inline in `<style>`, no dependency on `styles.css` or `app.js`). It has its own JS block at the bottom. It covers the same services but is optimized for cold social-media traffic.

### Responsive Breakpoints
Both `styles.css` and `landing.html` use these breakpoints:
- `1060px` — tablet landscape: 2-column grids
- `860px` — tablet portrait: single-column hero, hide provider card
- `768px` — mobile: hamburger nav, mobile CTA bar visible
- `540px` — small phone: single-column everything, reduced padding

### Multi-File Edits
Content that lives in multiple files simultaneously:
- **Email/phone** — 9 HTML files + JSON-LD structured data in `index.html`
- **Service names/prices** — `index.html` (service cards, FAQ, booking widget, footer nav) + `landing.html`
- **Star ratings** — `index.html` reviews section uses inline gradient CSS for partial stars
- **Legal policy content** — `hipaa.html`, `privacy.html`, `terms.html`, `nondiscrimination.html`, `accessibility.html` all independently maintain their own contact email

### Security & Caching (`vercel.json`)
Security headers (X-Frame-Options, CSP, HSTS, etc.) are all in `vercel.json`. If adding a new external script or font CDN, the `Content-Security-Policy` `script-src` or `style-src` directive must be updated or the browser will block it. Current allowed script sources: `'self' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com`.

`styles.css` and `app.js` have `max-age=31536000, immutable` caching — if content changes, the Vercel deploy invalidates the cache automatically.

### SEO
`sitemap.xml` and `robots.txt` are static files — update `sitemap.xml` manually when adding new pages. `landing.html` is intentionally excluded from the sitemap (social landing, not indexed).

## External Services

| Service | Purpose | Config location |
|---|---|---|
| Vercel | Hosting + CDN | `vercel.json`, `.vercel/` |
| Calendly | Appointment booking | `BOOKING_URL` constant in `app.js` |
| Doxy.me | Video visit waiting room | `DOXY_ROOM_URL` constant in `app.js` |
| Formspree | Form submissions | Hardcoded in `contact.html` and `landing.html` |
| Phosphor Icons | Icon library | CDN in `<head>` of each HTML file |
| GSAP + ScrollTrigger | Scroll animations | CDN in `index.html` only |
| Google Fonts (Inter) | Typography | CDN `<link>` in `index.html`; `landing.html` loads Outfit + Inter |
