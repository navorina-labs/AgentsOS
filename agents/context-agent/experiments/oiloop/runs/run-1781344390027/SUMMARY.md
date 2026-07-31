# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781344390027`
- Paired questions: **20**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.000 | 1.050 | 1.550 |
| Hallucination rate | 35.0% | 25.0% | 30.0% |
| Mean latency (ms) | 9305.400 | 2402.050 | 5239.950 |
| Mean input tokens | 80909.700 | 1009.400 | 8370.850 |
| Mean context chars | 400000.000 | 4097.800 | 36549.000 |
| CCR vs A (chars) | 1× | 112.303× | 11.641× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
