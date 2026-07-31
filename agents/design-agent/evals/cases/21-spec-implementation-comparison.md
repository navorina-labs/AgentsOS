# Specification-to-implementation comparison

Compare the supplied transfer implementation against the supplied structured UI specification.

Attachments:

- `attachments/ui-spec-valid.json` — authoritative structured specification;
- `attachments/transfer-implementation-workbench.html` — frozen implementation source;
- `attachments/transfer-implementation-evidence.json` — contract evidence manifest produced from the frozen implementation;
- `attachments/transfer-implementation-default-720x900.png` — wide-state render;
- `attachments/transfer-implementation-narrow-320x900.png` — narrow-state render;
- `attachments/transfer-implementation-error-720x900.png` — reproduced error state.
- `attachments/transfer-implementation-reduced-motion-720x900.png` — reduced-motion emulation render.

Read `references/spec-implementation-comparison.md`. Check the SHA-256 bindings before interpreting results.

Return:

1. the overall verdict using exactly `conforms`, `does_not_conform`, or `inconclusive`;
2. counts for pass, fail, unverified, and unresolved dependencies;
3. one contract-by-contract matrix for every specification contract, keeping `requires_decision` dependencies separate from implementation conformance;
4. a ranked remediation plan that groups symptoms by shared implementation cause;
5. the evidence boundaries and the exact additional evidence needed for every unverified claim.

Do not edit the supplied artifacts. Do not change the specification merely to match the implementation. Do not claim backend persistence, real network recovery, named screen-reader behavior, complete modality coverage, performance, usability outcomes, or product-wide conformance unless the supplied evidence directly proves it.
