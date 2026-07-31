# Business Core Template

<!-- Copy to experiments/{project}/cores/business-core.md and fill -->

## Metadata

| Field | Value |
|-------|-------|
| id | business-core |
| version | 0.1.0 |
| parent_core | null |
| project | {PROJECT_NAME} |
| last_updated | {DATE} |
| token_estimate | {N} |

---

## Purpose

{Business context for the agent/tool: market, pricing, cost model, distribution, and trust constraints.}

---

## Scope

### In Scope

- Market and positioning
- Pricing, packaging, and usage limits
- Cost model for model/API/tool execution
- Distribution channels
- Trust, compliance, and support constraints
- {project-specific business decisions}

### Out of Scope

- Tool execution implementation → Technical Core
- User workflows → Product Core
- Deployment procedures → Operational Core
- UI/CSS, tests, Docker configs

---

## Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| user_segment | | |
| pricing_plan | | |
| usage_limit | | |
| cost_driver | | |

---

## Invariants

- {Fact that must remain true for business decisions}
- {}

---

## Decision History

| Date | Decision | Rationale | Source |
|------|----------|-----------|--------|
| | | | |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| document | | |
| dashboard | | |
| url | | |

---

## Exclusions

Explicitly NOT included:

- {e.g., Stripe webhook source code}
- {e.g., Full analytics exports}

---

## Typical Outputs

- Pricing and quota recommendations
- Cost and support tradeoff analysis
- Distribution and packaging rationale
- Recommended business investigations
