# Run 3 — Production keyword router (v1.1.1, post-OL06 fix)

**Run:** `run-prod-router-1781701118` · **20 Q** · **condition B only** · **router: keyword** · 2026-06-17  
**Supersedes:** [run-prod-router-1781664681](../run-prod-router-1781664681/) (OL06 hallucination before workspace-core v1.1.1)

| Metric | Gold Phase 3.1 | **Production (keyword)** | Prior prod |
|--------|----------------|--------------------------|------------|
| B accuracy | 2.70 | **2.75** | 2.55 |
| B hallucination | 0% | **0%** | 5% (OL06) |
| B tokens (mean in) | 6 334 | **6 467** | 6 349 |
| Router F1 | 1.0 | **1.0** | 1.0 |

## H₁h verdict: **Supported**

- Production router F1 = **1.0** on all 20 questions.
- B accuracy **2.75** ≥ 2.16 (80% of gold 2.70) — exceeds prior prod run.

## OL06 (fixed)

| | run-prod-router-1781664681 | **run-prod-router-1781701118** |
|---|---|---|
| B accuracy | 2 | **3** |
| B hallucination | true | **false** |

Answer follows four gold bullets (FileOrganizer → FileOrganizeService → FilePreviewSheet → user confirm). No `RuleEnforcer` in OL06 scope.

## Weak spots vs gold

| Q | Gold B | Prod B | Notes |
|---|--------|--------|-------|
| OL08 | 3 | 1 | Judge variance (see [OL08-judge-variance.md](../run-prod-router-1781664681/OL08-judge-variance.md)) |
| OL19 | 3 | 2 | Answer variance |
