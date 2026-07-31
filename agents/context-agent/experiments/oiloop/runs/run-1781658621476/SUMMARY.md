# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781658621476`
- Paired questions: **10** (OL01–OL10 pilot subset)
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 0.500 | 2.100 | 2.400 |
| Hallucination rate | 20.0% | 30.0% | 20.0% |
| Mean latency (ms) | 4232.200 | 4848.700 | 5614.600 |
| Mean input tokens | 76663.400 | 6628.900 | 8850.100 |
| Mean context chars | 400000.000 | 21786.600 | 37969.800 |
| CCR vs A (chars) | 1× | 31.726× | 11.234× |

**Best accuracy:** C · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv`, `summary.json`, and `ABC-COMPARE.md`.
