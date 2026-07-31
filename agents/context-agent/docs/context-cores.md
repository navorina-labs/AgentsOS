# Context Cores

A Context Core is the fundamental unit of knowledge in AI Context OS.

---

## Definition

A **Context Core** is a curated, bounded document (or structured artifact) containing the minimal sufficient context for reasoning about a specific **decision domain**.

It is not:

- A folder of files
- A code embedding index
- A knowledge graph subgraph
- A prompt template alone

It is a **compressed decision surface** with explicit boundaries.

---

## Anatomy

Every core follows a standard structure (see [schemas/core.schema.json](../schemas/core.schema.json)):

```markdown
# {Core Name}

## Metadata
- id, version, parent_core, last_updated

## Purpose
Why this core exists.

## Scope
### In Scope
Questions this core answers.

### Out of Scope
Questions deferred elsewhere.

## Key Entities
Decision-relevant entities (not file lists).

## Invariants
Facts that must remain true for decisions in this domain.

## Decision History
Past decisions affecting this domain (ADRs, incidents, policy changes).

## Sources
Pointers to authoritative artifacts (paths, URLs, dashboards).

## Exclusions
Explicit list of what is NOT included and why.

## Typical Outputs
What kind of answers this core produces.
```

---

## Core Hierarchy

```
Business Core
├── Revenue Core
├── Paywall Core
└── Billing Core (shared boundary with Technical)

Product Core
├── Onboarding Core
└── (feature-specific subcores as needed)

Technical Core
├── (service-specific subcores as needed)
└── Billing Core (implementation side)

Operational Core
└── (environment-specific subcores as needed)
```

---

## Core vs File

| File-based context | Context Core |
|-------------------|--------------|
| `src/billing/webhook.ts` | Billing Core: "Stripe webhooks process `invoice.paid`; failure mode X" |
| Entire `docs/` folder | Product Core: "Three personas, five key flows, roadmap Q2" |
| Full `docker-compose.yml` | Operational Core: "Staging: 3 services; prod: 5 services + Redis" |

Cores **reference** files; they do not **contain** them.

---

## Building a Core

1. Start from template in [context-os/cores/](../context-os/cores/)
2. Use prompts in [prompts/](../prompts/)
3. Validate against [research/questions.md](../research/questions.md)
4. Measure compression ratio vs full repo
5. Schema-validate with [schemas/core.schema.json](../schemas/core.schema.json)

---

## Quality Criteria

A core is **valid** when:

- [ ] Every in-scope question from the test bank can be answered
- [ ] No out-of-scope question is answered (core defers correctly)
- [ ] Token count is <10% of full repository context (target; project-dependent)
- [ ] Sources are current (audit date within 30 days)
- [ ] Boundaries are explicit and non-overlapping with sibling cores

For an operational scoring rubric, see [core-quality-rubric.md](core-quality-rubric.md) and run:

```bash
context-os score
```

---

## Anti-Patterns

- **Kitchen sink core** — one core that answers everything (defeats the purpose)
- **File mirror core** — listing files instead of decision facts
- **Stale core** — not updated after major project changes
- **Leaky boundary** — technical implementation details in Business Core
- **Orphan core** — no routing rule points to it
