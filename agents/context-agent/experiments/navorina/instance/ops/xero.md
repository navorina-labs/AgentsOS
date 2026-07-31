# Xero (I4 Accounting export)

- Гайд: [`docs/setup/XERO.md`](../../docs/setup/XERO.md), страница `Navorina/xero-setup.html`.
- Env: `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET` (+ optional GL account codes).
- API: `/api/accounting/xero/*` (OAuth, journal push as DRAFT ManualJournals).
- Setup: `npm run setup:xero-check`, **`npm run verify:xero-pilot`**, `npm run setup:xero-live-check` (после keys).
- Smoke: `npm run smoke:xero-accounting`. Чеклист: [`docs/planning/XERO_WHEN_READY.md`](../../docs/planning/XERO_WHEN_READY.md).
- UI: Accounting → Export — Connect Xero, Push journal. Без ключей — setup guide only.
