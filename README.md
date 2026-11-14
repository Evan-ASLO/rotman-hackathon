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
- `styles.css`: responsive layout and Clawpilot light-only theme tokens. Component colors use `var(--cp-*)`.
- `script.js`: mobile navigation, scroll-linked SVG organizer choreography and FAQ feedback. Route geometry is sampled on layout changes; scroll position seeks paused Web Animations API timelines.
- `assets/rcvc.png`, `assets/rcig.png`, `assets/rceo.png`: latest supplied organizer logos in that exact mapping: black unicorn, charcoal/yellow arrows, and black lightbulb. Preserve their colors and proportions. Each acronym displays its full club name beneath it in parentheses.
- `proposal.txt`: downloadable draft outline. Update alongside the website when facts are confirmed.
- `assets/hero-background.webm`: crossfaded decorative loop derived from the supplied video. `hero-background.mp4` is the original fallback; `hero-background-poster.jpg` supplies the static treatment.

Do not replace placeholders with speculative facts. Keep Dragonfruit labelled prospective until confirmed. Publish a verified organizer contact before adding a contact form or email CTA.

The website is permanently light-only, regardless of browser preference or theme query parameters. Reduced-motion preference disables automatic authored motion and smooth scrolling. Without JavaScript, content, navigation, native FAQ disclosures, the hero still and downloads remain available.

The supplied video is blended into the full-width hero using a pale monochrome treatment and fading edges. Playback is muted and inline, with explicit pause/play controls. Sources load only when playback is requested and the hero is visible. Reduced-motion and data-saving preferences start with the still image; visitors may explicitly choose playback. Off-screen and hidden-tab playback pauses. Loading errors keep the still treatment and expose a retry control.

The coalition artwork uses three SVG routes and the supplied logos. Scrolling down draws the logos together, traces their routes and accents “Better, together”; scrolling back up separates them. Club names remain fixed and readable. Native touch, wheel and keyboard scrolling all control the same progress without pinning or scroll interception. Replay provides a bounded preview and returns to the current scroll state; scrolling interrupts it immediately. Resizing remeasures the routes without resetting scroll position. Hidden tabs and off-screen artwork stop preview work; reduced motion or unsupported animation APIs keep the original static composition. Animation frames run only on scroll/layout events or during the explicit 1.6-second preview, never continuously while idle.

## Deploy to Vercel

Import `Evan-ASLO/rotman-hackathon` through the intended personal Vercel account. Use production branch `main`, Framework Preset **Other**, repository root as Root Directory, no install or build command, and `.` as Output Directory. `vercel.json` supplies static output settings and basic response headers. No environment variables are required.

After importing, open the generated production URL and check the page, all three images, mobile navigation, FAQ and draft download. Pushes to `main` deploy automatically once the Git integration is connected.
