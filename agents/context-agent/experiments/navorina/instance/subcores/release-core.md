# Release Core

## Purpose

Контекст релиза: pre-release gates, smoke, e2e, env checks, integration pilots, CI. Subcore Operational.

## Covers

- `npm run pre:release` — full gate
- `ci:local`, `ci:local:full`, `ci:local:integrations`, `ci:local:e2e`
- Integration pilots: `verify:cp-pilot`, `verify:q2-pilot`, `verify:delivery-pilot`, `verify:xero-pilot`, `verify:integrations-pilot`
- Live checks: `setup:*-live-check`, `setup:services-check`, `setup:integrations-live-check`
- Release checklist manual smoke steps
- GitHub CI: `.github/workflows/nucleus-ci.yml`
- Post-release: roadmap status update for live keys

## Does not cover

- Product feature scope decisions → Business Core
- How features work → Product/Nucleus Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **pre:release** | `scripts/pre-release.mjs` |
| **nucleus-smoke** | CI job name |
| **VERIFY_INTEGRATIONS_E2E** | Env for e2e in pilot |
| **DIGEST_CRON_SECRET** | Cron auth |
| **RELEASE_CHECKLIST** | Human steps |

## Key files

| Путь | Роль |
|------|------|
| `scripts/pre-release.mjs` | Orchestrator |
| `scripts/verify-integrations-pilot.mjs` | All pilots |
| `package.json` | ci:local:* scripts |
| `.github/workflows/nucleus-ci.yml` | CI |
| `e2e/*.spec.ts` | Playwright suites |
| `docs/planning/RELEASE_CHECKLIST.md` | Checklist |

## Key docs

- `docs/planning/RELEASE_CHECKLIST.md`
- `docs/planning/INTEGRATIONS_WHEN_READY.md`
- `e2e/README.md`
- `docs/planning/STRIPE_WHEN_READY.md` (+ Resend, Push, Xero, CP0)

## Risks

- **Long ci:local** — may timeout in agent sessions
- **E2E requires chromium** — `npx playwright install chromium`
- **Live keys not in CI** — pilots run emulator mode only
- **Post-PMF surfaces** — K1/K6 not release blockers

## Dependencies

- operational-core
- billing-core, nucleus-core (domain smokes)

## AI summary

Before release: `npm run pre:release` or stepwise `ci:local:full` + `verify:integrations-pilot` + `ci:local:e2e`. Manual: RELEASE_CHECKLIST §3 (dev smoke 7 steps). After live keys: update roadmap + run `setup:integrations-live-check`. E2E list in `package.json` `ci:local:e2e`.

## Sources

- `docs/planning/RELEASE_CHECKLIST.md`
- `package.json`
- `scripts/pre-release.mjs`
- `.github/workflows/nucleus-ci.yml`
- `e2e/README.md`
- `context-os/ops/dev-and-release.md`
