# Question Router — Beacon Metrics

How agents pick **minimal context** for decision-scoped questions. Do **not** load the full repository — load **1 primary + 0–2 secondary** cores.

## Rules

1. Classify the question: business / product / technical / operational / domain subcore.
2. Open **primary** subcore if matched; else **primary** core.
3. Add **secondary** only when the question crosses boundaries (e.g. webhook = billing + technical).
4. Use `context-os/manifest.json` as the file index.
5. From each core, open only **Sources** — not whole directories.

## Matrix (minimal profile)

| Question type | Primary | Secondary | Avoid |
|---------------|---------|-----------|-------|
| Revenue / MRR / churn | business-core | product-core | full repo dump |
| Product scope / roadmap | product-core | business-core | all tests |
| Deploy / incident / CI | operational-core | technical-core | marketing docs |
| API / architecture / bugs | technical-core | operational-core | unrelated domains |

## SaaS profile

Add subcores: `revenue-core`, `paywall-core`, `billing-core`, `onboarding-core` — see `routing-map.json`.

## CLI

```bash
context-os route "Why did MRR drop?"
context-os eval route --questions context-os/eval/questions.json
```

## Examples

| Question | Route |
|----------|-------|
| Why did revenue drop? | **business-core** (+ product-core) |
| How do we deploy? | **operational-core** + technical-core |
| Stripe webhook failing | **billing-core** + technical-core (saas) |
| Improve onboarding | **onboarding-core** + product-core (saas) |
