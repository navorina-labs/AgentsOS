# Nucleus Core

## Purpose

Контекст Financial Mirror и Nucleus hub: ledger, dashboard, month close, export, invoicing, payments, accounting. Subcore Product + Technical.

## Covers

- FM client: `financial-mirror.ts`, calculations, Firestore sync
- 42 hub modules: invoicing, billpay, magic inbox, accounting, trade journal, crypto treasury, etc.
- Month close loop CFH5: reconcile → snapshot → brief → ZIP export
- Invoicing RN*: quotes, partial pay, time→invoice, delivery, reminders
- Crypto CP*: accept crypto, checkout, standing links, audit export
- Accounting I4: Xero journal push, accountant pack
- Events: `financial-mirror:ready`, `window.__fmReady`, domain events
- Month lock: `test:nucleus-month-lock`

## Does not cover

- Stripe subscription → Billing Core
- Assistant chat outside Nucleus context → Assistant Core
- Release verification scripts → Release Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **Financial Mirror** | Income, expenses, snapshots, workspace |
| **Magic Inbox** | Receipt intake + OCR |
| **Month close** | `nucleus-accountant-pack-hub.ts` |
| **Invoicing hub** | Quotes, invoices, delivery |
| **Crypto treasury hub** | Receive/send/reconcile |
| **Trade journal** | N6–N7 Insights tab |
| **Ledger / transactions** | `nucleus-transactions-hub.ts` |

## Key files

| Путь | Роль |
|------|------|
| `Navorina/nucleus.html` | Hub shell |
| `Navorina/nucleus-dashboard.html` | Dashboard |
| `Navorina/src/utils/financial-mirror.ts` | FM core |
| `Navorina/src/utils/financial-mirror-firestore.ts` | Persistence |
| `Navorina/src/utils/nucleus-dashboard.ts` | Dashboard UI |
| `Navorina/src/utils/nucleus-accountant-pack-hub.ts` | Month close pack |
| `Navorina/src/utils/nucleus-invoicing-hub.ts` | Invoicing |
| `Navorina/src/utils/nucleus-magic-inbox-hub.ts` | Magic Inbox |
| `Navorina/src/utils/nucleus-trade-journal-hub.ts` | Journal |
| `server/financial-mirror/` | Server FM logic |
| `server/routes/financial-mirror-invoicing.test.js` | Invoicing API |

## Key docs

- `docs/firebase/FINANCIAL_MIRROR_FIRESTORE.md`
- `docs/planning/CRYPTO_FIN_HUB_FLOW.md`
- `docs/planning/FRONTEND_NUCLEUS.md`
- `docs/design-system/NUCLEUS_TOKENS_COMPONENTS.md`
- `docs/planning/CP_CRYPTO_MERCHANT_B2B_SPEC.md`
- `context-os/ops/crypto-payments.md`
- `context-os/ops/xero.md`
- `context-os/ops/nucleus-misc.md`

## Risks

- **Hub proliferation** — 42 hubs, сложная навигация для агента
- **CFH1 auto-post ⬜** — crypto payments not fully in ledger
- **Guest vs auth workspace** — merge edge cases
- **Month lock** — data integrity on close

## Dependencies

- technical-core (API, Firestore)
- paywall-core (gated exports/AI)
- billing-core (Pro crypto features)

## AI summary

Nucleus = **Financial Mirror** + tab hubs. Start: `financial-mirror.ts` + relevant `nucleus-*-hub.ts`. Month close: accountant-pack + crypto audit CSV. Invoicing: hub + delivery + crypto-hub. API under `/api/financial-mirror/` and invoicing/crypto routes. UI tokens: `NUCLEUS_TOKENS_COMPONENTS.md`.

## Sources

- `Navorina/src/utils/financial-mirror.ts`
- `Navorina/src/utils/nucleus-*-hub.ts` (42 files)
- `docs/planning/CRYPTO_FIN_HUB_FLOW.md`
- `docs/firebase/FINANCIAL_MIRROR_FIRESTORE.md`
- `context-os/ops/crypto-payments.md`
- `docs/planning/FRONTEND_NUCLEUS.md`
