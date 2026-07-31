# Validity Audit — AI Context OS (Phase 2 + 3.1)

**Date:** 2026-06-17 (post Phase 3.1 closure)  
**Scope:** MailAgent, Django REST, Navorina (Phase 2.1) · Oiloop (Phase 3.1)  
**Synthesis:** [SYNTHESIS.md](SYNTHESIS.md) · **Go/no-go:** [CRITICAL-REVIEW.md](CRITICAL-REVIEW.md)

This document maps **what we can honestly claim** vs threats to internal, construct, and external validity.

---

## 1. Study design (as run)

| Parameter | Actual |
|-----------|--------|
| Design | Within-subjects A/B/C per question |
| Model | gpt-4o-mini (all runs) |
| Judge | LLM-as-judge (accuracy 0–3, completeness, actionability, hallucination) |
| Human raters | Author-rated blind pilot n=10 ([human-blind-pilot-oiloop.csv](human-blind-pilot-oiloop.csv)); masked decode 75% (not independent humans) |
| N | **149** total (45 + 42 + 42 + 20) — project-specific banks |
| Statistics | Descriptive means + bootstrap CI on Oiloop paired deltas ([bootstrap-ci.mjs](bootstrap-ci.mjs)) |

**Classification:** Exploratory multi-case study, not confirmatory RCT.

---

## 2. Per-project measurement validity

| Threat | MailAgent | Django REST | Navorina | Oiloop (3.1) |
|--------|-----------|-------------|----------|--------------|
| B uses production router vs gold | ✅ F1 1.0 | ✅ F1 0.85 | ✅ F1 0.87 | ✅ Gold + prod keyword F1 1.0 |
| Raw run in repo | ✅ run-1781319187610 | ⚠️ aggregate only | ✅ run-1781143403051 | ✅ run-1781660908 |
| Independent expert blind | ❌ | ❌ | ❌ | ⚠️ author pilot 60% B |

**Django:** [run-drf-phase-2.1-aggregate](../experiments/django-rest-framework/runs/run-drf-phase-2.1-aggregate/) — no per-question `paired.csv`.

**Oiloop canonical:** [run-1781660908](../experiments/oiloop/runs/run-1781660908/) supersedes run-1781354424217.

---

## 3. Construct validity

| Metric | Threat |
|--------|--------|
| LLM-as-judge accuracy | Same model family; run-to-run variance (mitigated by Phase 3.1 replication) |
| Hallucination rate | Binary judge; prod OL06 5% from over-scoped core text (fix: v1.1.1 scaffold) |
| Masked decode 75% | Not independent humans |
| CCR_tokens vs CCR_core | Must label explicitly — see [evaluation-framework.md](evaluation-framework.md) §7 |

### CCR (dual metric)

| Project | CCR_tokens | CCR_core | Run |
|---------|------------|----------|-----|
| MailAgent | **8.3×** | 12.1× | run-1781319187610 |
| Django REST | **38×**† | — | aggregate |
| Navorina | **13.7×** | 14.6× | run-1781143403051 |
| Oiloop | **~12×** | ~29× | run-1781660908 |

---

## 4. Internal validity

| Claim | Supported? | Notes |
|-------|------------|-------|
| Cores reduce API tokens vs A | ✅ Strong | 8–38× OSS; ~12× Oiloop 3.1 |
| B ≥ A on all 4 projects | ✅ Descriptive | Oiloop Δ +1.95 (N=20) |
| C default on integrated codebases | ⚠️ **3/4 OSS only** | **Oiloop prod default is B**, not C |
| Multi-core B beats C/D cross-cutting | ✅ Oiloop Run 2 | H₁f rejected for hybrid D |
| Core content fixes improve B | ✅ Strong | OL08 0→3; Phase 3.1: 1.20→2.70 |

### Oiloop run stability

| Run | A_acc | B_acc | Δ | Notes |
|-----|-------|-------|---|-------|
| run-1781354424217 | 1.00 | 1.20 | +0.20 | OL08 content fix |
| **run-1781660908** | **0.75** | **2.70** | **+1.95** | **Phase 3.1 canonical** |
| run-prod-router-1781701118 | — | **2.75** | — | keyword F1=1.0; **0% hall** (supersedes 1781664681) |
| run-prod-router-1781664681 | — | 2.55 | — | keyword F1=1.0; 5% hall (OL06, pre-v1.1.1) |

---

## 5. External validity

| Generalizes to | Does not generalize to |
|----------------|------------------------|
| OSS SaaS + macOS companion with maintained cores | Unmaintained repos, one-shot AGENTS.md |
| gpt-4o-mini at eval date | Other models without re-eval |
| Scoped eval questions | Open-ended multi-file codegen |
| Oiloop `.fast` + keyword router | Ad-hoc full-repo dumps |

---

## 6. Honest claim ledger

### Safe to publish

- B mean accuracy **≥** A on all 4 projects (descriptive).
- CCR_tokens **8–38×** (OSS); **~12×** Oiloop Phase 3.1.
- Oiloop **production default B** (keyword, multi-core); F1=1.0 on 20 Q.
- Phase 3.1: B **2.70** vs A **0.75**; B hall **0%** on gold run.
- Author blind pilot: **60%** B-preferred (n=10) — label as author-rated.
- Bootstrap CI script published for paired deltas.

### Do not publish without qualification

- "Statistically significant" / "fully validated" / "double-blind expert study"
- "C is production default on Oiloop" — **false** after Phase 3.1
- "C always lower hallucination than B" (false on MailAgent)
- Single compression number without CCR_tokens vs CCR_core
- Django as fully reproducible from this repo (aggregate only)

---

## 7. Remaining work

| Priority | Action | Status |
|----------|--------|--------|
| P0 | Phase 3.1 replication | ✅ run-1781660908 |
| P0 | Production router validation | ✅ run-prod-router-1781701118 (B 2.75, hall 0%) |
| P0 | Bootstrap CI | ✅ bootstrap-ci.mjs |
| P0 | Synthesis + maintenance docs | ✅ SYNTHESIS.md, oiloop/MAINTENANCE.md |
| P1 | OL06 prod hallucination | ✅ v1.1.1 smoke: acc 3, hall false |
| P1 | Author blind pilot | ✅ human-blind-pilot-oiloop.csv |
| P2 | Django per-question re-run | ❌ optional |
| P2 | Independent human re-rate | ❌ conference track |
| P2 | Paper Results draft | ✅ paper-draft.md |

---

## 8. Cross-reference

- [PHASE-2-RESULTS.md](../context-os/evaluations/PHASE-2-RESULTS.md)
- [PHASE-3-RESULTS.md](../context-os/evaluations/PHASE-3-RESULTS.md)
- [PHASE-3.1-CLOSED.md](../experiments/oiloop/runs/run-1781660908/PHASE-3.1-CLOSED.md)
- [experiments/oiloop/MAINTENANCE.md](../experiments/oiloop/MAINTENANCE.md)
- [routing-adjudication.md](routing-adjudication.md)
