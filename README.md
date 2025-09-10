## Gen AI Solutions Static Site

This repository hosts the static marketing/portfolio site with SEO & accessibility enhancements.

### Implemented SEO Improvements
1. Meta basics: unique `<title>` + meta description on all primary pages.
2. Canonical tags (placeholder domain) to prevent duplicate URL issues.
3. Open Graph & Twitter Card tags for rich sharing.
4. Local / service intent keywords inserted (placeholders like `[Your City]`).
5. Structured data (JSON-LD):
   - `ProfessionalService` (home)
   - `Service` catalog (services page)
   - `AboutPage` (about)
   - `ContactPage` (contact)
6. Added `robots.txt` and `sitemap.xml` (remember to update domain before deploying).
7. Accessibility helpers: skip link + visually hidden utility + improved headings.
8. Added more internal linking CTAs for crawl depth and topical relevance.
9. Improved service copy for intent (offline, private, self‑hosted, on‑prem, RAG, transcription, fine-tuning, media).
10. Image `alt` attributes and `loading="lazy"` where appropriate.

### Replace Placeholders
Search and replace the following with real values:
- `[Your City]`, `[Region]`, `[Street Address]`, `[Postcode]`
- Social profile URLs
- `https://www.example.com/` (domain in meta, schema, sitemap, robots)
- Telephone number
Add a real `og-image.png` and optionally `favicon.png` in `assets/images/`.

### Recommended Next Actions
1. Create a favicon set (ICO + PNG variants) and update `<link rel="icon">`.
2. Add a compressed Open Graph preview image (1200x630) referencing real domain.
3. Add HTTPS + redirect www/non-www consistently when hosting.
4. Set up server headers:
   - `Cache-Control` for static assets
   - `Content-Security-Policy` (tighten once images/fonts finalised)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
5. Generate an XML image sitemap if you add many media assets.
6. Add a `humans.txt` or `security.txt` if relevant.
7. Track conversions: add privacy-friendly analytics (e.g., Plausible / self-hosted) + event for Contact form submissions.
8. Consider adding a blog or case study section for recurring fresh content (improves topical authority and long-tail capture).
9. Add `breadcrumbs` (JSON-LD + visible) if site structure grows.
10. Implement structured FAQ (FAQPage) for common buyer questions (can rank for People Also Ask).

### Performance Suggestions
- Inline critical CSS for above-the-fold hero (optional refinement).
- Add explicit image dimensions to prevent layout shift.
- Use modern image formats (WebP/AVIF) for thumbnails.
- Preload primary font weights if layout shift observed.

### Local SEO (When Ready)
1. Set up and verify Google Business Profile (matching NAP: Name, Address, Phone).
2. Ensure NAP consistency on any local directory citations.
3. Embed a map (optional) on Contact page once real address is public.
4. Add a dedicated "Areas Served" section or page.

### Contact Form Backend
Currently the contact form is client-only (console + alert). Implement one of:
- Form submission to serverless function (Netlify Functions, Cloudflare Workers, AWS Lambda) with spam protection (honeypot + rate limit).
- Direct integration with an email API (Postmark / SES). Avoid exposing keys client side.

### Deployment Checklist
1. Replace placeholders listed above.
2. Run a link checker (e.g., `npx broken-link-checker`).
3. Validate schema at https://validator.schema.org
4. Test Core Web Vitals via Lighthouse.
5. Submit `sitemap.xml` in Google Search Console & Bing Webmaster Tools.

### Future Enhancements (Optional)
- Add `manifest.webmanifest` + basic PWA for offline viewing of marketing copy.
- Add dark/light toggle if branding evolves.
- Add microcopy for conversion trust (testimonials, security badges, compliance notes).
- Integrate a simple pricing or engagement model page for higher commercial intent queries.

---
Feel free to ask for automation scripts (e.g., build script to minify assets) if you take this beyond static hosting.

