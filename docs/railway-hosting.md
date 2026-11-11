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

The contact form delivers to `support@gen-ai-solutions.com` in Zoho Mail through
FormSubmit. Activate the recipient when FormSubmit requests confirmation, then
verify a labelled enquiry arrives before declaring form delivery ready.
JavaScript sets its
FormSubmit thank-you URL to the current website origin, so the Railway URL and
a new custom domain return visitors to a working confirmation page. Without
JavaScript, FormSubmit supplies its default confirmation page. The service-worker
cache version is `v12` for the website refresh and new service pages.

The production origin is `https://gen-ai-solutions.com/`, with `www` redirected
to the apex by Caddy. Cloudflare manages registration and DNS, Railway hosts
the static website, and Zoho Mail handles `support@gen-ai-solutions.com` as an
additional send-and-receive address in the existing Zoho mailbox.

The generated Railway URL is
`https://website-production-90779735.up.railway.app/`. Production follows
`main` in `mrman1982/mrman1982.github.io`. Prepare and review website changes on
a separate branch, then integrate the intended files into `main` for Railway
to build. If temporarily pinning a service to a commit, pushing alone will not
deploy until that pin is removed or replaced. Verify the resulting deployment
and public HTTPS after each release.
