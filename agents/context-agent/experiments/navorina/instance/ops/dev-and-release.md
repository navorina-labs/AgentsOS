# Dev, E2E, emulators, workspace services

## Dev

- `npm run dev` — статика + Vite; после правок — полное обновление страницы (cookie/SW сбрасываются при перезапуске dev).
- Тестовый Firebase-логин: [`Navorina/docs/setup/TEST_CREDENTIALS.md`](../../Navorina/docs/setup/TEST_CREDENTIALS.md).
- Pre-release: `npm run pre:release` (unit + integrations + e2e); без e2e: `npm run ci:local:full`. Чеклист: [`docs/planning/RELEASE_CHECKLIST.md`](../../docs/planning/RELEASE_CHECKLIST.md).

## E2E (Playwright)

Запуск и опциональный Apify fingerprint: [`e2e/README.md`](../../e2e/README.md).

Перед релизом интеграций: `npm run ci:local:integrations` (unit + smoke CP/Q2/Delivery/Xero); с Playwright: `VERIFY_INTEGRATIONS_E2E=1 npm run verify:integrations-pilot`.

## Workspace services (billing + email + push)

- API: `GET /api/financial-mirror/workspace/services` (публично), `GET /api/financial-mirror/workspace/context` (с `userId` — paywall + subscription + services).
- Клиент: `Navorina/src/utils/nucleus-workspace-context-client.ts`; Settings и setup-страницы используют один запрос.
- Проверка env + API: `npm run setup:services-check` (Stripe + Resend + VAPID); smoke: `npm run smoke:workspace-services`.
- **Pilot всех интеграций:** `npm run verify:integrations-pilot` (CP + Q2 + Delivery + Xero без live keys); live: `npm run setup:integrations-live-check`; индекс: [`docs/planning/INTEGRATIONS_WHEN_READY.md`](../../docs/planning/INTEGRATIONS_WHEN_READY.md).
- A2 автотесты: `npm run test:nucleus-guest-workspace-merge`, `npm run test:nucleus-month-lock`.

## Dev emulators (без Stripe / Resend / VAPID)

- Обзор: [`docs/setup/LOCAL_DEV_EMULATORS.md`](../../docs/setup/LOCAL_DEV_EMULATORS.md); smoke: `npm run test:dev-emulators`; быстрая проверка: `npm run dev:verify`.
- По умолчанию в `server/development.defaults.env`: `BILLING_EMULATOR=1`, `RESEND_EMULATOR=1`, `PUSH_EMULATOR=1`.
