# Tracking Notes

No new analytics provider, pixel, retargeting script or external tracking tool
was added in this sprint.

The site currently has lightweight `data-track` attributes and JavaScript that
can push events to `dataLayer` or `gtag` if an analytics provider is loaded.
No analytics provider is currently loaded by these changes, so the next
tracking decision should be made deliberately rather than patched in page by
page.

Recommended future events:

- Contact form submit.
- Assessment request click.
- Email click.
- Phone or WhatsApp click if a real public number is added later.
- Lead magnet download.
- Demo video view.
- Booking link click if a real booking link is added later.

Do not capture sensitive form content in analytics. Event payloads should avoid
message text, document names, client names, medical details, legal details,
financial records, staff data or any other confidential business information.

If analytics is added later, prefer a simple privacy-friendly setup with clear
conversion events and no retargeting by default.
