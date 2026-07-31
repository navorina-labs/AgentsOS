# Token Spend — A / B / C

- Run: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781222450776`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 81,228 | 123 | $0.2452 |
| B | Context OS | 709 | 59 | $0.0028 |
| C | Hermes graph | 8,270 | 111 | $0.0261 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−99.1%** (CCR **114.6×**)
- Answer cost: **−98.8%** ($0.2423 saved)

### C (Hermes graph)
- Input tokens: **−89.8%** (CCR **9.8×**)
- Answer cost: **−89.3%** ($0.2190 saved)

Judge calls not included. See `tokens-paired.csv`.
