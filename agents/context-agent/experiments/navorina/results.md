# Navorina Phase 2.1 — Published Results

**Entry point for agents.** Source harness: [Navorina `context-os/eval`](https://github.com/Alex0nder/Navorina/tree/main/context-os/eval).

**Status:** Measured · run `1781143403051` · commit `413acd41`

---

## Navorina Phase 2.1 eval (42 questions, gpt-4o-mini)

| Condition | Strategy | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|----------|-------------------|----------|---------|---------|
| **A** | Legacy docs baseline | ~27.6k | 1.00 | 24% | ~4.3s |
| **B** | Context OS routed cores | **~2.0k** | **1.19** | 19% | **~3.1s** |
| **C** | Hermes-style graph retrieval | ~11.9k | 0.93 | **7%** | ~7.4s |

**Cost (answer phase):** A=$0.18 · **B=$0.015** · C=$0.08

**Headline**

- **B** wins on accuracy (+19% vs A) and tokens (**14×** CCR, ~91% cheaper).
- **C** lowest hallucination (**7%**) — best trust profile; accuracy −22% vs B.
- **Hypothesis** (domain cores beat full repo): **supported**.

---

## Links

| What | Path |
|------|------|
| Full run | [runs/run-1781143403051](./runs/run-1781143403051/) |
| Metrics | [summary.json](./runs/run-1781143403051/summary.json) |
| Tokens & cost | [tokens-summary.json](./runs/run-1781143403051/tokens-summary.json) |
| Phase 2 report | [PHASE-2-RESULTS.md](../../context-os/evaluations/PHASE-2-RESULTS.md) |

---

## Router (Tuned Run)

| Mode | F1 | CI gate |
|------|-----|---------|
| Keyword | **0.872** | ≥ 0.75 (always) |
| Semantic | **0.837** | ≥ 0.75 (optional, `OPENAI_API_KEY`) |

Frozen canon instance: [instance/](./instance/) · `EXPORT_META.json` commit pin.

---

## Key finding

**C for production** (7% halluc), **B for accuracy** (1.19). Compression 14× — below MailAgent 45× due to doc sprawl in Condition A. Failure modes (NV05, NV12, NV26, NV29, NV33, NV39) resolved via explicit multi-core route mapping.

---

## Reproduce

```bash
git clone https://github.com/Alex0nder/Navorina.git
cd Navorina
npm run eval:context-os:graph-build
npm run eval:context-os
npm run eval:context-os:aggregate -- context-os/eval/results/run-<id>
npm run eval:context-os:export -- context-os/eval/results/run-<id>
```
