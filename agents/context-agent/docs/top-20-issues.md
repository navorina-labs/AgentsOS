# Top 20 Repository Issues — Resolved & Open Split

This document tracks the harsh audit of the AI Context OS framework, splitting identified issues into resolved achievements and open work items.

**Original Audit Date:** 2026-06-10  
**Updated:** 2026-07-12 (pre-npm 0.1.0 release hygiene)
**Cross-Reference:** [research/CRITICAL-REVIEW.md](../research/CRITICAL-REVIEW.md)

---

## Part 1: Resolved Issues

### Issue 1: Zero experimental evidence for the primary hypothesis (RESOLVED)
* **Status:** Resolved. A/B/C evaluations across four codebases; raw runs in `experiments/`.

### Issue 2: `overview.md` states outcomes as facts, not hypotheses (RESOLVED)
* **Status:** Resolved 2026-07-12. Stage 5 bullets are conditional and link to [research/SYNTHESIS.md](../research/SYNTHESIS.md).

### Issue 3: `minimal-context-principle.md` false CCR claim (RESOLVED)
* **Status:** Resolved. Docs match measured Phase 2–3 CCR.

### Issue 4: MailAgent experiment directory empty (RESOLVED)
* **Status:** Resolved. Phase 1 subject fully populated.

### Issue 5: Question bank SaaS-biased (RESOLVED)
* **Status:** Resolved. Per-project question banks.

### Issue 6: Contradictory routing for "How to deploy?" (RESOLVED)
* **Status:** Resolved 2026-07-12. Canonical rule: bare deploy → `operational-core`; arch+deploy → tech+ops. Aligned in [docs/routing.md](routing.md), [routing-examples.md](../context-os/router/routing-examples.md), [routing-rules.md](../context-os/router/routing-rules.md).

### Issue 7: Router not executable (RESOLVED)
* **Status:** Resolved. Keyword + semantic routers with F1 eval.

### Issue 8: Condition A undefined when repo exceeds context window (PARTIALLY RESOLVED)
* **Status:** Partially resolved. Per-subject `baseline-manifest.json` freezes Condition A file lists. A single cross-project truncation standard is still optional polish.

### Issue 9: Roadmap Phase 5 wording (RESOLVED)
* **Status:** Resolved 2026-07-12. Phase 5 redefined as replication package + community release with explicit remaining exit criteria (npm publish, arXiv, external replication).

### Issue 11: GraphRAG / H₁e without baseline (RESOLVED)
* **Status:** Resolved. Condition C evaluated on all four subjects.

### Issue 12: No gold answers / scoring package (RESOLVED)
* **Status:** Resolved. Gold bullets + `paired.csv` / `summary.json` per run.

### Issue 14: Empty core templates only (RESOLVED)
* **Status:** Resolved. Filled cores in experiments + `examples/reference-saas`.

### Issue 16: Entity Extraction undefined (RESOLVED)
* **Status:** Resolved 2026-07-12. Stage 2 in [docs/overview.md](overview.md) now has input/output contract + annotated example.

### Issue 17: Illustrative MailAgent example without watermark (RESOLVED)
* **Status:** Resolved 2026-07-12. Banner + invariant tags in [examples/mailagent/README.md](../examples/mailagent/README.md).

### Issue 18: Statistical plan mismatches ordinal scales (RESOLVED)
* **Status:** Resolved 2026-07-12. [research/metrics.md](../research/metrics.md) and [evaluation-framework.md](../research/evaluation-framework.md) document bootstrap CI on paired deltas as the practice used; confirmatory p-values explicitly out of scope without independent raters.

### Issue 19: JSON schemas orphaned (RESOLVED)
* **Status:** Resolved. `context-os validate --schema` is exercised in `test:framework` / CI (`test:cli`, `test:scaffold`, `test:reference`, profile tests).

### Issue 20: Ops vs Technical boundary ambiguous (RESOLVED)
* **Status:** Resolved. Boundary table + adjudicated cases in [research/routing-adjudication.md](../research/routing-adjudication.md); linked from [docs/routing.md](routing.md).

---

## Part 2: Open Issues

### Issue 8 (remainder): Cross-project Condition A truncation standard
* **Status:** Open (low).
* **How to fix:** Optional doc: one default truncation strategy when baseline manifests are absent.

### Issue 10: Massive duplication across `docs/`, `theory/`, and `principles.md`
* **Status:** Open (low).
* **How to fix:** Designate canonical files; link instead of restating. Dedup pass.

### Issue 13: Billing Core dual parent (Business vs Technical)
* **Status:** Open (medium — product design).
* **How to fix:** Split `billing-business-core` / `billing-technical-core`, or add explicit `frame` in core metadata.

### Issue 15: Terminology inconsistency for cores and routes
* **Status:** Open (low — polish).
* **How to fix:** Enforce `id` = kebab-case, display name = Title Case in templates and docs.

### Ship blockers (not original audit issues)

| Item | Status | Path |
|------|--------|------|
| npm publish `0.1.0` | Open | [docs/releasing.md](releasing.md) |
| GitHub Release v0.1.0 | Open | [docs/outreach/PUBLICATION-PACK.md](outreach/PUBLICATION-PACK.md) |
| arXiv PDF upload | Open | [papers/ARXIV-SUBMISSION.md](../papers/ARXIV-SUBMISSION.md) |
| External replication | Open | Phase 5 exit |

---

## Out of scope (do not treat as framework gaps)

- SaaS UI / dashboard
- MCP server
- Automated core generation
- Conference empirical paper without independent human raters + Django full re-run
