# Minimal Context Principle

**Use the minimum context sufficient for the decision at hand.**

---

## Statement

For a question Q and decision domain D, the context C provided to the LLM should satisfy:

1. **Sufficiency:** C enables a correct answer to Q
2. **Minimality:** No proper subset of C enables a correct answer to Q
3. **Boundedness:** |C| << |FullProject| for scoped questions

---

## Sufficiency ≠ Completeness

| Completeness | Sufficiency |
|--------------|-------------|
| Everything about the project | Everything needed for this decision |
| Maximizes information | Minimizes noise |
| Exploration mode | Decision mode |

A sufficient context for "why did revenue drop?" does not need to be complete regarding the codebase.

---

## Measuring Minimality

### Context Compression Ratio (CCR)

```
CCR = tokens(FullRepository) / tokens(ContextCore)
```

Target for scoped questions: CCR ≥ 5× (hypothesis; measured 14–83× across Phase 2–3 projects — see [experiments/README.md](../experiments/README.md)).

### Ablation Test

1. Answer Q with full core C
2. Remove one section at a time
3. If answer quality drops, section was necessary
4. If quality unchanged, section was redundant

Repeat until minimal C* is found.

### Negative Token Test

Add irrelevant tokens (random files) to C and measure quality degradation. Confirms that minimality matters, not just absolute size.

---

## Practical Guidelines

### Include

- Decision-relevant facts and invariants
- Recent changes affecting the domain
- Authoritative source pointers
- Explicit unknowns ("we do not track X")

### Exclude

- Implementation code (unless Q is implementation-specific)
- Tests (unless Q is about test strategy)
- Unrelated feature documentation
- Full config files (summarize instead)
- Historical noise (old decisions superseded)

### Compress

- "Uses PostgreSQL 15 with 12 tables" not full schema dump
- "Stripe webhooks: invoice.paid, customer.subscription.deleted" not handler source
- "Deploy: GitHub Actions → ECS, ~8 min" not full pipeline YAML

---

## Failure Modes of Over-Context

1. **Attention competition** — relevant tokens diluted
2. **False correlation** — model links unrelated co-occurring facts
3. **Confidence inflation** — model cites irrelevant sources confidently
4. **Cost** — linear token cost for sublinear quality gain

---

## Relation to Other Principles

- **Domain Boundary** defines what minimality applies to
- **Decision-Centric** defines what "sufficient" means
- **Router First** ensures minimality is applied per-question, not globally
- **Compression** maintains minimality over time as project grows
