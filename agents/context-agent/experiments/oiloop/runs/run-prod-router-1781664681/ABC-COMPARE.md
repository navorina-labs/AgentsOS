# Run 3 — Production keyword router

**Run:** `run-prod-router-1781664681` · **20 Q** · **condition B only** · **router: keyword** · 2026-06-17

| Metric | Gold Phase 3.1 | **Production (keyword)** | Δ |
|--------|----------------|--------------------------|---|
| B accuracy | 2.70 | **2.55** | −0.15 |
| B hallucination | 0% | **5%** | 1 Q (OL06) |
| B tokens | 6 334 | **6 349** | ≈0 |
| Router F1 | 1.0 | **1.0** | identical |

## H₁h verdict: **Supported**

- Production router matches gold labels on all 20 questions (F1 = 1.0).
- B accuracy 2.55 ≥ 2.16 (80% of gold 2.70).

## Weak spots vs gold (same routing, answer/judge variance)

| Q | Gold B | Prod B | Cause |
|---|--------|--------|-------|
| OL08 | 3 | 1 | **Identical answer text** — judge scored 3 vs 1 (variance) |
| OL19 | 3 | 2 | Answer variance |
| OL06 | 2 | 2 + hall | Extra symbols cited (RuleEnforcer) |

See [OL08-judge-variance.md](OL08-judge-variance.md).
