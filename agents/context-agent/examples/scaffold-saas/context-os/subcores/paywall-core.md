# Paywall Core Template

**Parent:** business-core

## Metadata

| Field | Value |
|-------|-------|
| id | paywall-core |
| version | 0.1.0 |
| parent_core | business-core |
| project | example-saas |
| token_estimate | {N} |

---

## Purpose

Trial, conversion, upgrade, and paywall logic decisions.

---

## Scope

### In Scope

- Trial duration and limits
- Free vs paid feature gates
- Upgrade/downgrade flows (business logic)
- Conversion funnel metrics
- Paywall experiments

### Out of Scope

- Payment processing code → Billing Core
- Onboarding UX → Onboarding Core
- Raw revenue totals → Revenue Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| trial | Duration, limits, expiry behavior |
| paywall_gate | Feature or usage limit triggering upgrade |
| conversion_funnel | Stages and current rates |

---

## Invariants

- {Trial length}
- {What happens on trial expiry}

---

## Sources

| Reference | Description |
|-----------|-------------|
| | |

---

## Typical Outputs

- Conversion improvement hypotheses
- Paywall change impact estimates
