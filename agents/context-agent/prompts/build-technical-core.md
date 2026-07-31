# Prompt: Build Technical Core

Build a Technical Context Core for `{PROJECT_NAME}`.

---

## Purpose

Capture everything needed for **technical and architectural decisions**: system design, implementation location, APIs, data model, dependencies.

---

## Instructions

1. Read technical artifacts (ADRs, architecture docs, API specs, package manifests — summarize code, do not paste).

2. Fill the Technical Core template with:

### Purpose
What technical decisions this core supports.

### In Scope
- System architecture (services, boundaries)
- Tech stack
- API contracts (endpoints, methods — not full handlers)
- Data model (entities and relationships — not full DDL)
- Key module responsibilities
- Dependencies and versions
- Technical debt register
- Local dev setup (summary)

### Out of Scope
- Business metrics → Business Core
- Product roadmap → Product Core
- Deploy runbooks → Operational Core
- Full source listings

### Key Entities
| Entity | Description |
|--------|-------------|
| service | Named deployable unit |
| api_endpoint | Route + purpose |
| data_entity | Table/model + role |

### Invariants
- e.g., "Monolith with 3 modules" or "Microservices: A, B, C"
- e.g., "PostgreSQL 15, Redis for cache"

### Decision History
- ADRs with dates
- Major refactors

### Sources
- `docs/architecture.md`
- `package.json` / `go.mod` (versions only)
- `src/` structure (tree summary, not contents)

### Exclusions
"Does not include: test files, CSS, Docker compose full text, revenue dashboards"

3. Target: < 4000 tokens.

---

## Validation Questions

Must answer:
- How is the system architected?
- Where is X implemented?
- What database do we use?
- What are the API endpoints?

Must defer:
- Why did revenue drop? → Business
- How to deploy? → Operational
