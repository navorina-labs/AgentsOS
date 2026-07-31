# Billing Core

## Purpose

Контекст биллинга: Stripe Checkout, webhooks, subscription state, emulator, failed payments. Subcore Technical + Business.

## Covers

- Stripe Plus/Pro checkout (`stripe-billing.js`)
- Webhook → `user_subscriptions` (Supabase upsert)
- Price IDs, tier normalization (`stripe-billing-tier.js`)
- Billing emulator: instant upgrade in dev (`billing-emulator.js`)
- File store: `server/.data/user-subscriptions.json`
- Ops override: `PUT /api/ops/users/:userId/subscription`
- CLI: `npm run subscription:upsert`
- Smoke: `smoke:stripe-billing`, `smoke:billing-emulator`, `verify:q2-pilot`
- Setup pages: `stripe-setup.html`

## Does not cover

- Feature matrix (what Plus unlocks) → Paywall Core
- Crypto payments billing → Nucleus Core (CP*)

## Key entities

| Сущность | Описание |
|----------|----------|
| **STRIPE_SECRET_KEY** | Live Stripe |
| **STRIPE_WEBHOOK_SECRET** | Webhook verify |
| **BILLING_EMULATOR** | Dev mode flag |
| **checkout session** | Plus/Pro purchase |
| **user_subscriptions** | Supabase table |
| **upsertUserSubscriptionByExternalId** | Webhook handler |

## Key files

| Путь | Роль |
|------|------|
| `server/routes/stripe-billing.js` | Checkout + webhook |
| `server/routes/stripe-billing-tier.js` | Tier/price resolution |
| `server/routes/billing-emulator.js` | Dev billing API |
| `server/db/upsert-user-subscription.js` | DB write |
| `server/db/user-subscription-file-store.js` | Dev file store |
| `scripts/smoke-stripe-billing.mjs` | Smoke |
| `scripts/setup-stripe-check.mjs` | Env check |
| `Navorina/stripe-setup.html` | Setup guide UI |

## Key docs

- `docs/setup/STRIPE_GEORGIA.md`
- `docs/setup/LOCAL_BILLING_EMULATOR.md`
- `docs/planning/STRIPE_WHEN_READY.md`
- `context-os/ops/stripe-billing.md`

## Risks

- **Emulator auto-off** when full STRIPE_* set — can surprise devs
- **Webhook failures** — tier desync between Stripe and Supabase
- **Georgia business registration** — blocker for live Stripe (STRIPE_WHEN_READY)
- **external_user_id** migration — Supabase schema drift

## Dependencies

- paywall-core (tier consumption)
- operational-core (smoke/verify)
- technical-core (env, routes)

## AI summary

Billing path: Settings → Plan → **Stripe Checkout** or **emulator** → webhook/upsert → `getUserTier`. Debug: check `BILLING_EMULATOR`, `server/.data/user-subscriptions.json`, `npm run smoke:billing-emulator`. Live: `STRIPE_WHEN_READY.md` + `setup:stripe-live-check`.

## Sources

- `server/routes/stripe-billing.js`
- `server/routes/billing-emulator.js`
- `docs/setup/LOCAL_BILLING_EMULATOR.md`
- `docs/planning/STRIPE_WHEN_READY.md`
- `context-os/ops/stripe-billing.md`
- `e2e/settings-billing-emulator.spec.ts`
