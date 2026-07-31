# Token Spend — A / B / C

- Run: `context-os/eval/results/run-1781143403051`
- Model: **gpt-4o-mini**
- Conditions: **A, B, C**

## Per answer (mean input tokens)

| Condition | Label | Mean input | Mean output | Est. cost (session) |
|-----------|-------|------------|-------------|---------------------|
| A | full repo | 27,627 | 132 | $0.1774 |
| B | Context OS | 2,021 | 99 | $0.0152 |
| C | Hermes graph | 11,858 | 147 | $0.0784 |

## Savings vs A (full repo)

### B (Context OS)
- Input tokens: **−92.7%** (CCR **13.7×**)
- Answer cost: **−91.4%** ($0.1621 saved)

### C (Hermes graph)
- Input tokens: **−57.1%** (CCR **2.3×**)
- Answer cost: **−55.8%** ($0.0990 saved)

Judge calls not included. See `tokens-paired.csv`.
