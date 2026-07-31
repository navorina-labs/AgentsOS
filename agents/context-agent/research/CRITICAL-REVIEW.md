# Critical Review — Go/No-Go (Phase 4 Paper)

**Date:** 2026-06-17 (post Phase 3.1 closure)  
**Detail:** [validity-audit.md](validity-audit.md)

---

## Verdict

| Output | Status | Recommendation |
|--------|--------|----------------|
| **Twitter / blog** | ✅ GO | Phase 3.1: B 2.70 vs A 0.75; prod router F1=1.0 |
| **Methods + replication repo** | ⚠️ GO with gaps | Django aggregate-only (no paired.csv); 3/4 full runs |
| **arXiv methods preprint** | ✅ GO | Paper draft updated; limitations upfront |
| **Conference empirical paper** | ⛔ NO-GO | Independent human rater on blind pilot; Django full re-run |

**One-line:** H₁ holds strongly on Oiloop Phase 3.1 (B 2.70 vs A 0.75, Δ +1.95); prior +0.05 fragility superseded by v1.1 cores + gold fix.

---

## Resolved since 2026-06-12

| Issue | Status |
|-------|--------|
| MailAgent gold cores in eval B | ✅ `run-1781319187610` keyword F1=1.0 |
| Oiloop OL08 routing bug | ✅ F1=1.0; content fix in v1.1 cores |
| Routing gold-label conflicts | ✅ `routing-adjudication.md` |
| CCR metric conflation | ✅ dual metric: CCR_tokens + CCR_core |
| Expert section mislabeled | ✅ renamed masked decode preference |
| Oiloop run-stability (A drift) | ✅ Phase 3.1 canonical run-1781660908 |
| Phase 3.1 replication | ✅ B 2.70, H₁g/H₁h supported, H₁f rejected |
| Bootstrap CI | ✅ `research/bootstrap-ci.mjs` on paired deltas |
| Production default decision | ✅ B (keyword, multi-core) — not C/D |

## Still open

| Issue | Severity |
|-------|----------|
| LLM-as-judge only | **9** |
| Masked decode 75% ≠ human study | **8** — protocol: [human-blind-pilot-oiloop.md](../prompts/human-blind-pilot-oiloop.md) |
| Django raw run (per-question) | **6** — aggregate export only; [RE-RUN.md](../experiments/django-rest-framework/RE-RUN.md) |
| Human blind pilot (independent) | **7** — agent-rated 100%; user rating in progress |
| OL06 prod hallucination (5%) | ✅ **0** on v1.1.1 smoke — [run-ol06-v111-smoke](../experiments/oiloop/runs/run-ol06-v111-smoke/) |

---

## Canonical runs (2026-06-17)

| Project | Run | Router | B acc | Δ B vs A | CCR_tokens |
|---------|-----|--------|-------|----------|------------|
| MailAgent | run-1781319187610 | keyword F1=1.0 | — | +21% | 8.3× |
| Django REST | run-drf-phase-2.1-aggregate | keyword F1=0.72 | 1.68 | +0.33 | 38× |
| Navorina | run-1781143403051 | keyword F1=0.87 | — | +19% | 13.7× |
| **Oiloop** | **run-1781660908** | gold F1=1.0 | **2.70** | **+1.95** | **~12×** |
| Oiloop prod | run-prod-router-1781701118 | keyword F1=1.0 | **2.75** | — | ~12× |

---

## Next work

1. ~~Re-run Oiloop Phase 3.1~~ ✅ run-1781660908
2. ~~Bootstrap CI on paired deltas~~ ✅ `research/bootstrap-ci.mjs`
3. ~~Export Django~~ ⚠️ aggregate [run-drf-phase-2.1-aggregate](../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) — full re-run optional
4. Human blind pilot 10 Q — user rating in progress ([protocol](../prompts/human-blind-pilot-oiloop.md))
5. ~~Paper Results + Limitations~~ ✅ [paper-draft.md](../papers/paper-draft.md)

---

## Safe paper title angle

> *Domain-Oriented Context Cores: Compression and Routing Across Four Codebases — When Graph Retrieval Must Default*

Lead with **4-project table + decision matrix + limitations**, not universal victory.
