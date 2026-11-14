# Website design

## Visual authority

The user pinned `https://events.cantutor.ai/`: an airy event page with oversized bold headings, open content sections, thin rules, organizer imagery and a clear primary action. This implementation adapts that structure to a sponsorship proposal.

## System

Use the light-only `--cp-*` tokens in `styles.css` for every component color. The site never follows dark system preferences or theme query overrides. Warm neutral grounds, rose primary action, flat surfaces, thin neutral borders. Font stack: Segoe UI, Aptos, Calibri and platform sans-serif; Consolas for compact event details. The supplied organizer images retain their original colors and proportions.

Display type is large for the event title; secondary headings and body copy step down clearly. Avoid additional decorative section labels and invented event metrics. Keep sections open rather than enclosing every item in cards.

## Composition and responsiveness

Desktop: text wordmark and horizontal navigation, large two-line title, sponsorship action alongside the three-club coalition, flat event facts, alternating two-column and full-width sections. Smaller screens stack content, use an accessible compact menu, and retain readable organizer images and the same section order.

## Motion and accessibility

The supplied club video is the hero's quiet atmospheric backdrop, not a dark panel. A monochrome inverse/multiply treatment, warm overlay and edge mask blend it into the permanent light ground. The crossfaded loop is muted and inline, with a still poster and an accessible pause/play control. Reduced motion and data saving prevent automatic loading/playback. Hidden tabs and off-screen heroes pause it; media failures expose a still fallback and retry. The small foreground logos remain the authoritative club identities.

The user selected the cinematic coalition direction: three SVG routes connect the original logos to one junction. A bounded Web Animations API sequence moves the logos inward along the drawn paths, then returns them to their corresponding name columns. The names remain stationary and readable. Route tracing and one junction pulse support that same focal moment rather than adding competing effects.

The sequence plays once when visible. Replay is explicit; off-screen, hidden-tab, resize and reduced-motion states cancel playback to the static layout. FAQ feedback stays short. Default HTML remains useful without JavaScript, and unsupported animation APIs use the static composition. Use semantic landmarks, native details/summary FAQs, visible focus and genuine links.

## Content integrity

RCVC = latest supplied black unicorn; RCIG = latest supplied charcoal/yellow arrows; RCEO = latest supplied black lightbulb. Display each standalone club acronym above its parenthesized full name. Dragonfruit Ventures remains a prospective partner. Lorem Ipsum and explicit unconfirmed labels stand in for event details. The draft download is real; no contact or registration submission is simulated.
