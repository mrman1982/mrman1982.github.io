# Tracking Notes

Google Analytics loading and conversion-event sending were removed from
`js/script.js` on 11 November 2026. The site does not initialise `gtag` or
`dataLayer`, send analytics events, or create analytics or advertising cookies.
Existing `data-track` attributes are inert markup, with no event listeners or
network requests attached to them.

The light/dark theme preference is stored locally under `genai-theme`. It is
read by the browser to restore the chosen theme, not sent to an analytics
service. The service worker caches public site files for repeat and offline
visits. These browser features do not track conversions.

HTML requests versioned CSS and JavaScript URLs so returning visitors do not
run the earlier analytics loader from an old service-worker cache. Update those
URL versions and the matching service-worker precache entries together when
releasing changes to shared assets.

Website delivery still requires normal requests to the host and network
providers. This is separate from a visitor analytics service. Public pages use
local assets and device fonts, with no external icon-font dependency. Contact enquiries are submitted
to FormSubmit and forwarded to the configured Zoho Mail address. Do not describe
the entire site as making no third-party connections.

The privacy policy describes the current browser preference, website delivery
and enquiry processing. Do not add analytics, advertising pixels or conversion
tracking without an explicit decision about purpose, data collection and
visitor controls. Never include enquiry text or confidential project details
in an analytics payload.
