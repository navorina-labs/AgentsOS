# Context OS Eval Summary

- Results: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781225808172`
- Paired questions: **20**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.200 | 1.050 | 1.550 |
| Hallucination rate | 20.0% | 25.0% | 15.0% |
| Mean latency (ms) | 5287.900 | 1787.200 | 5670.850 |
| Mean input tokens | 81211.700 | 978.800 | 8290.000 |
| Mean context chars | 400000.000 | 3963.000 | 36155.650 |
| CCR vs A (chars) | 1× | 368.246× | 11.712× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** NO

See `paired.csv` and `summary.json`.
