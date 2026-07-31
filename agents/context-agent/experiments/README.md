# Experiments

Controlled experiments comparing Full Repository vs Context Core routing.

---

## Structure

```
experiments/
├── README.md              # This file
├── template/              # Blank experiment scaffold
├── mailagent/             # Phase 1 — measured + raw runs
├── django-rest-framework/ # Phase 2.1 — measured (summary only)
├── navorina/              # Phase 2.1 — measured + raw runs
└── oiloop/                # Phase 3 — measured + raw runs (private codebase)
```

---

## Phase 2.1 & 3 Results (summary)

| Project | Qs | B_acc | B_hall | C_hall | CCR_tokens | CCR_core | Raw run | Verified |
|---------|-----|-------|--------|--------|------------|----------|---------|----------|
| [MailAgent](mailagent/) | 45 | 1.67 | 17.8% | 22.2% | **8.3×** | 12.1× | [run-1781319187610](mailagent/runs/run-1781319187610/) | ✅ |
| [Django REST](django-rest-framework/) | 42 | 1.68 | 22% | 11% | **38×**† | — | summary only | ⚠️ |
| [Navorina](navorina/) | 42 | 1.19 | 19% | **7%** | **13.7×** | 14.6× | [run-1781143403051](navorina/runs/run-1781143403051/) | ✅ |
| [Oiloop](oiloop/) | 20 | 1.20 | 20% | 15% | **78×** | 109× | [run-1781354424217](oiloop/runs/run-1781354424217/) | ✅ |

† Django: measured in private workspace; export raw run pending.

Full reports: [context-os/evaluations/PHASE-2-RESULTS.md](../context-os/evaluations/PHASE-2-RESULTS.md), [context-os/evaluations/PHASE-3-RESULTS.md](../context-os/evaluations/PHASE-3-RESULTS.md)

---

## Running an Experiment

1. Copy `template/` to `experiments/{your-project}/`
2. Build cores using [prompts/build-context-os.md](../prompts/build-context-os.md)
3. Adapt eval harness from [MailAgent/context-os/eval](https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval)
4. Run A/B/C per [research/evaluation-framework.md](../research/evaluation-framework.md)
5. Export run → `experiments/{project}/runs/run-<id>/`
6. Publish `results.md`

---

## Phase Plan

| Phase | Subject | Status |
|-------|---------|--------|
| 1 | MailAgent | ✅ Published |
| 2.1 | Django REST, Navorina | ✅ Published |
| 3 | Oiloop (Private validation) | ✅ Published |

See [docs/research-roadmap.md](../docs/research-roadmap.md).
