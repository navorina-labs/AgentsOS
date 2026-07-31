# Token Spend — A / B / C

- Run: `/Users/alex0nder/Projects/Oiloop/context-os/eval/results/run-1781225808172`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 81,212 | 125 | $0.2451 |
| B | Context OS | 979 | 57 | $0.0036 |
| C | Hermes graph | 8,290 | 106 | $0.0261 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−98.8%** (CCR **83.0×**)
- Answer cost: **−98.5%** ($0.2415 saved)

### C (Hermes graph)
- Input tokens: **−89.8%** (CCR **9.8×**)
- Answer cost: **−89.3%** ($0.2190 saved)

Judge calls not included. See `tokens-paired.csv`.
