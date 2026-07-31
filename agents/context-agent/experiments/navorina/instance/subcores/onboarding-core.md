# Onboarding Core

## Purpose

Контекст активации: first value, welcome flow, workspace setup, Nucleus checklist/wizard, assistant onboarding. Subcore Product.

## Covers

- Nucleus onboarding checklist (B4): income → expense → snapshot → invoice
- Onboarding wizard (`nucleus-onboarding-wizard.ts`) + server test
- Guest workspace merge (`test:nucleus-guest-workspace-merge`)
- Auth/signup flow: `signup.html`, `auth.html`, Firebase
- Workspace setup: FM init, `financial-mirror:ready` event
- Assistant welcome message removal in chat
- Setup guide pages: stripe, resend, push, xero, crypto-payments
- Dev onboarding: `docs/setup/START_HERE.md`

## Does not cover

- Paywall conversion post-trial → Paywall Core
- Full FM data model → Nucleus Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **ONBOARDING_DISMISS_KEY** | localStorage dismiss |
| **OnboardingStepId** | income, expense, snapshot, invoice |
| **guest workspace** | Merge on signup |
| **nucleus-onboarding-wizard** | Goal step wizard |
| **TEST_CREDENTIALS** | Dev login |

## Key files

| Путь | Роль |
|------|------|
| `Navorina/src/utils/nucleus-onboarding-checklist.ts` | Dashboard checklist |
| `Navorina/src/utils/nucleus-onboarding-wizard.ts` | Wizard UI |
| `server/agents/nucleus-onboarding-wizard-goal.test.js` | Wizard test |
| `Navorina/scripts/nucleus-guest-workspace-merge.test.mjs` | Guest merge |
| `Navorina/signup.html` | Signup |
| `Navorina/auth.html` | Auth |
| `Navorina/src/utils/financial-mirror.ts` | Workspace init |
| `e2e/nucleus-guest-workspace-merge.spec.ts` | E2E |

## Key docs

- `docs/setup/START_HERE.md`
- `docs/setup/AUTH_SETUP.md`
- `Navorina/docs/setup/TEST_CREDENTIALS.md`
- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md` (B4 onboarding)

## Risks

- **localStorage onboarding state** — persists across dev sessions (masks fresh-user UX)
- **Fragmented entry points** — landing vs assistant vs nucleus (roadmap P1)
- **Setup pages proliferation** — many *-setup.html without unified checklist

## Dependencies

- product-core, nucleus-core
- operational-core (dev credentials)

## AI summary

Activation = **Nucleus checklist** (4 steps) + **guest→user workspace merge** + **FM ready event**. Keys in `nucleus-onboarding-checklist.ts`. Assistant: welcome message in `chat.ts`. Dev test user: `TEST_CREDENTIALS.md`. For «improve onboarding» — read checklist + wizard + roadmap B1–B7, not entire FM.

## Sources

- `Navorina/src/utils/nucleus-onboarding-checklist.ts`
- `Navorina/src/utils/nucleus-onboarding-wizard.ts`
- `docs/setup/START_HERE.md`
- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md`
- `e2e/nucleus-guest-workspace-merge.spec.ts`
