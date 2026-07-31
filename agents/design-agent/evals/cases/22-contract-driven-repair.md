# Contract-driven implementation repair

Repair the supplied transfer review implementation so that every implementation-ready contract in the structured specification passes.

Attachments:

- `attachments/ui-spec-valid.json` — authoritative specification; do not edit it;
- `attachments/transfer-implementation-workbench.html` — implementation to edit in place;
- `attachments/transfer-implementation-evidence.json` — pre-repair comparison evidence.

Read `references/contract-driven-repair.md` and `references/spec-implementation-comparison.md`.

Requirements:

- preserve every supplied task value and action;
- do not implement or score `contract-session-policy`, which remains `requires_decision`;
- make the smallest coherent HTML/CSS/JavaScript repair using no external dependencies;
- expose a deterministic `window.__transferLab` object with `reset()`, `setComplete(boolean)`, `setOutcome(name)`, and a readable `submissionCount`;
- support at least `network`, `insufficient`, `limit`, and `success` outcomes without presenting the harness as production backend behavior;
- keep the long recipient fully available, make the layout reflow without page-level horizontal scrolling, preserve native semantics and visible keyboard focus, expose pending/result semantics, prevent duplicate activation, and adapt continuous motion under reduced motion;
- keep Amount, Fee, and Total debit consecutive, with Total debit visually dominant;
- regenerate evidence from the modified implementation by running:

```bash
python3 design-agent/scripts/verify_transfer_repair.py \
  attachments/ui-spec-valid.json \
  attachments/transfer-implementation-workbench.html \
  repair-evidence
```

Iterate until that command exits successfully and its comparator verdict is exactly `conforms` with 7 pass, 0 fail, 0 unverified, and one unresolved dependency.

Return a concise repair report containing:

1. `repaired_and_verified`;
2. the pre-repair and post-repair implementation SHA-256 values;
3. contracts repaired, instrumented, preserved, or blocked;
4. the exact verifier verdict and counts;
5. changed implementation causes, not a list of cosmetic symptoms;
6. remaining evidence boundaries.

Do not return `repaired_and_verified` unless the verifier passed. The modified HTML and generated evidence artifacts must remain in the workspace for collection.
