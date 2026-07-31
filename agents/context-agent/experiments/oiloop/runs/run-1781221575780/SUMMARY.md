# Context OS Eval Summary

- Results: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781221575780`
- Paired questions: **10**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.400 | 1.100 | 2.000 |
| Hallucination rate | 0.0% | 20.0% | 20.0% |
| Mean latency (ms) | 7072.300 | 1892.400 | 3188.200 |
| Mean input tokens | 81228.400 | 663.600 | 8041.000 |
| Mean context chars | 400000.000 | 2592.600 | 34512.500 |
| CCR vs A (chars) | 1× | 651.833× | 12.065× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** NO

See `paired.csv` and `summary.json`.
