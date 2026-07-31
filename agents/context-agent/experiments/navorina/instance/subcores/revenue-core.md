# Revenue Core

## Purpose

Контекст монетизации и revenue-метрик: что влияет на деньги, какие поверхности конвертируют, что можно убрать без revenue impact. Subcore Business Core.

## Covers

- Тарифы free / plus / pro и revenue-bearing features
- Поверхности: `subscribe.html`, Settings → Plan, paywall prompts
- Revenue streams: Stripe subscriptions (Q2), Pro crypto invoicing, API-cost discipline
- Метрики PRD: конверсия инструментов, Nucleus retention, assistant engagement
- Аналитика: Amplitude (`amplitude-analytics.ts`), event tracking setup
- Churn drivers: paywall gates, AI limits, integration gaps (no live keys)
- «Что можно удалить» — фичи вне Plus/Pro matrix и non-goals

## Does not cover

- Webhook implementation → Billing Core
- UI paywall components detail → Paywall Core
- Full product module map → Product Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **Plus** | Snapshots, brief, export, periodic review |
| **Pro** | Full AI crew + invoice email + accept crypto |
| **invoice_accept_crypto** | Pro-only revenue differentiator |
| **monthly_brief_ai** | Plus+ digest AI |
| **Amplitude** | Product analytics client |
| **MRR / Upgrade Rate** | Roadmap goals (universe research dataset) |

## Key files

| Путь | Роль |
|------|------|
| `server/paywall/index.js` | Feature → tier matrix |
| `server/paywall/tier-packaging.test.js` | Plus/Pro tests |
| `Navorina/subscribe.html` | Pricing page |
| `Navorina/src/utils/nucleus-paywall-prompt.ts` | Upgrade CTAs |
| `Navorina/src/utils/amplitude-analytics.ts` | Analytics |
| `Navorina/src/utils/nucleus-workspace-context-client.ts` | Tier in workspace context |
| `server/services/workspace-context.js` | Server bundle |

## Key docs

- `docs/planning/PRD_NAVORINA.md` §2 (метрики)
- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md` (принцип API-cost)
- `docs/tracking/EVENT_TRACKING_SETUP.md`
- `docs/planning/STRIPE_WHEN_READY.md`
- `docs/development/PLAN_RATE_LIMITING_PAYWALL.md`

## Risks

- **Нет единого revenue dashboard в репо** — метрики размазаны (Amplitude, Supabase events)
- **Free tier generous** — monthly_snapshot true на free
- **Crypto revenue blocked** — CP0 live ⬜
- **Tool pages** — трафик без явной monetization path

## Dependencies

- business-core, paywall-core, billing-core

## AI summary

Revenue = **Stripe Plus/Pro** + **Pro-only** (crypto invoicing, full AI). Матрица: `server/paywall/index.js`. При падении revenue: (1) conversion subscribe→paid, (2) Pro feature usage, (3) churn после paywall hit, (4) live integration gaps. Удалять безопасно: non-goals PRD, level-3 planning docs, experiments — не Plus/Pro gates.

## Sources

- `server/paywall/index.js`
- `docs/planning/PRD_NAVORINA.md`
- `docs/tracking/EVENT_TRACKING_SETUP.md`
- `Navorina/src/utils/amplitude-analytics.ts`
- `Navorina/src/utils/nucleus-paywall-prompt.ts`
- `project-universe-research/src/data/navorina-universe.ts` (goals dataset)
