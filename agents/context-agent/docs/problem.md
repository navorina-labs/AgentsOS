# Problem Statement

## The Context Overload Problem

AI coding and reasoning systems increasingly receive **entire project artifacts** as context:

- Documentation (README, ADRs, wikis)
- Source code (all languages, all modules)
- Tests (unit, integration, e2e)
- Configuration (env, Docker, CI/CD, Terraform)
- Logs and metrics
- Issue trackers and PR history

The implicit assumption: **more context → better answers**.

---

## A Concrete Failure Mode

**Question:** "Revenue dropped last week. What happened?"

**What the question requires:**

- Revenue metrics and trends
- Pricing and billing events
- Customer cohort changes
- Recent product or paywall changes affecting conversion
- Known incidents affecting payments

**What full-repository context typically includes:**

- CSS and styling code
- Docker Compose files
- UI component tests
- Linting configuration
- Unrelated feature branches
- Infrastructure for dev environments

**Result:** The model may:

- Cite irrelevant files (e.g., a CSS change as "the cause")
- Miss the actual billing webhook failure buried in logs
- Hallucinate connections between unrelated domains
- Produce confident but wrong causal chains
- Consume tokens on noise

---

## Root Cause Analysis

### 1. No Responsibility Boundaries

Files do not map to decisions. A `styles/` folder has no relationship to revenue analysis, yet it occupies the same context window as `billing/webhooks.ts`.

### 2. Attention Dilution

Transformer attention spreads across all tokens. Irrelevant tokens compete with relevant ones. Critical signals (e.g., "Stripe webhook disabled on Tuesday") lose salience.

### 3. False Relevance

Models infer patterns from co-occurrence. If billing code and UI code appear together in context, the model may incorrectly link them causally.

### 4. Conflicting Decision Frames

The same artifact supports multiple decision types:

| Artifact | Business decision | Technical decision |
|----------|--------------------|--------------------|
| Pricing page | Conversion optimization | Component refactor |
| API endpoint | Feature availability | Rate limiting design |
| Database schema | Data product definition | Migration strategy |

Without routing, the model does not know which frame applies.

### 5. Cost and Latency

Larger context increases:

- Input token cost
- Time to first token
- Cache miss rates

Without proportional quality improvement.

---

## Why Window Size Is Not the Solution

Expanding context windows (128K, 1M tokens) does not solve boundary absence. It enables **more noise**, not **better signal selection**.

The problem is **structural**, not **capacity**.

---

## Proposed Direction

Instead of asking "how do we fit more context?", ask:

> "What is the minimal context sufficient for this specific decision?"

AI Context OS formalizes this through Context Cores and a Router that selects boundaries before reasoning.

See [hypothesis.md](hypothesis.md) and [principles.md](principles.md).
