# Technical Core

## Purpose

Технический контекст: стек, архитектура, данные, API, env, сборка, auth. Для вопросов «как устроено», «где код», «какой endpoint», «почему не работает интеграция на уровне кода».

## Covers

- Репозиторий: `Navorina/` (статика+Vite+TS), `server/` (Express API), `docs/`, `e2e/`, `scripts/`
- Frontend: HTML, CSS tokens, TypeScript → `dist-ts/`, React 18 для assistant
- Backend: `financial-api-server.js`, routes, agents, services, paywall, ai-limits
- Данные: Firestore (FM), Supabase (subscriptions, AI usage), localStorage, `server/.data/`
- Auth: Firebase (документация + client), Supabase RLS migrations
- API namespaces: `/api/financial-mirror/*`, `/api/ops/*`, `/api/accounting/xero/*`, crypto-payments, invoicing
- Dev stack: `npm run dev` → Vite :5501 + server :3001 + эмуляторы
- Build: `npm run build`, Netlify deployment docs

## Does not cover

- Release checklist порядок → Release Core
- Бизнес-обоснование тарифов → Business Core
- UX copy и термины crypto UI → Product Core
- Пошаговый onboarding пользователя → Onboarding Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **financial-api-server.js** | Main Express entry |
| **paywall/index.js** | Tier + feature access |
| **ai-limits.js** | Per-agent monthly limits |
| **workspace-context.js** | Paywall + subscription + services bundle |
| **financial-mirror-rest.js** | FM REST/DB layer |
| **fm-ai-usage.js** | AI usage tracking Supabase |
| **user-subscription-file-store.js** | Dev billing file store |
| **agents/** | LLM agents (verdict, brief, OCR, digest, …) |
| **FinancialMirrorAPI** | Client API layer in `financial-mirror.ts` |

## Key files

| Путь | Роль |
|------|------|
| `package.json` | Root scripts: dev, ci, smoke, tests |
| `server/package.json` | Server tests |
| `server/financial-api-server.js` | API mount |
| `server/development.defaults.env` | Default emulator flags |
| `server/.env.example` | Production env template |
| `server/routes/stripe-billing.js` | Stripe checkout + webhook |
| `server/routes/billing-emulator.js` | Dev billing |
| `server/routes/financial-mirror-*.js` | FM routes |
| `server/routes/ops.js` | Ops v0 |
| `Navorina/vite.config.js` | Vite build |
| `Navorina/src/utils/financial-mirror-firestore.ts` | Firestore client |
| `scripts/dev-all.sh` | Dev orchestration |

## Key docs

- `docs/architecture/OVERVIEW.md`
- `docs/architecture/DATA_STORAGE_AND_FLOW.md`
- `docs/firebase/FINANCIAL_MIRROR_FIRESTORE.md`
- `docs/setup/START_HERE.md`
- `docs/setup/LOCAL_DEV_EMULATORS.md`
- `docs/deployment/DEPLOYMENT.md`
- `docs/security/` — RLS, policies
- `server/README.md`
- `server/financial-mirror/README.md`

## Risks

- **Firestore + Supabase + localStorage** — три слоя данных, риск рассинхрона (roadmap P4)
- **dist-ts/** committed — drift с `src/` если забыть compile
- **Dual auth docs** — Firebase primary в architecture, Supabase в migrations/tracking

## Dependencies

- Operational Core — как запускать и проверять
- Billing Core — Stripe/emulator routes
- Nucleus Core — FM client + hubs
- Assistant Core — chat, AI routes, limits

## AI summary

Стек: **статический фронт** (`Navorina/`, Vite, TS→dist-ts) + **Node Express** (`server/`). Данные: **Firestore** для FM workspace, **Supabase** для subscriptions/AI usage, **localStorage** на клиенте. API под `/api/financial-mirror/`. Dev: `npm run dev`. Paywall: `server/paywall/index.js`; AI limits: `server/ai-limits.js`. Не читать весь репо — идти от route → service → client util.

## Sources

- `docs/architecture/OVERVIEW.md`
- `docs/architecture/DATA_STORAGE_AND_FLOW.md`
- `docs/setup/START_HERE.md`
- `docs/planning/PRD_NAVORINA.md` §7
- `package.json`, `server/package.json`
- `AGENTS.md`
- `server/financial-api-server.js`
- `server/README.md`
