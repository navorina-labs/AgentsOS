# Domain-Oriented Context

## Thesis

Context for AI reasoning should be organized by **decision domains**, not by technical artifacts (files, services, layers).

---

## Decision Domain

A decision domain is a bounded area of responsibility where a class of questions can be answered with a coherent set of facts and invariants.

Examples:

| Domain | Example decisions |
|--------|-------------------|
| Revenue | Raise prices? Which segment to target? |
| Onboarding | Simplify signup? Add tutorial step? |
| Billing | Fix webhook? Change invoice format? |
| Deployment | Roll back? Blue-green or canary? |

Domains are **orthogonal to code structure**. The billing domain spans `src/billing/`, Stripe dashboard, and revenue reports — none of which alone constitute the domain.

---

## Why Domains, Not Files

Files are implementation artifacts. Decisions cross files:

- "Revenue dropped" may trace to a one-line webhook config, a pricing page change, and a churn spike — three different directories
- "How to deploy?" spans CI config, Docker files, and runbooks — again, multiple directories

File-based context forces the model to **discover** domain boundaries. Domain-oriented context **states** them.

---

## Domain Taxonomy (Default)

AI Context OS proposes a four-domain taxonomy applicable to most software projects:

```
Business    — money, growth, economics
Product     — users, features, value
Technical   — architecture, implementation
Operational — deploy, monitor, incidents
```

This is a **starting hypothesis**, not a universal ontology. Subcores refine within domains.

---

## Domain Stability

Domains change slower than code:

- Billing domain invariants persist across refactors
- Onboarding decisions survive UI rewrites
- Deployment procedures update less frequently than feature code

Therefore cores **version independently** from the codebase and compress over time.

---

## Mapping Artifacts to Domains

| Artifact type | Primary domain | May also inform |
|---------------|----------------|-----------------|
| Stripe dashboard | Business | Billing subcore |
| PRD | Product | Business (if pricing) |
| ADR | Technical | Operational (if infra) |
| Runbook | Operational | Technical |
| Unit tests | Technical | — (usually excluded) |
| CSS | — | Product (only if UX question) |

The mapping is many-to-many. Cores reference artifacts; artifacts do not define cores.

---

## Formal Property

Let D be a decision domain, Q a question, C(D) the context core for D.

**Domain sufficiency:** C(D) contains all facts necessary to answer Q iff Q ∈ scope(D).

**Domain minimality:** Removing any fact from C(D) causes incorrect or incomplete answers for some Q ∈ scope(D).

Both properties are empirically testable via the evaluation framework.
