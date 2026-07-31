# Context OS — Navorina

Система **контекстных ядер** для AI-агентов. Цель — быстрее понимать проект и загружать **минимальный** релевантный контекст вместо всего репозитория.

Построено по модели **[AI Context OS](https://github.com/navorina-labs/AI-Context-OS)** на данных из `docs/`, `AGENTS.md`, `Navorina/`, `server/`, `package.json`. Прототип: `docs/archive/real-project-test/`.

Это **первая заполненная реализация** на реальном проекте (не шаблон). Framework-репозиторий — теория и templates; `navorina/context-os/` — production instance.

## Что такое Context OS

- **Cores** — 4 главных слоя: Business, Product, Technical, Operational
- **Subcores** — 7 доменных ядер: Revenue, Paywall, Billing, Onboarding, Nucleus, Assistant, Release
- **Router** — какой core читать для какого вопроса
- **Audit** — карта проекта, кандидаты на уборку, риски

## Зачем нужны Core

| Проблема | Решение |
|----------|---------|
| `AGENTS.md` — длинный ops | `context-os/ops/` shards + subcore |
| 229+ файлов в `docs/` | INDEX + core ссылается на 5–10 canonical docs |
| 42 nucleus hubs | `nucleus-core.md` даёт entry points |
| Агент читает устаревший PHASE*_PROGRESS | Router → roadmap + PRD |

## Как AI выбирает контекст

1. Прочитать [`router/question-router.md`](./router/question-router.md)
2. Сопоставить вопрос с [`router/routing-map.json`](./router/routing-map.json)
3. Открыть **primary** core/subcore из `cores/` или `subcores/`
4. По секции **Sources** в core — точечно открыть 1–3 файла кода
5. UI-задачи: дополнительно `docs/agents/AGENT_HUB.md` + `UX_PRINCIPLES.md`

## Структура

```
context-os/
├── CANON.md               ← контракт канона (читать первым)
├── MAINTENANCE.md         ← когда обновлять cores/ops
├── README.md              ← вы здесь
├── manifest.json          ← machine index
├── cores/                 ← 4 главных ядра
├── subcores/              ← 7 доменных ядер
├── ops/                   ← API, smoke, env (бывший AGENTS.md §)
├── router/                ← маршрутизация вопросов
├── eval/                  ← A/B/C harness
└── audit/                 ← карта, cleanup, риски
```

## Какие файлы читать первыми

| Ситуация | Файлы |
|----------|-------|
| Любой новый вопрос | `router/question-router.md` |
| Не знаешь scope | `cores/product-core.md` |
| Не знаешь бизнес | `cores/business-core.md` |
| Правка кода | core по router + **Sources** |
| UI в Navorina | + `docs/agents/AGENT_HUB.md` |
| Релиз | `subcores/release-core.md` |

## Как обновлять Core

1. **Не дублировать** длинные спеки — ссылаться на canonical doc в `docs/`
2. После значимых изменений продукта: обновить затронутый core + `manifest.json` date
3. Новый домен → новый subcore + запись в `routing-map.json`
4. Cleanup только через `audit/cleanup-candidates.md` — не удалять без проверки
5. При конфликте: **код** > `DESIGN_SYSTEM.md` > planning level 3

## Как использовать с AI-агентом

### В чате

Укажи core явно в первом сообщении:

```
Use only Revenue Core and answer why revenue dropped.
```

```
Use Billing Core + Technical Core and debug Stripe webhook.
```

```
Use Product Core and explain what Navorina is.
```

```
Use Release Core and prepare release checklist.
```

### Связь с существующими правилами

- `product-design-system.mdc` — остаётся для UI (дополняет Product Core)
- `context-os/ops/<shard>.md` — ops после выбора core
- `real-project-test/README.md` — redirect stub; архив в `docs/archive/real-project-test/`

## How to ask an AI agent

Примеры промптов:

| Задача | Промпт |
|--------|--------|
| Revenue | «Use only Revenue Core and answer why revenue dropped.» |
| Stripe | «Use Billing Core + Technical Core and debug Stripe webhook.» |
| Product | «Use Product Core and explain what Navorina is.» |
| Release | «Use Release Core and prepare release checklist.» |
| FM | «Use Nucleus Core + Technical Core — how does month close work?» |
| Paywall | «Use Paywall Core — why is accept crypto blocked on Plus?» |
| Onboarding | «Use Onboarding Core — what blocks first value?» |
| Cleanup | «Read audit/cleanup-candidates.md — what is safe to archive?» |

## CI и export

```bash
npm run context-os:validate
npm run eval:context-os:route:ci    # keyword F1 ≥ 0.75
npm run context-os:export-framework   # bundle → framework-export/navorina/
npm run context-os:sync-framework     # + rsync → ../AI-Context-OS/experiments/navorina/instance/
```

Workflow: [`.github/workflows/context-os-ci.yml`](../.github/workflows/context-os-ci.yml).

## Manifest

См. [`manifest.json`](./manifest.json) для путей всех ядер и audit-файлов.

## Framework

| Репозиторий | Роль |
|-------------|------|
| [navorina-labs/AI-Context-OS](https://github.com/navorina-labs/AI-Context-OS) | Theory, `schemas/`, core templates, routing methodology |
| `navorina/context-os/` (этот каталог) | Filled cores for Navorina from real code + docs |
| `docs/archive/real-project-test/` | Archived prototype cores |

Pipeline (framework):

```
Question → Router → Context Core → LLM
```

## Sources

- [AI-Context-OS](https://github.com/navorina-labs/AI-Context-OS)
- `docs/archive/real-project-test/`
- `docs/planning/INDEX.md`
- `AGENTS.md`
- `docs/architecture/OVERVIEW.md`
