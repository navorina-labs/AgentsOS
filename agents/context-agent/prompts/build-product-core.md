# Prompt: Build Product Core

Build a Product Context Core for `{PROJECT_NAME}`.

---

## Purpose

Capture everything needed for **product decisions**: what the product is, who it serves, features, roadmap, user experience.

---

## Instructions

1. Read product artifacts (PRDs, README user sections, roadmap, support themes — NOT implementation code).

2. Fill the Product Core template with:

### Purpose
What product decisions this core supports.

### In Scope
- Product definition and value proposition
- Target users and personas
- Feature inventory and status
- User flows (described, not coded)
- Roadmap
- Feedback themes

### Out of Scope
- Revenue numbers → Business Core
- API implementation → Technical Core
- Deploy → Operational Core
- Test files, lint config

### Key Entities
| Entity | Description |
|--------|-------------|
| persona | Target user type |
| feature | Named capability with status |
| user_flow | End-to-end task path |

### Invariants
- e.g., "Core workflow: connect → configure → automate"
- e.g., "Free tier limited to N items"

### Decision History
- Features shipped / killed and why
- Major UX changes

### Sources
- `README.md` (user section)
- `docs/roadmap.md`
- Support ticket exports (themes only)

### Exclusions
"Does not include component source, database schemas, CI config"

3. If user onboarding is significant, draft Onboarding Subcore separately.

4. Target: < 3500 tokens.

---

## Validation Questions

Must answer:
- What is the product?
- Who is it for?
- What features exist?
- What's on the roadmap?

Must defer:
- What is MRR? → Business
- Where is auth code? → Technical
