# Decision-Centric Context

Context should be organized around **decisions**, not **artifacts**.

---

## Artifact-Centric (Status Quo)

Most AI tooling organizes context by what exists in the repository:

```
src/
docs/
tests/
.github/
docker/
```

Retrieval asks: "Which files are similar to the query?"

The model must infer: "Which decision does this question require?"

---

## Decision-Centric (AI Context OS)

Context asks: "What decision is being made?"

Then provides: facts, constraints, and history for **that decision only**.

```
Question: "Should we add a free tier?"
  ↓
Decision type: pricing / packaging (Business)
  ↓
Context: current tiers, conversion data, competitor positioning, past pricing decisions
  ↓
NOT: Docker configs, CSS, test files
```

---

## Decision Taxonomy

Decisions classify into types:

| Type | Examples | Primary core |
|------|----------|--------------|
| Economic | pricing, packaging, unit economics | Business |
| Scope | feature priority, roadmap | Product |
| Structural | architecture, tech stack | Technical |
| Procedural | deploy, rollback, incident | Operational |
| Mixed | "ship billing v2" | Composed cores |

---

## Decision History as Context

Past decisions are high-signal, low-token context:

- ADR: "We chose Stripe over Paddle because X" (Technical + Business)
- Postmortem: "Outage caused by webhook timeout" (Operational + Billing)
- Pricing change log: "Raised Pro tier 20% on 2025-03-01" (Business)

Decision history is more valuable per token than raw code for most business/product questions.

---

## Decision Frames

The same artifact supports multiple decision frames:

**Stripe webhook handler code:**

| Frame | Relevant facts |
|-------|----------------|
| Business | "Processes payments for 3 pricing tiers" |
| Technical | "Async handler, 30s timeout, retries 3x" |
| Operational | "Alert on failure, runbook link" |

A decision-centric core includes only the frame relevant to the routed question.

---

## Building Decision-Centric Cores

1. List decisions this domain owns (brainstorm with stakeholders)
2. For each decision, list required facts
3. Map facts to source artifacts (pointers only)
4. Remove facts not required by any listed decision
5. Add decision history (ADRs, incidents, policy docs)
6. Validate with question bank

---

## Anti-Pattern: File Inventory Cores

Bad core content:

```markdown
## Files
- src/billing/webhook.ts
- src/billing/invoice.ts
- src/billing/subscription.ts
```

Good core content:

```markdown
## Billing Invariants
- All subscriptions flow through Stripe
- Webhooks: invoice.paid (activate), customer.subscription.deleted (churn)
- Failure mode: webhook timeout → payments marked pending, alert fires
- Last incident: 2025-11-12, timeout increased 15s→30s

## Sources
- src/billing/webhook.ts (handler)
- runbooks/billing-webhook-failure.md
```

---

## Evaluation

Decision-centric context is working when:

- Answers reference decisions, not file lists
- Negative test cases correctly defer out-of-scope questions
- Experts agree answers are "actionable for the decision" not just "factually correct"
