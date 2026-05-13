# Tracking Notes

Google Analytics 4 is loaded centrally from `js/script.js` using measurement ID
`G-L7W0E1GDX0`.

The site keeps lightweight `data-track` attributes and JavaScript that pushes
conversion events to `dataLayer` and `gtag`. The analytics loader respects
browser Do Not Track signals and does not load GA4 when Do Not Track is enabled.

Advertising storage, ad user data and ad personalisation signals are denied in
the GA4 consent defaults. Do not add retargeting or advertising pixels without a
separate privacy review.

Tracked or recommended events:

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

If more analytics is added later, prefer a simple privacy-friendly setup with
clear conversion events and no retargeting by default.
