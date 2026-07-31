# Prompt: Build Business Core

Build a Business Context Core for `{PROJECT_NAME}`.

---

## Purpose

Capture everything needed for **business and economic decisions**: revenue, pricing, growth, churn, unit economics.

---

## Instructions

1. Read project business artifacts (pricing pages, Stripe dashboard docs, metrics definitions, investor updates — NOT webhook code).

2. Fill the Business Core template with:

### Purpose
One paragraph: what business decisions this core supports.

### In Scope
- Revenue metrics (MRR, ARR, churn, conversion)
- Pricing model and tiers
- Customer segments
- Unit economics (CAC, LTV)
- Growth KPIs

### Out of Scope
- Implementation details → Technical Core
- Feature specs → Product Core
- Deploy procedures → Operational Core
- CSS, UI components, tests

### Key Entities
| Entity | Description | Key attributes |
|--------|-------------|----------------|
| pricing_tier | ... | name, price, limits |
| revenue_metric | ... | definition, source |

### Invariants
- e.g., "All revenue flows through Stripe"
- e.g., "MRR = sum of active subscription amounts"

### Decision History
- Past pricing changes with dates and rationale
- Major business pivots

### Sources
Pointers only:
- `docs/pricing.md`
- Stripe dashboard (link)
- Analytics tool (link)

### Exclusions
Explicit: "Does not include webhook handlers, API code, Docker configs"

3. If monetization exists, also draft Revenue, Paywall, Billing subcores.

4. Target: < 3000 tokens for primary Business Core.

---

## Validation Questions

Must answer correctly from core alone:
- Why did revenue drop?
- What is our pricing model?
- What is churn rate?
- Should we raise prices?

Must defer:
- How is billing implemented? → Billing/Technical
- How to deploy? → Operational
