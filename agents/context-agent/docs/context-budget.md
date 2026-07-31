# Routed Context Budget

Context OS controls context size at the routing boundary. A project should not
pass its quality gate merely because the average route is small: every
evaluated route must fit the configured budget.

## Gate

`context-os check` applies a default maximum of 2,000 estimated tokens to each
question in `context-os/eval/questions.json`.

```bash
context-os check --max-route-tokens 2000
context-os check --min-score 85 --max-route-tokens 1200
```

The estimate uses the same deterministic approximation as dry-run evaluation.
It is a regression signal, not provider billing data. Tokenizers differ between
models, so projects should leave headroom below the model-specific limit.

An over-budget result identifies:

- the eval question;
- estimated routed tokens;
- selected cores;
- the configured limit.

Reduce a route by tightening core scope, splitting an overloaded core, removing
duplicated material, or routing to fewer secondary cores. Do not raise the
budget until the larger context is justified by an eval case.

## Framework Levels

The Verified maturity level requires:

- every core score at least 75;
- at least one non-empty dry-run question;
- no zero-context questions;
- no route above 2,000 estimated tokens;
- a baseline manifest.

Production projects may enforce a lower budget through `check`. The maturity
threshold remains stable so maturity results are comparable across projects.
