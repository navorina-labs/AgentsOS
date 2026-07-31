# Question Router

Как выбирать минимальный контекст для AI-агента в Navorina. **Не читать весь репозиторий** — загрузить 1 primary + 0–2 secondary cores.

## Правила

1. Определи **тип вопроса** (бизнес / продукт / техника / операции / домен).
2. Открой **primary subcore** если есть; иначе **primary core**.
3. Добавь **secondary** только если вопрос пересекает границы (например webhook = billing + technical).
4. **avoid: full-project** — не грузить AGENTS.md целиком для узких вопросов; используй `context-os/manifest.json`.
5. Для UI-правок в `Navorina/**` — добавь `docs/agents/AGENT_HUB.md` + `UX_PRINCIPLES.md` (не отдельный core, но обязательный слой).

## Core selection matrix

| Тип вопроса | Primary | Secondary | Avoid |
|-------------|---------|-----------|-------|
| Что такое Navorina / scope | product-core | business-core | full AGENTS.md |
| Позиционирование / North Star | business-core | product-core | nucleus hubs |
| Revenue / MRR / что влияет на деньги | revenue-core | business-core, billing-core | all e2e specs |
| Paywall / upgrade CTA / trial | paywall-core | revenue-core | full AGENTS.md |
| Stripe / webhook / subscription | billing-core | technical-core, paywall-core | marketing docs |
| Onboarding / activation | onboarding-core | product-core | crypto CP* specs |
| Financial Mirror / month close | nucleus-core | technical-core | assistant chat |
| Assistant / chat / voice / AI limits | assistant-core | paywall-core, technical-core | invoicing routes |
| Release / smoke / CI | release-core | operational-core | PRD full |
| Новый backend dev setup | technical-core | operational-core | planning level-3 |
| Churn / retention | business-core | product-core, revenue-core | server agents |
| Что удалить / cleanup | business-core | product-core | — |
| UI / формы / Nucleus tabs | product-core | nucleus-core | package.json scripts |
| Env / emulators | operational-core | technical-core | roadmap timeline |
| Crypto payments UX | nucleus-core | product-core | stripe routes |
| Xero / accounting export | nucleus-core | release-core | assistant-core |
| Ops / support tier | operational-core | business-core | design-system |

## Примеры маршрутизации

| Вопрос | Route |
|--------|-------|
| Revenue упал на 20% | **revenue-core** + business-core |
| Stripe webhook упал | **billing-core** + technical-core |
| Что является ядром продукта | **product-core** |
| Как улучшить onboarding | **onboarding-core** + product-core |
| Что проверить перед релизом | **release-core** + operational-core |
| Как работает Financial Mirror | **nucleus-core** + technical-core |
| Что можно удалить | **business-core** + product-core |
| Почему растёт churn | **business-core** + product-core (+ revenue-core) |
| Новый backend developer onboarding | **technical-core** + operational-core |
| Почему не работает accept crypto | **nucleus-core** + paywall-core + billing-core |
| INP на assistant странице | **assistant-core** + product-core + MWG |
| Month close export пустой | **nucleus-core** + technical-core |

## Файлы по приоритету

### Всегда первые (meta)
- `context-os/README.md`
- `context-os/manifest.json`
- Этот файл

### После выбора core
- Соответствующий файл из `context-os/cores/` или `context-os/subcores/`
- Секция **Sources** в core → точечное чтение исходников

### UI-задачи (дополнительно)
- `docs/agents/AGENT_HUB.md`
- `docs/design-system/UX_PRINCIPLES.md`
- `npm run mwg:search -- "<task>"`

### Операции (дополнительно)
- `context-os/ops/<shard>.md` — API, smoke, env (индекс: `AGENTS.md`)

## Machine-readable routing

См. [`routing-map.json`](./routing-map.json) для pattern → core mapping.

## Sources

- `docs/archive/real-project-test/` (historical prototype)
- `docs/planning/INDEX.md` (уровни документации)
- `AGENTS.md`
