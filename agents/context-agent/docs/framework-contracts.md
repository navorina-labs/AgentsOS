# Framework Contracts

AI Context OS treats the generated `context-os/` folder as a small framework boundary between a project and AI agents.

The stable contracts are:

| Contract | File | Checked by |
|----------|------|------------|
| Project manifest | `context-os/manifest.json` | `context-os validate --schema`, `context-os doctor` |
| Keyword routing map | `context-os/router/routing-map.json` | `context-os validate --schema`, `context-os eval route` |
| Core documents | `context-os/cores/*.md`, `context-os/subcores/*.md` | `context-os validate`, `context-os stats`, `context-os eval dry-run` |
| Eval question bank | `context-os/eval/questions.json` | `context-os validate --schema`, `context-os eval route` |
| Baseline manifest | `context-os/eval/baseline-manifest.json` | `context-os eval run` |
| Drift config | `context-os/drift-config.json` | `context-os drift check` |
| Graph config | `context-os/graph/graph-config.json` | `context-os graph build` |

Profiles are scaffold presets. List them with:

```bash
context-os profiles
context-os profiles validate
```

Current profiles: `minimal`, `saas`, `agent-tool`, `oss-library`.

`profiles validate` is the framework-level profile gate. A bundled profile should pass:

- template file presence checks;
- manifest, routing, and question bank validation;
- keyword routing checks against `eval/questions.stub.json`.

Core quality is scored with [core-quality-rubric.md](core-quality-rubric.md):

```bash
context-os score
context-os score --min 75
```

For CI or local framework readiness, use the unified gate:

```bash
context-os check --min-score 75
context-os check --min-score 75 --max-route-tokens 2000
context-os routing lint --strict
context-os cores verify --base origin/main
context-os contracts verify --base origin/main
```

`check` runs project readiness diagnostics, core scoring, bundled profile validation, routing evaluation, and dry-run context loading.
Every dry-run route must stay within the configured token budget.

Install the default GitHub Actions gate in a consumer repo:

```bash
context-os ci init --min-score 75
```

Initialize methodology audit documents:

```bash
context-os audit init
```

This writes `context-os/audit/project-map.md`, `cleanup.md`, and `risks.md`.

Assess cumulative framework adoption:

```bash
context-os maturity
context-os maturity --min routable
```

The level definitions and production recommendations are specified in
[maturity-model.md](maturity-model.md).

Install a tool-specific instruction adapter without copying domain context into
the instruction file:

```bash
context-os adapters install agents
context-os adapters install --all
context-os adapters status
```

See [agent-adapters.md](agent-adapters.md) for the managed-file contract.

Generate a consolidated framework health snapshot:

```bash
context-os audit report
context-os audit report --json
context-os audit record
context-os audit compare
```

See [audit-report.md](audit-report.md) and
[routing-quality.md](routing-quality.md) for the report and lint contracts.
See [core-lifecycle.md](core-lifecycle.md) for version enforcement.
See [cli-api.md](cli-api.md) for JSON and exit-code compatibility.

The published JSON schemas live in `@context-os/schemas`:

```js
import manifestSchema from "@context-os/schemas/manifest";
import routingSchema from "@context-os/schemas/routing";
import questionsSchema from "@context-os/schemas/questions";
import coreSchema from "@context-os/schemas/core";
```

## Compatibility Rules

- Core ids use kebab-case and should end with `-core`.
- `manifest.cores` and `manifest.subcores` are the authoritative list of loadable cores.
- `routing-map.json` routes by literal keywords or phrases. The current CLI does not treat patterns as regular expressions.
- `questions.json` may be either an array or an object with a `questions` array.
- `expected_cores` must refer to ids declared in the manifest.
- `context-os validate --schema` is the local compatibility gate for scaffold consumers.
- `context-os doctor` is the readiness gate for framework adoption.
