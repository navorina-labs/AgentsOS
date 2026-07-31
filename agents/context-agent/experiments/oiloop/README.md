# Experiment: Oiloop (macOS AI Companion)

This experiment evaluates the **AI Context OS** domain-oriented context cores approach on a private commercial macOS companion application (`Oiloop`).

**Maintenance:** [MAINTENANCE.md](MAINTENANCE.md) — when to update cores after code changes.

---

## Metadata

| Field | Value |
|-------|-------|
| Project | Oiloop |
| Repository | `file:///Users/alex0nder/Projects/Oiloop` |
| Phase | 3 |
| Status | measured |
| Start date | 2026-06-12 |
| Model used | `gpt-4o-mini` |

---

## Hypothesis (Subject-Specific)

- **Domain-Oriented Context Cores (Condition B)** will yield equivalent or higher accuracy compared to the **Full Repository snap (Condition A)** while achieving a Context Compression Ratio (CCR) of $\ge 5\times$ and reducing local model latency by $\ge 40\%$.
- System/automation-related queries will route cleanly to `system-control-core`, preventing accidental trigger tag hallucinations in other contexts.

---

## Cores Built

| Core | Version | Token estimate |
|------|---------|----------------|
| [personal-core](cores/personal-core.md) | 1.0.0 | ~800 |
| [workspace-core](cores/workspace-core.md) | 1.1.0 | ~1200 |
| [communication-core](cores/communication-core.md) | 1.0.0 | ~1000 |
| [system-control-core](cores/system-control-core.md) | 1.0.0 | ~950 |
| [browsing-core](cores/browsing-core.md) | 1.0.0 | ~750 |

---

## Routing Validation

| Metric | Target | Actual |
|--------|--------|--------|
| Routing precision | ≥0.90 | 1.00 |
| Routing recall | ≥0.90 | 1.00 |

---

## Compression

| Measure | Value |
|---------|-------|
| Full repo tokens | ~80,910 |
| Mean routed core tokens | ~1,044 |
| CCR | 109× |

---

## Results Summary

Run: [runs/run-1781660908/](runs/run-1781660908/) (canonical) · Run 3: [run-prod-router-1781701118](runs/run-prod-router-1781701118/) · Run 2: [run-hybrid-1781664794](runs/run-hybrid-1781664794/)

| Metric | Phase 3.1 (gold) | Run 3 (keyword) | Run 2 cross-cutting (B) |
|--------|------------------|-----------------|---------------------------|
| B accuracy | **2.70** | **2.75** | **2.875** |
| B hallucination | 0% | **0%** | 0% |
| Router F1 | 1.0 | **1.0** | 1.0 (gold) |

**Production default:** B (keyword router, multi-core). H₁f hybrid D **rejected**.

Prior: [run-1781354424217](runs/run-1781354424217/) (superseded).

Superseded: [run-1781354424217](runs/run-1781354424217/), [run-1781344390027](runs/run-1781344390027/), [run-1781225808172](runs/run-1781225808172/), [run-1781222450776](runs/run-1781222450776/).

---

## Files Structure

```
experiments/oiloop/
├── README.md
├── hypothesis.md
├── routing-rules.md
└── cores/
    ├── personal-core.md
    ├── workspace-core.md
    ├── communication-core.md
    ├── system-control-core.md
    └── browsing-core.md
```
