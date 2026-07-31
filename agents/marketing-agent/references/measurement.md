# Marketing measurement

Use this reference for KPI trees, analytics plans, experiments, forecasts, and reporting.

## Metric hierarchy

Start with a business outcome, then work backward:

```text
business outcome
  -> customer value event
    -> funnel transition
      -> controllable leading indicator
        -> delivery diagnostic
```

Examples:

- retained revenue -> retained paid account -> activation rate -> qualified onboarding completion -> onboarding errors;
- qualified pipeline -> accepted opportunity -> demo-to-opportunity rate -> qualified demo requests -> landing-page form failures;
- organic customer value -> organic conversion -> qualified organic visit -> target-page impressions -> crawl/index coverage.

## Definitions

- **Conversion rate:** conversions / eligible opportunities. Define both numerator and denominator.
- **Activation rate:** users reaching a product-specific first-value event / eligible new users.
- **Retention:** cohort members still performing the retained-value behavior after a stated interval.
- **CAC:** attributable acquisition spend / acquired customers. State included labor and channel costs.
- **Payback:** acquisition cost / periodic gross profit from the acquired cohort.
- **Incremental lift:** outcome with treatment minus estimated outcome without treatment.

Never mix users, sessions, accounts, and events in one metric without an explicit model.

## Baseline and target

Before setting a target, record:

- current value and period;
- unit of analysis;
- source and query definition;
- segmentation;
- seasonality or known interventions;
- data completeness and attribution limits.

If no baseline exists, the first deliverable is instrumentation and a measurement window—not an arbitrary percentage target.

## Experiment decisions

Specify:

- hypothesis and expected mechanism;
- primary metric and no more than two guardrails;
- population, exposure, and contamination risks;
- minimum detectable effect or practical decision threshold;
- sample-size and runtime rationale;
- stopping rule;
- interpretation for positive, neutral, and harmful outcomes.

Avoid repeated peeking and post-hoc metric switching. If controlled testing is infeasible, use a clearly labeled observational design and report alternative explanations.

## Forecasts

Express forecasts as scenarios:

```text
qualified opportunities x conversion rate x value per conversion
```

Show source, range, and sensitivity for every input. The output is a planning model, not a promise.
