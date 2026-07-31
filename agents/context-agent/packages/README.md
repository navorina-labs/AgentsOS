# Context OS Framework

Turn the research into a **scaffold + validate + route + eval** toolkit for any repository.

## Install / run

From this monorepo:

```bash
npm run context-os -- init --name myapp --profile saas
npm run context-os -- doctor
```

After publish:

```bash
npx context-os init --name myapp --profile saas
npx context-os doctor
```

## Packages

| Package | Path | Role |
|---------|------|------|
| `context-os` | [packages/cli](cli) | CLI: `init`, `doctor`, `route`, `validate`, `eval`, `stats`, `graph`, `drift` |
| `@context-os/eval` | [packages/eval](eval) | A/B/C run, dry-run, bootstrap, aggregate |
| `@context-os/schemas` | [packages/schemas](schemas) | JSON Schema for cores and routing |

Framework contracts are documented in [docs/framework-contracts.md](../docs/framework-contracts.md).

## Framework workflow

```bash
# 1. Scaffold context boundaries
context-os init --name myapp --profile minimal

# 2. Check framework readiness
context-os doctor
context-os validate --schema
context-os score --min 50
context-os check --min-score 75
context-os ci init --min-score 75
context-os audit init

# 3. Route decision-scoped questions
context-os route "Which core owns deploy risk?"
context-os stats "Stripe webhook failed"

# 4. Add evaluation and CI when the cores are filled
context-os eval route
context-os eval dry-run
context-os drift check --base origin/main --strict
```

## Profiles

```bash
context-os profiles
context-os profiles validate
context-os init --name myapp --profile minimal
context-os init --name mysaas --profile saas
context-os init --name myagent --profile agent-tool
context-os init --name mylib --profile oss-library
```

| Profile | Use when |
|---------|----------|
| `minimal` | You need the generic four-core scaffold. |
| `saas` | The project has revenue, paywall, billing, and onboarding decisions. |
| `agent-tool` | The project is an AI agent, developer tool, plugin, connector, or automation product. |
| `oss-library` | The project is a public library, SDK, package, or reusable developer API. |

`context-os profiles validate` checks every bundled profile for required template files, manifest/routing/question contracts, and routing correctness for its stub question bank.

## Eval workflow (replication)

```bash
# 1. Scaffold + fill cores
context-os init --name myapp --profile saas

# 2. Questions bank
cp context-os/eval/questions.stub.json context-os/eval/questions.json
# edit: expected_cores, gold bullets

# 3. Baseline manifest (Condition A) — copied from stub on init
# edit context-os/eval/baseline-manifest.json for your repo layout

# 4. Routing F1 (no API key for keyword)
context-os eval route
context-os router embed              # once, needs OPENAI_API_KEY
context-os eval route --router semantic

# 5. Dry-run context sizes (no API key)
context-os eval dry-run
context-os eval run --dry-run --condition both --aggregate

# 5. Graph index (optional, for Condition C)
context-os graph build

# 6. Drift CI (PR — no API key)
context-os drift check --base origin/main --strict

# 7. Full A/B/C eval (needs OPENAI_API_KEY)
context-os eval run --condition abc --router keyword
context-os eval aggregate context-os/eval/results/run-<id>
context-os eval bootstrap context-os/eval/results/run-<id>/paired.csv
```

## Commands

| Command | API key | Description |
|---------|---------|-------------|
| `doctor` | No | Readiness diagnostics for scaffold, router, eval, drift, graph |
| `score` | No | Core quality rubric score for filled cores |
| `check` | No | Unified framework gate: doctor + score + profiles + eval route/dry-run |
| `ci init` | No | Generate GitHub Actions workflow for `context-os check` |
| `audit init` | No | Generate project-map, cleanup, and risks methodology docs |
| `maturity` | No | Assess cumulative adoption level and next required action |
| `adapters install` | No | Install managed instructions for AGENTS, Claude, or Copilot |
| `routing lint` | No | Detect conflicting patterns and question coverage gaps |
| `audit report` | No | Generate Markdown and JSON framework health snapshots |
| `audit record/compare` | No | Persist and compare framework metric history |
| `cores verify` | No | Require version metadata changes for edited cores |
| `contracts verify` | No | Couple manifest, routing, and eval-bank evolution |
| `eval route` | No | Routing F1 on questions.json |
| `eval dry-run` | No | B context sizes per question |
| `eval run --dry-run` | No | Full pipeline, context only |
| `eval run` | Yes | A/B/C with LLM + judge |
| `graph build` | No | Scan repo → graph-index.json |
| `router embed` | Yes | Build semantic router embeddings |
| `route --router semantic` | Yes* | Route via embeddings (*cached index) |
| `drift check` | No | Stale cores vs git diff |
| `eval aggregate` | No | results.json → paired.csv + summary |
| `eval bootstrap` | No | 95% CI on paired.csv |

Condition **C** (graph) runs only if `context-os/graph/graph-index.json` exists.

## Research → product path

1. **Done:** CLI + eval + graph + semantic router + drift CI
2. **Done:** Consumer CI via `context-os ci init` (generates `.github/workflows/context-os.yml` for `context-os check`)
3. **Next:** Publish synchronized `0.1.0` to npm — see [docs/releasing.md](../docs/releasing.md)

See [research/SYNTHESIS.md](../research/SYNTHESIS.md) for measured results.

Package publication and tarball verification are documented in
[docs/releasing.md](../docs/releasing.md).

The complete framework contract is exercised by
[examples/reference-saas](../examples/reference-saas), an Operational maturity
reference with source-backed cores and routing gold cases.
