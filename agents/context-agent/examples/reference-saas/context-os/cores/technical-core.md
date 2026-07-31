# Technical Core

## Metadata

| Field | Value |
|-------|-------|
| id | technical-core |
| version | 1.0.0 |
| project | Beacon Metrics |
| last_updated | 2026-06-27 |

## Purpose

Own architecture and implementation constraints for ingestion, metric queries,
and dashboard delivery.

## Scope

### In Scope

- Service boundaries and data ownership
- Public API contracts
- Event ingestion and metric computation
- Storage, tenancy, and dependency rules

### Out of Scope

- Pricing and revenue policy
- Product roadmap prioritization
- Deployment approvals and incident roles

## Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| ingestion API | Receives customer events | workspace id, event id, occurred at |
| event store | Durable append-only event data | tenant partition, received at |
| metric query | Aggregation request | workspace, metric, time range |
| dashboard API | Reads saved dashboards and results | workspace, dashboard id |

## Invariants

- Every persisted record carries a workspace identifier.
- Event identifiers are idempotency keys within a workspace.
- Metric queries never read data across workspace partitions.
- Public API changes remain backward compatible within a major version.
- Dashboard requests do not compute metrics synchronously from raw events.

## Decision History

| Date | Decision | Rationale | Source |
|------|----------|-----------|--------|
| 2026-04-18 | Separate ingestion from query serving | Write spikes must not degrade dashboards | docs/architecture.md |
| 2026-06-05 | Keep raw events immutable | Reprocessing requires reproducible inputs | docs/architecture.md |

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| document | docs/architecture.md | Canonical components and contracts |

## Exclusions

- Full source listings
- Cloud resource identifiers
- Secret values and credentials
- Runbook procedures

## Typical Outputs

- Component-level implementation plan
- API compatibility assessment
- Data ownership and tenancy review
