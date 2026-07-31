# Navorina — Phase 2.1 Results

**Status:** Measured  
**Questions:** 42 · **Cores:** 11 · **Run:** [run-1781143403051](../../experiments/navorina/runs/run-1781143403051/)  
**Commit:** `413acd41`

---

## A/B/C Results

| Metric | A (full repo) | B (cores) | C (graph) |
|--------|---------------|-----------|-----------|
| **Accuracy** | 1.00 | **1.19** | 0.93 |
| **Cost** | $0.18 | **$0.015** | $0.08 |
| **Hallucination** | 24% | 19% | **7%** |
| **Mean input tokens** | ~27.6k | **~2.0k** | ~11.9k |
| **Latency (mean)** | 4.3s | **3.1s** | 7.4s |

**Key finding:** C wins on trust (7% halluc vs 19% B) but loses accuracy (0.93 vs 1.19 B). Production default **C**; B for read-only Q&A when router F1 improves.

---

## Generalization

| Metric | Value |
|--------|-------|
| Questions | 42 |
| Cores | 11 |
| Router F1 (keyword) | **0.872** |
| Router F1 (semantic) | **0.837** |
| Production canon | [experiments/navorina/instance](../../experiments/navorina/instance/) |
| Core compression | **14×** (13.7× measured) |
| Hypothesis (B > A) | **supported** |
| Run verified | 2026-06-11 |

---

## Router Failures (keyword)

- All historical routing failures (NV05, NV12, NV26, NV33, NV39) are fully resolved (F1 = 1.000).
- Minor partial matches remain only on highly integrated cross-cutting boundaries (e.g., NV42 F1 = 0.571).

---

## Cross-Reference

- Summary: [PHASE-2-RESULTS.md](PHASE-2-RESULTS.md)
- Published: [experiments/navorina/results.md](../../experiments/navorina/results.md)
