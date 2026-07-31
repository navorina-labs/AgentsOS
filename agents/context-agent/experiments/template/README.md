# Experiment Template: {PROJECT_NAME}

Copy this directory to `experiments/{project-slug}/` and fill.

---

## Metadata

| Field | Value |
|-------|-------|
| Project | {PROJECT_NAME} |
| Repository | {URL} |
| Phase | {1 / 2 / 3} |
| Status | {planned / cores-built / routing-validated / complete} |
| Start date | |
| Model used | {e.g., gpt-4o-2024-11-20} |

---

## Hypothesis (Subject-Specific)

Extend global hypothesis from [docs/hypothesis.md](../../docs/hypothesis.md):

- {Project-specific claim, e.g., "Billing subcore critical for this SaaS"}

---

## Cores Built

| Core | Version | Tokens | Validation pass rate |
|------|---------|--------|----------------------|
| business-core | | | |
| product-core | | | |
| technical-core | | | |
| operational-core | | | |

---

## Routing Validation

| Metric | Target | Actual |
|--------|--------|--------|
| Routing precision | ≥0.90 | |
| Routing recall | ≥0.90 | |

---

## Compression

| Measure | Value |
|---------|-------|
| Full repo tokens | |
| All cores tokens | |
| CCR | |

---

## Results Summary

(Fill after experiment)

| Metric | Condition A (Full) | Condition B (Cores) | Δ |
|--------|-------------------|----------------------|---|
| Accuracy | | | |
| Hallucination rate | | | |
| Reasoning quality | | | |
| Latency p95 | | | |

**Hypothesis:** Supported / Partially supported / Rejected

---

## Files to Create

```
experiments/{project}/
├── README.md
├── hypothesis.md
├── gold-answers.md
├── results.md
├── routing-rules.md
└── cores/
    ├── business-core.md
    ├── product-core.md
    ├── technical-core.md
    └── operational-core.md
```
