# Django REST Framework — Phase 2.1 Export (aggregate)

**Run ID:** `run-drf-phase-2.1-aggregate`  
**Export type:** aggregate only — per-question `paired.csv` not preserved in source workspace  
**Questions:** 42 · **Model:** gpt-4o-mini

## A / B / C (published metrics)

| Metric | A | B | C |
|--------|---|---|---|
| Mean accuracy (0–3) | 1.35 | **1.68** | 1.40 |
| Hallucination | 18% | 22% | **11%** |
| Mean input tokens | ~76k | **~2k** | ~18k |
| CCR_tokens (vs A) | 1× | **38×** | 4.2× |
| Router F1 (keyword) | — | 0.72 | — |
| Router F1 (semantic) | — | **0.85** | — |

**Hypothesis (B ≥ A accuracy):** Supported (+24% mean accuracy).  
**Production default (DRF):** **C** — half the hallucination rate of B.

## Provenance

Eval conducted in private Oiloop workspace. Source: `Oiloop/docs/DJANGO-REST-FRAMEWORK-RESULTS.md`.

Full per-question replication requires DRF checkout + cores + `questions.json` (not in public repo). See [RE-RUN.md](../../../RE-RUN.md).

## Cross-reference

- [django-phase-2.1.md](../../../../context-os/evaluations/django-phase-2.1.md)
- [PHASE-2-RESULTS.md](../../../../context-os/evaluations/PHASE-2-RESULTS.md)
