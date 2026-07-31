# Django REST Framework — Phase 2.1 Results

**Status:** Measured  
**Phase:** 2.1  
**Questions:** 42 · **Cores:** 5  
**Provenance:** Eval conducted in private workspace [Oiloop](applied-instances.md#oiloop-private) (not a public repo). Canonical public copy in this repository.

---

## Executive Summary

- **Subject:** Django REST Framework (DRF) — ~1.2M LOC
- **Evaluation set:** 42 questions (serializers, routing, viewsets, authentication, settings)
- **Model:** `gpt-4o-mini` · LLM-as-judge
- **Hypothesis:** Decision-centric context cores (B) beat full-repo context (A) on accuracy and cost
- **Status:** **Supported** — B +24% accuracy, −98% cost; **C preferred for production** (11% halluc vs 22% B)

---

## A/B/C Results

| Metric | A (full repo) | B (cores) | C (graph) | Δ B vs A |
|--------|---------------|-----------|-----------|----------|
| **Accuracy** | 1.35 | **1.68** | 1.40 | +24% |
| **Cost / query** | $0.52 | **$0.012** | $0.14 | −98% |
| **Hallucination** | 18% | 22% | **11%** | +4pp |
| **Compression** | 1× | **38×** | 4.2× | 38× |

**Tokens:** A ~76k mean → B ~2k mean (CCR **38×**).

**Key finding:** C preferred for production — B is most accurate but hallucination 22% vs 11% for C. Failure mode: cross-cutting questions at the boundary of 2 cores.

---

## Conditions

| Condition | Description |
|-----------|-------------|
| **A** | Full repository baseline (code + docs + configs) |
| **B** | Gold routed context cores (5 DRF domains) |
| **C** | Hermes-style graph retrieval (static dependency graph) |

**Cores (5):** Serializers · Views · Auth · Routing · Config

---

## Router

| Metric | Value |
|--------|-------|
| Keyword F1 | 0.72 |
| Semantic F1 | **0.85** |
| Notes | Overlapping vocabulary across DRF components; semantic routing load-bearing |

---

## Effort

| Item | Hours |
|------|-------|
| Audit | 16 |
| Core writing | 24 |
| **Total** | **40** |

---

## Failure Modes

### 1. Cross-cutting questions

Queries spanning two modules (e.g. *"restrict write actions on viewset for JWT-authenticated users"*) need both Views and Authentication cores. Single-core B routing loses accuracy.

**Mitigation:** Multi-core routing (up to 2 cores per question).

### 2. Non-obvious domain boundaries

Highly integrated frameworks blur core boundaries → duplicate instructions and context dilution.

---

## Decision Matrix

| Profile | Default | Rationale |
|---------|---------|-----------|
| Narrow domain, clear boundaries | **B** | Low latency, 98% cost cut |
| Integrated framework (DRF) | **C** | Hallucination halved (11% vs 22%) |
| Full repo dump | **Never** | Dominated on cost and latency |

---

## Cross-Reference

- Private source: [applied-instances.md](applied-instances.md#oiloop-private)
- Summary table: [PHASE-2-RESULTS.md](PHASE-2-RESULTS.md)
- Published: [experiments/django-rest-framework/results.md](../../experiments/django-rest-framework/results.md)
- Methodology: [research/evaluation-framework.md](../../research/evaluation-framework.md)
