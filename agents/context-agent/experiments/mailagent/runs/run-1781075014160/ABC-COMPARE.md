# A / B / C — Hermes graph vs Context OS vs Full repo

**Run:** `run-1781075014160` · **35 вопросов** · **gpt-4o-mini** · 2026-06-10

| Condition | Стратегия | Mean context | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|-----------|--------------|-------------------|----------|---------|---------|
| **A** | Full repo | 320k chars | 87 755 | **1.40** | 20.0% | 10.8s |
| **B** | Context OS cores | 5.4k chars | **1 929** | **1.69** | 22.9% | **5.4s** |
| **C** | Hermes-style graph | 77k chars | 21 048 | 1.37 | **14.3%** | 11.1s |

## Токены и стоимость (answer phase)

| | A | B | C |
|---|---|---|---|
| Session input tokens | 3.07M | 68k | 737k |
| Est. cost | $0.467 | **$0.015** | $0.116 |
| Savings vs A | — | **−97%** | −76% |
| CCR input vs A | 1× | **45×** | 4.2× |

## Выводы

1. **Context OS (B)** — лучший баланс: выше точность, минимум токенов, быстрее всех.
2. **Hermes graph (C)** — между A и B по размеру, но **не** между ними по качеству: accuracy ≈ A (−0.03), при **11× больше токенов**, чем B.
3. **Full repo (A)** — самый дорогой и медленный; проигрывает B по accuracy.
4. Graph снизил hallucination vs A/B, но ценой контекста и без выигрыша в accuracy.

**Quality per token (accuracy / mean input):** B ≫ C ≫ A

## Ограничения

- C = статический graph index + keyword/BFS retrieval (не live CodeGraph MCP).
- B использует gold `expected_cores` (идеальный router).
- Judge tokens не включены в cost.
