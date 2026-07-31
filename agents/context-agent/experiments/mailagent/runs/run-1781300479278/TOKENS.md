# Token Spend — A / B / C

- Run: `context-os/eval/results/run-1781300479278`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 88,113 | 272 | $0.6021 |
| B | Context OS | 10,615 | 265 | $0.0788 |
| C | Hermes graph | 20,955 | 240 | $0.1479 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−88.0%** (CCR **8.3×**)
- Answer cost: **−86.9%** ($0.5233 saved)

### C (Hermes graph)
- Input tokens: **−76.2%** (CCR **4.2×**)
- Answer cost: **−75.4%** ($0.4542 saved)

Judge calls not included. See `tokens-paired.csv`.
