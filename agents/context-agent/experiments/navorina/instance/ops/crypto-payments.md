# Crypto payments (CP*) and invoicing

## UI-термины

Обязательно: [`docs/planning/CP_CRYPTO_PAYMENTS_TERMINOLOGY.md`](../../docs/planning/CP_CRYPTO_PAYMENTS_TERMINOLOGY.md) — не merchant/account/settlement в интерфейсе.

## Карта флоу

- [`docs/planning/CRYPTO_FIN_HUB_FLOW.md`](../../docs/planning/CRYPTO_FIN_HUB_FLOW.md)
- Runey benchmark: [`docs/planning/RUNEY_BENCHMARK.md`](../../docs/planning/RUNEY_BENCHMARK.md)
- i18n: `dashboard.cryptoPayments.*`

## API

- `GET /crypto-payments/status`; `POST /crypto-payments/register`; `GET /crypto-payments/intent`
- `POST /crypto-payments/standing/register`; `GET /crypto-payments/standing?customerId=`
- `GET /crypto-payments/checkout?token=` (public CP5); `GET /crypto-payments/audit?monthKey=` (CP8)
- `POST /crypto-payments/webhook`; dev `POST /crypto-payments/dev/simulate` (Pro + `invoice_accept_crypto`)
- CFH2/CFH3 payouts: `POST /crypto-payouts/submit`, `GET /crypto-payouts/list`, webhook `POST /crypto-payouts/webhook`

## Dev / emulator

- `CRYPTO_PAYMENTS_EMULATOR=1` в `server/development.defaults.env` — intent без ключей партнёра; webhook header `x-crypto-payments-secret: dev-emulator`.
- Partner stub: `CRYPTO_PAYMENTS_PARTNER_STUB=1` + `CRYPTO_PAYMENTS_EMULATOR=0` — [`docs/setup/LOCAL_CRYPTO_PAYMENTS.md`](../../docs/setup/LOCAL_CRYPTO_PAYMENTS.md).
- Live sandbox: [`docs/planning/CP0_PARTNER_WHEN_READY.md`](../../docs/planning/CP0_PARTNER_WHEN_READY.md).
- Env: `CRYPTO_PAYMENTS_PROVIDER`, `CRYPTO_PAYMENTS_API_KEY`, `CRYPTO_PAYMENTS_WEBHOOK_SECRET`, опц. `CRYPTO_PAYMENTS_API_BASE`, `CRYPTO_PAYMENTS_PARTNER_STUB`, `CRYPTO_PAYMENTS_STORE_PATH`.
- Спека: [`docs/planning/CP_CRYPTO_MERCHANT_B2B_SPEC.md`](../../docs/planning/CP_CRYPTO_MERCHANT_B2B_SPEC.md).

## UI surfaces

- Invoicing → **Accept crypto** + **Customers** → standing link (CP6); Payments → Receive
- Payer: `Navorina/invoice-pay.html` (IP1–IP6) → `Navorina/crypto-checkout.html` (CP5)
- Setup: `Navorina/crypto-payments-setup.html`; Settings → Crypto payments (CP8)
- CP8: AML/KYC disclaimers — `mountCryptoComplianceSettings`; ack on first Accept crypto

## Invoicing / delivery (RN*)

- IP payer API: `GET /invoicing/public-view`, `POST /invoicing/public-unlock`, `PUT`/`DELETE /invoicing/public-snapshot`
- Delivery RN8 password + revoke; RN7 branding; после смены бренда/пароля/revoke — снова **Copy client link**
- Invoice email: `POST /invoicing/send-email` (`kind: initial|reminder`)
- RN3+ overdue reminders: `GET/PUT /invoicing/reminder-preferences`; cron `POST /invoicing/cron/overdue-reminders`
- RN1 quote-to-cash: `documentKind: quote`; **Convert to invoice**
- RN2 partial pay: `amountPaid` / balance due; crypto underpaid keeps invoice open
- RN5 time→invoice: Time → **Create Nucleus invoice**; `lineSummary` + `timeEntryIds`

## Month close (CFH5)

Accounting → Export → **Close month & export pack** (crypto reconcile warn → snapshot → brief → ZIP with `crypto_audit_{month}.csv`).

CP7 Briefing AI: `POST /api/financial-mirror/ai/crypto-reconcile-brief` (Plus/Pro, `monthly_brief_ai`); клиент `nucleus-crypto-reconcile-brief.ts`.

## Smoke / tests

- Smoke: `npm run smoke:crypto-payments`, `npm run smoke:crypto-payments-partner-stub`
- Check: `npm run setup:crypto-payments-check`, **`npm run verify:cp-pilot`**, `npm run setup:crypto-payments-live-check`
- Client: `test:nucleus-crypto-payments-i18n`, `test:nucleus-invoicing-crypto`, `test:nucleus-crypto-compliance`, `test:nucleus-month-close-loop`, `test:nucleus-accountant-pack-crypto`
- E2E: `e2e/nucleus-crypto-audit-export.spec.ts`, `e2e/nucleus-crypto-standing-reconcile.spec.ts`, `e2e/quote-to-close`
- Server: `server/test:crypto-payments-*`, `server/test:crypto-payouts`, `server/test:invoice-share-store`
