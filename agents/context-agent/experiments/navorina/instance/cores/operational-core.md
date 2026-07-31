# Operational Core

## Purpose

Операционный контекст: dev workflow, эмуляторы, smoke/e2e, release, ops API, env management. Для вопросов «как запустить», «как проверить», «что перед деплоем», «как дебажить без keys».

## Covers

- Dev: `npm run dev`, порты 5501/3001, полное обновление страницы
- Dev wipe rules: cookie/SW сброс при restart; localStorage сохраняется
- Эмуляторы: billing, Resend, Push, crypto payments/payouts
- Pilot verification: `verify:*-pilot`, `setup:*-check`, `setup:*-live-check`
- CI local: `ci:local`, `ci:local:full`, `pre:release`
- E2E: Playwright в `e2e/`, `ci:local:e2e`
- Ops v0: `OPS_SECRET`, support tier CLI
- Env pull: `env:pull`, Supabase/Netlify scripts
- Release checklist и integration when-ready docs

## Does not cover

- Продуктовый scope фич → Business/Product Core
- Детали Stripe API → Billing Core
- FM business logic → Nucleus Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **dev-all.sh** | Vite + server + defaults |
| **development.defaults.env** | BILLING/RESEND/PUSH/CRYPTO emulators = 1 |
| **pre:release** | Full pre-release gate |
| **verify:integrations-pilot** | CP+Q2+Delivery+Xero без live keys |
| **nucleus-ci.yml** | GitHub CI workflow |
| **OPS v0** | Support API + digest dry-run |
| **TEST_CREDENTIALS** | Firebase test login |

## Key files

| Путь | Роль |
|------|------|
| `scripts/dev-all.sh` | Dev orchestration |
| `scripts/pre-release.mjs` | Pre-release runner |
| `scripts/verify-integrations-pilot.mjs` | Integration pilot |
| `scripts/smoke-*.mjs` | Smoke tests |
| `server/development.defaults.env` | Dev emulator defaults |
| `server/.env.example` | Env template |
| `e2e/README.md` | Playwright guide |
| `.github/workflows/nucleus-ci.yml` | CI |
| Legacy IDE rules | Dev cookie/SW notes |

## Key docs

- `docs/setup/START_HERE.md`
- `docs/setup/LOCAL_DEV_EMULATORS.md`
- `docs/setup/LOCAL_BILLING_EMULATOR.md`
- `docs/setup/LOCAL_RESEND_EMULATOR.md`
- `docs/setup/LOCAL_PUSH_EMULATOR.md`
- `docs/setup/LOCAL_CRYPTO_PAYMENTS.md`
- `docs/planning/RELEASE_CHECKLIST.md`
- `docs/planning/INTEGRATIONS_WHEN_READY.md`
- `docs/planning/OPS_V0.md`
- `Navorina/docs/setup/TEST_CREDENTIALS.md`

## Risks

- **Emulator ≠ production** — успех smoke не гарантирует live keys
- **Длинный ci:local** — много последовательных smoke; легко пропустить блок
- **OPS_SECRET** — production-only, не коммитить
- **E2E flakiness** — Playwright зависит от dev stack и Firebase
- **localStorage persistence** — dev state может маскировать баги onboarding

## Dependencies

- Technical Core — что именно тестируется
- Release Core — детальный release gate
- Billing Core — Stripe/emulator smoke

## AI summary

Локально: `npm install` → `npm run dev` → full page reload. Без keys работают **эмуляторы** из `server/development.defaults.env`. Перед релизом: `npm run pre:release` или `ci:local:full` + `verify:integrations-pilot`. Интеграции: `INTEGRATIONS_WHEN_READY.md`. Ops: `OPS_V0.md` + `npm run smoke:ops-api`. Не просить пользователя чистить cookies — достаточно restart dev + hard refresh.

## Sources

- `AGENTS.md`
- `docs/setup/START_HERE.md`
- `docs/setup/LOCAL_DEV_EMULATORS.md`
- `docs/planning/RELEASE_CHECKLIST.md`
- `docs/planning/OPS_V0.md`
- `docs/planning/INTEGRATIONS_WHEN_READY.md`
- `package.json` (scripts)
- Legacy IDE rules (not exported)
- `e2e/README.md`
