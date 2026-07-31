# Oiloop Context OS Hypothesis

Phase 3 (Private Project Validation) — aligned with [docs/hypothesis.md v2](../../docs/hypothesis.md).

---

## 1. Primary Hypothesis (Oiloop)

> Scoping the LLM context to domain-specific Context Cores (Condition B) achieves **higher accuracy** than the full repository baseline (Condition A) on decision-scoped questions, at **CCR ≥ 5×**.

Hallucination and latency are secondary claims (H₁a, H₁c) — not part of the primary pass/fail gate.

---

## 2. Oiloop-Specific Predictions

| Stratum | Example Q | Predicted winner |
|---------|-----------|------------------|
| Single-core workspace | OL06, OL08 | B |
| Single-core personal | OL02, OL04 | B |
| Cross-cutting workspace + personal | OL07 | D or C |
| Multi-core communication + system | OL09 | D or C |
| Sandbox / security-scoped | OL05 | B (if core complete) or C |

**Production default:** C (graph) for non-trivial Q; B for fast lane / Ollama.

---

## 3. Secondary Hypotheses

### H1: Accidental XML Tag Hallucinations

Stripping XML capability tags from non-system cores yields **100% reduction** in accidental tool-calling hallucinations on general chat queries.

### H2: Local Model Speed-Up

Condition B achieves **≥40%** prompt-processing latency reduction on local LLMs (Ollama) vs full-repo context.

### H3: Score-Based Routing Precision

Production `ContextRouter.swift` achieves F1 **≥ 0.85** without measurable overhead.

### H4: Expert Preference

Blind evaluation: experts prefer Condition B in **≥ 60%** of scoped questions.

> **Phase 3 actual:** 75% B-or-equal via masked decode — not independent human raters.

### H5: Core Richness (H₁g)

Expanded core metadata (pilot run-1781658621476) raises B accuracy from **1.20 → ≥2.0** on OL01–OL10 without raising single-domain hallucination.

### H6: Hybrid Default (H₁f)

Condition D (core + graph supplement) matches C accuracy on OL05, OL07, OL09 at ≤1.5× B tokens.

---

## 4. Evidence (runs)

| Run | N | A | B | C | hypothesis | Notes |
|-----|---|---|---|---|------------|-------|
| run-1781354424217 | 20 | 1.00 | **1.20** | **1.55** | ✅ | canonical |
| run-1781658621476 | 10 | 0.50 | **2.10** | **2.40** | ✅ | pilot, expanded cores |

---

## 5. Open Items → Phase 3.1

1. Replicate pilot on full 20 Q with expanded cores ([core-fixes-OL05-OL07.md](core-fixes-OL05-OL07.md))
2. Add Condition D on cross-cutting Q
3. Run production router (not gold F1 = 1.0)

Protocol: [prompts/run-oiloop-phase-3.1-eval.md](../../prompts/run-oiloop-phase-3.1-eval.md)
