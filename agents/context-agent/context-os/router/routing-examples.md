# Routing Examples

Concrete routing decisions for common question patterns.

---

## Single-Core Routes

| Question | Route | Reasoning |
|----------|-------|-----------|
| Revenue dropped | `revenue-core` | Direct metric question |
| Stripe webhook broken | `billing-core` | Payment infrastructure |
| Improve onboarding | `onboarding-core` | Activation domain |
| What is the product? | `product-core` | Product definition |
| How to deploy? | `operational-core` | Ops procedure |
| Where is auth code? | `technical-core` | Implementation location |
| What is our churn rate? | `revenue-core` | Business metric |
| Trial conversion low | `paywall-core` | Conversion funnel |
| What alerts fire on payment failure? | `operational-core` | Monitoring (not billing logic) |
| Should we raise prices? | `revenue-core`, `paywall-core` | Pricing spans both |

---

## Composed Routes

| Question | Route | Order |
|----------|-------|-------|
| How to deploy? (needs arch context) | `technical-core` + `operational-core` | Tech first, then ops |
| Deploy new billing feature | `billing-core` + `technical-core` + `operational-core` | What → how → deploy |
| Users can't complete signup | `onboarding-core` + `technical-core` | UX then possible bug |
| Revenue dropped — product or bug? | `revenue-core` + `billing-core` + `product-core` | Metrics, payments, product |
| Launch EU with billing changes | `billing-core` + `technical-core` + `product-core` | Compliance + impl + scope |

---

## Deferral Examples

| Question | Response | Correct Core |
|----------|----------|--------------|
| "Fix the CSS on pricing page" (in Revenue Core) | Defer: "Visual implementation → Product/Technical. This core covers revenue impact only." | Product Core |
| "Show me all test files" (in Business Core) | Defer: "Out of scope for business decisions." | Technical or exclude |
| "What database version?" (in Product Core) | Defer: "Infrastructure detail → Technical Core." | Technical Core |

---

## Ambiguous Cases

| Question | Action |
|----------|--------|
| "Billing is broken" | Route `billing-core` + `operational-core` (could be code or infra) |
| "Stripe" (alone) | Clarify: "Revenue impact, webhook code, or deploy?" |
| "Improve conversion" | Route `paywall-core` + `onboarding-core` (could be either) |

---

## Negative Test Cases

These must NOT route to Technical Core alone:

- Why did revenue drop?
- Should we add a free tier?
- What is churn?

These must NOT route to Business Core alone:

- Where is the webhook handler?
- How do we deploy?
- What ORM do we use?

---

## Logging Format

```json
{
  "question": "Revenue dropped last week",
  "matched_rules": ["R-BIZ-001"],
  "intent": "business",
  "cores": ["revenue-core"],
  "confidence": 0.95,
  "token_estimate": 2100
}
```
