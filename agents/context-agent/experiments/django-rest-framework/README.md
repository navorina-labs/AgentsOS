# Experiment: Django REST Framework (Phase 2.1)

Replication of AI Context OS on a popular open-source web API framework.

**Eval workspace:** Private project Oiloop (not published). Results copied to this public research repo.

**Published results:** [results.md](./results.md)

---

## Subject

**Django REST Framework (DRF)** — toolkit for building Web APIs in Django (~1.2M LOC).

---

## Headline (measured)

| | A | B | C |
|---|---|---|---|
| Accuracy | 1.35 | **1.68** | 1.40 |
| Cost | $0.52 | **$0.012** | $0.14 |
| Hallucination | 18% | 22% | **11%** |
| Compression | — | **38×** | 4.2× |

**Default for production:** **C** (graph retrieval) — half the hallucination rate of B.

---

## Status

| Milestone | Status |
|-----------|--------|
| Cores drafted | ✅ 5 cores |
| Routing validated | ✅ F1 0.72 kw / 0.85 semantic |
| A/B/C experiment | ✅ Completed |
| Results in research repo | ✅ [django-phase-2.1.md](../../context-os/evaluations/django-phase-2.1.md) |
| Raw run exported | ⚠️ [aggregate only](../../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) — [RE-RUN.md](./RE-RUN.md) for full export |

---

## Cross-Reference

- [PHASE-2-RESULTS.md](../../context-os/evaluations/PHASE-2-RESULTS.md)
- [applied-instances.md](../../context-os/evaluations/applied-instances.md) — Oiloop private
