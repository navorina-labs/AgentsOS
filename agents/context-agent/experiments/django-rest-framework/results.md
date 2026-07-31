# Django REST Framework Phase 2.1 — Published Results

**Provenance:** Eval workspace — private project Oiloop (not public). See [applied-instances.md](../../context-os/evaluations/applied-instances.md).

---

## Evaluation Results (42 questions, gpt-4o-mini)

| Condition | Strategy | Accuracy | Cost | Halluc. | CCR |
|-----------|----------|----------|------|---------|-----|
| **A** | Full repo baseline | 1.35 | $0.52 | 18% | 1× |
| **B** | Context OS routed cores | **1.68** | **$0.012** | 22% | **38×** |
| **C** | Hermes-style graph | 1.40 | $0.14 | **11%** | 4.2× |

**Headline**

- **B** wins accuracy (+24% vs A) and cost (−98%).
- **C** wins trust — hallucination 11% vs 22% B.
- **Hypothesis supported** on accuracy and compression.

---

## Router

| Mode | F1 |
|------|-----|
| Keyword | 0.72 |
| Semantic | **0.85** |

---

## Effort

40 hours total (16 audit + 24 core writing).

---

## Failure Modes

- Cross-cutting questions need 2 cores (Views + Auth boundary).
- Non-obvious domain boundaries in integrated frameworks.

---

## Links

| What | Path |
|------|------|
| Full report | [django-phase-2.1.md](../../context-os/evaluations/django-phase-2.1.md) |
| Phase 2 summary | [PHASE-2-RESULTS.md](../../context-os/evaluations/PHASE-2-RESULTS.md) |
| Private applied instance | [applied-instances.md](../../context-os/evaluations/applied-instances.md) |
