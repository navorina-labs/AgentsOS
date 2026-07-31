# Context Boundaries

Explicit boundaries are the mechanism that makes domain-oriented context work.

---

## Boundary Definition

A **context boundary** is a declarative rule that separates:

- What a core **owns** (answers here)
- What a core **defers** (route elsewhere)
- What is **excluded** (never in any core for this question type)

Boundaries are **hard**, not soft. A core that leaks across boundaries defeats compression and reintroduces dilution.

---

## Boundary Types

### 1. Scope Boundary

Defines question types in/out of scope.

```markdown
## In Scope
- Revenue trend analysis
- Pricing model questions

## Out of Scope
- CSS/styling → excluded
- Docker configuration → Operational Core
- API implementation → Technical Core
```

### 2. Entity Boundary

Defines which entities appear in the core.

Revenue Core includes: `MRR`, `pricing_tiers`, `churn_cohorts`
Revenue Core excludes: `React components`, `database migrations`

### 3. Temporal Boundary

Defines how far back decision history extends.

Example: Revenue Core includes last 90 days of metric changes and all pricing decisions; excludes full git history.

### 4. Fidelity Boundary

Defines level of detail.

Technical Core: API contracts and service responsibilities (high-level)
Technical Core does not include: full source code listings

---

## Boundary Violations

| Violation | Example | Fix |
|-----------|---------|-----|
| Leak | Business core contains webhook handler code | Move to Billing/Tech core |
| Overlap | Two cores answer same question differently | Merge or split scope |
| Gap | Question has no matching core | Add subcore or routing rule |
| Stale | Core references removed feature | Audit and update |

---

## Boundary Testing

For each core, maintain a test set:

- **Positive cases:** questions that must be answerable from this core alone
- **Negative cases:** questions that must be deferred (core should say "route to X")
- **Edge cases:** questions on the boundary between two cores

Negative case pass rate is as important as positive case accuracy.

---

## Boundary vs Graph Edge

| Graph edge | Context boundary |
|------------|------------------|
| "A relates to B" | "A is in scope; B is out of scope" |
| Symmetric (usually) | Asymmetric (deferral direction matters) |
| Discovered | Declared |
| Traversable | Not traversable across boundary |

Graphs connect. Boundaries separate.

---

## Composition Without Boundary Erosion

When composing cores for mixed questions:

1. Each core retains its boundary in the composed context
2. Sections are labeled by core name
3. The LLM is instructed not to merge facts across sections without explicit cross-domain reasoning
4. Total composed size has a hard cap; truncate lower-priority cores first
