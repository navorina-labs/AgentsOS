# UI specification template

Omit sections that genuinely do not apply. Keep decisions testable.

For a validated handoff, author the normative contract with
[ui-spec-schema.json](ui-spec-schema.json) and follow
[structured-specification.md](structured-specification.md). Derive this Markdown
view from the contract IDs rather than maintaining two independent requirements
documents.

## Context

- Product / surface:
- Primary user and job:
- Business or product outcome:
- Platform and viewport range:
- Existing design system:
- Constraints:
- Assumptions:
- Out of scope:

## Experience model

- Entry points:
- Primary flow:
- Alternate and recovery flows:
- Information architecture:
- Success signal:

## Screen or view specification

Repeat for each view:

### `[View name]`

- Purpose:
- Primary action:
- Reading and focus order:
- Regions and hierarchy:
- Layout/grid:
- Content rules:
- Components:
- Interactions:
- States:
- Edge cases:
- Analytics or instrumentation:

## Foundations

- Color roles:
- Typography roles:
- Spacing and grid:
- Shape/elevation:
- Iconography/imagery:
- Motion:

Prefer semantic token examples such as `color.text.muted` or `space.cluster.sm`; do not freeze arbitrary values when the project already has tokens.

## Component contracts

For each new or changed component:

- Purpose and anatomy:
- Variants and sizes:
- Properties and defaults:
- States:
- Keyboard interaction:
- Accessible name/role/value:
- Content constraints:
- Responsive behavior:
- Do / don’t:

## Responsive behavior

Describe what changes, why it changes, and the content condition that triggers it. Cover narrow, intermediate, and wide layouts plus text scaling and input-method changes.

## Accessibility

- Target standard:
- Semantic structure:
- Focus order and keyboard model:
- Contrast requirements:
- Target sizes:
- Labels, instructions, errors, and announcements:
- Zoom/reflow/text resizing:
- Motion and media alternatives:
- Manual and automated test plan:

## Acceptance criteria

Write observable checks using Given/When/Then or concise equivalent statements. Include core task, state coverage, responsiveness, accessibility, and content stress cases.

Reference the exact contract each criterion verifies. Every implementation-ready
contract needs at least one acceptance criterion; unresolved `requires_decision`
contracts instead link to an open question.

## Evidence and decisions

| Decision | Evidence/source | Confidence | Trade-off |
|---|---|---|---|

## Open questions

List only decisions that materially block or change implementation.

Label normative decisions and requirements as `confirmed`,
`proposed_default_validate`, or `requires_decision`. Never hide a missing product
decision inside an assumption.
