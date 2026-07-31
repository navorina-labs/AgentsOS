# Revenue Core Template

**Parent:** business-core

## Metadata

| Field | Value |
|-------|-------|
| id | revenue-core |
| version | 0.1.0 |
| parent_core | business-core |
| project | example-saas |
| token_estimate | {N} |

---

## Purpose

Revenue, MRR, ARR, growth, and churn decisions.

---

## Scope

### In Scope

- MRR, ARR, revenue trends
- Churn and retention
- Cohort analysis (summary)
- Revenue forecasting inputs
- Segment revenue breakdown

### Out of Scope

- Paywall UX details → Paywall Core
- Webhook implementation → Billing Core / Technical Core
- Deploy → Operational Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| mrr | Monthly recurring revenue definition and source |
| churn_rate | Definition, calculation, current value |
| revenue_cohort | Segment breakdown |

---

## Invariants

- {How MRR is calculated}
- {Revenue recognition rules}

---

## Sources

| Reference | Description |
|-----------|-------------|
| | Stripe dashboard / analytics |

---

## Typical Outputs

- Revenue drop/root cause hypotheses
- Trend interpretation
- Segment comparisons
