# Project Map

Сжатая карта репозитория `navorina`. Не исчерпывающий список файлов — группировка по смыслу.

## Верхний уровень

| Путь | Назначение |
|------|------------|
| `Navorina/` | Публикуемый фронт: HTML, CSS, TS, assets |
| `server/` | Express API, agents, paywall, integrations |
| `docs/` | Продукт, DS, setup, planning, security |
| `e2e/` | Playwright specs |
| `scripts/` | dev, build, smoke, verify, env |
| `context-os/` | AI Context OS (эта система) |
| `docs/archive/real-project-test/` | Архив прототипа cores |
| `real-project-test/README.md` | Redirect stub → `context-os/` |
| `project-universe-research/` | Research UI для universe model (не prod) |
| `archive/` | Архивные ассеты |
| `AGENTS.md` | Agent ops index → `context-os/ops/` |
| `context-os/ops/` | Ops shards (API, smoke, env) |

## Продуктовые модули

### Marketing & account
- `index.html`, `docs.html`, `contact.html`, `privacy.html`, `terms.html`
- `auth.html`, `signup.html`, `reset-password.html`, `settings.html`, `subscribe.html`
- Локали: `ru/`, `es/`

### Assistant
- `assistant.html`
- `src/core/chat.ts`, `src/components/` (Chat, Sphere)
- Voice/utils: `sphere-*.ts`, `audioAnalyzer.ts`, `prompts.ts`

### Nucleus / Financial Mirror
- Entry: `nucleus.html`, `nucleus-dashboard.html`, `nucleus-budget.html`, `nucleus-income.html`, `nucleus-transactions.html`, `nucleus-taxes.html`
- Core: `financial-mirror.ts`, `financial-mirror-firestore.ts`, `nucleus-dashboard.ts`
- 42 hubs: `nucleus-*-hub.ts` (invoicing, billpay, magic inbox, accounting, crypto treasury, trade journal, …)

### Tools (static)
- `invoice.html`, `qr-generator.html`, `document-generator.html`, `quote-generator.html`, `proposal-generator.html`
- `calculator/` subtree
- App Suite utils (no `appsuite.html` page — utils only)

### Payer / public
- `invoice-pay.html`, `crypto-checkout.html`, `contact-form.html` (noindex)

### Integration setup pages
- `stripe-setup.html`, `resend-setup.html`, `push-setup.html`, `xero-setup.html`, `crypto-payments-setup.html`

## Технические модули (server)

| Модуль | Путь |
|--------|------|
| API entry | `financial-api-server.js` |
| Paywall | `paywall/index.js`, `ai-limits.js` |
| Billing | `routes/stripe-billing.js`, `routes/billing-emulator.js` |
| Workspace | `services/workspace-context.js`, `routes/financial-mirror-workspace-context*` |
| FM REST | `db/financial-mirror-rest.js`, `financial-mirror/` |
| Invoicing | `routes/financial-mirror-invoicing*` |
| Crypto | `routes/financial-mirror-crypto-payments*`, `services/crypto-payments-*` |
| Digest/Email | `services/digest-email.js`, `services/resend-*` |
| Push | `services/web-push-*` |
| Xero | `routes/xero-accounting.js` |
| Ops | `routes/ops.js`, `middleware/ops-auth.js` |
| AI agents | `server/agents/*.js` (20+ agents) |
| Contact | `routes/contact.js` |

## Документация (ключевые)

| Кластер | Путь |
|---------|------|
| Agent workflow | `docs/agents/AGENT_HUB.md`, `MODERN_WEB_GUIDANCE.md` |
| Planning L1 | `docs/planning/PRD_NAVORINA.md`, `NAVORINA_ROADMAP_TIMELINE.md`, `INDEX.md` |
| Design system | `docs/design-system/*` |
| Architecture | `docs/architecture/OVERVIEW.md`, `DATA_STORAGE_AND_FLOW.md` |
| Setup | `docs/setup/START_HERE.md`, `LOCAL_DEV_EMULATORS.md` |
| Release | `docs/planning/RELEASE_CHECKLIST.md`, `INTEGRATIONS_WHEN_READY.md` |
| Firebase | `docs/firebase/FINANCIAL_MIRROR_FIRESTORE.md` |
| Security | `docs/security/*` |

## Интеграции

| Сервис | Client | Server | Setup doc |
|--------|--------|--------|-----------|
| Firebase Auth/FM | `financial-mirror-firestore.ts` | nucleus-firebase-verify | `AUTH_SETUP.md` |
| Supabase | migrations in `Navorina/supabase_migrations/` | `db/supabase-client.js` | security docs |
| Stripe Q2 | `stripe-setup.html` | `stripe-billing.js` | `STRIPE_WHEN_READY.md` |
| Resend M2 | `resend-setup.html` | `resend-email-emulator.js` | `RESEND_WHEN_READY.md` |
| Web Push M3 | `push-setup.html` | `web-push-delivery.js` | `PUSH_WHEN_READY.md` |
| Crypto CP* | `crypto-payments-setup.html` | crypto-payments routes | `CP0_PARTNER_WHEN_READY.md` |
| Xero I4 | `xero-setup.html` | `xero-accounting.js` | `XERO_WHEN_READY.md` |

## API (основные префиксы)

- `GET/POST /api/financial-mirror/*` — workspace, AI, digest, push, features
- `GET/POST /api/financial-mirror/invoicing/*` — invoicing, email, reminders
- `GET/POST /crypto-payments/*` — register, intent, checkout, webhook, audit
- `POST /crypto-payouts/*` — submit, list, webhook
- `GET/POST /api/accounting/xero/*` — OAuth, journal push
- `GET/PUT /api/ops/*` — subscription override, integrations summary

## Тесты

| Слой | Где |
|------|-----|
| Nucleus unit | `Navorina/scripts/nucleus-*.test.mjs` |
| Server unit | `server/**/*.test.js` |
| Root smoke | `scripts/smoke-*.mjs`, `scripts/verify-*-pilot.mjs` |
| E2E | `e2e/*.spec.ts` |
| CI aggregate | `npm run ci:local`, `pre:release` |

## Скрипты (группы)

- **Dev:** `dev-all.sh`, `dev-verify.mjs`
- **Build:** `build-production.cjs`
- **Smoke:** `smoke-*.mjs` (per integration)
- **Verify:** `verify-*-pilot.mjs`, `setup-*-check.mjs`
- **Env:** `env-pull.mjs`, `netlify-env-import.mjs`
- **Data:** `firestore-sync-*.cjs`, `seed-*.cjs`

## Sources

- `docs/architecture/OVERVIEW.md`
- `docs/planning/INDEX.md`
- `package.json`
- `AGENTS.md`
- `Navorina/*.html`
- `server/financial-api-server.js`
