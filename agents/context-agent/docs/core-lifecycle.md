# Core Lifecycle

Context cores are versioned decision artifacts. A material edit must be visible
to reviewers instead of silently changing the context supplied to agents.

## Metadata Contract

Every core declares:

```markdown
| version | 1.2.0 |
| last_updated | 2026-06-27 |
```

`version` uses numeric `major.minor.patch` semver. `last_updated` uses an ISO
calendar date.

Recommended version changes:

| Change | Version |
|--------|---------|
| Clarification with unchanged decisions | Patch |
| New entities, constraints, or supported decisions | Minor |
| Removed or incompatible decision contract | Major |

## Git Verification

```bash
context-os cores verify --base origin/main
context-os cores verify --base HEAD~1 --json
```

For each manifest-declared core, verification compares the working file with
the same path at the git base:

- unchanged content passes without a version change;
- a new core must contain valid version and date metadata;
- changed content requires a strictly greater version;
- `last_updated` cannot be older than the base version.

Equal dates are allowed because multiple reviewed edits may happen on one day.

The generated consumer workflow runs this check together with drift detection.
Drift answers whether changed source files require a core update. Core lifecycle
verification answers whether an edited core announces its own revision.

Renaming or deleting a core is also a manifest contract change and should be
reviewed together with routing and question-bank updates.

## Cross-Contract Evolution

```bash
context-os contracts verify --base origin/main
```

The command treats `manifest.json`, `routing-map.json`, and `questions.json` as
one versioned behavior contract. It requires:

- a routing change to include a question-bank change;
- added or removed core ids to update both routing and questions;
- every added core to be reachable and represented by an expected eval case;
- every removed core to disappear from routing and expected eval results;
- all routed and expected core ids to remain declared in the manifest.

Comparison is semantic JSON comparison, so formatting-only edits do not trigger
false coupling requirements. A project with no manifest at the base is treated
as a valid bootstrap.
