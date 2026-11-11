FROM caddy:2.11.9-alpine

WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile

# Copy the public site only. The repository also contains private local work
# and development documentation which must never become part of the web root.
COPY *.html robots.txt sitemap.xml image-sitemap.xml llms.txt pricing.md site.webmanifest sw.js BingSiteAuth.xml 3b56e2d0c1a94f7ca49d18f4f6e60f1b.txt ./
COPY css/style.css ./css/style.css
COPY js/script.js ./js/script.js
COPY images/ ./images/
COPY assets/images/ ./assets/images/

RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

EXPOSE 8080
