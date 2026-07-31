# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781300479278`
- Paired questions: **45**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.333 | 1.533 | 1.222 |
| Hallucination rate | 24.4% | 20.0% | 20.0% |
| Mean latency (ms) | 5606.822 | 7502.956 | 9149.089 |
| Mean input tokens | 88112.867 | 10614.778 | 20954.622 |
| Mean context chars | 320000.000 | 37760.222 | 77773.089 |
| CCR vs A (chars) | 1× | 12.130× | 4.127× |

**Best accuracy:** B · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
