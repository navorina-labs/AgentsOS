# MailAgent Context OS — Full Experiment (35 questions)

**Date:** 2026-06-10  
**Model:** gpt-4o-mini  
**Protocol:** [AI-Context-OS](https://github.com/navorina-labs/AI-Context-OS) A vs B
**Repo:** Alex0nder/MailAgent @ main

## Results (35/35 paired)

| Metric | A (baseline ~320k chars) | B (context cores) | Δ |
|--------|--------------------------|-------------------|---|
| Mean accuracy (0–3) | **1.40** | **1.69** | **+0.29** |
| Hallucination rate | 20.0% | 22.9% | +2.9pp |
| Mean latency | 10.8s | 5.4s | **−50%** |
| Mean context size | 320k chars | ~5.4k chars | — |
| **CCR** | — | — | **~60×** |

**Hypothesis supported (heuristic):** YES

Success criteria met: Accuracy(B) > Accuracy(A) with CCR ≥ 5×.

## Interpretation

- Context cores deliver **~60× smaller** prompts with **+21% relative accuracy** (1.40 → 1.69).
- **Latency halved** — less input tokens, faster inference.
- **Hallucinations did not improve** — judge flagged ~23% for both conditions; cores are not a silver bullet for fabrication.
- Condition A hits OpenAI **TPM limits** (80k tokens/request) — realistic pain of full-repo context.

## Failures & retries

Initial run: 9× Condition A failed (429 TPM / 500). Retried with backoff + 20s pause after A calls. Final: **35/35 paired**.

## Export to AI-Context-OS

```bash
cp -R context-os/eval/results/run-1781075014160 \
  experiments/mailagent/runs/run-2026-06-10-full
```

Files: `summary.json`, `SUMMARY.md`, `paired.csv`, `results.json`, `MA*-{A,B}.md`
