# Context OS Templates

Reference implementation of AI Context OS as **documentation artifacts** — not executable code.

---

## Contents

| Directory | Purpose |
|-----------|---------|
| [cores/](cores/) | Primary core templates (Business, Product, Technical, Operational) |
| [subcores/](subcores/) | Refined subcore templates |
| [router/](router/) | Routing rules and examples |
| [audit/](audit/) | Project mapping, cleanup, risk templates |
| [evaluations/](evaluations/) | Phase 2 results, per-project reports, private applied instances |

---

## Phase 2 Results (2026-06-11)

**[PHASE-2-RESULTS.md](evaluations/PHASE-2-RESULTS.md)** — 3 projects, 119 questions, A/B/C comparison.

| Project | Status | Report |
|---------|--------|--------|
| MailAgent | Measured | [mailagent-phase-2.1.md](evaluations/mailagent-phase-2.1.md) |
| Django REST | Measured | [django-phase-2.1.md](evaluations/django-phase-2.1.md) |
| Navorina | Measured | [navorina-phase-2.1.md](evaluations/navorina-phase-2.1.md) |

---

## Usage

1. Copy templates to `experiments/{your-project}/cores/`
2. Fill using prompts in [prompts/](../prompts/)
3. Validate against [research/questions.md](../research/questions.md)
4. Optional: export JSON matching [schemas/core.schema.json](../schemas/core.schema.json)

---

## Versioning

Cores are versioned independently from the codebase:

```
business-core v1.2.0 — updated after pricing change
technical-core v2.0.0 — updated after architecture migration
```

Tag in core metadata. Audit monthly or after major project changes.

---

## Not Included (in research repo)

- Hosted SaaS runtime
- Automatic git sync

**CLI scaffold** lives in [packages/cli](../packages/cli) (`context-os init`, `route`, `validate`).
