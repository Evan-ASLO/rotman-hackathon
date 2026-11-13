# Rotman hackathon proposal

A responsive, sponsorship-first single-page website for a proposed Rotman Commerce hackathon. Built with plain HTML, CSS and JavaScript; no build step, dependencies, analytics or external font services.

## Proposal status

RCVC (unicorn), RCIG (arrows) and RCEO (lightbulb) form the organizer coalition. Dragonfruit Ventures is **prospective**, not a confirmed sponsor. Dates, venue, format, attendance, eligibility, prizes, contacts and sponsorship benefits remain unconfirmed. Lorem Ipsum deliberately stands in for unfinished descriptions. Registration is not open.

## Run locally

Serve the repository with any static HTTP server. With Python installed:

    python -m http.server 4173 --bind 127.0.0.1

Open `http://127.0.0.1:4173`. The page also works directly from `index.html`, but an HTTP server is recommended for checking downloads and deployment behavior.

## Edit

- `index.html`: headings, sections, FAQ, proposal status and CTA anchors.
- `styles.css`: responsive layout and Clawpilot light/dark theme tokens. Component colors use `var(--cp-*)`.
- `script.js`: mobile navigation, bounded organizer convergence and FAQ feedback.
- `assets/rcvc.png`, `assets/rcig.png`, `assets/rceo.png`: supplied organizer logos in that exact mapping, preserved without stretching.
- `proposal.txt`: downloadable draft outline. Update alongside the website when facts are confirmed.

Do not replace placeholders with speculative facts. Keep Dragonfruit labelled prospective until confirmed. Publish a verified organizer contact before adding a contact form or email CTA.

Theme follows the browser preference. `?scoutTheme=light` and `?scoutTheme=dark` explicitly override it. Reduced-motion preference disables authored motion and smooth scrolling. Without JavaScript, content, navigation, native FAQ disclosures and downloads remain available.

## Deploy to Vercel

Import `Evan-ASLO/rotman-hackathon` through the intended personal Vercel account. Use production branch `main`, Framework Preset **Other**, repository root as Root Directory, no install or build command, and `.` as Output Directory. `vercel.json` supplies static output settings and basic response headers. No environment variables are required.

After importing, open the generated production URL and check the page, all three images, mobile navigation, FAQ and draft download. Pushes to `main` deploy automatically once the Git integration is connected.
