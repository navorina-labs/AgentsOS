# Routing Rules (Generic Template)

Project-agnostic routing rules. Copy to `experiments/{project}/routing-rules.md` and customize.

**Priority:** Lower number = matched first.

---

## Rule Format

```
ID: {rule-id}
Priority: {N}
Intent: {business|product|technical|operational|mixed}
Keywords: [list]
Route: [core-ids]
Max tokens: {optional cap}
```

---

## Business Rules

### R-BIZ-001: Revenue metrics

- **Priority:** 10
- **Keywords:** revenue, MRR, ARR, churn, growth, retention, LTV, CAC
- **Route:** `revenue-core`
- **Examples:** "Why did revenue drop?", "What is our MRR?"

### R-BIZ-002: Paywall and conversion

- **Priority:** 11
- **Keywords:** paywall, trial, conversion, upgrade, free tier, free plan
- **Route:** `paywall-core`
- **Examples:** "Trial conversion is low", "What happens when trial expires?"

### R-BIZ-003: Billing (business frame)

- **Priority:** 12
- **Keywords:** payment failed, refund, invoice, subscription cancelled, Stripe (when about money)
- **Route:** `billing-core`
- **Examples:** "How many failed payments?", "Stripe outage impact"

### R-BIZ-004: General business fallback

- **Priority:** 90
- **Keywords:** pricing, business, KPI, metrics, competitors
- **Route:** `business-core`

---

## Product Rules

### R-PRD-001: Onboarding

- **Priority:** 10
- **Keywords:** onboarding, signup, activation, first run, time to value, drop off
- **Route:** `onboarding-core`

### R-PRD-002: Product definition

- **Priority:** 20
- **Keywords:** what is the product, features, roadmap, persona, value proposition
- **Route:** `product-core`

### R-PRD-003: Product fallback

- **Priority:** 91
- **Keywords:** user, UX, feedback, feature request
- **Route:** `product-core`

---

## Technical Rules

### R-TEC-001: Architecture

- **Priority:** 10
- **Keywords:** architecture, tech stack, how is X implemented, where is, data model, API
- **Route:** `technical-core`

### R-TEC-002: Billing implementation

- **Priority:** 11
- **Keywords:** webhook, stripe handler, billing code, subscription table
- **Route:** `billing-core`, `technical-core` (composition)

### R-TEC-003: Local dev

- **Priority:** 20
- **Keywords:** run locally, setup dev, install dependencies
- **Route:** `technical-core`

---

## Operational Rules

### R-OPS-001: Deploy

- **Priority:** 10
- **Keywords:** deploy, production, staging, rollback, CI/CD, release
- **Route:** `operational-core`

### R-OPS-002: Incident

- **Priority:** 5
- **Keywords:** down, outage, incident, production broken, alert firing
- **Route:** `operational-core`

### R-OPS-003: Monitoring

- **Priority:** 15
- **Keywords:** monitoring, logs, on-call, SLA, SLO, uptime
- **Route:** `operational-core`

---

## Mixed Rules (Composition)

### R-MIX-001: Deploy feature

- **Priority:** 10
- **Keywords:** deploy + (feature|billing|new)
- **Route:** `technical-core`, `operational-core`

### R-MIX-002: Revenue + product

- **Priority:** 10
- **Keywords:** revenue + (feature|onboarding|conversion)
- **Route:** `revenue-core`, `product-core` (or relevant subcores)

### R-MIX-003: Billing failure impact

- **Priority:** 5
- **Keywords:** webhook + (fail|broken|error)
- **Route:** `billing-core`, `operational-core`, `revenue-core`

---

## Fallback

When no rule matches with confidence:

| Action | Condition |
|--------|-----------|
| `clarify` | Ambiguous intent |
| `business-core` | Default for metric questions |
| `technical-core` | Default for "how" implementation questions |
| `reject` | Question outside all cores (e.g., "write me a poem") |

---

## Deferral Rules

Core must NOT answer — must defer:

| Question type | Defer to |
|---------------|----------|
| CSS/styling (unless UX question) | exclude or Product |
| Docker full config | Operational (summary only) |
| Unit test contents | exclude |
| Unrelated domain | name correct core |

---

## Validation

Test all rules against [research/questions.md](../../research/questions.md). Target routing accuracy ≥ 90% before experiment.
