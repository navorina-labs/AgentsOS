# Prompt: Build Context OS for a Project

Use this prompt to manually build a complete Context OS for a subject project. No engine — human or LLM-assisted curation only.

---

## System

You are building a research Context OS for the project `{PROJECT_NAME}`.

Follow AI Context OS principles:
1. Minimal Context — only decision-relevant facts
2. Domain Boundaries — explicit in/out of scope per core
3. Decision-Centric — organize around decisions, not files
4. Router First — define routing before populating cores
5. Context Compression — summarize, pointer not paste

Do NOT include full source code. Reference file paths only.

---

## Input

Provide:
- Project name and one-line description
- Repository URL or local path
- Available artifacts: README, docs, ADRs, dashboards, runbooks
- Primary business model (SaaS, OSS, internal tool, etc.)

---

## Task

### Step 1: Project Map

Fill [context-os/audit/project-map.template.md](../context-os/audit/project-map.template.md):
- List domains present (business, product, technical, operational)
- Identify subcores needed
- Note gaps in available documentation

### Step 2: Build Primary Cores

For each of Business, Product, Technical, Operational:
1. Copy template from `context-os/cores/`
2. Run domain-specific build prompt (see `prompts/build-*-core.md`)
3. Validate against 10 questions from [research/questions.md](../research/questions.md)
4. Estimate token count

### Step 3: Build Subcores

Based on project map, create subcores:
- Revenue, Paywall, Billing (if monetized)
- Onboarding (if user-facing)
- Others as needed

### Step 4: Define Routing Rules

1. Copy [context-os/router/routing-rules.md](../context-os/router/routing-rules.md) structure
2. Add project-specific rules
3. Test against full question bank routing labels

### Step 5: Audit

Fill:
- [context-os/audit/cleanup.template.md](../context-os/audit/cleanup.template.md)
- [context-os/audit/risks.template.md](../context-os/audit/risks.template.md)

### Step 6: Measure Compression

```
CCR = tokens(full_repo_snapshot) / tokens(all_cores_combined)
```

Target: CCR ≥ 5×. Document actual ratio.

---

## Output

```
context-os/
  cores/
    {project}-business-core.md
    {project}-product-core.md
    {project}-technical-core.md
    {project}-operational-core.md
  subcores/
    ...
  router/
    {project}-routing-rules.md
```

Plus experiment README in `experiments/{project}/`.

---

## Quality Checklist

- [ ] Each core has explicit out-of-scope section
- [ ] No full file contents embedded
- [ ] Decision history included where available
- [ ] Routing covers all 125 benchmark questions
- [ ] Token estimate per core documented
- [ ] Schema-valid JSON export optional
