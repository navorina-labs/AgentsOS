# Experiment Design

Controlled A/B experiment comparing Full Repository context vs Context Core routing.

---

## Research Question

Does routing questions to domain-oriented Context Cores produce better AI answers than providing the full repository?

---

## Design

### Within-Subjects Comparison

Each question Q in the evaluation set is answered under both conditions:

```
Condition A: Q → Full Repository → LLM → Answer_A
Condition B: Q → Router → Context Core(s) → LLM → Answer_B
```

Same model, temperature, and system prompt for both conditions. Only context differs.

---

## Procedure

### Step 1: Select Subject Project

Choose a project with:

- Sufficient complexity (multi-domain)
- Available ground truth (docs, metrics, experts)
- Public or consented for research use

Phase 1 subject: MailAgent (see [experiments/mailagent/](../experiments/mailagent/)).

### Step 2: Build Context Cores

1. Run entity extraction (manual, guided by templates)
2. Populate four primary cores + subcores
3. Validate cores against positive/negative question sets
4. Record core token counts

### Step 3: Prepare Full Repository Baseline

1. Collect all project artifacts (code, docs, configs, tests)
2. Fit maximum content into model context window
3. If repo exceeds window: use current industry practice (RAG over all files or truncation) and document method
4. Record baseline token count

### Step 4: Define Gold Standards

For each question in [questions.md](questions.md):

- Gold answer or answer criteria
- Correct core routing label
- Domain tag (business/product/technical/operational/mixed)

### Step 5: Run Experiments

For each Q (randomized order to reduce order effects):

1. Submit Q under Condition A → capture Answer_A, tokens, latency
2. Submit Q under Condition B → capture Answer_B, tokens, latency, routing decision
3. Store raw outputs

### Step 6: Evaluate

Blind rating by two raters on:

- Accuracy (0–3)
- Reasoning quality (1–5)
- Hallucination (yes/no)
- Completeness (0–2)

Plus automatic metrics: tokens, latency, CCR.

### Step 7: Analyze

- Paired comparison per question
- Breakdown by domain
- Routing error analysis for Condition B
- Statistical significance testing

---

## Controls

| Variable | Control |
|----------|---------|
| Model | Fixed (e.g., GPT-4o, Claude 3.5 — document version) |
| Temperature | 0 for reproducibility |
| System prompt | Identical across conditions |
| Question order | Randomized |
| Rater blinding | Raters do not know A vs B |
| Time | Cores and baseline prepared same week |

---

## Independent Variables

| Variable | Levels |
|----------|--------|
| Context condition | Full Repository (A), Context Core (B) |
| Question domain | Business, Product, Technical, Operational, Mixed |

---

## Dependent Variables

See [evaluation-framework.md](evaluation-framework.md):

- Accuracy
- Latency
- Context size / CCR
- Reasoning quality
- Hallucination rate
- Answer completeness

---

## Sample Size

Minimum 100 questions from [questions.md](questions.md):

- 25 Business
- 25 Product
- 25 Technical
- 25 Operational
- 25 Mixed

Power analysis: 100 paired questions detect Cohen's d = 0.3 at α = 0.05, power = 0.8.

---

## Routing Sub-Experiment

Before main experiment, evaluate router alone:

1. Submit questions to router (no LLM)
2. Compare selected cores to gold routing labels
3. Target: routing accuracy ≥ 90% before proceeding

If routing accuracy < 80%, refine rules in [context-os/router/](../context-os/router/) before main experiment.

---

## Ablation Studies (Optional)

| Ablation | Purpose |
|----------|---------|
| Single core vs composed | Mixed question handling |
| Core with sources vs without | Value of source pointers |
| Minimal vs verbose core | Minimality principle test |
| Router vs random core | Router contribution |

---

## Replication

Each phase (roadmap) repeats this design on a new subject project. Results meta-analyzed in paper.

---

## Ethics and Data

- No PII in published results
- Private project data stays private; only scores published
- Open-source subjects: link to public repo, not full context dumps in results
