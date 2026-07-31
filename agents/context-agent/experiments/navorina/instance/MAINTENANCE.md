# Context OS — обслуживание

Когда обновлять cores, ops и router после изменений в репозитории.

## Матрица «код → документ»

| Изменение | Обновить |
|-----------|----------|
| `server/paywall/**` | `subcores/paywall-core.md`, при API — `ops/stripe-billing.md` |
| `server/routes/stripe-billing.js` | `billing-core`, `ops/stripe-billing.md` |
| Crypto payments routes / CP UI | `nucleus-core`, `ops/crypto-payments.md` |
| Resend / digest / invoice email | `ops/delivery.md` |
| Web Push / VAPID | `ops/delivery.md` |
| Xero accounting routes | `nucleus-core`, `ops/xero.md` |
| Новый `nucleus-*-hub.ts` | `nucleus-core` Key files |
| npm smoke / `pre:release` / CI | `release-core`, `ops/dev-and-release.md` |
| PRD / roadmap фаза | `product-core`, `business-core` |
| Новая интеграция | subcore + новый `ops/*.md` + `routing-map.json` |
| UI shell (Bold v3, mobile) | `product-core` Key docs |

## Чеклист перед merge (context-os)

- [ ] Затронутый домен: обновлён соответствующий core?
- [ ] Ops (API/smoke/env): обновлён `context-os/ops/` shard?
- [ ] Новый маршрут вопроса: запись в `router/routing-map.json`?
- [ ] `npm run context-os:validate` — зелёный
- [ ] При изменении cores: `npm run eval:context-os:graph-build` (для Condition C)

## Периодически

| Частота | Действие |
|---------|----------|
| Каждый PR в `context-os/**` | CI: `context-os:validate` + `eval:context-os:route --ci` (`.github/workflows/context-os-ci.yml`) |
| Перед major release | `npm run eval:context-os:pilot` или full eval |
| После крупного рефактора docs | `audit/duplicate-or-stale-docs.md` |

## Не дублировать

- Длинные спеки остаются в `docs/planning/` — core **ссылается**, не копирует
- Ops-детали — только в `context-os/ops/`, не в cores и не в AGENT_HUB
- UI workflow — только в AGENT_HUB §2

## Sources

- [`CANON.md`](./CANON.md)
- [`audit/cleanup-candidates.md`](./audit/cleanup-candidates.md)
