# MailAgent — Phase 2.1 Results

**Status:** Measured · **Canonical:** keyword router  
**Questions:** 45 · **Cores:** 6 · **Model:** gpt-4o-mini

---

## A/B/C Results

| Metric | A (full repo) | B (cores) | C (graph) |
|--------|---------------|-----------|-----------|
| **Accuracy** | 1.38 | **1.67** | 1.24 |
| **Mean input tokens** | ~88k | **~10.6k** | ~21k |
| **Hallucination** | 20% | **17.8%** | 22.2% |
| **Latency** | ~6.1s | ~6.1s | ~10.1s |
| **Router F1** | — | **1.00** (keyword) | — |
| **Compression** | 1× | **12×** | 4.1× |

**Key finding:** B wins on accuracy (+21% vs A) with production keyword router (F1=1.0). Narrow domain — **B is the default** (C does not improve trust).

---

## Superseded baseline

| Run | Router | B_acc | CCR | Notes |
|-----|--------|-------|-----|-------|
| run-1781075014160 | gold | 1.69 | 45× | Oracle cores — optimistic |

---

## Raw Artifacts

| Resource | Path |
|----------|------|
| Published summary | [experiments/mailagent/results.md](../../experiments/mailagent/results.md) |
| **Canonical run** | [run-1781319187610](../../experiments/mailagent/runs/run-1781319187610/) |
| Gold baseline | [run-1781075014160](../../experiments/mailagent/runs/run-1781075014160/) |
| Eval harness | [MailAgent/context-os/eval](https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval) |

---

## Cross-Reference

- Summary table: [PHASE-2-RESULTS.md](PHASE-2-RESULTS.md)
