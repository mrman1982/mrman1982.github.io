## Gen AI Solutions Static Site

Static marketing/portfolio site with SEO, accessibility, and offline/PWA enhancements for https://gen-ai-solutions.ie/.

### Pages & Features

- `index.html` (Home)
  - Schema: `ProfessionalService`, `WebSite`, `Organization`, `FAQPage`
  - Hero, service overview, workshops, FAQs
- `services.html` (Services catalog)
  - Schema: `Service` catalog + `BreadcrumbList`
  - Visible breadcrumb nav, detailed offline/self‑hosted offerings, portfolio thumbnails
- `kerry-generative-ai.html` (Local landing)
  - Schema: `LocalBusiness`, `FAQPage`, `Service`, `BreadcrumbList`
  - Targeted copy for Tralee, Killarney, Dingle, Listowel
- `ai-resources.html` (Resources hub)
  - Schema: `ItemList`, `BreadcrumbList`
  - Tool links, quick comparison table, tips
- `about.html` (About)
  - Schema: `AboutPage`
- `contact.html` (Contact)
  - Schema: `ContactPage`
  - Contact form integrated via FormSubmit (set at runtime to avoid exposing email in source)
  - Honeypot and redirect to `thank-you.html`
- `search.html` (Client-side site search)
  - Keyword search over site sections; no indexing of this page (`noindex`)
- `thank-you.html` (Post‑form confirmation)
  - `noindex,nofollow`
- `robots.txt`, `sitemap.xml`, `image-sitemap.xml` (SEO infrastructure)
- `site.webmanifest`, `sw.js` (PWA)
- `css/style.css`, `js/script.js` (UI + behavior)

### Implemented SEO & UX Improvements

1. Meta basics: unique `<title>` + meta descriptions across primary pages.
2. Canonical tags using the live domain `https://gen-ai-solutions.ie/`.
3. Open Graph & Twitter Card tags with `og:image` at `/images/og-image.png`.
4. Local/service intent keywords for Kerry and towns (Tralee, Killarney, Dingle, Listowel).
5. Structured data (JSON-LD):
   - `ProfessionalService` + `WebSite` + `Organization` + `FAQPage` (home)
   - `Service` catalog + `BreadcrumbList` (services)
   - `LocalBusiness` + `FAQPage` + `Service` + `BreadcrumbList` (Kerry page)
   - `AboutPage` (about)
   - `ContactPage` (contact)
   - `ItemList` + `BreadcrumbList` (resources)
6. Robots & sitemaps: `robots.txt` references both `sitemap.xml` and `image-sitemap.xml`.
7. Accessibility helpers: skip link, focus styles, mobile nav a11y, visually hidden utility.
8. Internal linking CTAs for crawl depth and topical relevance.
9. Service copy optimized for offline/private/self‑hosted intents (RAG, transcription, fine‑tuning, media, workshops).
10. Images have `alt`, lazy loading where appropriate, and explicit dimensions to reduce layout shift.
11. Visible breadcrumbs on key pages (e.g., Services, Kerry), plus JSON-LD breadcrumbs.
12. Client‑side search page for UX (kept out of index).

### Google & Bing SEO Setup

- Search Engine Accounts
  - Google Search Console: submit `sitemap.xml` and `image-sitemap.xml`.
  - Bing Webmaster Tools: submit the same sitemaps.
- Site Verification
  - Google: add `<meta name="google-site-verification" content="YOUR_TOKEN" />` to `index.html` (or verify via DNS/HTML file).
  - Bing: `<meta name="msvalidate.01" content="YOUR_TOKEN" />` — already present on `index.html` (update token as needed).
- Sitemaps & Robots
  - `robots.txt` includes both sitemap URLs and allows crawl.
  - Keep canonical URLs absolute and on the preferred host.
- Indexing Controls
  - `search.html` uses `noindex,follow`.
  - `thank-you.html` uses `noindex,nofollow`.
  - All other primary pages are indexable.
- Structured Data
  - Use page‑appropriate schema (see Pages & Features above) and validate via https://validator.schema.org
- Social Previews
  - Provide `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, and `twitter:card`/`twitter:image` on new pages.
- Analytics (optional)
  - Google Analytics `gtag.js` is included on `contact.html`, `search.html`, `thank-you.html`. Add to more pages if you want full‑site coverage.

### PWA & Caching

- Service worker `sw.js` at site root.
  - Navigations (HTML): network‑first with cache fallback.
  - CSS/JS: cache‑first with background refresh.
  - Images: stale‑while‑revalidate.
- Cache version: `v2` (bump `CACHE_VERSION` when deploying asset changes).
- `site.webmanifest` configured with app name, theme colors, and an icon at `/images/logo.png`.

### Contact Form Backend

- Uses FormSubmit; action is injected at runtime in `js/script.js` so the recipient email isn’t visible in static HTML.
- Anti‑spam: honeypot field and `captcha=false`.
- Redirect: `_next` to `thank-you.html` on success.

### Static Page Template (SEO‑Ready)

Use this as a starting point for new pages. Replace placeholders in ALL CAPS.

```html
<!DOCTYPE html>
<html lang="en-IE">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no" />
    <meta name="theme-color" content="#0d1117" />
    <title>PAGE TITLE — BRAND/LOCATION</title>
    <meta name="description" content="ONE SENTENCE SUMMARY FOR THIS PAGE." />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="https://gen-ai-solutions.ie/PAGE.html" />

    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IE" />
    <meta property="og:site_name" content="Gen AI Solutions" />
    <meta property="og:title" content="SOCIAL TITLE" />
    <meta property="og:description" content="SOCIAL DESCRIPTION" />
    <meta property="og:url" content="https://gen-ai-solutions.ie/PAGE.html" />
    <meta property="og:image" content="https://gen-ai-solutions.ie/images/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://gen-ai-solutions.ie/images/og-image.png" />

    <!-- Optional: Verification (use one page or DNS) -->
    <!-- <meta name="google-site-verification" content="GOOGLE_TOKEN" /> -->
    <!-- <meta name="msvalidate.01" content="BING_TOKEN" /> -->

    <!-- PWA / Icons -->
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.png" />
    <link rel="icon" type="image/png" href="/images/logo.png" />

    <!-- CSS -->
    <link rel="preload" href="/css/style.css" as="style" />
    <link rel="stylesheet" href="/css/style.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="/css/style.css" /></noscript>

    <!-- JSON-LD: choose a page-appropriate type -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "PAGE TITLE",
      "description": "ONE SENTENCE SUMMARY",
      "url": "https://gen-ai-solutions.ie/PAGE.html"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gen-ai-solutions.ie/" },
        { "@type": "ListItem", "position": 2, "name": "PAGE NAME", "item": "https://gen-ai-solutions.ie/PAGE.html" }
      ]
    }
    </script>
  </head>
  <body>
    <!-- Page content -->
    <script src="/js/script.js" defer></script>
  </body>
</html>
```

### New Static Page Checklist

- Title and unique meta description are set.
- Canonical URL uses the live domain.
- `robots` meta is correct (default `index,follow`; special pages may use `noindex`).
- Open Graph and Twitter tags filled with correct `og:url` and image.
- JSON‑LD added with appropriate type and a `BreadcrumbList`.
- Internal links added to connect the page with related content.
- Images have `alt`, explicit width/height, and `loading="lazy"` where appropriate.
- Add the page to `sitemap.xml` if it’s part of the core nav.
- If adding new key images, extend `image-sitemap.xml`.
- If analytics should track this page, add your GA snippet.

### Recommended Next Actions

1. Create a full favicon set (ICO + multiple PNG sizes) and update `<link rel="icon">` and manifest icons.
2. Ensure `og-image.png` is compressed (1200×630) and optimized.
3. Consider adding server/CDN headers:
   - `Cache-Control` (long TTL for assets, short/no-cache for HTML)
   - `Content-Security-Policy` (tighten once external assets finalized)
   - `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`
   - GitHub Pages doesn’t support custom headers; Netlify/Cloudflare can via `_headers`.
4. Extend `image-sitemap.xml` as you add portfolio images.
5. Optional: Add `humans.txt` or `security.txt`.
6. Track conversions: add an event for contact form submissions if using analytics.
7. Consider a blog or more case studies for fresh content and long‑tail queries.
8. Add a dedicated "Areas Served" section or expand local pages if targeting more regions.

### Deployment Checklist

1. Validate schema at https://validator.schema.org
2. Test Core Web Vitals via Lighthouse.
3. Submit `sitemap.xml` in Google Search Console & Bing Webmaster Tools.
4. Verify service worker registration in DevTools (Application → Service Workers).
5. If you control CDN settings, apply:
   - HTML: `Cache-Control: no-cache, must-revalidate`
   - CSS/JS/Images: `Cache-Control: public, max-age=31536000, immutable`
   - Sitemaps/robots: shorter cache (e.g., `max-age=3600`)
6. Run a link checker locally (e.g., `npx broken-link-checker`).

### Notes for Contributors

- Keep JSON-LD current when adding pages.
- When adding images, include descriptive `alt` text and explicit `width`/`height`.
- If you add new assets that should be precached, update `PRECACHE_URLS` and bump `CACHE_VERSION` in `sw.js`.
- Keep `image-sitemap.xml` in sync with any new key visuals.
