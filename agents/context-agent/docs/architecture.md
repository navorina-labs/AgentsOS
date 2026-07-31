# Architecture

AI Context OS organizes project knowledge into four primary Context Cores. Each core is a bounded decision context with explicit scope, sources, and outputs.

---

## Business Core

### Purpose

Enable decisions about revenue, growth, unit economics, market positioning, and business health.

### Questions Covered

- Why did revenue / MRR / ARR change?
- What is our pricing model and how does it affect conversion?
- Which customer segments drive growth?
- What are unit economics (CAC, LTV, churn)?
- Are we meeting business KPIs?

### Questions Not Covered

- How is feature X implemented? → Technical Core
- What does the onboarding flow look like? → Product Core / Onboarding Subcore
- How do we deploy to production? → Operational Core
- What CSS framework do we use? → out of scope

### Typical Sources

- Revenue dashboards and analytics exports
- Stripe/billing summaries (not raw webhook handlers)
- Pricing documentation
- Business metrics definitions
- Churn and cohort reports
- Investor/board metric definitions

### Typical Output

- Causal hypothesis for metric changes
- Recommended business investigations
- KPI interpretation
- Pricing or packaging recommendations (decision-level, not code)

---

## Product Core

### Purpose

Enable decisions about what the product does, who it serves, feature scope, and user experience.

### Questions Covered

- What is the product and who is it for?
- What features exist and what is their status?
- How do users accomplish key tasks?
- What is on the roadmap?
- What user feedback patterns exist?

### Questions Not Covered

- What is our MRR? → Business Core
- How is authentication implemented? → Technical Core
- What is our uptime SLA? → Operational Core
- How much did we spend on ads? → Business Core

### Typical Sources

- Product requirements and specs
- User journey maps
- Feature flags and rollout status
- Support ticket themes
- Roadmap documents
- Personas and use cases

### Typical Output

- Feature scope recommendations
- UX improvement hypotheses
- Prioritization rationale
- User impact assessment

---

## Technical Core

### Purpose

Enable decisions about system architecture, implementation, code structure, APIs, and technical debt.

### Questions Covered

- How is the system architected?
- Where is feature X implemented?
- What are the API contracts?
- What dependencies and versions do we use?
- What is the data model?
- What technical debt exists?

### Questions Not Covered

- Why did revenue drop? → Business Core
- Should we add feature Y? → Product Core
- How do we roll back a deploy? → Operational Core
- What is our pricing strategy? → Business Core

### Typical Sources

- Architecture decision records (ADRs)
- API documentation
- Service dependency maps
- Database schemas (summarized)
- Key module responsibilities
- Tech stack inventory

### Typical Output

- Implementation guidance
- Architecture recommendations
- Refactoring priorities
- Integration approach

---

## Operational Core

### Purpose

Enable decisions about deployment, monitoring, incidents, reliability, and day-to-day operations.

### Questions Covered

- How do we deploy to staging / production?
- What monitoring and alerts exist?
- What happened during incident X?
- What is the rollback procedure?
- What are environment configurations (high-level)?
- What is current system health?

### Questions Not Covered

- How is the payment flow coded? → Technical Core
- What features are we building? → Product Core
- What is our churn rate? → Business Core
- Should we redesign onboarding? → Product Core

### Typical Sources

- Runbooks and playbooks
- CI/CD pipeline definitions (summarized)
- Incident postmortems
- Alert definitions and on-call rotations
- Infrastructure topology (not full Terraform dumps)
- SLA and SLO definitions

### Typical Output

- Incident diagnosis steps
- Deploy / rollback instructions
- Operational risk assessment
- Monitoring gap identification

---

## Subcores

Primary cores decompose into subcores for finer routing:

| Subcore | Parent | Focus |
|---------|--------|-------|
| Revenue Core | Business | MRR, ARR, conversion |
| Paywall Core | Business | Paywall logic, trials, upgrades |
| Billing Core | Business / Technical | Payments, webhooks, invoices |
| Onboarding Core | Product | First-run experience, activation |

See [context-cores.md](context-cores.md) and [context-os/subcores/](../context-os/subcores/).

---

## Core Composition

Some questions require multiple cores:

```
"How to deploy the new billing feature?"
→ Technical Core (what changed) + Operational Core (how to deploy)
```

Composition rules are defined in [routing.md](routing.md).

---

## Core Lifecycle

1. **Extract** — entity extraction from full project
2. **Draft** — populate core template (manual or guided prompts)
3. **Validate** — test against question bank
4. **Compress** — remove non-decision facts
5. **Version** — tag core version independent of codebase
6. **Audit** — periodic review against project drift
