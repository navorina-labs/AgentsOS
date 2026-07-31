# Experiment: Navorina (Phase 2.1 + production canon)

Third project in AI Context OS cross-project validation. **First filled production instance** with canon pipeline (Pass 3–4, 2026-06-11).

**Live repo:** [Navorina](https://github.com/Alex0nder/Navorina) → `context-os/`  
**Frozen snapshot:** [instance/](./instance/) (rsync from `npm run context-os:sync-framework`)  
**Published results:** [results.md](./results.md)

---

## Subject

**Navorina** — multi-module prod app (~270k LOC): nucleus/FM, paywall/billing, crypto payments, AI assistant.

---

## Status (2026-06-11)

| Milestone | Status |
|-----------|--------|
| Question bank (42 Q + gold) | ✅ |
| Harness A/B/C | ✅ [run-1781143403051](./runs/run-1781143403051/) |
| Router keyword F1 | ✅ **0.784** (CI gate ≥ 0.75) |
| Router semantic F1 | ✅ **0.767** (CI optional, `OPENAI_API_KEY`) |
| Canon (`CANON.md`, ops shards) | ✅ [instance/CANON.md](./instance/CANON.md) |
| CI validate + router | ✅ `context-os-ci.yml` in Navorina |
| Instance snapshot in framework | ✅ `instance/` |

---

## Canon pipeline (production)

```
CANON.md → question-router → core/subcore → Sources
                              ↓
                    context-os/ops/<shard>.md
                              ↓ UI
                    docs/agents/AGENT_HUB.md §2
```

Default eval lane: **Condition C + semantic router** (7% hallucination vs 19% for B).

---

## Headline (run-1781143403051)

| | A | B | C |
|---|---|---|---|
| Accuracy | 1.00 | **1.19** | 0.93 |
| Cost | $0.18 | **$0.015** | $0.08 |
| Hallucination | 24% | 19% | **7%** |
| Compression | — | **14×** | — |

---

## Runs

| Run | Questions | Conditions | Notes |
|-----|-----------|------------|-------|
| **[run-1781143403051](./runs/run-1781143403051/)** | **42** | **A, B, C** | Primary result |

---

## Sync instance snapshot

From Navorina repo (sibling checkout):

```bash
npm run context-os:sync-framework
```

---

## Cross-Reference

- [PHASE-2-RESULTS.md](../../context-os/evaluations/PHASE-2-RESULTS.md)
- [navorina-phase-2.1.md](../../context-os/evaluations/navorina-phase-2.1.md)
- Live eval: [Navorina context-os/eval](https://github.com/Alex0nder/Navorina/tree/main/context-os/eval)
