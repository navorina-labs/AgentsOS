# Business Core

## Metadata

| Field | Value |
|-------|-------|
| id | business-core |
| version | 1.0.0 |
| project | Beacon Metrics |
| last_updated | 2026-06-27 |

## Purpose

Own commercial decisions for Beacon Metrics: pricing, revenue interpretation,
customer segmentation, and retention economics.

## Scope

### In Scope

- Subscription tiers and billing intervals
- MRR, activation, paid conversion, and logo churn
- Segment-specific retention and expansion decisions
- Commercial constraints for packaging changes

### Out of Scope

- Feature behavior and user journeys
- API and storage implementation
- Deployment and incident procedures

## Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| workspace | Billable customer account | tier, seats, billing interval |
| subscription | Commercial agreement | status, renewal date, monthly value |
| activation | First dashboard with a connected source | timestamp, source type |
| logo churn | Lost paying workspace | cancellation date, reason |

## Invariants

- A workspace is counted in MRR only while its subscription is active.
- Annual contracts contribute one twelfth of contract value to MRR.
- Trial workspaces are excluded from paid conversion until a payment succeeds.
- Pricing recommendations must report expected effects on activation and churn.

## Decision History

| Date | Decision | Rationale | Source |
|------|----------|-----------|--------|
| 2026-05-15 | Keep a 14-day trial | Most activated trials connect data by day 3 | docs/business-model.md |
| 2026-06-01 | Price by workspace, not event volume | Predictable invoices reduce support load | docs/business-model.md |

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| document | docs/business-model.md | Canonical pricing and metric definitions |

## Exclusions

- Payment processor payloads
- Raw customer event exports
- Revenue recognition accounting
- Sales compensation policy

## Typical Outputs

- Metric interpretation with a named denominator
- Pricing decision with activation and churn tradeoffs
- Segment-specific retention investigation
