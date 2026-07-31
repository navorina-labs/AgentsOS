# Phase 2 Results: Cross-Project Validation

**Status:** All 3 projects measured (MailAgent, Django REST, Navorina)  
**Date:** 2026-06-13 (post adversarial audit — dual CCR)  
**Protocol:** A/B/C within-subjects · gpt-4o-mini · LLM-as-judge

---

## Executive Summary

AI Context OS was tested on **3 OSS projects** (129 questions total: 45 + 42 + 42).

**Hypothesis supported (descriptive):** context cores (B) outperform full-repo context (A) on accuracy across all three Phase 2 projects (keyword router on MailAgent).

**Tradeoff:** B is cheapest and most accurate, but hallucination is **not universally lower than C** — C beats B on hallucination on **Django and Navorina only** (2/4 with Phase 3). For integrated codebases where trust matters, **C is the production default**.

| Variant | Role |
|---------|------|
| **A** | Full repo baseline — dominated on cost; never default |
| **B** | Routed cores — fast lane; narrow domains with F1 ≥ 0.95 |
| **C** | Graph retrieval — production default when cross-cutting deps or hallucination risk dominate |

---

## Table 1: Cross-Project Results

| Project | Codebase | Qs | Cores | A_acc | B_acc | C_acc | B_hall | C_hall | Router F1 | CCR_tokens | CCR_core | Key finding |
|---------|----------|----|-------|-------|-------|-------|--------|--------|-----------|------------|----------|-------------|
| **MailAgent** | 320k | 45 | 6 | 1.38 | **1.67** | 1.24 | 18% | 22% | **1.00** | **8.3×** | 12.1× | B wins; C hall ≥ B |
| **Django REST** | ~1.2M | 42 | 5 | 1.35 | **1.68** | 1.40 | 22% | **11%** | 0.85 | **38×**† | — | C preferred (halluc) |
| **Navorina** | ~270k | 42 | 11 | 1.00 | **1.19** | 0.93 | 19% | **7%** | **0.87** | **13.7×** | 14.6× | C wins on trust; B on accuracy |

**Legend:** A = full repo · B = keyword-routed cores · C = Hermes-style graph retrieval  
**CCR_tokens** = `mean(tokens_in_A) / mean(tokens_in_B)` · **CCR_core** = harness `mean_ccr_tokens_est_b` (baseline chars / core chars)  
† Django: [aggregate export](../../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) — no per-question `paired.csv`; see [RE-RUN.md](../../experiments/django-rest-framework/RE-RUN.md).

**MailAgent:** [run-1781319187610](../../experiments/mailagent/runs/run-1781319187610/) (keyword). Superseded gold: [run-1781075014160](../../experiments/mailagent/runs/run-1781075014160/).

**Navorina:** [run-1781143403051](../../experiments/navorina/runs/run-1781143403051/) · commit `413acd41`

---

## Compression (dual metric)

| Project | A tokens (mean) | B tokens (mean) | **CCR_tokens** | CCR_core | Notes |
|---------|-----------------|-----------------|----------------|----------|-------|
| MailAgent | 88,113 | 10,615 | **8.3×** | 12.1× | B includes prompt + question overhead |
| Django REST | ~76k | ~2k | **38×**† | — | measured in Oiloop workspace |
| Navorina | 27,627 | 2,021 | **13.7×** | 14.6× | doc sprawl caps ratio vs MailAgent |

Do **not** cite CCR_core as API cost savings. See [evaluation-framework.md](../../research/evaluation-framework.md) §7.

---

## Router Quality

| Project | Keyword F1 | Semantic F1 | Notes |
|---------|------------|-------------|-------|
| MailAgent | **1.00** | — | All 45 Q: `expected === routed` in `run-meta.json` |
| Django REST | 0.72 | **0.85** | Cross-cutting questions hurt keyword |
| Navorina | **0.872** | **0.837** | Resolved NV05/12/26/33/39 keyword/semantic failures |

MailAgent F1=1.0 is project-specific (narrow domain + adjudicated question bank), not a jump from Navorina/Django ~0.55–0.87.

---

## Key Findings (4 Patterns)

### 1. B wins on accuracy vs A (Phase 2 OSS)

+19–24% mean accuracy (B vs A) on Django REST and Navorina; MailAgent **+21%** with keyword router (45 Q). **CCR_tokens 8–38×** lower than A.

**Phase 3 (Oiloop):** B **+1.95** vs A (Phase 3.1, N=20) — see [PHASE-3-RESULTS.md](PHASE-3-RESULTS.md) and [research/SYNTHESIS.md](../../research/SYNTHESIS.md).

### 2. Hallucination: C beats B on 2/4 projects (with Phase 3)

| Project | B_hall | C_hall | C < B? |
|---------|--------|--------|--------|
| MailAgent | 18% | 22% | ❌ |
| Django REST | 22% | 11% | ✅ |
| Navorina | 19% | 7% | ✅ |
| Oiloop (Ph3) | 25% | 30% | ❌ |

Navorina C at **7%** — lowest hallucination in the study.

### 3. C is the production default on complex / integrated codebases

Django REST and Navorina: accuracy tradeoff vs B, but fewer hallucinations. Oiloop (Phase 3): C wins on accuracy (+55% vs A) despite higher halluc than B.

### 4. Compression varies with baseline sprawl and metric choice

**CCR_tokens** (API): 8.3× MailAgent · 38× Django · 13.7× Navorina.  
**CCR_core** (harness): up to 12–15× on OSS; Oiloop reaches **112×** core-char ratio (see Phase 3).

---

## Recommendations by Project Profile

| Profile | Default | Why |
|---------|---------|-----|
| Narrow domain, clear boundaries (MailAgent) | **B** | Router F1=1.0; read-only Q&A |
| Medium OSS, cross-cutting questions (Django REST) | **C** | B +24% accuracy but 22% halluc vs 11% for C |
| Multi-module prod, 11 cores (Navorina) | **C** | C halluc **7%** vs B 19%; B still +19% accuracy vs A |

### Decision Matrix

```
                B better          C better
              ─────────        ─────────
MailAgent        ●
Django REST                      ●
Navorina                         ●
```

| Variant | When to use |
|---------|-------------|
| **B** | Narrow domain, router F1 ≥ 0.95, read-only Q&A (MailAgent default) |
| **C** | Prod codegen/ops, cross-cutting questions, C hallucination < B |
| **A** | Never default — dominated on cost |

---

## Failure Modes (Observed)

| Mode | Projects | Evidence |
|------|----------|----------|
| Cross-cutting questions need 2+ cores | Django REST, Navorina | NV42 F1=0.571; DRF keyword F1=0.72 |
| C accuracy drop on sparse graph | Navorina | C_acc 0.93 vs B 1.19 |
| Keyword router misses paywall/assistant | Navorina | NV29 F1=0 |
| Legacy doc sprawl inflates A baseline | Navorina | Lower CCR_tokens vs MailAgent |
| Non-obvious domain boundaries | Django REST, Navorina | 11 cores, crypto/paywall/nucleus overlap |

---

## Limitations

- **LLM-as-judge** for accuracy and hallucination (not blind human raters).
- **Django REST** — aggregate export [run-drf-phase-2.1-aggregate](../../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/); per-question CSV requires [re-run](../../experiments/django-rest-framework/RE-RUN.md).
- **MailAgent** canonical run uses keyword router; gold run `1781075014160` is oracle baseline only.
- **C** = static graph index + keyword/BFS (not live CodeGraph MCP).
- **CCR:** report CCR_tokens for cost claims; CCR_core is supplementary.
- No confidence intervals or significance tests.

---

## Per-Project Reports

| Project | Report | Raw run | Verifiable |
|---------|--------|---------|------------|
| MailAgent | [mailagent-phase-2.1.md](mailagent-phase-2.1.md) | [run-1781319187610](../../experiments/mailagent/runs/run-1781319187610/) | ✅ |
| Django REST | [django-phase-2.1.md](django-phase-2.1.md) | [run-drf-phase-2.1-aggregate](../../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) | ⚠️ aggregate only |
| Navorina | [navorina-phase-2.1.md](navorina-phase-2.1.md) | [run-1781143403051](../../experiments/navorina/runs/run-1781143403051/) | ✅ |

---

## Next Steps

1. **Export Django raw run** to `experiments/django-rest-framework/runs/`.
2. **Oiloop** — re-run after `workspace-core` FilePreviewSheet patch (OL08).
3. **Statistics** — bootstrap CI on paired accuracy deltas.
4. **Publication** — blog + arXiv methods (with limitations upfront).

---

## Applied Instances (Private)

| Project | Role | Doc |
|---------|------|-----|
| **Oiloop** | DRF eval workspace + Phase 3 (20 Q) + live macOS cores | [applied-instances.md](applied-instances.md) · [PHASE-3-RESULTS.md](PHASE-3-RESULTS.md) |

---

## Appendix

- Methodology: [research/evaluation-framework.md](../../research/evaluation-framework.md)
- Validity: [research/validity-audit.md](../../research/validity-audit.md)
- MailAgent harness: [MailAgent/context-os/eval](https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval)
- Navorina harness: [Navorina/context-os/eval](https://github.com/Alex0nder/Navorina/tree/main/context-os/eval)
