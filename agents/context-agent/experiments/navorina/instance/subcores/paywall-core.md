# Paywall Core

## Purpose

Контекст paywall: tier → feature access, upgrade CTA, trial/free limits, pricing surfaces, conversion logic. Subcore Business + Product.

## Covers

- Tier matrix: free / plus / pro / premium (legacy) / unlimited
- Feature flags: `monthly_brief_ai`, `invoice_accept_crypto`, `financial_verdict_ai`, export, etc.
- Server enforcement: `checkFeatureAccess`, middleware на FM AI routes
- Client: paywall prompts, workspace context tier display
- Pricing pages: `subscribe.html`, `ru/subscribe.html`, `es/subscribe.html`
- Settings → Plan upgrade flow
- Tests: `test:paywall`, `tier-packaging.test.js`, e2e billing emulator

## Does not cover

- Stripe checkout session creation → Billing Core
- AI token counting internals → Assistant Core + `ai-limits.js`

## Key entities

| Сущность | Описание |
|----------|----------|
| **FEATURE_ACCESS** | `server/paywall/index.js` |
| **getUserTier** | Supabase + local override |
| **fetchSubscriptionTier** | `db/user-subscription-tier.js` |
| **nucleus-paywall-prompt** | Client upgrade UI |
| **workspace/context** | Tier + services in one API |

## Key files

| Путь | Роль |
|------|------|
| `server/paywall/index.js` | Canonical paywall |
| `server/db/user-subscription-tier.js` | Tier fetch |
| `server/routes/financial-mirror-features.test.js` | Features route tests |
| `server/routes/financial-mirror-workspace-context.test.js` | Context API tests |
| `Navorina/src/utils/nucleus-paywall-prompt.ts` | Client prompts |
| `Navorina/settings.html` | Plan settings |
| `e2e/settings-billing-emulator.spec.ts` | E2E upgrade |

## Key docs

- `docs/development/PLAN_RATE_LIMITING_PAYWALL.md`
- `docs/planning/IMPROVEMENT_PLAN.md` (FM paywall sections)
- `AGENTS.md` (Billing emulator, Settings → Plan)

## Risks

- **premium = pro** — legacy Stripe naming
- **Client-only gating** — must match server enforcement

## Dependencies

- billing-core (subscription state)
- revenue-core (business impact)
- assistant-core (AI feature gates)

## AI summary

Paywall truth: **`server/paywall/index.js`**. Plus = snapshots+brief+export; Pro = all AI + invoice email + crypto accept. Tier from Supabase or `BILLING_EMULATOR`. Client reads `GET /api/financial-mirror/workspace/context`.

## Sources

- `server/paywall/index.js`
- `server/paywall/tier-packaging.test.js`
- `server/routes/financial-mirror-features.test.js`
- `Navorina/src/utils/nucleus-paywall-prompt.ts`
- `docs/development/PLAN_RATE_LIMITING_PAYWALL.md`
