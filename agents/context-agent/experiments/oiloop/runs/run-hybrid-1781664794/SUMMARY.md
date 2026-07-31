# Context OS Eval Summary

- Results: `context-os/eval/results/run-hybrid-1781664794`
- Paired questions: **8**
- Conditions: **B, C, D**

## A / B / C / D comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) | D (hybrid) |
|--------|---------------|----------------|------------------|----------------|
| Mean accuracy (0–3) | — | 2.875 | 2.375 | 2.500 |
| Hallucination rate | — | 0.0% | 25.0% | 12.5% |
| Mean latency (ms) | — | 1870.875 | 3403.500 | 3131.750 |
| Mean input tokens | — | 8546.500 | 7905.000 | 11983.625 |
| Mean context chars | — | 28900.375 | 34098.125 | 43933.250 |
| CCR vs A (chars) | 1× | —× | —× | —× |

**Best accuracy:** B · **Lowest tokens:** A

**Hybrid D vs B:** Δ accuracy -0.375 · tokens ratio 1.402×

**Hypothesis B vs A (heuristic):** N/A (no A)

See `paired.csv` and `summary.json`.
