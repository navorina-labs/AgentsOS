# Navorina — Phase 2.1 Results (measured)

Run: `run-1781143403051` · 2026-06-11 · commit `413acd41` · model `gpt-4o-mini`

## A/B/C

| Metric | A | B | C |
|--------|---|---|---|
| Mean accuracy (0–3) | **1.00** | **1.19** | **0.93** |
| Hallucination rate | 24% | 19% | **7%** |
| Cost (USD, 42 Q) | $0.18 | **$0.015** | $0.078 |
| Mean input tokens | 27,627 | **2,021** | 11,858 |
| Mean latency (ms) | 4,298 | **3,078** | 7,356 |

## Compression & router

| Metric | Value |
|--------|-------|
| CCR A/B (input tokens) | **13.7×** |
| CCR A/B (context chars) | **14.6×** |
| Keyword router F1 | **0.784** |
| Semantic router F1 | **0.767** |
| Questions | 42 |
| Cores | 11 |

## Cross-project row

| Project | Qs | Cores | A_acc | B_acc | C_acc | A_cost | B_cost | C_cost | B_hall | C_hall | Router_kw | Router_sem | CCR A/B | Key finding |
|---------|-----|-------|-------|-------|-------|--------|--------|--------|--------|--------|-----------|------------|---------|-------------|
| Navorina | 42 | 11 | 1.00 | 1.19 | 0.93 | $0.18 | $0.015 | $0.078 | 19% | 7% | 0.78 | 0.77 | 14× | C for trust; B for accuracy/cost |

## Key finding

**B выигрывает accuracy (+19% vs A) и cost ($0.015), но C — лучший trust profile: hallucination 7% vs 19% (B) и 24% (A).** Для production codegen/ops — **C + semantic router**; B — fast/cheap read-only lane. Compression 14× (ниже MailAgent 45×) из‑за doc sprawl в Condition A.

## Artifacts

- `context-os/eval/results/run-1781143403051/` — full run
- `context-os/eval/export/run-1781143403051/` — lean bundle
- `../AI-Context-OS/experiments/navorina/runs/run-1781143403051/` — exported

## Reproduce

```bash
npm run eval:context-os:embeddings
npm run eval:context-os:route:semantic
npm run eval:context-os:route
npm run eval:context-os:graph-build
npm run eval:context-os
npm run eval:context-os:aggregate -- context-os/eval/results/run-1781143403051
npm run eval:context-os:tokens -- context-os/eval/results/run-1781143403051
```
