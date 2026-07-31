# Dashboard content resilience and internationalization audit

Audit the reproduced content-stress states for the revised operations dashboard.

Attachments:

- `attachments/dashboard-content-pseudo-1440x1000.png`
- `attachments/dashboard-content-pseudo-768x1000.png`
- `attachments/dashboard-content-pseudo-390x1000.png`
- `attachments/dashboard-content-pseudo-320x1000.png`
- `attachments/dashboard-content-rtl-1440x1000.png`
- `attachments/dashboard-content-rtl-390x1000.png`
- `attachments/dashboard-content-text-200-1440x1000.png`
- `attachments/dashboard-content-text-200-390x1000.png`
- `attachments/visual-dashboard-after.html`
- `attachments/dashboard-content-stress.js`
- `attachments/dashboard-content-stress-trace.json`

The Chrome trace binds source and harness hashes, viewport metrics, language and direction, overflow and clipping inventories, responsive representation, checks, and screenshots.

Deliver:

1. a matched state/viewport matrix for pseudo-localized growth, 320 px reflow, Arabic RTL with mixed Latin identifiers, and 200% text-only enlargement;
2. ranked content-resilience, page-overflow, wrapping, breakpoint, RTL/bidi, localization-completeness, and responsive-representation findings;
3. exact distinctions among visible, source-confirmed, trace-observed, and unverified claims;
4. systemic component, layout, typography, localization, and regression-suite corrections;
5. a `Promote`, `Revise`, or `Inconclusive` verdict with binary acceptance gates.

Treat failed contract checks as evidence. Locate the cause of page-level overflow rather than merely reporting `scrollWidth`. Compare 1440, 768, 390, and 320 pseudo-locale states. Inspect whether long header content and controls grow or wrap coherently. In RTL, distinguish successful logical-property mirroring and stable mixed identifiers from untranslated English control values and still-unverified bidi combinations.

The pseudo strings test growth only; do not call them a production translation or use them to judge German language quality. The 200% author stylesheet is a deterministic text-only enlargement simulation, not browser zoom, OS text scaling, Dynamic Type, or user settings. The 320 CSS px viewport is direct narrow-reflow evidence, not proof that 400% browser zoom was performed. Page-level width does not prove nested or below-fold reachability. Do not solve task-critical overflow by silently truncating required content.
