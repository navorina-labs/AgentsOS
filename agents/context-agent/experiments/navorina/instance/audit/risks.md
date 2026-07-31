# Risks

Риски по четырём слоям — только из реальных данных репозитория.

## Business risks

| Риск | Evidence | Impact |
|------|----------|--------|
| **CP0 live не подключён** | Roadmap: Receive ✅ pilot, ⬜ CP0 live | Нет реального crypto revenue |
| **Stripe live blocked** | `STRIPE_WHEN_READY.md`, Georgia setup | MRR только через emulator в dev |
| **Фрагментация entry points** | Roadmap § Аудит: landing, assistant, tools, Nucleus | Размытая активация и конверсия |
| **API-cost vs subscription** | Roadmap принцип #5: API &lt; 10–20% подписки | Margin squeeze на Pro AI |
| **Non-custody dependency** | PRD non-goals; CP через PSP | Partner risk, KYC delays (CP0 doc) |
| **Tool traffic без monetization** | PRD persona «инструментщик»; roadmap P6 ⬜ | SEO traffic, низкий LTV |

## Product risks

| Риск | Evidence | Impact |
|------|----------|--------|
| **AI chat изолирован от FM** | Roadmap M1–M4; fragmented AI | Слабый sticky workflow |
| **Treasury view ⬜ CFH4** | Roadmap North Star pillar 6 | Неполный command center UX |
| **i18n drift** | `ru/`, `es/` partial mirrors | Broken locales, support burden |
| **42 nucleus hubs** | `Navorina/src/utils/nucleus-*-hub.ts` | Cognitive load, inconsistent patterns |
| **experiments/ в Navorina** | gamified-dashboard-2d | Scope creep |
| **Paywall UX vs server mismatch** | paywall-core: client+server must align | False upgrade prompts or leaks |

## Technical risks

| Риск | Evidence | Impact |
|------|----------|--------|
| **Firestore + Supabase + localStorage** | architecture, roadmap P4 | Data sync bugs, split brain |
| ~~Legacy paywall.js~~ | Удалён 2026-06-10 | — |
| **dist-ts in repo** | Compiled JS alongside src | Stale builds in prod |
| **Dual auth documentation** | Firebase + Supabase migrations | Agent/dev confusion |
| **Webhook failures** | stripe-billing.js, crypto webhooks | Tier/payment desync |
| **Emulator ≠ prod** | development.defaults.env | False confidence from green CI |
| **Long ci:local** | package.json single chain | Skipped checks before release |

## Operational risks

| Риск | Evidence | Impact |
|------|----------|--------|
| **Many integration keys** | INTEGRATIONS_WHEN_READY index | Partial prod config |
| **OPS_SECRET exposure** | OPS_V0.md, RELEASE_CHECKLIST | Support API compromise |
| **localStorage persists in dev** | Legacy IDE rules | Masked onboarding bugs |
| **E2E flakiness** | Playwright + Firebase + dev stack | Blocked releases |
| **Doc sprawl** | 229+ files in docs/, INDEX warns 37 planning | Agents read wrong source |
| ~~Triple agent docs~~ | Сведено: context-os + AGENTS § + AGENT_HUB (2026-06-10) | — |

## Cross-layer top 5 (priority)

1. **Live monetization blocked** (Stripe + CP0) — business + operational
2. **Data layer fragmentation** (Firestore/Supabase/localStorage) — technical + product
3. **Documentation sprawl** — operational + all cores
4. **Entry point fragmentation** — product + onboarding
5. ~~README legacy voice block~~ — archived `docs/archive/README_VOICE_ASSISTANT_LEGACY.md` (2026-06-11)

## Sources

- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md`
- `docs/planning/PRD_NAVORINA.md`
- `docs/planning/INTEGRATIONS_WHEN_READY.md`
- `docs/architecture/OVERVIEW.md`
- `server/paywall.js`, `server/paywall/index.js`
- `docs/planning/RELEASE_CHECKLIST.md`
- `docs/planning/INDEX.md`
