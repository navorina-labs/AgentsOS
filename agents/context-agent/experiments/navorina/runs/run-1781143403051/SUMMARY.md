# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781143403051`
- Paired questions: **42**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.000 | 1.190 | 0.929 |
| Hallucination rate | 23.8% | 19.0% | 7.1% |
| Mean latency (ms) | 4298.048 | 3078.119 | 7356.333 |
| Mean input tokens | 27626.857 | 2021.476 | 11858.214 |
| Mean context chars | 89218.000 | 6817.952 | 46947.905 |
| CCR vs A (chars) | 1× | 14.633× | 1.984× |

**Best accuracy:** B · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
