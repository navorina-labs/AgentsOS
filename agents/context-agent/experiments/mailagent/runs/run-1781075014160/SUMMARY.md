# Context OS Eval Summary

- Results: `context-os/eval/results/run-1781075014160`
- Paired questions: **35**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.400 | 1.686 | 1.371 |
| Hallucination rate | 20.0% | 22.9% | 14.3% |
| Mean latency (ms) | 10845.486 | 5440.029 | 11080.943 |
| Mean input tokens | 87755.457 | 1929.143 | 21047.543 |
| Mean context chars | 320000.000 | 6485.371 | 77624.857 |
| CCR vs A (chars) | 1× | 59.724× | 4.135× |

**Best accuracy:** B · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
