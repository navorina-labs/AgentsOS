# Repository Health Score

> **Note (2026-06-12):** Scores below reflect the pre-measurement audit (2026-06-10). Phase 2+3 runs now exist — see [research/CRITICAL-REVIEW.md](../research/CRITICAL-REVIEW.md) and [research/validity-audit.md](../research/validity-audit.md) for updated evidence quality and paper go/no-go. Re-score after claims hygiene + MailAgent router re-run.

Reviewer-style assessment of AI Context OS **as it exists today** (2026-06-10). Scores are 1–10 where 10 = publication-ready / production-grade for that dimension. **No optimism.** Evidence = what is in the repo, not what the roadmap promises.

---

## Summary

| Dimension | Score | One-line verdict |
|-----------|-------|------------------|
| Research quality | **3** | Strong problem framing; weak empirical backing |
| Reproducibility | **2** | Cannot replicate any reported result — there are none |
| Evidence quality | **1** | Zero measured outcomes; one false "validated" claim |
| Routing quality | **4** | Documented but contradictory and non-executable |
| Core quality | **3** | Good templates; no filled cores; size claims untested |
| Scalability | **2** | Manual curation only; cost acknowledged, not measured |
| Maintainability | **4** | Clear structure undermined by heavy duplication |

**Overall repository health: 2.7 / 10** — credible research *proposal*, not a research *result*.

**Reviewer recommendation:** **Reject** as empirical paper. **Revise & resubmit** as methods/protocol repo after Phase 1 artifacts exist.

---

## Research quality — 3/10

**What works**
- Problem statement (`problem.md`) is concrete and falsifiable in spirit.
- Primary hypothesis H₁ is formally stated with null and falsification criteria.
- Evaluation dimensions (accuracy, hallucination, CCR, latency) are sensible.

**What fails review**
- No Results section material anywhere.
- Sub-hypotheses H₁a–H₁e outnumber what the experiment design can support.
- Theory files (`theory/*`) restate principles without adding testable predictions beyond H₁.
- `comparison-with-graphs.md` reads like a position paper, not a literature review with citations.
- Attention-dilution mechanism in `problem.md` is asserted, not argued with references.

**Blockers for acceptance**
- Claims exceed evidence by orders of magnitude.
- Phase 1 labeled complete in `minimal-context-principle.md` when it is not started.

---

## Reproducibility — 2/10

**What works**
- Question bank exists (125 items) with intended routes.
- Experiment design (`experiment-design.md`) describes within-subjects A/B.
- JSON schemas and markdown templates provide structure.

**What fails review**
- No gold answers for any question on any project.
- No rater instructions (`papers/future-paper-outline.md` Appendix D missing).
- No results CSV template committed (only inline example in `metrics.md`).
- No router implementation or routing log for 125 questions.
- No frozen model ID, prompt, or baseline file list for Condition A.
- MailAgent subject not linked to a repository URL.

**Replication attempt today:** A third party can read the hypothesis. They cannot run the experiment end-to-end.

---

## Evidence quality — 1/10

**What works**
- Hypothesis explicitly allows null result ("publish anyway" in roadmap risks).

**What fails review**
- **No data points.** Not even a pilot of n=10.
- `overview.md` presents expected benefits as outcomes.
- `minimal-context-principle.md` falsely states Phase 1 empirically validated CCR ≥5×.
- `examples/mailagent/` reads like qualitative validation; `experiments/mailagent/` says not started.
- Success criteria (CCR ≥5×, accuracy ≥80%) appear in roadmap as phase *exit* criteria but function as implied *current* standards.

**Evidence inventory**

| Artifact | Present? |
|----------|----------|
| Raw LLM outputs | No |
| Blind rater scores | No |
| Routing adjudication log | No |
| Token counts per condition | No |
| Statistical test output | No |
| Expert preference study | No |

This is the lowest-scoring dimension. A research repo without evidence is a manifesto.

---

## Routing quality — 4/10

**What works**
- Intent taxonomy (business/product/technical/operational/mixed) is coherent.
- Keyword rules with priorities are a reasonable v0 spec.
- Mixed-question composition is acknowledged, not ignored.
- Separate routing metrics (precision/recall) show awareness of failure mode.

**What fails review**
- **Internal contradictions** on deploy routing (`docs/routing.md` vs `routing-examples.md` vs `routing-rules.md`).
- Billing routes mix business and technical frames in one core.
- Ops vs tech overlap (database, cloud, secrets, logging) without adjudication table.
- No executable router; 90% accuracy target is aspirational.
- Question bank gold routes use inconsistent naming (Title Case vs kebab-case).
- 125-question SaaS bias breaks routing for MailAgent-class subjects.

**Measured routing accuracy:** Unknown (not run).

---

## Core quality — 3/10

**What works**
- Template anatomy (purpose, scope, invariants, sources, exclusions) is well designed.
- Anti-patterns listed in `context-cores.md` show critical awareness.
- Subcore decomposition (revenue, paywall, billing, onboarding) matches SaaS reality.
- Prompts give concrete token budgets per core type.

**What fails review**
- **All templates empty** — zero filled cores in repo.
- No reference core with measured `token_estimate`.
- Quality gate "<10% of full repository tokens" is arbitrary and unchecked.
- Billing dual-parent unresolved → templates cannot be filled consistently.
- `context-cores.md` says validate against full question bank; impossible without project-specific data.
- Cores for non-SaaS projects (MailAgent) not demonstrated — Business template assumes pricing tiers.

**Core size verdict:** Cannot score too large/too small — there is no content.

---

## Scalability — 2/10

**What works**
- Roadmap honestly lists manual curation and defers automation.
- Maintenance metrics defined (build time, drift rate, staleness incidents).
- Audit templates (`cleanup`, `risks`, `project-map`) exist.

**What fails review**
- No recorded core build time for any project.
- 40 hours/project exit criterion (Phase 2) is a guess.
- Entity extraction undefined — does not scale even manually.
- Every new project requires duplicating routing rules, gold answers, cores.
- Composition cap ("truncate lower-priority cores") has no priority function.
- Monthly audit workflow not demonstrated.

**Scalability claim:** The repo argues cores compress context. It does not demonstrate that humans can produce cores fast enough to matter.

---

## Maintainability — 4/10

**What works**
- Directory layout is logical (`docs`, `theory`, `research`, `context-os`, `experiments`).
- MIT license, README entry point, cross-links between files.
- Schemas attempt machine-readable contracts.
- Experiment template supports multiple subjects.

**What fails review**
- **High duplication** across docs/theory/principles/routing/metrics (drift already present).
- Phase 5 roadmap obsolete (repo already public).
- Schema `$id` points to non-existent domain.
- No CI, no link checker, no schema validation.
- `examples/` vs `experiments/` split confuses lifecycle.
- Contributing mentioned in README; no `CONTRIBUTING.md`.

**Drift observed:** Routing for deploy; Phase 1 validation claim; Phase 5 timing.

---

## Cross-dimension failures

### README vs research

| README says | Research reality |
|-------------|------------------|
| "Testing whether AI performs better with cores" | Good — framed as test |
| Planned experiments include MailAgent Phase 1 | MailAgent has no cores, no URL, no results |
| Links to evaluation framework | Framework exists; no data collected |
| `overview.md` linked as system model | Overview states benefits as facts |

### MailAgent experiment vs claimed conclusions

| Claim elsewhere | MailAgent status |
|-----------------|------------------|
| Phase 1 validates CCR (`minimal-context-principle.md`) | All milestones Not started |
| Example invariants for MailAgent (`examples/mailagent/`) | Explicitly not validated |
| 125-question routing test | ~25+ questions inapplicable without monetization |
| Exit: ≥80% in-scope accuracy | No in-scope set defined for MailAgent |

**Verdict:** MailAgent cannot confirm or refute any conclusion. It is a placeholder.

---

## What would move the score

| Action | Dimensions improved |
|--------|---------------------|
| Publish Phase 1 results (even null) | Evidence +3, Research +2, Reproducibility +3 |
| Fix routing contradictions + gold labels | Routing +2, Reproducibility +1 |
| One filled reference core + token count | Core quality +3 |
| Rater instructions + CSV template | Reproducibility +2 |
| Dedup docs / canonical sources | Maintainability +2 |
| Remove false "empirically validated" text | Evidence +2, Research +1 |

**Realistic score after Phase 1 (honest null result):** ~5–6/10 overall — still weak for publication, acceptable as open research log.

**Realistic score after Phase 1 (positive, significant result):** ~7/10 — viable preprint with limitations section.

---

## Reviewer closing statement

AI Context OS is a **well-structured hypothesis and methods draft** attached to an **empty results folder**. The most damaging defect is not missing code — it is copy that implies validation where none exists (`overview.md`, `minimal-context-principle.md`, comparison matrix adjectives). Until Phase 1 produces data and routing ground truth is unified, this repository does not support its own claims.

Fix evidence first. Then fix routing. Then deduplicate docs.

See [top-20-issues.md](top-20-issues.md) for actionable issue list.
