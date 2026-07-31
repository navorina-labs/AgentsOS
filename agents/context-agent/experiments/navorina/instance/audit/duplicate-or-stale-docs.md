# Duplicate or Stale Docs

Пары и кластеры документов, где источник правды один, остальные — история или дубликат.

## Canonical → Stale

| Canonical (читать) | Stale / duplicate (не для новых фич) | Причина |
|--------------------|--------------------------------------|---------|
| `docs/planning/NAVORINA_ROADMAP_TIMELINE.md` | `docs/archive/planning/PHASE*`, `FOUNDATION_COMPLETE.md` | Archived level 3 |
| `docs/planning/PRD_NAVORINA.md` | `docs/archive/planning/PRODUCT_DEVELOPMENT_IDEAS.md`, `IMPROVEMENTS.md` | Archived ideas |
| `docs/design-system/DESIGN_SYSTEM.md` + `Navorina/css/variables.css` | `docs/reference/css/VARIABLES.md` | DS rule: code wins |
| `server/paywall/index.js` | ~~`server/paywall.js`~~ (удалён 2026-06-10) | Legacy tier model |
| `context-os/cores/*.md` | `docs/archive/real-project-test/*.md` | context-os superseded prototype |
| `docs/agents/AGENT_HUB.md` | Длинные копии workflow в random planning docs | Single agent workflow |
| `docs/planning/INDEX.md` | Чтение всех 37 planning files | INDEX явно запрещает |
| `docs/setup/START_HERE.md` | Разрозненные старые setup notes в `docs/troubleshooting/` | START_HERE — entry |
| `docs/planning/FRONTEND_NUCLEUS.md` | `docs/archive/planning/FRONTEND_PLAN.md` | Archived; superseded |
| `docs/planning/DEVELOPMENT_PLAN_LLMs_in_Finance.md` | `docs/integration/FinGPT-Integration-Plan.md` | Overlapping AI finance plans |
| `docs/firebase/FINANCIAL_MIRROR_FIRESTORE.md` | Supabase-only FM docs without Firebase mention | Dual DB era |
| `context-os/ops/*.md` | `AGENTS.md` (старый монолит ops) | Ops в shards; AGENTS — индекс |
| `docs/setup/LOCAL_*` | Полная копия ops в planning | Cross-link OK; не дублировать в cores |

## Triple agent context overlap

| Layer | Path | Role |
|-------|------|------|
| Rules | `docs/design-system/DESIGN_SYSTEM.md` | Canonical UI rules |
| Ops index | `AGENTS.md` | Короткий индекс → ops shards |
| Ops detail | `context-os/ops/*.md` | API, smoke, env по интеграции |
| Cores | `context-os/cores/`, `subcores/` | Minimal routed context |
| Prototype | `docs/archive/real-project-test/` | Pre-context-os experiment (archived) |

**Рекомендация:** для новых сессий — `CANON.md` → router → core → `ops/<shard>.md`; UI — AGENT_HUB §2.

## Stale product positioning

| File | Issue |
|------|-------|
| `package.json` description | «Offline-first AI Voice Assistant» vs PRD Crypto/Fin Hub |
| `package.json` keywords | ollama, whisper, piper — legacy offline stack |
| `docs/guides/RUSSIAN_MODELS_GUIDE.md` | May not match current cloud AI agents path |

## Screenshot / benchmark docs (not stale, but heavy)

- `docs/planning/cryptopay-screenshots/` — reference for CRYPTOPAY_BENCHMARK
- `docs/planning/runey-screenshots/` — reference for RUNEY_BENCHMARK
- Not duplicates; do not delete without moving benchmarks

## Optimization docs cluster (likely stale)

Archived to `docs/archive/optimization/` (2026-06-10). Formerly `docs/optimization/`:
- `CACHE_FIX.md`, `FINAL_FIX.md`, `FINAL_TEST.md`, `FIX_NOW.md`, `NUCLEAR_FIX.md`, `ULTIMATE_FIX.md`

Marked as historical debugging in INDEX level 3 pattern.

## Sources

- `docs/planning/INDEX.md`
- `docs/design-system/DESIGN_SYSTEM.md`
- `real-project-test/README.md`
- `package.json`
