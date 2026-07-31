# Django REST Framework — Re-run Protocol

Per-question artifacts for Phase 2.1 were lost from the private eval workspace. This document describes how to produce a full export (`paired.csv`, `results.json`, per-question MD).

## Prerequisites

1. Clone [django-rest-framework](https://github.com/encode/django-rest-framework) (~1.2M LOC)
2. Restore or rebuild 5 context cores (Serializers, Views, Auth, Routing, Config)
3. Restore 42-question bank with gold labels and `expected_cores`
4. Copy eval harness from MailAgent or Oiloop: `context-os/eval/`

## Run

```bash
export OPENAI_API_KEY=...
cd <drf-checkout>
node context-os/eval/run-eval.mjs \
  --condition abc \
  --router keyword \
  --out context-os/eval/results/run-drf-<timestamp>
node context-os/eval/aggregate.mjs context-os/eval/results/run-drf-<timestamp>
```

## Export to AI-Context-OS

```bash
# Copy to experiments/django-rest-framework/runs/run-drf-<id>/
# Include: SUMMARY.md, paired.csv, summary.json, results.json, run-meta.json, manifest.json
node research/bootstrap-ci.mjs experiments/django-rest-framework/runs/run-drf-<id>/paired.csv
```

Replace `run-drf-phase-2.1-aggregate/` (aggregate-only) with the full run.
