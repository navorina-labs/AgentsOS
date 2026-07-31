# Token Spend — A / B / C

- Run: `context-os/eval/results/run-1781354424217`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 80,910 | 123 | $0.2442 |
| B | Context OS | 1,044 | 60 | $0.0038 |
| C | Hermes graph | 8,399 | 108 | $0.0265 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−98.7%** (CCR **77.5×**)
- Answer cost: **−98.4%** ($0.2404 saved)

### C (Hermes graph)
- Input tokens: **−89.6%** (CCR **9.6×**)
- Answer cost: **−89.2%** ($0.2177 saved)

Judge calls not included. See `tokens-paired.csv`.
