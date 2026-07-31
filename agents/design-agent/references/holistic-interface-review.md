# Holistic interface review

Use this protocol for a full or quick cross-discipline review of one screen, flow, feature, or bounded product surface.

## Resolve scope before findings

State:

- review mode: `quick` or `full`;
- exact surface, flow, states, viewports, and artifacts inspected;
- stack, styling system, tokens, and component conventions visible in source;
- evidence or domains that were unavailable.

Use `full` unless the request asks for a quick review. A quick review covers the primary path and reports only high- and medium-impact findings, capped at five. A full review covers all supplied states and domains, capped at fifteen. Never imply that an uninspected repository or product was reviewed.

## Inspect in owner order

Review foundations before polish:

1. accessibility;
2. layout;
3. writing;
4. typography;
5. colors;
6. UI polish and motion.

When companion `better-*` skills are available, use each as the source of truth for its domain. Use one consolidated output format rather than each skill’s standalone format. Mark an unavailable domain `Not reviewed`; do not silently reconstruct it from memory or claim holistic coverage.

Build a coverage matrix:

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | exact source, render, trace, or check | finding count, `Clear`, or `Not reviewed` |

`Clear` means the supplied evidence was actually inspected and no actionable issue was found. It is not a claim of complete product quality or conformance.

## Assign one owner per root cause

One root cause becomes one finding even when it has several effects.

- Missing name, focus, semantics, keyboard path, or modality contract → **Accessibility**.
- Grouping, order, reachability, reflow, breakpoint, or clipping caused by structure → **Layout**.
- Ambiguous outcome, terminology, error instruction, or recovery copy → **Writing**.
- Rendering, type scale, line-height, measure, wrapping, or truncation mechanics → **Typography**.
- Measured contrast, gamut, semantic color role, or appearance palette → **Colors**.
- Radius, elevation, icon craft, transition specificity, or nonessential motion → **UI**.

Mention secondary effects in the same finding. Do not repeat a narrow-layout truncation as separate layout, typography, and accessibility rows unless evidence shows independent root causes requiring different corrections.

When ownership is ambiguous, assign the finding to the layer that must change:

- fixed columns silently clip several fields → Layout owns it;
- a correctly sized column deliberately truncates one value without full-text access → Typography owns it;
- vague destructive label remains vague at every width → Writing owns it;
- text becomes unreadable because a measured foreground/background pair fails → Colors owns the measurement, while Accessibility may classify the user impact.

## Consolidate systemic evidence

Cluster occurrences only when one correction prevents them:

| Cluster | Evidence | Immediate containment | Reusable correction | Audit scope and verification |
| --- | --- | --- | --- | --- |

Do not call one occurrence product-wide. Distinguish:

- repeated evidence in the supplied scope;
- source-confirmed shared primitive;
- suspected reuse requiring repository discovery.

Keep an unrelated blocker separate even when combining it would make the report shorter.

## Use one severity and verdict scale

- **HIGH:** blocks a task, hides required content or controls, misleads a consequential decision, creates data-loss risk, or establishes a repeated systemic failure.
- **MEDIUM:** materially harms comprehension, efficiency, adaptability, trust, or consistency.
- **LOW:** isolated craft or polish with limited task impact; include only in full mode.

Rank within a severity by reach and leverage. A shared component or policy defect outranks the same symptom in one leaf instance.

End with exactly one interface-review verdict:

- **Block:** at least one HIGH finding remains.
- **Needs changes:** only MEDIUM or LOW findings remain.
- **Approve:** no actionable finding remains and the claimed coverage was verified.

Do not translate this scale into `Promote`, `Revise`, or another verdict vocabulary during a holistic interface review.

## Keep evidence domains honest

For each finding cite an exact source locator, trace assertion, measurement, or visible region.

- A screenshot supports visible composition, clipping, hierarchy, and state.
- Source supports declared semantics, strings, tokens, and properties.
- A bound trace supports only the recorded input and state.
- Computed contrast supports the named colors, method, and rendered pair.
- Browser DOM or accessibility-tree state is not a named screen-reader transcript.
- Page-level `scrollWidth` does not prove that a clipped child or hidden internal region is reachable.
- A CSS transition property does not prove smoothness, frame pacing, or compositor behavior.

Do not convert an unverified check into a finding or a pass. Label it `Not verified` and name the next evidence required.

## Make restraint visible

Include real candidates that were inspected and rejected:

| Location | Candidate | Rejected because |
| --- | --- | --- |

Use 1–3 candidates in quick mode and 2–5 in full mode. Valid reasons include:

- the current implementation follows the project convention;
- a border communicates structure rather than decorative depth;
- evidence does not support a contrast, motion, or behavior claim;
- introducing a new token, component, dependency, or color notation would add needless complexity;
- the neighboring owner domain permits the current implementation.

Do not invent filler candidates.

## Stay read-only unless implementation is requested

A review request authorizes inspection and reporting, not edits. If implementation is also requested, preserve the consolidated findings as change scope, fix blockers first, and rerun affected evidence gates.

## Output

Use these sections:

1. `Scope and coverage`
2. `Findings` — one table ordered by severity, reach, and leverage
3. `Systemic synthesis` — only when shared causes are evidenced
4. `Considered but rejected`
5. `Verification`
6. `Verdict`

The findings table uses:

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |

Every `After` cell must be an actionable correction in the project’s existing design and styling system.
