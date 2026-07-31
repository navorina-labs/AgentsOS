# A / B / C — Navorina Phase 2.1

**Run:** `run-1781143403051` · **42 questions** · **gpt-4o-mini** · 2026-06-11

| Condition | Strategy | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|----------|-------------------|----------|---------|---------|
| **A** | Legacy docs | 27,627 | 1.00 | 24.0% | 4.3s |
| **B** | Context OS cores | **2,021** | **1.19** | 19.0% | **3.1s** |
| **C** | Hermes-style graph | 11,858 | 0.93 | **7.1%** | 7.4s |

## Tokens and cost (answer phase)

| | A | B | C |
|---|---|---|---|
| Session input tokens | 1.16M | 85k | 498k |
| Est. cost | $0.18 | **$0.015** | $0.08 |
| Savings vs A | — | **−91%** | −56% |
| CCR input vs A | 1× | **13.7×** | 2.3× |

## Conclusions

1. **Context OS (B)** — best accuracy and cost; +19% vs A, 14× compression.
2. **Hermes graph (C)** — lowest hallucination (7%) but accuracy drops to 0.93; 6× more tokens than B.
3. **Legacy docs (A)** — most expensive; baseline inflated by PRD + Roadmap + DS bundle.
4. **Production default: C** when hallucination matters; **B** for read-only Q&A with gold router.

**Quality per token (accuracy / mean input):** B ≫ C ≫ A

## Limitations

- B uses gold `expected_cores` from question bank.
- C = static graph index (477 nodes) + keyword/BFS.
- Keyword router F1 = 0.784 (NV29, NV42 failures).
- Judge tokens not included in cost.
