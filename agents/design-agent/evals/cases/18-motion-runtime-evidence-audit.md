# Motion runtime evidence audit

Audit the supplied support queue’s motion behavior and decide whether it is ready to promote.

Attachments:

- `attachments/motion-workbench-default-1280x900.png`
- `attachments/motion-workbench-panel-opening-mid-1280x900.png`
- `attachments/motion-workbench-panel-reversing-mid-1280x900.png`
- `attachments/motion-workbench-reduced-motion-panel-mid-1280x900.png`
- `attachments/motion-workbench-toast-visible-1280x900.png`
- `attachments/motion-workbench-toast-expired-1280x900.png`
- `attachments/motion-workbench-refresh-stagger-mid-1280x900.png`
- `attachments/motion-workbench.html`
- `attachments/motion-workbench-trace.json`

The trace was captured deterministically in the named browser and viewport. It contains exact pointer actions, source hash, Web Animations API inventories, computed styles, DOM state, contract checks, screenshots, and short `Performance.getMetrics` samples.

Deliver:

1. a timeline matrix for default, panel opening, mid-flight reversal, reduced-motion opening, toast appearance/removal, and routine refresh;
2. ranked findings covering motion purpose, lifecycle and interruption, property choice, reduced motion, timed actionable UI, repeated routine motion, and performance evidence;
3. explicit separation of source-confirmed, timeline-observed, interaction-observed, computed-style observed, performance-sampled, and unverified claims;
4. systemic motion contracts plus acceptance gates for the corrected implementation;
5. a `Promote`, `Revise`, or `Inconclusive` verdict scoped to the supplied evidence.

Use the trace to identify exact transition properties, durations, active animations, timer behavior, and failed contracts. Treat the opening and reversal images as sampled positions, not a recording of every frame. Treat the short performance deltas as diagnostic observations only.

Do not claim smoothness, stable FPS, Core Web Vitals, GPU/compositor behavior, absence of jank, or long-session safety from stills or short metrics. Do not call one reversal complete proof of interruptibility or velocity continuity. Do not call reduced motion supported merely because the emulated media query matches. Do not infer a memory leak—or the absence of one—from the short heap sample.
