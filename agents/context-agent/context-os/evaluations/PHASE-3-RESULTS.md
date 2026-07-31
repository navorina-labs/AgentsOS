# Phase 3 Results: Private Codebase Validation (Oiloop)

**Status:** Measured · **Updated:** 2026-06-17 (Phase 3.1 replication)  
**Date:** 2026-06-13 (initial) · 2026-06-17 (Phase 3.1)  
**Protocol:** A/B/C within-subjects · gpt-4o-mini · LLM-as-judge + masked decode preference (A vs B)

**Canonical run (Phase 3.1):** [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) — 20 Q, gold, v1.1 cores. **B 2.70 / C 2.35 / A 0.75**.  
**Run 3 (production router):** [run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/) — keyword, B **2.75**, F1 **1.0**, hall **0%**.  
**Prior Run 3:** [run-prod-router-1781664681](../../experiments/oiloop/runs/run-prod-router-1781664681/) — pre OL06 fix (B 2.55, 5% hall).  
**Run 2 (hybrid):** [run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/) — cross-cutting B/C/D; **H₁f rejected**.  
**Phase 3.1 closed:** [PHASE-3.1-CLOSED.md](../../experiments/oiloop/runs/run-1781660908/PHASE-3.1-CLOSED.md)

---

## Executive Summary (Phase 3.1 — 2026-06-17)

Phase 3.1 replicates Oiloop eval with **workspace-core v1.1.0** and corrected gold answers.

**Primary hypothesis (B accuracy ≥ A):** Met — B **2.70** vs A **0.75** (`hypothesis_supported: true`). Δ **+1.95** on N=20.

**H₁g (core richness):** Met — B improved from **1.20 → 2.70** vs prior canonical.

**Efficiency:** **CCR_tokens ~12×** (76,663 → 6,334); **CCR_core ~29×**. B latency **2.1s** vs A **2.5s**.

**Production default for Oiloop: B (keyword router, multi-core)** — validated Run 3: B **2.75**, F1 **1.0**, **0%** hallucination. Cross-cutting: B beats C and D (Run 2).

| Variant | Role on Oiloop (final) |
|---------|------------------------|
| **A** | Full repo — never default |
| **B** | **Production default** — best accuracy; multi-core on cross-cutting Q |
| **C** | Optional graph path — not default (25% hall on cross-cutting) |
| **D** | Hybrid — **rejected** (H₁f); B > D > C on cross-cutting accuracy |

---

## Run 3 — Production router (H₁h)

| Metric | Gold [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) | [run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/) |
|--------|------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| B accuracy | 2.70 | **2.75** |
| B hallucination | 0% | **0%** |
| Router F1 | 1.0 | **1.0** |
| B tokens | 6 334 | **6 467** |

**H₁h: Supported** — production keyword router preserves gold routing; accuracy ≥ 80% of gold.

Prior run (pre OL06 fix): [run-prod-router-1781664681](../../experiments/oiloop/runs/run-prod-router-1781664681/) — B 2.55, 5% hall.

OL08 Δ (3→1) is [judge variance](../../experiments/oiloop/runs/run-prod-router-1781664681/OL08-judge-variance.md), not routing failure.

---

## Run 2 — Hybrid ablation (H₁f)

8 cross-cutting Q · [run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/)

| | B | C | D |
|---|---|---|---|
| Accuracy | **2.875** | 2.375 | 2.500 |
| Hallucination | **0%** | 25% | 12.5% |
| Tokens | **8 547** | 7 905 | 11 984 |

**H₁f: Rejected** — D does not match or exceed C at lower cost than B; **multi-core B wins** cross-cutting.

---

## Executive Summary (Phase 3 — 2026-06-13, superseded headline)

---

## Oiloop Run Stability (critical)

| Run | Date | A_acc | B_acc | Δ B vs A | hypothesis | OL08 B acc | Notes |
|-----|------|-------|-------|----------|------------|------------|-------|
| run-1781225808172 | superseded | **1.20** | 1.05 | −0.15 | **false** | 0 | OL08 routing bug |
| run-1781344390027 | superseded | **1.00** | 1.05 | +0.05 | **true** | 0 | B unchanged; OL08 bug |
| **run-1781354424217** | prior canonical | **1.00** | **1.20** | **+0.20** | **true** | **3** | OL08 fixed |
| **run-1781660908** | **Phase 3.1 canonical** | **0.75** | **2.70** | **+1.95** | **true** | 3 | v1.1 cores + gold fix |
| run-prod-router-1781701118 | Run 3 keyword | — | **2.75** | — | — | 1 | F1=1.0; hall 0% |
| run-prod-router-1781664681 | Run 3 (prior) | — | 2.55 | — | — | 1* | pre OL06 fix |
| run-hybrid-1781664794 | Run 2 B/C/D | — | **2.875**† | — | — | — | †cross-cutting only; B best |

**Interpretation:** OL08 content fix successfully resolved the FilePreviewSheet content gap, elevating B accuracy of OL08 from 0 to 3, and overall B accuracy from 1.05 to 1.20.

---

## Table 1: Oiloop A/B/C

| Metric | A (full repo) | B (cores) | C (graph) | Δ B vs A | Δ C vs A |
|--------|---------------|-----------|-----------|----------|----------|
| **Accuracy (0–3)** | 1.00 | **1.20** | **1.55** | **+0.20 (+20.0%)** | **+0.55 (+55.0%)** |
| **Completeness (0–2)** | 0.85 | **0.90** | **1.20** | +0.05 | +0.35 |
| **Actionability (1–5)** | 2.70 | **2.65** | **3.40** | −0.05 | +0.70 |
| **Input tokens (mean)** | 80,910 | **1,044** | **8,399** | **−98.71%** | **−89.62%** |
| **CCR_tokens** | 1× | **78×** | 9.6× | | |
| **CCR_core** | 1× | **109×** | 11.6× | | |
| **Hallucination rate** | 20% | **20%** | **15%** | 0 pp | −5 pp |
| **Latency (mean ms)** | 3,920 | **1,840** | **4,294** | −53.1% | +9.5% |
| **Router F1 (keyword)** | — | **1.000** | — | | |

**Legend:** A = full repo · B = keyword-routed cores (up to 2) · C = Hermes-style graph retrieval

---

## Phase 2 vs Phase 3 Comparison

### Cross-Project Table (Phase 2 + Oiloop) — 149 Q

| Project | Phase | Qs | A_acc | B_acc | C_acc | B vs A | Router F1 | CCR_tokens | CCR_core | Default |
|---------|-------|----|-------|-------|-------|--------|-----------|------------|----------|---------|
| MailAgent | 2 | 45 | 1.38 | **1.67** | 1.24 | +21% | 1.00 | 8.3× | 12.1× | **B** |
| Django REST | 2 | 42 | 1.35 | **1.68** | 1.40 | +24% | 0.85 | 38×† | — | **C** |
| Navorina | 2 | 42 | 1.00 | **1.19** | 0.93 | +19% | 0.87 | 13.7× | 14.6× | **C** |
| **Oiloop** | **3** | **20** | 1.00 | **1.20** | **1.55** | **+20%** | 1.00 | **78×** | **109×** | **C** |

† Django summary only.

### What Changed in Phase 3

| Pattern | Phase 2 (OSS) | Phase 3 (Oiloop) |
|---------|---------------|------------------|
| B accuracy vs A | B wins +19–24% | B wins +20% (robust; resolved OL08 content gap) |
| C vs B hallucination | C lower on Django, Navorina | C lower (15% vs 20%) |
| Decode preference | — | 75% B-or-equal (masked decode, not humans) |
| CCR_tokens | 8–38× | **78×** |
| CCR_core | 12–15× | **109×** |

### Decision Matrix (Updated)

```
                B better          C better
              ─────────        ─────────
MailAgent        ●
Django REST                      ●
Navorina                         ●
Oiloop                           ●
```

---

## Masked Decode Preference (A vs B)

Decoded from [expert-validation-results.md](../../docs/expert-validation-results.md) after [run-1781354424217](../../experiments/oiloop/runs/run-1781354424217/):

| Outcome | Count |
|---------|-------|
| B preferred | 5 |
| A preferred | 5 |
| Equal | 10 |

**B preferred or equal: 75.0%** — meets Phase 3 exit criterion (H4).

**Methodology (required disclosure):** Preferences derived by `autofill-survey.mjs` decode on **existing eval answers** — masked preference pilot, **not** fresh blind human ratings. Do not describe as "expert study" or "5 experts preferred B."

---

## Key Findings

1. **B ≥ A descriptively (+0.20)** with **78× CCR_tokens** and **2.13×** latency savings.
2. **Graph retrieval (C) wins on quality (+55% accuracy vs A)** — production default.
3. **Routing fixed** (keyword F1=1.0) and **OL08 content fixed** (B accuracy went from 0 to 3).
4. **C vs B hallucination** holds on Oiloop (15% vs 20%).

---

## Recommendations

| Profile | Default | Why |
|---------|---------|-----|
| Oiloop (integrated Swift/system) | **C** | +55% accuracy vs A |
| Fast lane (Ollama, background) | **B multi-core** | 78× CCR_tokens, 1.8s latency |
| Any full-repo dump | **Never A** | Cost and latency dominated |

---

## Limitations

- N = 20 questions; +0.20 B vs A not significance-tested.
- Masked decode 75% ≠ human expert validation.
- Private codebase — raw artifacts in [experiments/oiloop/](../../experiments/oiloop/).

---

## Phase 3.1 Results (canonical)

| Metric | A | B | C | Δ B vs A |
|--------|---|---|---|----------|
| Accuracy | 0.75 | **2.70** | 2.35 | **+1.95** |
| Hallucination | 30% | **0%** | 10% | −30 pp |
| Input tokens | 76,663 | **6,334** | 8,963 | −91.7% |
| CCR (chars) | 1× | **29×** | 11× | |
| Latency | 2.5s | **2.1s** | 2.7s | |

Run: [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) · [ABC-COMPARE.md](../../experiments/oiloop/runs/run-1781660908/ABC-COMPARE.md)

---

## Pilot Re-validation (2026-06-17)

Expanded Context Core metadata re-run on OL01–OL10. Full-repo baseline (A) collapsed to **0.50** mean accuracy at 400k chars; B and C both exceed **2.0**.

| Metric | A | B | C | Δ B vs A |
|--------|---|---|---|----------|
| Accuracy | 0.50 | **2.10** | **2.40** | **+1.60** |
| Input tokens | 76,663 | **6,629** | 8,850 | −91.4% |
| CCR (chars) | 1× | **31.7×** | 11.2× | |
| Hallucination | 20% | 30% | 20% | |

Artifacts: [run-1781658621476](../../experiments/oiloop/runs/run-1781658621476/) · [ABC-COMPARE.md](../../experiments/oiloop/runs/run-1781658621476/ABC-COMPARE.md). Canonical 20Q benchmark unchanged.

---

## Per-Project Report

| Project | Report | Raw run | Pilot |
|---------|--------|---------|-------|
| Oiloop | [oiloop-phase-3.md](oiloop-phase-3.md) | [run-1781660908](../../experiments/oiloop/runs/run-1781660908/) | [run-1781658621476](../../experiments/oiloop/runs/run-1781658621476/) |

**Also:** [run-prod-router-1781701118](../../experiments/oiloop/runs/run-prod-router-1781701118/) · [run-hybrid-1781664794](../../experiments/oiloop/runs/run-hybrid-1781664794/)

**Next eval:** Phase 3.1 — [run-oiloop-phase-3.1-eval.md](../../prompts/run-oiloop-phase-3.1-eval.md) · core fixes: [core-fixes-OL05-OL07.md](core-fixes-OL05-OL07.md)

---

## Cross-Reference

- Phase 2: [PHASE-2-RESULTS.md](PHASE-2-RESULTS.md)
- Validity: [research/validity-audit.md](../../research/validity-audit.md)
- Applied instance: [applied-instances.md](applied-instances.md)
- Methodology: [research/evaluation-framework.md](../../research/evaluation-framework.md)
- Phase 3.1 protocol: [prompts/run-oiloop-phase-3.1-eval.md](../../prompts/run-oiloop-phase-3.1-eval.md)
- Core fixes (OL05/OL07): [core-fixes-OL05-OL07.md](../../experiments/oiloop/core-fixes-OL05-OL07.md)
- Hypothesis v2: [docs/hypothesis.md](../../docs/hypothesis.md)
