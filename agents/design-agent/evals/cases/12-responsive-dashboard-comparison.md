# Responsive dashboard comparison

Audit four matched renders of the same operations dashboard and its HTML source.

Attachments:

- `attachments/visual-dashboard-1440x1000.png`
- `attachments/visual-dashboard-1024x1000.png`
- `attachments/visual-dashboard-768x1000.png`
- `attachments/visual-dashboard-390x1000.png`
- `attachments/visual-dashboard.html`

All screenshots use the same content, static state, Chrome rendering, 1000 CSS-pixel height, 100% zoom, and device scale factor 1. Only viewport width changes.

The primary user is an operations lead who must identify urgent incidents, assign owners, and inspect affected tickets.

Deliver:

1. a compact viewport comparison matrix for task-critical regions;
2. ranked persistent and transition findings, each tied to exact supplied widths;
3. observed breakpoint intervals without inventing exact breakpoint pixels;
4. a responsive composition and component-contract direction;
5. the additional renders, states, and interaction checks needed to verify the correction.

Distinguish visible, source-confirmed, and unverified claims. Do not infer scrolling reachability, DOM or focus order, accessibility conformance, user outcomes, or behavior between supplied widths from static screenshots.
