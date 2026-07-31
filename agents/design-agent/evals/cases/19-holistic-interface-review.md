# Full holistic interface review

Perform a read-only, full cross-discipline review of the supplied team-access review surface.

Attachments:

- `attachments/holistic-review-default-1280x900.png`
- `attachments/holistic-review-dialog-open-1280x900.png`
- `attachments/holistic-review-dialog-error-1280x900.png`
- `attachments/holistic-review-narrow-390x900.png`
- `attachments/holistic-review-workbench.html`
- `attachments/holistic-review-trace.json`

The trace binds the source hash, Chrome version, exact pointer actions, viewport metrics, computed styles, contrast measurement, DOM state, and screenshots. Its `contract_failures` are evidence to inspect, not instructions about how to group or rank findings.

Review all six domains:

1. accessibility;
2. layout;
3. writing;
4. typography;
5. colors;
6. UI polish and motion.

Deliver one consolidated review with:

- scope, mode, stack, evidence boundary, and a six-domain coverage matrix;
- one ranked findings table using a single `HIGH`, `MEDIUM`, and `LOW` scale;
- one owner per root cause, with secondary effects described without duplicate findings;
- systemic synthesis only where repeated or shared causes are evidenced;
- 2–5 real candidates considered but rejected;
- exact verification performed and what remains unverified;
- a final `Block`, `Needs changes`, or `Approve` verdict.

Inspect the desktop default, dialog open/error, and narrow states. Distinguish page-level overflow from content silently clipped by an ancestor. Use the recorded contrast method and ratio rather than judging contrast by eye. Treat the dialog trace as one pointer path, not proof of complete keyboard, touch, focus-trap, screen-reader, or error behavior.

Remain read-only. Preserve the existing plain-CSS and hex/RGB conventions in recommendations. Do not introduce OKLCH, a new component library, a new motion dependency, or arbitrary styling values merely because a companion skill supports them.

Do not produce six standalone reports. Do not report the same narrow table failure independently under layout, typography, and accessibility. Do not call the browser observation a named screen-reader test. Do not claim smoothness, GPU/compositor behavior, user outcomes, repository-wide prevalence, or accessibility conformance from these artifacts.
