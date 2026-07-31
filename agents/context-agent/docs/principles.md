# Principles

Five foundational principles govern AI Context OS design and evaluation.

---

## 1. Minimal Context Principle

**Use the minimum context sufficient for the decision at hand.**

- Sufficiency is defined by answer quality, not repository coverage
- If a fact does not influence the decision, exclude it
- Measure compression ratio: `full_repo_tokens / core_tokens`
- Prefer pointers to sources over embedding full file contents

See [theory/minimal-context-principle.md](../theory/minimal-context-principle.md).

---

## 2. Domain Boundary Principle

**Context must have explicit responsibility boundaries.**

Every Context Core declares:

- **In scope:** questions and decisions this core owns
- **Out of scope:** questions explicitly deferred to other cores
- **Boundary violations:** what happens when a question crosses domains

Boundaries are decision domains, not technical layers (not "frontend" vs "backend").

See [theory/context-boundaries.md](../theory/context-boundaries.md).

---

## 3. Decision-Centric Principle

**Context is built around decisions, not artifacts.**

Traditional organization:

```
src/
  billing/
  ui/
  api/
```

Decision-centric organization:

```
Revenue decisions → Revenue Core
Payment failures → Billing Core
Deploy failures → Operational Core
```

Artifacts (files, services) are **sources** referenced by cores, not organizational units.

See [theory/decision-centric-context.md](../theory/decision-centric-context.md).

---

## 4. Router First Principle

**Select context before answering. Never reason on undifferentiated full context by default.**

Pipeline order:

1. Receive question
2. Classify intent
3. Select core(s)
4. Load minimal context
5. Invoke LLM
6. Log routing decision for audit

Skipping routing is an explicit opt-in for exploratory tasks, not the default path.

See [routing.md](routing.md).

---

## 5. Context Compression Principle

**Compress the project without losing decision-relevant meaning.**

Compression techniques:

- Summarize invariants instead of listing all code paths
- Extract decision history (ADRs, incident postmortems) not full git history
- Reference file paths and line ranges instead of embedding content
- Maintain entity registries (customers, services, features) not file indexes
- Version cores independently from codebase

Compression is lossy for implementation detail but lossless for decision facts.

---

## Principle Interactions

```
Router First
    ↓
Domain Boundary → selects which core
    ↓
Decision-Centric → defines core content
    ↓
Minimal Context → limits core size
    ↓
Context Compression → maintains core over time
```

All principles are testable via the evaluation framework in [research/evaluation-framework.md](../research/evaluation-framework.md).
