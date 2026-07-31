# Product Core

## Metadata

| Field | Value |
|-------|-------|
| id | product-core |
| version | 1.0.0 |
| project | Beacon Metrics |
| last_updated | 2026-06-27 |

## Purpose

Own product behavior and prioritization for the analytics onboarding and
dashboard experience.

## Scope

### In Scope

- Target personas and jobs to be done
- Source connection and dashboard creation journeys
- Feature acceptance boundaries
- Roadmap priorities and product success signals

### Out of Scope

- Subscription economics
- API implementation details
- Release and incident operations

## Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| owner | Person configuring analytics | workspace role, technical confidence |
| data source | External system providing events | type, connection status |
| dashboard | Saved collection of metrics | owner, freshness, visibility |
| activation journey | Path to first useful dashboard | current step, completion time |

## Invariants

- A new workspace must be able to reach a sample dashboard without credentials.
- Production activation requires at least one successfully synchronized source.
- Failed connection tests must preserve entered configuration for retry.
- Product proposals must define an observable user outcome.

## Decision History

| Date | Decision | Rationale | Source |
|------|----------|-----------|--------|
| 2026-05-20 | Make sample data the default first-run path | It exposes dashboard value before integration work | docs/product-spec.md |
| 2026-06-10 | Prioritize connection diagnostics over new chart types | Connection failure is the largest activation blocker | docs/product-spec.md |

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| document | docs/product-spec.md | Personas, journeys, and roadmap |

## Exclusions

- Pixel-level visual specifications
- Vendor SDK implementation
- Marketing website content
- Support ticket transcripts

## Typical Outputs

- Scoped feature proposal with acceptance criteria
- User-flow impact assessment
- Roadmap recommendation tied to activation
