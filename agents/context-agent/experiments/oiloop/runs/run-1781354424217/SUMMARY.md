# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781354424217`
- Paired questions: **20**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.000 | 1.200 | 1.550 |
| Hallucination rate | 20.0% | 20.0% | 15.0% |
| Mean latency (ms) | 3920.000 | 1840.300 | 4294.300 |
| Mean input tokens | 80909.700 | 1043.600 | 8399.350 |
| Mean context chars | 400000.000 | 4230.400 | 36659.500 |
| CCR vs A (chars) | 1× | 108.611× | 11.611× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
