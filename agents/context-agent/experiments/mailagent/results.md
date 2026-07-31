# MailAgent Phase 1 — Published Results

**Entry point for agents.** Source harness: [MailAgent `context-os/eval`](https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval).

---

## Canonical eval (45 questions, keyword router, gpt-4o-mini)

| Condition | Strategy | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|----------|-------------------|----------|---------|---------|
| **A** | Full repo baseline | ~88k | 1.38 | 20% | ~6.1s |
| **B** | Keyword-routed cores | **~10.6k** | **1.67** | **17.8%** | ~6.1s |
| **C** | Hermes-style graph retrieval | ~21k | 1.24 | 22.2% | ~10.1s |

**Canonical run:** [run-1781319187610](runs/run-1781319187610/) · `router_mode: keyword` · `router_mean_f1: 1.0`

**Headline**

- **B** wins on accuracy (+0.29 vs A) with **12× compression** (production keyword router, not gold labels).
- **C** does not beat B on accuracy or hallucination on this narrow domain — **B is the production default** for MailAgent.
- **Hypothesis supported** (`hypothesis_supported: true` in summary).

---

## Links

| What | URL |
|------|-----|
| This summary | https://github.com/navorina-labs/AI-Context-OS/blob/main/experiments/mailagent/results.md |
| **Canonical run (45 Q)** | https://github.com/navorina-labs/AI-Context-OS/tree/main/experiments/mailagent/runs/run-1781319187610 |
| Metrics | https://github.com/navorina-labs/AI-Context-OS/blob/main/experiments/mailagent/runs/run-1781319187610/summary.json |
| Gold-router baseline (35 Q) | [run-1781075014160](runs/run-1781075014160/) — optimistic B; superseded for claims |
| Eval harness | https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval |

---

## Runs in this repo

| Run | Questions | Router | Notes |
|-----|-----------|--------|-------|
| [run-1781074375223](runs/run-1781074375223/) | 10 (pilot) | gold | Early pilot |
| [run-1781075014160](runs/run-1781075014160/) | 35 | **gold** | Oracle B; 45× CCR; do not cite as production routing |
| **[run-1781319187610](runs/run-1781319187610/)** | **45** | **keyword** | **Canonical** |

---

## Limitations

- **C** = static graph index + keyword/BFS retrieval (not live CodeGraph MCP).
- **LLM-as-judge** — not blind human raters.
- Judge tokens not included in cost estimates.
- B loads multiple cores per question → CCR ~12× (not 45× from gold single-core run).

---

## Reproduce

```bash
git clone https://github.com/Alex0nder/MailAgent.git
cd MailAgent
npm run eval:context-os:graph-build
node context-os/eval/run-eval.mjs --condition all --router keyword
npm run eval:context-os:aggregate -- context-os/eval/results/run-<id>
npm run eval:context-os:export -- context-os/eval/results/run-<id>
```

---

## Status (2026-06-13)

| Milestone | Status |
|-----------|--------|
| Project map | ✅ |
| Cores drafted | ✅ 4 + 8 subcores |
| Routing validated | ✅ Keyword F1 1.0 (45 Q) |
| Gold answers | ✅ 45 questions in `questions.json` |
| A/B/C experiment | ✅ [run-1781319187610](runs/run-1781319187610/) |
| Results published | ✅ (this file) |
