# Cleanup Candidates

Статус после pass 2 (2026-06-10).

## Выполнено ✅

### Pass 1
| Путь | Действие |
|------|----------|
| `server/paywall.js` | Удалён |
| `real-project-test/*.md` | → `docs/archive/real-project-test/` |
| `docs/optimization/*` | → `docs/archive/optimization/` |
| `THEME_ICONS_REVIEW.md` | → `docs/archive/reviews/` |
| Agent integration | `AGENTS.md`, `AGENT_HUB`, Context OS managed instructions |

### Pass 2
| Путь | Действие |
|------|----------|
| `docs/planning/` level-3 (10 файлов) | → `docs/archive/planning/` |
| `package.json` name | `ai-voice-assistant` → **`navorina`** |
| `package.json` description/keywords | Обновлены под Crypto / Fin Hub |
| `INDEX.md`, `MIGRATION_GUIDE.md`, `ROADMAP` | Ссылки на архив |

### Pass 3 (2026-06-11) — Context OS canon

| Путь | Действие |
|------|----------|
| `context-os/CANON.md`, `MAINTENANCE.md` | Добавлены |
| `context-os/ops/*.md` | Ops shards из AGENTS.md |
| `AGENTS.md` | Сжат до индекса |
| `context-os/validate.mjs` | `npm run context-os:validate` |
| `context-os/eval-harness-tmp/` | Удалён (дубликат eval/) |

### Pass 4 (2026-06-11) — CI + README + framework export

| Путь | Действие |
|------|----------|
| `.github/workflows/context-os-ci.yml` | validate + router F1 gate |
| `context-os/eval/router-baseline.json` | min F1 0.75 |
| `README.md` | Сжат; legacy → archive |
| `context-os/export-framework.mjs` | `npm run context-os:export-framework` |

## Остаётся (не трогали)

| Путь | Риск | Примечание |
|------|------|------------|
| `project-universe-research/` | low | Research UI |
| `Navorina/experiments/gamified-dashboard-2d/` | low | Experimental |
| `Navorina/dist-ts/` | medium | Compiled output in git |
| `docs/planning/cryptopay-screenshots/` | low | Benchmark assets |
| `docs/planning/runey-screenshots/` | low | Benchmark assets |
| ~~`README.md` legacy voice block~~ | — | → `docs/archive/README_VOICE_ASSISTANT_LEGACY.md` (2026-06-11) |
| `examples/navorina` в AI-Context-OS repo | — | External publish |

## Sources

- `docs/archive/README.md`
- `docs/planning/INDEX.md` § Уровень 3
