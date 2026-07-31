# Ops v0 (support tier / integrations)

Без product UI — support API.

- Гайд: [`docs/planning/OPS_V0.md`](../../docs/planning/OPS_V0.md).
- Env: `OPS_SECRET` (production); dev: `OPS_ALLOW_DEV=1` в `server/development.defaults.env`.
- API: `GET/PUT /api/ops/users/:userId/subscription`, `GET /api/ops/integrations/summary`, `POST /api/ops/digest/weekly?dryRun=1`.
- CLI Supabase: `npm run subscription:upsert -- --id=UID --tier=pro`.
- Smoke: `npm run smoke:ops-api`; тесты: `npm --prefix server run test:ops-route`.
