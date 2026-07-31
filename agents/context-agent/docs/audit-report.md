# Framework Audit Report

`context-os audit report` creates a reviewable snapshot of framework health.

```bash
context-os audit report
context-os audit report --min-score 85 --max-route-tokens 1200
context-os audit report --json
context-os audit report --stdout
```

Artifact mode writes:

- `context-os/audit/report.md` for human review;
- `context-os/audit/report.json` for CI artifacts and historical analysis.

The report combines:

- readiness diagnostics;
- per-core quality and architecture checks;
- routing lint and question coverage;
- routing F1;
- zero-context and route-budget checks;
- static drift inventory, including missing core Sources;
- maturity level and next action.

The drift section intentionally uses an empty changed-file set. It validates
inventory and source integrity without depending on the current git branch.
Run `context-os drift check --base <ref> --strict` separately for change-aware
staleness detection.

Generated reports are snapshots. Teams may archive JSON reports externally to
track score, budget, and maturity trends without committing a changing
timestamp on every CI run.

## History

Record a compact snapshot:

```bash
context-os audit record --min-score 85 --max-route-tokens 1200
context-os audit history
context-os audit history --json
```

Records are appended to `context-os/audit/history.jsonl`. Each line contains:

- audit status and thresholds;
- commit hash when available;
- maturity, score, routing F1, budget, and drift metrics;
- per-core score, version, and word count.

The compact history omits the full diagnostic payload. Keep full report
artifacts in CI when detailed forensic evidence is required.

## Comparison

Compare the two latest records:

```bash
context-os audit compare
context-os audit compare --json
```

Select explicit records using ids from `audit history`:

```bash
context-os audit compare --from <id> --to <id>
```

Comparison exits with status 1 when it detects:

- PASS becoming FAIL;
- lower maturity, mean score, routing F1, or individual core score;
- higher maximum routed tokens or drift errors;
- a removed core;
- a lowered minimum-score policy;
- a relaxed route-token budget.

Use `--no-fail` for exploratory comparison that should always exit successfully.

Teams may commit `history.jsonl` when framework metrics are part of repository
governance. High-frequency CI should store it as a build artifact or send the
snapshot to an external metrics store to avoid noisy commits.
