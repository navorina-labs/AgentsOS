# Design-system evidence and migration protocol

Use this protocol when auditing CSS tokens, foundations, component consistency, state styling, theme readiness, or migration plans.

## Establish scope before judging

Name the exact surfaces included:

- source files and style blocks;
- generated token/literal inventory;
- rendered viewports and component states;
- injected harness or runtime styles outside the static inventory;
- themes, brands, platforms, repositories, and packages not supplied.

A CSS custom-property inventory describes the supplied source only. It does not prove a product-wide design system, reusable component API, ownership, documentation, adoption, governance, theme coverage, or cross-repository use.

Treat evidence separately:

- **Source-confirmed:** declaration, token definition/reference, selector, or component markup exists.
- **Inventory-observed:** a deterministic parser reports a value, count, locator, or unresolved reference.
- **Rendered:** a supplied capture shows a visual state at one condition.
- **Interaction-observed:** an action-bound trace proves the reproduced state.
- **Unverified:** requires another theme, state, package, runtime, owner, or rendered measurement.

## Classify foundations by intent

Do not call every custom property a semantic token. Classify:

- **Primitive:** reusable raw scale such as neutral-700, spacing-3, radius-2.
- **Semantic:** role such as text-primary, surface-canvas, border-control, focus-ring, status-critical.
- **Component:** local contract such as button-primary-background or dialog-padding; use only when the role genuinely differs from the shared semantic layer.
- **Alias:** temporary or stable indirection from an old name to the intended replacement.

A name suggests intent but usage determines whether the role is coherent. Inspect every use before renaming or consolidating.

## Interpret repetition carefully

Frequency is migration evidence, not a command:

- repeated equal values may represent different meanings and must stay separate semantically;
- different values may belong to one component scale or state family;
- one-off values can still deserve a semantic token when the role is consequential or theme-dependent;
- structural hairlines, optical adjustments, chart geometry, and fixed interaction thresholds may remain literals.

Never create one token per raw value. Cluster by shared role, owner, theme behavior, and change cadence. A spacing token should express a deliberate scale or component contract, not merely replace every occurrence of `12px`.

## Audit token integrity

For every proposed foundation record:

| Role | Current definitions and uses | Intended layer | Theme/state behavior | Migration action | Verification |
| --- | --- | --- | --- | --- | --- |
| Semantic intent | exact locators | primitive/semantic/component | light/dark/contrast/forced colors | keep, split, merge, alias, deprecate | source and render gate |

Check:

- undefined references and unused definitions;
- semantic names borrowed outside their role;
- same role represented by several raw values;
- same raw value carrying conflicting roles;
- missing state roles for hover, focus, disabled, selected, error, success, and forced colors;
- values embedded in injected or runtime styles that the static inventory did not parse.

## Audit component contracts

Selectors that look similar do not prove a reusable component. Use source plus matched renders or traces to define:

- anatomy and slots;
- variants and sizes;
- interactive states and state precedence;
- typography, spacing, radius, border/shadow, and color roles;
- content limits and responsive transitions;
- keyboard, focus, disabled/busy, announcement, and forced-colors behavior;
- ownership and regression fixtures.

Keep structural borders, input outlines, dividers, and status edges distinct from decorative elevation. Do not replace every border with a shadow. Check nested radii only where surfaces share a visible, even inset; independent surfaces do not require concentric math.

## Handle color evidence honestly

Preserve the project’s established notation unless a color-system migration is in scope. Do not introduce OKLCH into a hex/RGB codebase for an isolated audit.

Color literals and token names do not prove contrast. Measure the exact rendered foreground/background pair in each relevant state and appearance. Forced-colors screenshots prove that emulated render only. Dark mode, increased contrast, gamut, translucency, and locale-specific color meaning remain unverified unless supplied.

## Plan migration without churn

Use staged migration:

1. Freeze and label the current inventory and scope.
2. Define the smallest semantic role set required by real components and themes.
3. Map current definitions and literals to `keep`, `alias`, `split`, `merge`, `component-local`, or `intentional literal`.
4. Introduce aliases and deprecation metadata before removing old names.
5. Migrate one component family and all its states together.
6. Render and interaction-test matched states and appearances.
7. Measure adoption and remove aliases only after verified consumers are gone.

Assign an owner, versioning policy, exception process, documentation location, and regression suite. Do not infer these exist from CSS.

## Acceptance gates

- Inventory scope and omitted runtime/theme surfaces are explicit.
- Every migration candidate has shared semantic intent, not just a repeated value.
- No undefined references remain; unused definitions are removed or documented.
- Component contracts cover applicable states and responsive behavior.
- Injected/runtime styles are inventoried separately or merged through a disclosed second pass.
- Contrast, theme, and accessibility claims use rendered evidence rather than token names.
- Migration includes aliases, deprecation, ownership, rollout, and regression verification.
- Product-wide claims require product-wide repository and adoption evidence.
