# Greater ATL Health — Project Context

## Project
Static telehealth website for **Lyna Ashu, FNP-C** (Family Nurse Practitioner, Atlanta GA).
- Domain: https://www.greateratlhealth.com
- Stack: Plain HTML / CSS / JS — no framework, no build step
- Deployment: Vercel (vercel.json present)

## Provider
- Name: Lyna Ashu, FNP-C
- Title: Board-Certified Family Nurse Practitioner
- Services: On-demand video visits, DOT physicals, sports physicals, weight loss, preventive care
- Video platform: Doxy.me waiting room → https://doxy.me/lynanp
- Phone: (678) 570-7587
- Email: hello@greateratlhealth.com

## Branch
Active dev branch: `claude/continue-greater-atl-health-dseRK`
Never push to main without explicit permission.

## Server
- IP: 21.0.0.166
- User: user
- Project root: /home/user/greateratlhealth

## File Structure
All files live flat in the project root (no src/ or dist/):
- index.html — main landing page
- styles.css — all styles
- app.js — minimal JS (no bundler)
- book.html, thank-you.html, contact.html — booking flow
- prepare.html — visit prep instructions
- hipaa.html, privacy.html, terms.html, nondiscrimination.html, accessibility.html — legal pages

## Pending: Provider Photo
The real photo exists on the user's Mac:
- Mac path: `~/Desktop/B75114A8-7F86-439F-88D2-CE5CE98604E4.heic`
- Upload via: `scp ~/Desktop/B75114A8-7F86-439F-88D2-CE5CE98604E4.heic user@21.0.0.166:/home/user/greateratlhealth/provider-photo.heic`
- Currently using SVG placeholder: `provider-photo.svg`
- Once uploaded: install `libheif-examples` → run `heif-convert` → produce `provider-photo.jpg` + `provider-photo.webp`
- Replace placeholder divs in index.html hero (~line 181) and about (~line 418) sections with `<picture>` elements

## Conventions
- No frameworks — keep it plain HTML/CSS/JS
- CSS custom properties defined in :root in styles.css
- Accessibility: semantic HTML, aria labels, proper heading hierarchy
- Images: prefer `<picture>` with WebP + JPEG fallback
- Do not introduce npm, build tools, or external dependencies without asking
