# Oiloop — Phase 3 Results

**Status:** Phase 3.1 closed (2026-06-17)  
**Questions:** 20 · **Cores:** 5 (v1.1.0) · **Model:** gpt-4o-mini  
**Production default:** B (keyword router, multi-core)

**Canonical run:** [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) · gold router · v1.1 cores  
**Closure:** [PHASE-3.1-CLOSED.md](../../experiments/oiloop/runs/run-1781660908/PHASE-3.1-CLOSED.md)

---

## Phase 3.1 — A/B/C (canonical)

| Metric | A (full repo) | B (cores) | C (graph) |
|--------|---------------|-----------|-----------|
| **Accuracy** | 0.75 | **2.70** | 2.35 |
| **Hallucination** | 30% | **0%** | 10% |
| **Mean input tokens** | 76,663 | **6,334** | 8,963 |
| **CCR (tokens)** | 1× | **~12×** | ~8.6× |
| **Latency** | 2.5s | **2.1s** | 2.7s |

**H₁ supported:** B **2.70** vs A **0.75** (Δ +1.95). H₁g supported (core richness: 1.20 → 2.70).

---

## Run 3 — Production router (H₁h)

[run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/) · keyword router · 20 Q · B only (v1.1.1)

| Metric | Gold | Production |
|--------|------|------------|
| B accuracy | 2.70 | **2.75** |
| Router F1 | 1.0 | **1.0** |
| B hallucination | 0% | **0%** |

Prior (pre OL06 fix): [run-prod-router-1781664681](../../experiments/oiloop/runs/run-prod-router-1781664681/) — B 2.55, 5% hall.

OL08 Δ (3→1) = [judge variance](../../experiments/oiloop/runs/run-prod-router-1781664681/OL08-judge-variance.md), not routing failure.

---

## Run 2 — Cross-cutting B/C/D (H₁f)

[run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/) · 8 cross-cutting Q

| | B | C | D |
|---|---|---|---|
| Accuracy | **2.875** | 2.375 | 2.500 |
| Hallucination | **0%** | 25% | 12.5% |

**H₁f rejected** — multi-core B beats hybrid D and graph C on cross-cutting.

---

## Generalization

| Metric | Value |
|--------|-------|
| Codebase | Oiloop macOS companion (Swift) |
| Cores | `personal`, `workspace`, `communication`, `system-control`, `browsing` |
| Router F1 (keyword) | **1.000** (Run 3) |
| Expert preference (masked decode, prior run) | **75.0%** — human blind pilot pending |

---

## Historical runs (superseded)

| Run | B acc | Notes |
|-----|-------|-------|
| [run-1781354424217](../../experiments/oiloop/runs/run-1781354424217/) | 1.20 | Pre v1.1 cores |
| [run-1781658621476](../../experiments/oiloop/runs/run-1781658621476/) | 2.10 | 10 Q pilot, expanded metadata |

---

## Raw Artifacts

| Resource | Path |
|----------|------|
| Phase 3.1 canonical | [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) |
| Production router | [run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/) |
| Hybrid ablation | [run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/) |
| Private report | `Oiloop/docs/OILOOP-EXPERIMENT-RESULTS.md` |

---

## Cross-Reference

- [PHASE-3-RESULTS.md](PHASE-3-RESULTS.md)
- [PHASE-2-RESULTS.md](PHASE-2-RESULTS.md)
- [applied-instances.md](applied-instances.md)
- [hypothesis.md](../../docs/hypothesis.md)
