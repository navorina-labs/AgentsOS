# Navorina — Phase 2.1 Eval

Formal cross-project validation (Phase 2) for AI Context OS on Navorina.

## Profile

| Field | Value |
|-------|-------|
| Codebase | ~270k LOC |
| Cores | 11 (4 + 7 subcores) |
| Router routes | 14 |
| Questions | 42 (`context-os/eval/questions.json`) |
| Model | gpt-4o-mini |
| Default pipeline | C + semantic router |

## Conditions

| Condition | Context |
|-----------|---------|
| **A** | `AGENTS.md` + Hub + PRD + Roadmap + DS + UX + Component map |
| **B** | Gold `expected_cores` from question bank (Context OS cores) |
| **C** | Hermes-style graph (`context-os/graph/`) + retrieval snippets |

## Run

```bash
# Router F1 (no answer LLM)
npm run eval:context-os:route
npm run eval:context-os:embeddings
npm run eval:context-os:route:semantic

# Graph for C
npm run eval:context-os:graph-build

# Dry sizes
npm run eval:context-os:dry-abc

# Pilot (NV01–NV10)
npm run eval:context-os:pilot

# Full 42 × A/B/C
npm run eval:context-os

# Summarize
npm run eval:context-os:aggregate -- context-os/eval/results/run-<id>
npm run eval:context-os:tokens -- context-os/eval/results/run-<id>
NAVORINA_COMMIT=$(git rev-parse HEAD) npm run eval:context-os:export -- context-os/eval/results/run-<id>
```

## Export

Copy `context-os/eval/export/run-<id>/` → `AI-Context-OS/experiments/navorina/runs/`.

## Risks

- `AGENTS.md` stale ops in Condition A
- `crypto_payments` route pulls 3 secondary cores — keyword F1 pressure
- Emulator ≠ prod on release/ops questions
- Doc sprawl may cap compression below MailAgent

## Methodology

[evaluation-framework.md](https://github.com/navorina-labs/AI-Context-OS/blob/main/research/evaluation-framework.md)
