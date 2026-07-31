# Product Core

## Purpose

Продуктовый контекст: что такое Navorina, модули, страницы, пользовательские флоу, UX-рамки, глоссарий. Для вопросов «что строим», «какой экран», «какой модуль», «что ядро продукта».

## Covers

- Продуктовое резюме: ассистент + tools + Nucleus (Financial Mirror)
- UX-принципы: calm fintech, progressive disclosure, anti-patterns
- Модули PRD: маркетинг, ассистент, App Suite, Nucleus FM, инструменты, аккаунт
- Nucleus hubs и слои (42 `nucleus-*-hub.ts` в `src/utils/`)
- Crypto / Fin Hub оси в UI: Payments, Invoicing, Accounting, Insights, Time, Settings
- i18n: `ru/`, `es/` path mirrors
- Дизайн-система: токены, формы, Nucleus tabs
- Глоссарий и терминология crypto UI

## Does not cover

- Stripe webhooks, env keys → Billing Core
- CI, smoke scripts → Release Core
- Детали Firestore schema → Technical Core + Nucleus Core
- Бизнес-метрики MRR/churn → Business Core + Revenue Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **Assistant** | `assistant.html` — чат + 3D Sphere + голос |
| **Nucleus** | `nucleus.html` — hub Financial Mirror |
| **Financial Mirror** | Доходы, расходы, snapshots, workspace |
| **Magic Inbox** | Receipt intake + OCR hints |
| **Invoicing** | Quotes, invoices, delivery, crypto accept |
| **Payments** | Receive, Send, Treasury hub |
| **Accounting** | Export, Xero, month close pack |
| **Insights** | Briefing, digest, trade journal |
| **Tools** | invoice, QR, calculators, document generators |
| **Settings** | Plan, delivery, crypto compliance, security |

## Key files

| Путь | Роль |
|------|------|
| `Navorina/nucleus.html` | Nucleus hub entry |
| `Navorina/assistant.html` | Assistant entry |
| `Navorina/index.html` | Landing |
| `Navorina/settings.html` | Settings shell |
| `Navorina/src/utils/financial-mirror.ts` | FM core client |
| `Navorina/src/utils/nucleus-dashboard.ts` | Dashboard |
| `Navorina/src/utils/nucleus-onboarding-checklist.ts` | Onboarding checklist B4 |
| `Navorina/src/utils/nucleus-onboarding-wizard.ts` | Onboarding wizard |
| `Navorina/css/variables.css` | Design tokens |
| `Navorina/src/core/chat.ts` | Chat logic |
| `Navorina/src/components/` | React: Chat, Sphere, widgets |

## Key docs

- `docs/planning/PRD_NAVORINA.md`
- `docs/planning/PBR_NAVORINA_V2.md` — IA v2 (Home / Get paid / Pay / Account)
- `docs/planning/CRYPTO_FIN_HUB_FLOW.md`
- `docs/design-system/UX_PRINCIPLES.md`
- `docs/design-system/DESIGN_SYSTEM.md`
- `docs/design-system/NAVORINA_BOLD_V3.md` — Bold v3 shell
- `docs/planning/PBR_BOLD_V3_OVERLAYS.md` — sheet/drawer/search overlays
- `docs/design-system/MOBILE_APP_SHELL.md` — mobile <= 800px
- `docs/design-system/COMPONENT_MAP.md`
- `docs/design-system/COMPONENT_LIBRARY.md`
- `docs/design-system/NUCLEUS_TOKENS_COMPONENTS.md`
- `docs/planning/FRONTEND_NUCLEUS.md`
- `docs/planning/CP_CRYPTO_PAYMENTS_TERMINOLOGY.md`
- `docs/reference/MOBBIN.md` — UI research (Mercury)
- `docs/agents/AGENT_HUB.md` — UI workflow only
- `docs/agents/AGENT_HUB.md`

## Risks

- **PRD vs код** — часть roadmap 🟡/⬜ ещё не в UI (Treasury CFH4, live CP0)
- **Много nucleus hubs** — риск дублирования логики между layer/hub файлами
- **Статические tool pages** — слабая связь с FM (roadmap P6)
- **i18n drift** — EN/RU/ES зеркала могут расходиться
- **experiments/** — `gamified-dashboard-2d` вне основного PRD scope

## Dependencies

- Business Core — scope и non-goals
- Nucleus Core — FM детали
- Assistant Core — чат/голос/AI UX
- Onboarding Core — activation flows
- Paywall Core — gated UI surfaces

## AI summary

Продукт = **Assistant** (чат+сфера) + **Nucleus** (FM workspace с табами Payments/Invoicing/Accounting/Insights) + **статические tools**. UX: calm fintech, оси Receive/Send/Account/Deliver. Перед UI-правками: `UX_PRINCIPLES.md`, `variables.css`, `COMPONENT_MAP.md`, `npm run mwg:search`. Shared header/footer — exact copy rule. Nucleus логика в `Navorina/src/utils/nucleus-*-hub.ts` и `financial-mirror.ts`.

## Sources

- `docs/planning/PRD_NAVORINA.md`
- `docs/planning/NAVORINA_ROADMAP_TIMELINE.md`
- `docs/planning/PBR_NAVORINA_V2.md`
- `docs/planning/CRYPTO_FIN_HUB_FLOW.md`
- `docs/design-system/UX_PRINCIPLES.md`
- `docs/design-system/DESIGN_SYSTEM.md`
- `docs/design-system/NAVORINA_BOLD_V3.md`
- `docs/design-system/MOBILE_APP_SHELL.md`
- `docs/planning/FRONTEND_NUCLEUS.md`
- `docs/agents/AGENT_HUB.md`
- `Navorina/*.html` (инвентарь страниц)
- `Navorina/src/utils/nucleus-*-hub.ts`
