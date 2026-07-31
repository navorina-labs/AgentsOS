# Operational Core

## Metadata

| Field | Value |
|-------|-------|
| id | operational-core |
| version | 1.0.0 |
| project | Beacon Metrics |
| last_updated | 2026-06-27 |

## Purpose

Own release safety, observability, incident response, and recovery procedures
for Beacon Metrics production services.

## Scope

### In Scope

- Deployment stages and rollback criteria
- Service-level objectives and alert ownership
- Incident severity and communication
- Backup verification and recovery objectives

### Out of Scope

- Feature prioritization
- Commercial policy
- Internal component implementation

## Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| release | Version promoted through environments | commit, owner, status |
| service objective | Reliability target | indicator, target, window |
| incident | Production impact record | severity, commander, timeline |
| rollback | Restoration to prior release | trigger, target version |

## Invariants

- Production promotion requires passing smoke and migration checks.
- A rollback is preferred when a release causes sustained error-budget burn.
- Severity-one incidents require an incident commander and status updates.
- Recovery tests must demonstrate restoration within the documented objective.

## Decision History

| Date | Decision | Rationale | Source |
|------|----------|-----------|--------|
| 2026-05-08 | Use canary promotion for ingestion | Malformed traffic effects appear before full rollout | docs/operations.md |
| 2026-06-12 | Page on sustained ingestion rejection rate | Short client bursts should not wake on-call | docs/operations.md |

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| runbook | docs/operations.md | Deployment, SLO, and incident policy |

## Exclusions

- CI workflow source
- Infrastructure-as-code listings
- Historical incident transcripts
- Customer support procedures

## Typical Outputs

- Release and rollback plan
- Incident classification and immediate actions
- SLO impact and recovery recommendation
