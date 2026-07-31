# Billing Core Template

**Parent:** business-core (business frame) / technical-core (implementation frame)

## Metadata

| Field | Value |
|-------|-------|
| id | billing-core |
| version | 0.1.0 |
| parent_core | business-core |
| project | example-saas |
| token_estimate | {N} |

---

## Purpose

Payment processing, subscriptions, invoices, and webhook decisions.

---

## Scope

### In Scope (Business frame)

- Payment provider (Stripe, etc.)
- Subscription lifecycle events
- Failed payment handling (business impact)
- Invoice and refund policies

### In Scope (Technical frame — separate section or child doc)

- Webhook events handled
- Failure modes and retries
- Idempotency approach (summary)

### Out of Scope

- Pricing strategy → Revenue / Paywall Core
- Deploy webhook changes → Operational Core
- Full handler source → cite path only

---

## Key Entities

| Entity | Description |
|--------|-------------|
| payment_provider | |
| webhook_event | Event type + handler behavior |
| subscription_state | States and transitions |

---

## Invariants

- {All payments through X}
- {Webhook events: list}

---

## Decision History

| Date | Change | Impact |
|------|--------|--------|
| | | |

---

## Sources

| Reference | Description |
|-----------|-------------|
| | src/billing/ (pointer) |
| | Stripe dashboard |

---

## Typical Outputs

- Payment failure diagnosis
- Webhook issue hypotheses
- Revenue impact of billing incidents
