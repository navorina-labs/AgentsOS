# Email delivery (Resend) and Web Push

## Resend (digest + invoice email)

- **Локально без Resend:** `RESEND_EMULATOR=1` в `server/development.defaults.env` — [`docs/setup/LOCAL_RESEND_EMULATOR.md`](../../docs/setup/LOCAL_RESEND_EMULATOR.md); `npm run test:resend-emulator`; **`npm run verify:delivery-pilot`**, `npm run setup:resend-live-check` (после keys).
- Гайд: [`docs/setup/RESEND.md`](../../docs/setup/RESEND.md), чеклист: [`docs/planning/RESEND_WHEN_READY.md`](../../docs/planning/RESEND_WHEN_READY.md), страница `Navorina/resend-setup.html`.
- Env: `server/.env.example` — `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- API: `GET /api/financial-mirror/digest/email-status`, `POST /api/financial-mirror/digest/send`.
- Smoke: `npm run smoke:resend-digest`, `npm run smoke:digest-cron` (weekly cron dry-run).
- UI: Insights → Briefing — **Send to my inbox** + **opt-in auto weekly**. Без ключей — toast + mailto.

## Web Push (M3 digest)

- **Локально без VAPID:** `PUSH_EMULATOR=1` в `server/development.defaults.env` — [`docs/setup/LOCAL_PUSH_EMULATOR.md`](../../docs/setup/LOCAL_PUSH_EMULATOR.md); `npm run test:push-emulator`; **`npm run verify:delivery-pilot`**, `npm run setup:push-live-check` (после keys).
- Env: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` в `server/.env`.
- Generate: `npm run generate:vapid-keys`.
- Setup: `Navorina/push-setup.html` (Settings → Browser push).
- API: `GET /api/financial-mirror/push/status`, `PUT /api/financial-mirror/push/subscribe`, `POST /api/financial-mirror/push/notify`.
- Smoke: `npm run smoke:web-push`.
- UI: Insights → Briefing — browser push opt-in. Без VAPID — checkbox disabled + hint.
