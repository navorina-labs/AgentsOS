# Context OS — канон Navorina

Единый контракт для AI-агентов и разработчиков: **как выбирать контекст** и **что считать источником правды**.

## Pipeline

```
Вопрос → question-router → primary core/subcore → Sources (1–3 файла кода)
                              ↓ при необходимости
                         secondary core + context-os/ops/<shard>.md
                              ↓ только для UI в Navorina/**
                         docs/agents/AGENT_HUB.md (workflow, не списки доков)
```

**Default eval lane (Phase 2.1):** Condition **C** (graph retrieval) + **semantic router** — лучший trust profile (hallucination ~7%).

## Иерархия при конфликте

1. **Код** (`Navorina/css/variables.css`, `server/paywall/index.js`, routes)
2. `docs/design-system/DESIGN_SYSTEM.md`
3. Planning **уровень 1** (`docs/planning/INDEX.md` § обязательно)
4. **Cores** (`context-os/cores/`, `context-os/subcores/`)
5. **Ops shards** (`context-os/ops/`)
6. `docs/reference/`, archive

## Роли документов

| Документ | Роль |
|----------|------|
| `context-os/router/question-router.md` | Маршрут по типу вопроса |
| `context-os/cores/*.md`, `subcores/*.md` | Доменный контекст + **Sources** |
| `context-os/ops/*.md` | API, smoke, env, эмуляторы (бывший AGENTS.md §) |
| `docs/agents/AGENT_HUB.md` | UI/UX workflow (шаги 0–5) |
| `AGENTS.md` | Короткий индекс → router + ops shards |

## Не читать по умолчанию

- Весь `AGENTS.md` целиком — только нужный ops shard
- Все 37 файлов `docs/planning/` — только INDEX level 1 + core **Key docs**
- `docs/archive/planning/PHASE*`, `docs/archive/optimization/`
- `docs/archive/real-project-test/` (заменён `context-os/`)

## UI vs ops

| Задача | Читать |
|--------|--------|
| Правка `Navorina/**` | router → `product-core` / `nucleus-core` → AGENT_HUB §2 |
| Stripe / CP / Resend / Xero | router → subcore → `context-os/ops/<shard>.md` |
| Релиз / smoke | `release-core` → `ops/dev-and-release.md` |

## Обновление канона

См. [`MAINTENANCE.md`](./MAINTENANCE.md). После правок cores: `npm run context-os:validate`.

## Sources

- [`manifest.json`](./manifest.json)
- [`router/question-router.md`](./router/question-router.md)
- [`evaluations/PHASE-2-NAVORINA-RESULTS.md`](./evaluations/PHASE-2-NAVORINA-RESULTS.md)
- [AI-Context-OS](https://github.com/navorina-labs/AI-Context-OS)
