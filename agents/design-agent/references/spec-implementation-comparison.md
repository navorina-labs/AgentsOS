# Specification-to-implementation comparison

Use this protocol when checking source, renders, traces, or a running interface against a structured UI specification.

## Freeze the comparison

Bind the evidence manifest to the exact specification and implementation with SHA-256 hashes. Record the browser, viewport, media preferences, harness, state setup, action modality, and capture locator for every runtime observation.

Re-run evidence after either source changes. A stale hash invalidates the comparison; do not reinterpret old evidence against new code.

## Compare one normative contract once

Use contract IDs from the specification as the comparison rows. Do not turn each visible symptom into another requirement or duplicate one root cause across accessibility, layout, content, and UI-polish rows.

For each implementation-ready contract, record:

- `pass`: at least one relevant assertion exists and every recorded assertion passed;
- `fail`: at least one recorded assertion contradicts the contract;
- `unverified`: available evidence cannot decide the contract.

Missing evidence is `unverified`, never `pass`. Source declarations prove only source facts. A screenshot proves only visible state. A runtime assertion proves only the observed browser, state, viewport, action, and property.

Contracts labeled `requires_decision` are unresolved dependencies. Exclude them from implementation conformance until the linked decision is resolved; do not score them as implementation success or failure.

## Bind assertions to evidence

Each assertion names:

- the expected observable condition;
- the observed result;
- a boolean result or `null` when not decidable;
- one or more evidence locators;
- the evidence surface: `source`, `dom`, `computed_style`, `screenshot`, `interaction_trace`, `accessibility_tree`, `named_assistive_technology`, `performance_trace`, or `manual_inspection`.

Use enough surfaces to match the acceptance criterion. For example, a keyboard contract may need an interaction trace and accessibility-tree evidence; a screenshot of a focus ring alone is insufficient. A reduced-motion media match does not prove that every effect adapted.

## Compute the verdict

- `does_not_conform`: one or more implementation-ready contracts fail.
- `inconclusive`: none fail, but one or more are missing or unverified.
- `conforms`: every implementation-ready contract passes.

Report the count of pass, fail, and unverified rows plus unresolved dependencies. Rank remediation by user-task impact and shared cause. Fix the implementation by default; changing a confirmed specification requires explicit product/design authority and new evidence.

## State evidence boundaries

Do not claim backend persistence, authorization correctness, network recovery, complete keyboard coverage, screen-reader output, performance, usability, conversion, or product-wide prevalence unless the corresponding evidence directly exists.

A passing comparison is scoped to the frozen implementation, specification, states, viewports, browsers, and modalities represented in the manifest. It is not universal product conformance.

Validate a comparison with:

```bash
python3 scripts/compare_spec_implementation.py \
  path/to/ui-spec.json path/to/implementation-evidence.json
```

Use `--format json` for automation.
