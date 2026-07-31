# Core Quality Rubric

This rubric turns Context OS methodology into an operational quality gate.

A core is not good because it is long. A core is good when it is bounded, current, source-backed, and sufficient for the routed decision domain.

## Score Bands

| Score | Interpretation | Action |
|-------|----------------|--------|
| 90-100 | Ready | Use in routed agent workflows. |
| 75-89 | Usable | Use, but fix warnings before relying on eval results. |
| 50-74 | Weak | Fill missing sections before production use. |
| 0-49 | Scaffold | Treat as template output, not project context. |

## Criteria

| Criterion | Points | Why it matters |
|-----------|--------|----------------|
| Purpose | 10 | The core must say what decision class it owns. |
| Scope | 20 | In-scope and out-of-scope boundaries prevent context leakage. |
| Key entities | 15 | Cores should compress decision-relevant entities, not mirror files. |
| Invariants | 15 | Agents need hard constraints more than broad prose. |
| Sources | 15 | Claims must point to authoritative files, docs, dashboards, or services. |
| Exclusions | 10 | Explicit omissions keep context minimal. |
| Typical outputs | 5 | The core should define the shape of useful answers. |
| Freshness | 10 | Stale cores degrade faster than missing cores because they look authoritative. |

## Gates

`context-os score` computes a practical approximation of this rubric from markdown cores.

It checks:

- required section presence;
- whether sections still contain obvious template placeholders;
- whether `last_updated` is present and recent enough;
- whether the Sources section contains at least one non-empty reference;
- whether core files declared in `manifest.json` exist.

The report also includes an architecture gate. It checks that:

- every core declared in the manifest is reachable from a route or fallback;
- local paths listed in Sources exist relative to the project root;
- cores over 2,500 words are reported as candidates for splitting.

Missing routes and broken local sources fail `score` and therefore fail `check`.
The size limit is advisory because useful density varies by domain.

`check` adds a routed context budget on top of per-core scoring. By default,
every eval question must load no more than 2,000 estimated tokens. See
[context-budget.md](context-budget.md).

Use:

```bash
context-os score
context-os score --json
context-os score --min 75
```

Recommended minimums:

| Use case | Minimum |
|----------|---------|
| Local experimentation | 50 |
| Team workflow | 75 |
| Published eval run | 85 |
| CI drift gate | 75 |

The score is intentionally a quality signal, not a proof of correctness. Pair it with `context-os eval route`, `context-os eval dry-run`, and project-specific gold answers.
