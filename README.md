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
- `script.js`: mobile navigation, page-wide organizer logo journey and FAQ feedback. Actual title and organizer image positions define the routes; scroll position seeks paused Web Animations API timelines.
- `assets/rcvc.png`, `assets/rcig.png`, `assets/rceo.png`: latest supplied organizer logos in that exact mapping: black unicorn, charcoal/yellow arrows, and black lightbulb. Preserve their colors and proportions. Each acronym displays its full club name beneath it in parentheses.
- `proposal.txt`: downloadable draft outline. Update alongside the website when facts are confirmed.
- `assets/hero-background.webm`: crossfaded decorative loop derived from the supplied video. `hero-background.mp4` is the original fallback; `hero-background-poster.jpg` supplies the static treatment.

Do not replace placeholders with speculative facts. Keep Dragonfruit labelled prospective until confirmed. Publish a verified organizer contact before adding a contact form or email CTA.

The website is permanently light-only, regardless of browser preference or theme query parameters. Reduced-motion preference disables automatic authored motion and smooth scrolling. Without JavaScript, content, navigation, native FAQ disclosures, the hero still and downloads remain available.

The supplied video is blended into the full-width hero using a pale monochrome treatment and fading edges. Playback is muted and inline, with explicit pause/play controls. Sources load only when playback is requested and the hero is visible. Reduced-motion and data-saving preferences start with the still image; visitors may explicitly choose playback. Off-screen and hidden-tab playback pauses. Loading errors keep the still treatment and expose a retry control.

The three supplied logos begin alongside the title, gather along the page edge, accompany the event facts and concept, then settle into their actual organizer positions. The standalone convergence panel, diagram, replay button and scrolling instructions are removed. A reserved reading rail keeps travelling marks out of the copy; organizer names remain in normal document flow. Native touch, wheel and keyboard scrolling reverse the journey without pinning or scroll interception. The moving copies are decorative; real title links and organizer image alternatives remain accessible. At each landing, the moving copy hands over to the normal organizer image. Resizing and deep links recalculate from the current scroll position. Reduced motion, no JavaScript and unsupported animation APIs show the original static images instead. Frames run only on scroll/layout events, with no idle animation loop.

## Deploy to Vercel

Import `Evan-ASLO/rotman-hackathon` through the intended personal Vercel account. Use production branch `main`, Framework Preset **Other**, repository root as Root Directory, no install or build command, and `.` as Output Directory. `vercel.json` supplies static output settings and basic response headers. No environment variables are required.

After importing, open the generated production URL and check the page, all three images, mobile navigation, FAQ and draft download. Pushes to `main` deploy automatically once the Git integration is connected.
