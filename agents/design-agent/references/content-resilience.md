# Content resilience and internationalization evidence

Use this protocol for pseudo-localization, long-content, RTL, mixed-direction, text-enlargement, and narrow-reflow evidence.

## Bound every claim to its method

- **Pseudo-localization stress** tests string growth, wrapping, control sizing, and content-dependent breakpoints. It does not validate translation quality, grammar, cultural fit, terminology, or locale formatting.
- **Representative locale render** shows one supplied translation and direction in one browser. It does not prove completeness across the product or linguistic correctness without qualified review.
- **RTL render** tests the reproduced DOM, CSS, logical properties, and supplied mixed-direction values. It does not prove every bidi combination, screen-reader pronunciation, or mirrored interaction.
- **Text-only enlargement simulation** tests the exact author stylesheet or browser setting recorded in the trace. Do not call an author stylesheet browser zoom, OS text scaling, Dynamic Type, or a user preference.
- **Narrow CSS viewport** is direct reflow evidence at that width. A 320 CSS px viewport is not proof that 400% browser zoom from 1280 px was performed.

Record the source and stress-harness hashes, browser, language, direction, viewport, device scale, exact content transformation, screenshot, document overflow, nested overflow, clipped text, offscreen controls, and visible responsive representation.

## Stress content deliberately

Use several stress types; do not rely on one universal expansion percentage:

- long short-label strings for buttons, tabs, filters, and menu triggers;
- long headings, organization names, subjects, errors, and status messages;
- unbreakable identifiers, URLs, account numbers, and compound words;
- large counts, currencies, dates, and localized number formats;
- mixed RTL/LTR names, IDs, Latin product tokens, and digits;
- empty, singular, plural, and maximum realistic values.

Pseudo-localized brackets and accent marks are useful harness signals, not product copy. Keep task-critical content intact so the audit tests resilience rather than content removal.

## Separate failure classes

### Page overflow

`documentElement.scrollWidth > clientWidth` is page-level horizontal overflow. Locate the widest responsible descendants and distinguish:

- a task-critical control or text region forcing the page wider;
- a documented two-dimensional region such as a table or chart;
- an internal scroller with a visible affordance and verified keyboard reachability;
- an intentionally off-canvas element that is inactive and removed from the focus order.

Do not excuse page overflow because an internal table is allowed to scroll. Do not call overflow inaccessible until reachability is tested.

### Clipping and truncation

Confirm the exact element has bounded content outside its visible box. Visually-hidden labels and inactive off-canvas content are not visual clipping defects. A placeholder may visually clip without losing the control’s accessible label; inspect the real label separately.

When missing text changes the task, wrapping or an explicit expandable full-value path is required. Do not solve a critical label, status, identity, amount, or identifier by silent truncation.

### Reflow and representation

At each width record which representation is active—table, list, cards, disclosure—and whether the full task remains reachable. A top-of-page screenshot and page-level width metric do not prove below-fold controls, nested scroll regions, focus visibility, or content parity.

## Inspect RTL and bidi

- Set valid `lang` and `dir` at the document or content boundary.
- Prefer logical properties such as `padding-inline`, `inset-inline-start`, and `border-inline-start`.
- Verify that leading/trailing layout and directional decoration mirror, while product meaning and numeric digit order do not reverse.
- Use `<bdi>` or an explicit direction boundary for mixed identifiers when surrounding RTL text can reorder them.
- Preserve one coherent DOM, visual, and focus order in both directions. Mirroring geometry does not require reversing semantic priority.
- Record untranslated strings separately from layout failures. A stable English control in an Arabic render proves layout survival, not localization completeness.

## Compare a stress matrix

| State | Width | Content/direction method | Page overflow | Clipping or loss | Active representation | Claim boundary |
| --- | ---: | --- | --- | --- | --- | --- |
| Baseline or stress state | CSS px | exact harness action | observed metric | exact element | table/list/card | what remains unverified |

Rank task loss and unreachable actions first, page overflow second, contradictory ordering and localization gaps next, then isolated wrapping polish.

For each correction, verify all affected states. Do not fix a long label at one breakpoint by creating clipping in another locale, direction, text size, or viewport.

## Acceptance gates

- No page-level horizontal overflow at supported widths unless the product explicitly requires a two-dimensional page surface.
- Critical content and actions remain visible or have an explicit, reachable full-value path.
- Controls grow or wrap without overlap, offscreen placement, or loss of hit area.
- One task-complete responsive representation is active and content-equivalent at each width.
- RTL uses correct document metadata, mirrors directional styling, and preserves mixed identifier/digit order.
- Untranslated or malformed locale content is reported separately from rendering resilience.
- Text enlargement, actual browser zoom, OS scaling, and CSS reflow are named and tested as separate methods.
- Remaining linguistic, assistive-technology, browser, and below-fold unknowns are disclosed.
