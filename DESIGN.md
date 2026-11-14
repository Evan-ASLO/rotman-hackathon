# Website design

## Visual authority

The user pinned `https://events.cantutor.ai/`: an airy event page with oversized bold headings, open content sections, thin rules, organizer imagery and a clear primary action. This implementation adapts that structure to a sponsorship proposal.

## System

Use the light-only `--cp-*` tokens in `styles.css` for every component color. The site never follows dark system preferences or theme query overrides. Warm neutral grounds, rose primary action, flat surfaces, thin neutral borders. Font stack: Segoe UI, Aptos, Calibri and platform sans-serif; Consolas for compact event details. The supplied organizer images retain their original colors and proportions.

Display type is large for the event title; secondary headings and body copy step down clearly. Avoid additional decorative section labels and invented event metrics. Keep sections open rather than enclosing every item in cards.

## Composition and responsiveness

Desktop: text wordmark and horizontal navigation, large two-line title with the original club marks beside it, sponsorship action, flat event facts, alternating two-column and full-width sections. Smaller screens place the marks below the title and use an accessible compact menu. Open space at the hero's foot and above the organizer images provides the departure and arrival; a narrow reading rail connects the intervening sections without covering their copy.

## Motion and accessibility

The supplied club video is the hero's quiet atmospheric backdrop, not a dark panel. A monochrome inverse/multiply treatment, warm overlay and edge mask blend it into the permanent light ground. The crossfaded loop is muted and inline, with a still poster and an accessible pause/play control. Reduced motion and data saving prevent automatic loading/playback. Hidden tabs and off-screen heroes pause it; media failures expose a still fallback and retry. The small foreground logos remain the authoritative club identities.

The user rejected the isolated convergence widget and selected a page-wide journey. Remove that panel, its miniature diagram, “Better, together” treatment, hint and replay control. The supplied logos now belong to the document: they leave their title positions, gather at the page edge, travel beside the facts and concept, then expand into their actual organizer image positions. Scrolling upward reverses the same route. On mobile, each mark lands in its own stacked organizer row. The original hero video and permanent light ground remain unchanged.

Use passive native scrolling, not scroll interception or sticky traps. Measure real image positions on layout changes, then seek three paused transform-only Web Animations API timelines in event-scheduled frames. There is no perpetual frame loop, replay or extra motion instruction. Travelling marks are pointer-transparent and hidden from assistive technology; the title images remain genuine links to the organizers. At landing, restore the normal image rather than leaving a fixed overlay behind. Keep marks away from text in a reserved rail and within the page bounds. Hidden tabs stop frame work; resize, menu reflow and deep links preserve geometry. Reduced motion and unsupported animation APIs retain static title and organizer images. Preserve native FAQs, visible focus and real downloads.

## Content integrity

RCVC = latest supplied black unicorn; RCIG = latest supplied charcoal/yellow arrows; RCEO = latest supplied black lightbulb. Display each standalone club acronym above its parenthesized full name. Dragonfruit Ventures remains a prospective partner. Lorem Ipsum and explicit unconfirmed labels stand in for event details. The draft download is real; no contact or registration submission is simulated.
