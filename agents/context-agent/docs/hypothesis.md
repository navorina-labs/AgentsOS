# Hypothesis

**Version:** 2.0 · **Updated:** 2026-06-17 (post Phase 2 + Oiloop Phase 3 + pilot run-1781658621476)

---

## Primary Hypothesis

**AI systems produce higher-quality answers when context is organized by decision domains rather than by undifferentiated repository dumps.**

Formally:

> **H₁:** For a fixed set of *decision-scoped* questions Q and project P, answers generated via `Router(Q) → ContextCore(s) → LLM` (Condition B) achieve **higher accuracy** than `FullRepository(P) → LLM` (Condition A), at **≥5× context compression** (`CCR_tokens`).

**Null hypothesis (H₀):** B accuracy ≤ A accuracy on decision-scoped Q.

**Out of scope for H₁:** hallucination, latency, graph retrieval, exploratory questions ("how does this codebase work").

---

## Stratified Predictions (Decision Matrix)

Quality is not uniform across question types. Predicted winner by stratum:

| Question type | Predicted default | Primary metric |
|---------------|-------------------|----------------|
| Single-domain, router F1 ≥ 0.95 | **B** (routed cores) | CCR_tokens, latency |
| Cross-cutting (2+ cores) | **B** (multi-core routed) | accuracy, hallucination |
| Integrated / system-heavy codebases | **C** (graph retrieval) | accuracy, trust |
| Exploratory / repo-wide | **A or C** | out of H₁ scope |
| Full repository dump | **Never default** | cost dominated |

---

## Supporting Sub-Hypotheses

### H₁a: Domain Boundaries Reduce Cross-Domain Hallucination

When context is bounded to a decision domain, the model has fewer irrelevant facts to misconnect. **Fabricated cross-domain connections** decrease vs full-repo dumps.

> **H₁a′ (cross-cutting caveat):** On questions spanning 2+ cores, single-core routing (B) does **not** guarantee lower hallucination than A. Multi-core composition (B₂) or hybrid (D) is required.

### H₁b: Minimal Context Improves Reasoning Quality

Smaller, focused context improves chain-of-thought quality because each step references decision-relevant facts only.

### H₁c: Routing Latency Is Offset by Context Reduction

Router overhead plus smaller context yields lower total latency than processing full repository context (especially on local LLMs).

### H₁d: Context Cores Generalize Across Projects

The four-core model (Business, Product, Technical, Operational) — and product-specific variants (e.g. Oiloop's 5 cores) — applies to diverse project types without per-project custom ontology.

### H₁e: Graph Retrieval Supplements Decision Boundaries (revised)

Knowledge graphs **supplement** explicit decision-domain cores; they do not replace them.

> For integrated codebases: `accuracy(C) ≥ accuracy(B) ≥ accuracy(A)` at `tokens(C) < tokens(A)`.

*Previous H₁e ("cores outperform graph-only") was rejected by Oiloop Phase 3 data.*

### H₁f: Hybrid Core + Graph Matches C at Lower Cost

Condition D (routed core + small graph supplement) matches or exceeds C accuracy on cross-cutting questions at ≤1.5× B token cost.

### H₁g: Core Metadata Richness Scales Answer Quality

Answer quality scales with core metadata completeness (entities, invariants, enforcement chains), not routing precision alone. Expanded cores widen B/C vs A gap without increasing hallucination on single-domain Q.

### H₁h: Production Router Preserves Gold-Router Gains

Production keyword router (F1 ≥ 0.85) preserves ≥80% of the accuracy delta (B − A) measured under gold routing (F1 = 1.0).

---

## What We Are NOT Claiming

- Context cores replace full repository access for exploratory tasks
- Manual core curation scales indefinitely without tooling
- One core per question is always sufficient (mixed questions require composition or D)
- Context cores eliminate hallucination entirely
- B is the universal production default on Oiloop (H₁f rejected; multi-core B wins cross-cutting)

---

## Falsification Criteria

The hypothesis framework is **rejected** if:

| # | Criterion | Scope |
|---|-----------|-------|
| 1 | A wins accuracy on **>50%** of decision-scoped questions | all Q |
| 2 | `CCR_tokens` < 5× **and** B accuracy ≤ A | efficiency claim |
| 3 | Hallucination(B) ≥ Hallucination(A) on **single-domain** Q only | H₁a |
| 4 | D and C both fail to beat A on **cross-cutting** Q | H₁f |
| 5 | Production router F1 < 0.85 **and** B accuracy ≤ A | H₁h |

*Criteria 3 does not apply to cross-cutting Q — see H₁a′.*

---

## Evidence Status (2026-06-17, Phase 3.1 closed)

| Claim | Status | Evidence |
|-------|--------|----------|
| H₁ (B acc ≥ A) | **Supported** | Oiloop Phase 3.1: B 2.70 vs A 0.75 |
| H₁a (halluc ↓) | **Supported (single-domain)** | Prod B 5%; gold B 0% on 20 Q |
| H₁c (latency ↓) | **Supported** | B 2.1–2.6s vs A 2.5s+ |
| H₁e (graph supplements) | **Partial** | C useful but not default; B wins Phase 3.1 |
| H₁f (hybrid D) | **Rejected** | [run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/): B 2.875 > D 2.50 > C 2.375 |
| H₁g (core richness) | **Supported** | B 2.70 vs prior canonical 1.20 |
| H₁h (prod router) | **Supported** | [run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/): F1=1.0, B **2.75**, hall **0%** |

---

## Measurement

See [research/evaluation-framework.md](../research/evaluation-framework.md) and [research/experiment-design.md](../research/experiment-design.md).

**Next eval:** Phase 3.1 **closed** — see [PHASE-3.1-CLOSED.md](../experiments/oiloop/runs/run-1781660908/PHASE-3.1-CLOSED.md)
