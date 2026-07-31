# Context Agent

**AgentsOS agent and framework for domain-oriented context cores in AI-assisted software projects.**

Context Agent is the new product name for AI Context OS. The `context-os` CLI and existing package names remain stable for compatibility.

AI Context OS helps teams scaffold, validate, route, evaluate, and maintain **domain-oriented context cores**: bounded decision contexts that AI agents can read instead of dumping an entire repository into the prompt.

The framework currently ships as a Node.js CLI plus schemas, templates, eval tooling, drift checks, and research-backed methodology. It is intentionally not a SaaS or hosted runtime.

**New here?** Start with [Quick start](#quick-start) if you want to use it in a repo, or [Results](#results) if you want the evidence first.

**Research closed?** See [research/SYNTHESIS.md](research/SYNTHESIS.md) — final conclusions and production decision matrix.

**Framework docs:** See [packages/README.md](packages/README.md), [docs/framework-contracts.md](docs/framework-contracts.md), [docs/cli-api.md](docs/cli-api.md), [docs/maturity-model.md](docs/maturity-model.md), [docs/context-budget.md](docs/context-budget.md), [docs/routing-quality.md](docs/routing-quality.md), [docs/core-lifecycle.md](docs/core-lifecycle.md), [docs/audit-report.md](docs/audit-report.md), and [docs/agent-adapters.md](docs/agent-adapters.md).

**Maintainers:** See [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md), [SECURITY.md](SECURITY.md), and the package release contract in [docs/releasing.md](docs/releasing.md).

**Reference implementation:** [examples/reference-saas](examples/reference-saas)
passes score 85+, routing evaluation, dry-run, drift/CI prerequisites, and the
Operational maturity gate.

```bash
# from clone
npm run context-os -- init --name myapp --profile saas --target ~/Projects/MyApp
npm run context-os -- doctor --root ~/Projects/MyApp

# after npm publish (name context-os is available)
npx context-os init --name myapp --profile saas
npx context-os doctor
```

## Quick start

```bash
npx context-os init --name myapp --profile minimal
npx context-os doctor
npx context-os validate --schema
npx context-os score --min 50
npx context-os profiles validate
npx context-os check --min-score 75
npx context-os ci init --min-score 75
npx context-os audit init
npx context-os maturity
npx context-os adapters install agents
npx context-os route "How do we deploy to production?"
```

Then fill the generated `context-os/cores/*.md` files and customize `context-os/router/routing-map.json`.

For evaluation and CI:

```bash
npx context-os eval route
npx context-os eval dry-run
npx context-os drift check --base origin/main --strict
```

Outreach: [docs/outreach/twitter-posts.md](docs/outreach/twitter-posts.md) · arXiv: [papers/ARXIV-SUBMISSION.md](papers/ARXIV-SUBMISSION.md)

## Why This Project Exists

Modern AI coding assistants receive entire repositories: documentation, source code, tests, configs, logs, and infrastructure definitions. The assumption is that more context improves answers.

We challenge that assumption.

The bottleneck is not context window size. It is **lack of responsibility boundaries**. A question like "Revenue dropped last week" does not require CSS, Docker configs, or unit tests — yet full-repository approaches often include them anyway.

AI Context OS proposes a different pipeline:

```
Question
  ↓
Router
  ↓
Context Core
  ↓
LLM
```

Instead of:

```
Full Repository
  ↓
LLM
```

---

## Hypothesis Under Test

**AI answers better when context is split by decision domains, not by files or folders.**

A Context Core is a minimal, self-contained slice of project knowledge scoped to a specific class of decisions (revenue, billing, onboarding, deployment, etc.). A Router selects the right core(s) before the model reasons.

---

## Why Full Repository Is Not Always Effective

| Issue | Effect |
|-------|--------|
| Irrelevant code pollutes attention | Model cites wrong files, invents connections |
| Conflicting signals across domains | Business metrics mixed with implementation details |
| No decision boundary | Cannot distinguish "what to build" from "how to deploy" |
| Context dilution | Important facts buried in noise |
| Higher cost and latency | Larger prompts without proportional quality gain |

Full repository context works for broad exploration. It fails when the question has a narrow decision scope.

---

## Why Graph ≠ Context

Knowledge graphs and GraphRAG organize **entities and relationships**. Context cores organize **decision responsibility**.

| Knowledge Graph | Context Core |
|-----------------|--------------|
| Nodes: entities, facts | Units: decision domains |
| Edges: semantic links | Boundaries: what is in / out of scope |
| Retrieval: traverse graph | Retrieval: route by question intent |
| Optimizes connectivity | Optimizes sufficiency |

Graphs answer "what is related to X?" Context cores answer "what do I need to decide about X?"

See [docs/comparison-with-graphs.md](docs/comparison-with-graphs.md) for a detailed comparison.

---

## Core Concepts

### Context Core

A **Context Core** is a curated, compressed representation of everything needed to reason about a specific decision domain:

- Purpose and scope
- Key entities and invariants
- Decision history and constraints
- Typical sources (not full files)
- Explicit exclusions

Templates live in [context-os/cores/](context-os/cores/) and [context-os/subcores/](context-os/subcores/).

### Router

The **Router** maps a natural-language question to one or more Context Cores before invoking the LLM. Routing is intent-based, not file-based.

See [docs/routing.md](docs/routing.md) and [context-os/router/](context-os/router/).

### Minimal Context

The **Minimal Context Principle** states: use the smallest context that is sufficient for the decision at hand. Measure sufficiency by answer quality, not by coverage of the repository.

See [theory/minimal-context-principle.md](theory/minimal-context-principle.md).

---

## Repository Structure

```
ai-context-os/
├── packages/          # context-os CLI + @context-os/schemas
├── docs/              # Problem, hypothesis, architecture, routing
├── theory/            # Theoretical foundations
├── experiments/       # Controlled experiment designs
├── examples/          # Reference implementations (documentation only)
├── prompts/           # Prompts for building cores manually
├── schemas/           # JSON schemas for cores and routing
├── context-os/        # Templates, router rules, audit tools
├── research/          # Questions, metrics, evaluation framework
└── papers/            # Future publication outline
```

---

## Results

- **[Phase 2 cross-project report](context-os/evaluations/PHASE-2-RESULTS.md)** — 3 OSS projects (129 questions, A/B/C). B ≥ A on accuracy; **8–38×** fewer API input tokens vs full repo; C preferred on hallucination for 2/3 projects.
- **[Phase 3 private codebase report](context-os/evaluations/PHASE-3-RESULTS.md)** — Oiloop macOS app (20 questions). B **+0.20** vs A after content fix; **78×** fewer API tokens; C best accuracy. Masked decode preference 75% (not independent human raters).
- **One-page summary:** [phase-3-twitter-card.png](context-os/evaluations/phase-3-twitter-card.png) — all 4 projects, 149 questions.
- **Honest limitations:** [research/validity-audit.md](research/validity-audit.md)

---

## How to use this repository

This repo contains both the framework implementation and the research record behind it. You do not need to read every file in `context-os/` in order.

### Read the results (~15 minutes)

| Step | File | Why |
|------|------|-----|
| 0 | [research/SYNTHESIS.md](../../research/SYNTHESIS.md) | **Final conclusions** — decision matrix, limitations, practice phase |
| 1 | [context-os/evaluations/PHASE-2-RESULTS.md](context-os/evaluations/PHASE-2-RESULTS.md) | Main table — 3 OSS projects, when **B** (routed cores) vs **C** (graph) |
| 2 | [context-os/evaluations/PHASE-3-RESULTS.md](context-os/evaluations/PHASE-3-RESULTS.md) | Private integrated codebase (Oiloop) |
| 3 | [context-os/evaluations/phase-3-twitter-card.png](context-os/evaluations/phase-3-twitter-card.png) | Visual summary — 149 questions, 4 codebases |
| 4 | [research/validity-audit.md](research/validity-audit.md) | What we can and cannot claim (LLM-as-judge, sample sizes) |
| 5 | [experiments/README.md](experiments/README.md) → `runs/run-*/summary.json` | Raw numbers if you want to verify |

**Skip on first pass:** `papers/`, `prompts/`, per-instance core markdown, JSON schemas — those are for replication, not for understanding the findings.

### Decision cheat sheet

| Your situation | Default |
|----------------|---------|
| Narrow domain, cost/latency matter | **B** — keyword-routed domain cores |
| Cross-cutting deps, hallucination risk | **C** — graph retrieval |
| Dump entire repo into the prompt | **A** — baseline only; not recommended for production |

Variants: **A** = full repo · **B** = routed cores · **C** = Hermes-style graph retrieval.

### Use with an AI coding assistant

Clone the repo, then paste:

```
Read in order:
1. context-os/evaluations/PHASE-2-RESULTS.md
2. context-os/evaluations/PHASE-3-RESULTS.md
3. research/validity-audit.md

Then answer: for a codebase like [yours], should we use A (full repo),
B (routed cores), or C (graph retrieval)? Cite table rows only.
Do not invent metrics not in those files.
```

### Replicate on your codebase

See [Getting started (replication)](#getting-started-replication) below and [packages/README.md](packages/README.md) for the eval workflow:

```bash
context-os init --name myapp --profile saas
context-os eval route && context-os eval run --dry-run --aggregate
context-os drift check --base origin/main --strict   # в CI на PR
# full run: OPENAI_API_KEY=... context-os eval run --condition ab
```

---

## Planned Experiments

| Phase | Subject | Goal | Status |
|-------|---------|------|--------|
| 1 | [MailAgent](experiments/mailagent/) | First controlled A/B: full repo vs context cores | Done |
| 2 | MailAgent, Django REST, Navorina | Cross-project generalization | ✅ [Results](context-os/evaluations/PHASE-2-RESULTS.md) |
| 3 | Private project validation | Real-world decision quality | ✅ [Results](context-os/evaluations/PHASE-3-RESULTS.md) |
| 4 | Paper | Formal publication of results | ✅ [Draft](papers/paper-draft.md) · [arXiv checklist](papers/ARXIV-SUBMISSION.md) |
| 5 | Open-source release | Community replication | In progress |

See [docs/research-roadmap.md](docs/research-roadmap.md) and [research/experiment-design.md](research/experiment-design.md).

---

## Getting started (replication)

To run your own A/B/C eval — not required to understand the published results.

1. Read [docs/overview.md](docs/overview.md) for the system model.
2. Read [docs/hypothesis.md](docs/hypothesis.md) and [docs/principles.md](docs/principles.md).
3. Study [context-os/cores/](context-os/cores/) templates.
4. Copy [experiments/template/](experiments/template/) and follow [experiments/README.md](experiments/README.md).
5. Run per [research/evaluation-framework.md](research/evaluation-framework.md).
6. Use [research/questions.md](research/questions.md) as the evaluation question bank.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Contributing

Contributions should improve the framework, schemas, templates, reproducibility, documentation, or research evidence. Keep claims tied to measured results and preserve reproducible eval paths.
