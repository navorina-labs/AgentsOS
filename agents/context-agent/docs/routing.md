# Routing

The Router selects Context Core(s) for a given question **before** LLM invocation.

---

## Router Responsibilities

1. **Intent classification** — business, product, technical, operational, or mixed
2. **Core selection** — map intent to one or more cores
3. **Composition** — combine cores for cross-domain questions
4. **Deferral** — reject or ask for clarification when intent is ambiguous
5. **Logging** — record routing decision for audit and evaluation

---

## Routing Pipeline

```
Input: natural language question
  ↓
Normalize (lowercase, extract entities, detect urgency)
  ↓
Classify intent (primary + secondary)
  ↓
Match routing rules
  ↓
Select core(s)
  ↓
Load core context (minimal)
  ↓
Output: { cores: [...], context: "...", routing_reason: "..." }
```

---

## Routing Examples

| Question | Route | Reason |
|----------|-------|--------|
| Revenue dropped | Revenue Core | Metric change → business revenue domain |
| Stripe webhook broken | Billing Core | Payment infrastructure failure |
| Improve onboarding | Onboarding Core | User activation → product onboarding |
| What is the product? | Product Core | Product definition question |
| How to deploy? | Operational Core | Deploy / release procedure (R-OPS-001) |
| How to deploy? (needs arch context) | Technical Core + Operational Core | Architecture first, then ops (R-MIX-001 family) |
| MRR vs churn analysis | Revenue Core | Business metrics |
| Trial conversion low | Paywall Core + Onboarding Core | Conversion spans paywall and first-run |
| API rate limit errors | Technical Core | Implementation / architecture |
| Production is down | Operational Core | Incident response |
| Should we raise prices? | Business Core (Revenue) | Pricing decision |
| User can't complete signup | Onboarding Core + Technical Core | UX flow + possible bug |
| What database do we use? | Technical Core | Infrastructure fact |
| Who are our customers? | Product Core + Business Core | Personas + segments |
| Rollback last deploy | Operational Core | Ops procedure |
| Feature flag for billing v2 | Technical Core + Product Core | Implementation + product scope |

---

## Intent Signals

### Business signals

`revenue`, `MRR`, `ARR`, `churn`, `pricing`, `conversion`, `LTV`, `CAC`, `growth`, `retention`, `paywall`, `subscription`, `billing` (when about money, not code)

### Product signals

`feature`, `roadmap`, `user`, `onboarding`, `UX`, `persona`, `feedback`, `activation`, `workflow`, `journey`

### Technical signals

`implement`, `architecture`, `API`, `database`, `schema`, `code`, `refactor`, `dependency`, `library`, `endpoint`, `model`

### Operational signals

`deploy`, `production`, `staging`, `incident`, `outage`, `monitoring`, `alert`, `rollback`, `CI/CD`, `uptime`, `SLA`, `on-call`

---

## Mixed Intent Handling

When multiple domains are detected:

1. List all matching cores
2. Order by relevance (primary intent first)
3. Concatenate core contexts with clear section headers
4. Cap total context size (apply compression if over budget)

Example:

```
"Deploy the new Stripe integration to production"
→ Billing Core (what changed) + Operational Core (how to deploy)
```

---

## Ambiguity Handling

When routing confidence is low:

- **Clarify:** "Are you asking about revenue impact or the technical implementation?"
- **Default safe:** route to broader parent core (e.g., Business Core instead of Revenue Core)
- **Log:** record ambiguous cases for routing rule improvement

---

## Routing Rules Format

Rules are documented in [context-os/router/routing-rules.md](../context-os/router/routing-rules.md).

**Canonical deploy rule:** bare deploy/release/rollback → `operational-core` (R-OPS-001). Add `technical-core` only when the question also needs architecture or feature-implementation context (R-MIX-001). See examples in [context-os/router/routing-examples.md](../context-os/router/routing-examples.md).

Ops vs tech boundary table: [research/routing-adjudication.md](../research/routing-adjudication.md).

Schema: [schemas/routing.schema.json](../schemas/routing.schema.json).

---

## Evaluation

Routing accuracy is measured separately from answer quality:

- **Routing precision:** selected cores match gold-standard labels
- **Routing recall:** no required core is missed
- **Routing latency:** time to classify and select

See [research/evaluation-framework.md](../research/evaluation-framework.md).
