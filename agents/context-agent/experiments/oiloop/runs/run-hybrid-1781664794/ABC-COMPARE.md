# Run 2 — Hybrid ablation (cross-cutting B/C/D)

**Run:** `run-hybrid-1781664794` · **8 Q** · **filter: cross-cutting** · **router: gold** · 2026-06-17

| Condition | Accuracy | Halluc. | Mean tokens | Latency |
|-----------|----------|---------|-------------|---------|
| **B** (multi-core) | **2.875** | **0%** | **8 547** | **1.87s** |
| C (graph) | 2.375 | 25% | 7 905 | 3.40s |
| D (hybrid) | 2.500 | 12.5% | 11 984 | 3.13s |

D/B token ratio: **1.40×** (under 1.5× budget).

## H₁f verdict: **Rejected**

- D accuracy (2.50) **< B** (2.875) — hybrid does not improve over multi-core routing.
- D **> C** on accuracy but with 12.5% hallucination vs B 0%.
- **Production default for cross-cutting: B** (2 cores), not D or C-only.

## Per-question highlights

| Q | B | C | D |
|---|---|---|---|
| OL16 | 3 | 1 (hall) | 3 |
| OL19 | 3 | 2 (hall) | 1 (hall) |
| OL12 | 2 | 2 | **3** |

Condition D wins only OL12; B wins or ties on 7/8.
