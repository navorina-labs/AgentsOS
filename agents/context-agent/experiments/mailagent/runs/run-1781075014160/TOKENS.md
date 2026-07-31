# Token Spend — A / B / C

- Run: `context-os/eval/results/run-1781075014160`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 87,755 | 286 | $0.4667 |
| B | Context OS | 1,929 | 211 | $0.0146 |
| C | Hermes graph | 21,048 | 255 | $0.1158 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−97.8%** (CCR **45.5×**)
- Answer cost: **−96.9%** ($0.4522 saved)

### C (Hermes graph)
- Input tokens: **−76.0%** (CCR **4.2×**)
- Answer cost: **−75.2%** ($0.3509 saved)

Judge calls not included. See `tokens-paired.csv`.
