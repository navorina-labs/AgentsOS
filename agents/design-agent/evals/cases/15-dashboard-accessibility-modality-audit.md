# Dashboard accessibility and modality audit

Audit the reproduced accessibility and input-modality evidence for the revised operations dashboard.

Attachments:

- `attachments/dashboard-a11y-keyboard-assign-focus-1440x1000.png`
- `attachments/dashboard-a11y-keyboard-loading-1440x1000.png`
- `attachments/dashboard-a11y-keyboard-error-focus-1440x1000.png`
- `attachments/dashboard-a11y-keyboard-success-focus-1440x1000.png`
- `attachments/dashboard-a11y-mobile-menu-focus-390x1000.png`
- `attachments/dashboard-a11y-mobile-menu-open-390x1000.png`
- `attachments/dashboard-a11y-mobile-menu-escape-390x1000.png`
- `attachments/dashboard-a11y-forced-colors-1440x1000.png`
- `attachments/dashboard-a11y-reduced-motion-1440x1000.png`
- `attachments/dashboard-a11y-reflow-200pct-equivalent-720x500-at-2x.png`
- `attachments/visual-dashboard-after.html`
- `attachments/dashboard-interactions.js`
- `attachments/dashboard-accessibility-trace.json`
- `attachments/dashboard-accessibility-tree.json`

The Chrome trace binds source and harness hashes, exact key sequences, active elements, contract checks, media emulation, viewport metrics, and screenshots. The primary user is an operations lead who must assign an incident owner and use the responsive header without a pointer.

Deliver:

1. an evidence matrix for the desktop keyboard journey, focus through async error/retry/success, mobile focus order and dismissal, browser AX semantics, forced colors, reduced motion, and the reflow-equivalent capture;
2. ranked accessibility, modality, focus-recovery, reading-order, disclosure, semantics, and reflow findings;
3. exact distinctions among interaction-observed, semantics-observed, visible-only, source-confirmed, and unverified claims;
4. systemic component and state-contract corrections with testable acceptance gates;
5. a `Promote`, `Revise`, or `Inconclusive` verdict.

Treat failed contract checks in the trace as evidence, not as test-run failure. Compare the mobile DOM focus order with the visible order. Inspect whether disabling the focused assignment control strands focus and quantify the recorded retry path. Check whether `Escape` dismisses the open mobile disclosure and where focus remains.

Do not claim that the Chrome accessibility tree proves VoiceOver, NVDA, JAWS, TalkBack, speech, braille, or live-region announcements. Do not call the 720 CSS px at device scale factor 2 capture actual browser zoom; it is explicitly a 200%-scale reflow equivalent. A page-level overflow check does not prove reachability inside every nested region. Do not claim comprehensive keyboard, forced-colors, reduced-motion, accessibility-conformance, backend, network, or user-outcome coverage from these artifacts.
