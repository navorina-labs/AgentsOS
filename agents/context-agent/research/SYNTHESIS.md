# AI Context OS — Research Synthesis (Final)

**Date:** 2026-06-17  
**Status:** Measurement phase closed · Practice phase open  
**Detail:** [validity-audit.md](validity-audit.md) · [CRITICAL-REVIEW.md](CRITICAL-REVIEW.md)

---

## One-line conclusion

**Domain-oriented context cores (B) beat full-repo dumps (A) on accuracy and cost across four codebases.** For Oiloop production, **keyword-routed multi-core B is the default** — not graph (C) or hybrid (D).

---

## Evidence summary

| Project | N | B vs A (accuracy) | CCR_tokens | Prod default |
|---------|---|-------------------|------------|--------------|
| MailAgent | 45 | B **1.67** vs A 1.38 (+21%) | **8.3×** | **B** (F1=1.0) |
| Django REST | 42 | B **1.68** vs A 1.35 (+24%) | **38×**† | **C** (hallucination) |
| Navorina | 42 | B **1.19** vs A 1.00 (+19%) | **13.7×** | **C** (hallucination) |
| Oiloop Phase 3.1 | 20 | B **2.70** vs A 0.75 (+1.95) | **~12×** | **B** (F1=1.0) |

† Django: [aggregate export](../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) — no per-question `paired.csv`.

**Canonical Oiloop runs:** [run-1781660908](../experiments/oiloop/runs/run-1781660908/) (gold) · [run-prod-router-1781701118](../experiments/oiloop/runs/run-prod-router-1781701118/) (keyword, B **2.75**, hall **0%**).

---

## Decision matrix (use in production)

| Situation | Default | Why |
|-----------|---------|-----|
| Narrow domain, router F1 ≥ 0.85, cost/latency matter | **B** — routed cores | Best accuracy + lowest tokens on 3/4 projects |
| OSS codegen, hallucination risk, cross-cutting deps | **C** — graph retrieval | Lower hall on Django/Navorina; not universal |
| Integrated macOS companion (Oiloop) | **B** — multi-core keyword | Phase 3.1: B > C; Run 2: B > D > C on cross-cutting |
| Dump entire repo | **A** | Baseline only — never production default |

Variants: **A** = full repo · **B** = routed domain cores · **C** = graph retrieval · **D** = hybrid (Oiloop ablation only — rejected).

---

## What we learned (4 patterns)

1. **Cores reduce noise** — CCR_tokens 8–38× on OSS; ~12× on Oiloop with v1.1 metadata.
2. **B ≥ A on all four projects** — descriptive; bootstrap CI on Oiloop paired deltas supports direction ([bootstrap-ci.mjs](bootstrap-ci.mjs)).
3. **C is not always better** — MailAgent: C hall > B; Oiloop cross-cutting: B beats C and D.
4. **Core quality dominates routing** — OL08 content gap (FilePreviewSheet) moved B accuracy 0→3; Phase 3.1: 1.20→2.70 after v1.1 cores + gold fix.

---

## Human blind pilot (author-rated, n=10)

Source: [human-blind-pilot-oiloop.csv](human-blind-pilot-oiloop.csv) · decode: `node research/decode-human-blind-pilot.mjs`

| Preference | Count |
|------------|-------|
| B preferred | 7 |
| Equal | 3 |
| A preferred | 0 |

**100% B+Equal** (B strict: 70%) — directionally consistent with eval. Label as *author-rated blind pilot*, not independent experts.

---

## Honest limitations

- LLM-as-judge only (no Cohen's κ at scale).
- Project-specific question banks (N=149 total, not same 149 Q everywhere).
- Django without per-question raw export.
- Oiloop prod router: ~~5% B hallucination (OL06)~~ **fixed** v1.1.1 — smoke verified ([run-ol06-v111-smoke](../experiments/oiloop/runs/run-ol06-v111-smoke/))
- Not statistically confirmatory — exploratory multi-case study.

---

## Practice phase — next improvements

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Core maintenance workflow | ✅ [experiments/oiloop/MAINTENANCE.md](../experiments/oiloop/MAINTENANCE.md) |
| P0 | OL06 answer scaffold in workspace-core v1.1.1 | ✅ smoke verified |
| P0 | npm publish synchronized `0.1.0` | Open — [docs/releasing.md](../docs/releasing.md); `verify:release` OK |
| P1 | `ContextCoreLoader` + composer review in prod | Oiloop (shipped) |
| P1 | arXiv methods preprint | PDF ready — upload per [ARXIV-SUBMISSION.md](../papers/ARXIV-SUBMISSION.md) |
| P1 | GitHub Release + outreach D0 | [PUBLICATION-PACK.md](../docs/outreach/PUBLICATION-PACK.md) |
| P2 | Django full re-run (paired.csv) | Optional — conference track |
| P2 | Independent human re-rate (10 Q) | Optional — conference track |
| P2 | Doc hygiene (overview / routing / Phase 5) | ✅ 2026-07-12 |

---

## Publication go/no-go

| Output | Verdict |
|--------|---------|
| Blog / Twitter | ✅ GO |
| Methods + replication repo | ✅ GO (Django aggregate caveat) |
| arXiv methods preprint | ✅ GO with limitations |
| Conference empirical paper | ⛔ NO-GO without independent human raters + Django full run |

---

## Cross-references

- Phase 2: [PHASE-2-RESULTS.md](../context-os/evaluations/PHASE-2-RESULTS.md)
- Phase 3.1: [PHASE-3-RESULTS.md](../context-os/evaluations/PHASE-3-RESULTS.md) · [PHASE-3.1-CLOSED.md](../experiments/oiloop/runs/run-1781660908/PHASE-3.1-CLOSED.md)
- Visual: [phase-3-twitter-card.png](../context-os/evaluations/phase-3-twitter-card.png) (Phase 3.1 numbers)
