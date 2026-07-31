# Prompt: Build Operational Core

Build an Operational Context Core for `{PROJECT_NAME}`.

---

## Purpose

Capture everything needed for **operational decisions**: deploy, monitor, incidents, reliability, environments.

---

## Instructions

1. Read operational artifacts (runbooks, CI configs summarized, incident postmortems, monitoring docs).

2. Fill the Operational Core template with:

### Purpose
What operational decisions this core supports.

### In Scope
- Environments (dev, staging, prod)
- Deploy procedures (step summary)
- Rollback procedures
- CI/CD pipeline (stages, not full YAML)
- Monitoring and alerts
- Incident response
- SLAs/SLOs
- On-call rotation
- Backup and DR (summary)

### Out of Scope
- Business impact analysis → Business Core (link only)
- Feature behavior → Product Core
- Implementation details → Technical Core
- Full Terraform/k8s manifests

### Key Entities
| Entity | Description |
|--------|-------------|
| environment | Name, purpose, URL |
| alert | Condition, severity, runbook |
| runbook | Procedure name + link |

### Invariants
- e.g., "Prod deploys via GitHub Actions on merge to main"
- e.g., "Rollback: revert commit + redeploy (~8 min)"

### Decision History
- Incident postmortems (date, cause, fix)
- Infra changes

### Sources
- `.github/workflows/` (summary)
- `docs/runbooks/`
- PagerDuty/Opsgenie config (links)

### Exclusions
"Does not include: application source code, pricing docs, full config dumps"

3. Target: < 3000 tokens.

---

## Validation Questions

Must answer:
- How do we deploy to production?
- How do we roll back?
- What alerts exist?
- What was the last incident?

Must defer:
- How is billing coded? → Technical
- What is churn? → Business
