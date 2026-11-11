# Railway static website hosting

The repository's Dockerfile packages the existing Gen AI Solutions HTML, CSS,
JavaScript, images and public discovery files. Railway can build this Dockerfile
directly from the connected GitHub repository. No Node build or database is needed.

Caddy listens on Railway's `PORT`, with port 8080 as the local default. Railway
terminates public HTTPS, so Caddy's automatic HTTPS and administration endpoint
are disabled. `railway.json` checks `/health` before a deployment becomes healthy.

The image has an explicit public-file allowlist. Development tools, documentation,
correspondence, dotfiles, credentials and the separate `coming-soon/` marketplace
are excluded. Add a new public asset to both the Dockerfile and `.dockerignore`
when it is outside the current copied paths or file types.

Caddy implements the useful page aliases from `_redirects`, keeps missing pages
at HTTP 404, and sends the site's basic security headers. It does not interpret
the old `_headers` and `_redirects` files. The previous CSP is intentionally not
activated during this hosting move because it would block existing inline and
onload behaviour. A separate CSP change needs its own browser validation.

## Local checks

With Docker running, build and test the exact deployment image:

```powershell
docker build -t gen-ai-solutions-railway .
docker run --rm -p 8080:8080 -e PORT=8080 gen-ai-solutions-railway
```

Check `/health`, `/`, `/services.html`, `/services`, `/css/style.css`, and an image.
`/index.html` and `/rag-and-fine-tuning-explained.html` should return HTTP 301 to
their intended targets. A missing path, `/README.md`, `/AGENTS.md`, `/.git/config`,
`/.local/`, `/docs/`, `/tools/`, and `/coming-soon/` must return HTTP 404.

For a native Caddy smoke test, `SITE_ROOT` can point at a temporary directory
containing the same allowlisted public files. Do not point it at the repository
root, since that bypasses the Docker packaging boundary.

## Deployment and domain checks

Connect the intended repository and branch, deploy, and generate a Railway URL.
Verify the same routes and 404 boundaries on that public URL. Add the selected
custom domain only after ownership is established, then use the exact DNS values
returned by Railway. Keep Zoho's mail DNS records independent of the web records.

The contact form keeps its existing delivery recipient. JavaScript sets its
FormSubmit thank-you URL to the current website origin, so the Railway URL and
a new custom domain return visitors to a working confirmation page. Without
JavaScript, FormSubmit supplies its default confirmation page. The service-worker
cache version is `v11` for this HTML/JavaScript change.

The hosting move does not change public copy, email delivery or canonical URLs.
Update those separately when the final domain and website refresh are approved.
Until then, a Railway preview still contains the original `.ie` metadata.
