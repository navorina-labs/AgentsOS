# Context OS Eval Summary

- Results: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781222450776`
- Paired questions: **20**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.300 | 1.050 | 1.550 |
| Hallucination rate | 20.0% | 20.0% | 25.0% |
| Mean latency (ms) | 4203.450 | 1948.000 | 4028.350 |
| Mean input tokens | 81227.700 | 709.100 | 8269.950 |
| Mean context chars | 400000.000 | 2772.450 | 36037.650 |
| CCR vs A (chars) | 1× | 394.866× | 11.760× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** NO

See `paired.csv` and `summary.json`.
