# Business Core

## Purpose

Бизнес-контекст Navorina: позиционирование, монетизация, персоны, оси Crypto / Fin Hub, интеграции как revenue-зависимости, retention и non-goals. Для вопросов «зачем», «кому», «что влияет на деньги», «что можно убрать без вреда бизнесу».

## Covers

- Позиционирование: Crypto / Fin Hub, command center (Receive / Send / Account / Deliver)
- North Star и принципы продукта (roadmap § North Star, § Принципы)
- Персоны: исследователь, практик, «инструментщик» (PRD §3)
- Тарифы и monetization contour: free / plus / pro / premium / unlimited
- Бизнес-оси и статусы фаз (CP*, CFH*, RN*, MD*, Q2, M2, M3, I4)
- Интеграции как бизнес-блокеры: Stripe, Resend, Push, Crypto PSP, Xero
- Метрики успеха из PRD: вовлечение ассистента, Nucleus, инструменты, стабильность
- Non-goals: custody, PSD2-агрегатор, нативные apps, Big4-налоги
- Ops v0 для support tier (без product UI)

## Does not cover

- Детали реализации API, env, webhook handlers → Technical Core + Billing Core
- Разметка UI, токены, компоненты → Product Core + design-system
- Команды smoke/e2e, release pipeline → Operational Core + Release Core
- Матрица feature flags по файлам → Paywall Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **Navorina** | Crypto / Fin Hub — ассистент + инструменты + Nucleus workspace |
| **Nucleus** | Financial Mirror workspace (учёт, invoicing, payments hub) |
| **Receive / Send / Account / Deliver** | Четыре бизнес-оси хаба |
| **Plus / Pro** | Платные тарифы (Stripe Q2) |
| **CP0–CP8** | Криптоплатежи через PSP-партнёра |
| **CFH1–CFH5** | Crypto Fin Hub flows (ledger bridge, payouts, month close) |
| **RN1–RN8** | Quote-to-cash / invoicing delivery |
| **Ops v0** | Support API для tier и digest dry-run |

## Key files

| Путь | Роль |
|------|------|
| `docs/planning/PRD_NAVORINA.md` | Scope, персоны, MVP, non-goals |
| `docs/planning/NAVORINA_ROADMAP_TIMELINE.md` | Фазы, North Star, принципы |
| `docs/planning/CRYPTO_FIN_HUB_FLOW.md` | Карта Receive/Send/Account/Deliver |
| `docs/planning/INTEGRATIONS_WHEN_READY.md` | Индекс live-интеграций |
| `docs/planning/OPS_V0.md` | Support tier API |
| `docs/planning/FINANCIAL_PAIN_POINTS.md` | Jobs-to-be-done |
| `server/paywall/index.js` | Матрица tier → features (бизнес-упаковка) |
| `Navorina/subscribe.html` | Pricing surface |

## Key docs

- `docs/planning/INDEX.md` — уровни 1–3 планирования
- `docs/planning/STRIPE_WHEN_READY.md`, `RESEND_WHEN_READY.md`, `PUSH_WHEN_READY.md`, `XERO_WHEN_READY.md`, `CP0_PARTNER_WHEN_READY.md`
- `docs/planning/CP_CRYPTO_PAYMENTS_TERMINOLOGY.md` — UI-термины crypto
- `docs/tracking/EVENT_TRACKING_SETUP.md` — задел аналитики

## Risks

- **CP0 live ⬜** — Receive без live PSP ограничивает реальный crypto revenue
- **Фрагментация точек входа** — лендинг, assistant, tools, Nucleus (roadmap § Аудит)
- **API-cost rule** — AI-фичи должны укладываться в 10–20% подписки (roadmap принцип #5)
- **Двойное хранение подписок** — Supabase + file store + emulator (см. Technical/Billing risks)
- **Зависимость от внешних keys** — Stripe Georgia, Resend, VAPID, Xero, crypto partner

## Dependencies

- Product Core — модули, которые монетизируются
- Paywall Core + Billing Core — конверсия и MRR
- Revenue Core — метрики и воронки
- Operational Core — pilot verification перед go-live

## AI summary

Navorina — не чат-обёртка и не кошелёк, а **Crypto / Fin Hub** для freelancers/малых команд: invoicing, crypto receive/send, ledger, month close. Деньги: **Plus/Pro через Stripe**, Pro unlocks crypto invoicing и полный AI. Custody у PSP. При вопросах о revenue/churn/удалении фич — сначала оси Receive/Send/Account/Deliver и тарифная матрица в `server/paywall/index.js`, затем roadmap статусы (✅/🟡/⬜).

## Sources

- `docs/planning/PRD_NAVORINA.md`
- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md`
- `docs/planning/CRYPTO_FIN_HUB_FLOW.md`
- `docs/planning/INDEX.md`
- `docs/planning/OPS_V0.md`
- `docs/planning/INTEGRATIONS_WHEN_READY.md`
- `docs/planning/FINANCIAL_PAIN_POINTS.md`
- `AGENTS.md`
- `server/paywall/index.js`
- `server/paywall/tier-packaging.test.js`
