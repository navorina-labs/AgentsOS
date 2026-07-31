# Onboarding Core Template

**Parent:** product-core

## Metadata

| Field | Value |
|-------|-------|
| id | onboarding-core |
| version | 0.1.0 |
| parent_core | product-core |
| project | {PROJECT_NAME} |
| token_estimate | {N} |

---

## Purpose

First-run experience, signup, activation, and time-to-value decisions.

---

## Scope

### In Scope

- Signup flow (steps described)
- Activation definition and rate
- Drop-off points
- Onboarding content (tutorials, empty states)
- First-value milestone

### Out of Scope

- Paywall/trial logic → Paywall Core
- Auth implementation → Technical Core
- Revenue from activated users → Revenue Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| signup_step | Order, fields, friction points |
| activation_event | What counts as "activated" |
| drop_off_point | Where users abandon |

---

## Invariants

- {Activation definition}
- {Required signup fields}

---

## Sources

| Reference | Description |
|-----------|-------------|
| | Analytics funnel |
| | Product docs |

---

## Typical Outputs

- Onboarding improvement recommendations
- Drop-off hypotheses
- Activation benchmark comparisons
