# Context OS Eval Summary

- Results: `/Users/alex0nder/Projects/MailAgent/context-os/eval/results/run-1781319187610`
- Paired questions: **45**
- Conditions: **A, B, C**

## A / B / C comparison

| Metric | A (full repo) | B (Context OS) | C (Hermes graph) |
|--------|---------------|----------------|------------------|
| Mean accuracy (0–3) | 1.378 | 1.667 | 1.244 |
| Hallucination rate | 20.0% | 17.8% | 22.2% |
| Mean latency (ms) | 6127.089 | 6129.156 | 10142.622 |
| Mean input tokens | 88112.867 | 10614.778 | 20954.622 |
| Mean context chars | 320000.000 | 37760.222 | 77773.089 |
| CCR vs A (chars) | 1× | 12.130× | 4.127× |

**Best accuracy:** B · **Lowest tokens:** B

**Hypothesis B vs A (heuristic):** YES

See `paired.csv` and `summary.json`.
