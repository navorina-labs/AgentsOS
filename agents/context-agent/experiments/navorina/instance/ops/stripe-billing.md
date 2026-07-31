# Stripe billing (Plus/Pro)

## Billing emulator (локально без Stripe)

- Эмулятор Plus/Pro: `BILLING_EMULATOR=1` в `server/development.defaults.env` (по умолчанию в dev). Гайд: [`docs/setup/LOCAL_BILLING_EMULATOR.md`](../../docs/setup/LOCAL_BILLING_EMULATOR.md).
- Smoke: `npm run smoke:billing-emulator`; тесты: `npm run test:billing-emulator`; e2e: `e2e/settings-billing-emulator.spec.ts`; **`npm run verify:q2-pilot`**, `npm run setup:stripe-live-check` (после keys).
- Settings → Plan: мгновенный upgrade, tier в `server/.data/user-subscriptions.json`.

## Stripe (test mode / live)

- Гайд: [`docs/setup/STRIPE_GEORGIA.md`](../../docs/setup/STRIPE_GEORGIA.md), чеклист: [`docs/planning/STRIPE_WHEN_READY.md`](../../docs/planning/STRIPE_WHEN_READY.md), страница `Navorina/stripe-setup.html` (Settings → Plan).
- При полном `STRIPE_*` эмулятор отключается; иначе checkout через эмулятор (см. выше).
- Canonical paywall: `server/paywall/index.js`.
