# Token Spend — A / B / C

- Run: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781221575780`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 81,228 | 148 | $0.1227 |
| B | Context OS | 664 | 72 | $0.0014 |
| C | Hermes graph | 8,041 | 121 | $0.0128 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−99.2%** (CCR **122.4×**)
- Answer cost: **−98.8%** ($0.1213 saved)

### C (Hermes graph)
- Input tokens: **−90.1%** (CCR **10.1×**)
- Answer cost: **−89.6%** ($0.1099 saved)

Judge calls not included. See `tokens-paired.csv`.
