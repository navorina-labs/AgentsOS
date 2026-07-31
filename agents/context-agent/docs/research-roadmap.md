# Research Roadmap

Phased plan to validate the AI Context OS hypothesis.

---

## Phase 1: MailAgent

**Goal:** First controlled experiment on a single real project.

**Subject:** MailAgent — an email automation / agent project (see [experiments/mailagent/](../experiments/mailagent/)).

**Activities:**

- Build four primary cores + relevant subcores for MailAgent
- Define gold-standard routing labels for 50+ questions
- Run A/B: full repository vs routed cores
- Measure accuracy, hallucination, context size, latency
- Document failures and routing errors

**Exit criteria:**

- Cores answer ≥80% of in-scope questions correctly
- Context compression ratio ≥5×
- Hallucination rate lower than full-repo baseline on business/product questions

**Duration:** 4–6 weeks

---

## Phase 2: Open-Source SaaS Replication

**Goal:** Test generalization across project types.

**Subjects:** 2–3 open-source SaaS projects with:

- Billing / subscriptions
- User onboarding
- Multi-service architecture
- Public documentation

**Activities:**

- Replicate core-building process using prompts and templates
- Measure time to build cores per project
- Cross-project evaluation on shared question patterns
- Identify which subcores recur across projects

**Exit criteria:**

- Four-core model applies without custom ontology on all subjects
- Quality gains replicate on ≥2 of 3 projects
- Core build time <40 hours per project (manual, documented)

**Duration:** 8–12 weeks

---

## Phase 3: Private Project Validation

**Goal:** Validate on a production codebase with real decision stakes.

**Subject:** One private commercial project (not published).

**Activities:**

- Build cores from production artifacts
- Evaluate with domain experts (founders, PMs, engineers)
- Blind comparison: expert rates answers without knowing source
- Measure decision usefulness, not just factual accuracy

**Exit criteria:**

- Expert preference for core-based answers ≥60% on scoped questions
- No regression on critical operational questions
- Documented core maintenance workflow

**Duration:** 6–8 weeks

---

## Phase 4: Paper

**Goal:** Formal publication of methods and results.

**Activities:**

- Write paper following [papers/future-paper-outline.md](../papers/future-paper-outline.md)
- Open-source evaluation dataset (questions + gold labels, no private code)
- Statistical analysis of A/B results
- Peer review submission (arXiv + conference target TBD)

**Exit criteria:**

- Reproducible experiment package
- Statistically significant results on primary hypothesis (or honest null result)
- Limitations section complete

**Duration:** 8–12 weeks

---

## Phase 5: Replication Package & Community Release

**Status:** In progress (framework RC ready; npm `0.1.0` not yet published)

**Goal:** Ship a replicable package so others can run the protocol without reading the whole research tree.

**Done:**

- Public research repository with raw runs under `experiments/`
- Evaluation question banks, gold labels, and scoring outputs
- Core-building playbook and filled reference cores
- Versioned JSON schemas (`@context-os/schemas`) + CLI (`context-os`)
- Reference implementations in [examples/](../examples/) (`reference-saas` at Operational maturity)

**Remaining exit criteria:**

- Synchronized npm publish of `@context-os/schemas`, `@context-os/eval`, `context-os` (`0.1.0`) — [docs/releasing.md](releasing.md)
- GitHub Release + methods preprint upload (arXiv)
- At least one external replication reported
- Issue tracker answers for methodology questions

**Duration:** Ongoing

---

## Timeline Overview

```
Phase 1: MailAgent          [██████████] DONE
Phase 2: OSS SaaS           [██████████] DONE
Phase 3: Private validation [██████████] DONE (Oiloop)
Phase 4: Paper              [████████░░] PDF ready — arXiv upload pending
Phase 5: Replication package[██████░░░░] CLI RC ready — npm 0.1.0 + external replication pending
```

Phases 3–4 overlapped; measurement closed 2026-06.

---

## Out of Scope (All Phases)

- Product / SaaS development
- UI or dashboard
- MCP server or API
- Automated core generation engine
- Commercial licensing

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Cores too stale to be useful | Audit templates, version tagging |
| Routing errors dominate | Separate routing evaluation, iterative rules |
| Null result (no quality gain) | Publish anyway; refine hypothesis |
| Manual curation doesn't scale | Document cost; defer automation to future work |
| Expert evaluation bias | Blind protocol, multiple raters |

See [context-os/audit/risks.template.md](../context-os/audit/risks.template.md).
