# Prompt: Oiloop Phase 3.1 Eval (copy-paste для агента)

Follow-up eval после pilot run-1781658621476. Цель: replication + Condition D + production router.

---

## Copy-paste block

```
Ты работаешь в репозитории Oiloop. Задача — Phase 3.1 eval для AI Context OS.

## Контекст

Phase 3 canonical (20 Q): run-1781354424217 — B 1.20 vs A 1.00, C 1.55.
Pilot (10 Q, expanded cores): run-1781658621476 — B 2.10 vs A 0.50, C 2.40.

Гипотеза v2: docs/hypothesis.md (AI-Context-OS repo)
Core fixes: experiments/oiloop/core-fixes-OL05-OL07.md
Методология: research/evaluation-framework.md

## Цели Phase 3.1

| # | Гипотеза | Как проверить |
|---|----------|---------------|
| 1 | H₁g — expanded cores поднимают B на 20 Q | A/B/C на OL01–OL20 с обновлёнными cores |
| 2 | H₁f — hybrid D ≥ C на cross-cutting | Condition D на OL05, OL07, OL09 (+ OL11, OL16, OL20 если cross-cutting) |
| 3 | H₁h — production router ≈ gold | Два прогона B: gold expected_cores vs live ContextRouter.swift |

## Условия

| Condition | Context |
|-----------|---------|
| **A** | Full repo baseline (400k chars cap) |
| **B** | Routed core(s) — gold или production router |
| **C** | Hermes-style graph retrieval |
| **D** | Primary routed core(s) + graph supplement (top-k subgraph, cap ≤15k chars) |

Model: **gpt-4o-mini** · Judge: LLM-as-judge · Temperature: frozen across conditions.

## Pre-run checklist

- [ ] Применить правки из core-fixes-OL05-OL07.md в Resources/cores/ (private repo)
- [ ] Bump core version (workspace-core → 1.1.0)
- [ ] Зафиксировать oiloop commit hash в run-meta.json
- [ ] Condition D builder реализован или адаптирован из eval harness
- [ ] Question bank: 20 Q (OL01–OL20), gold_answer актуален
- [ ] Stratified tags на каждый вопрос: `single-domain` | `cross-cutting`

## Stratified question tags (required)

| ID | Tag | expected_cores |
|----|-----|----------------|
| OL01–OL04 | single-domain | personal-core |
| OL05, OL06, OL08 | single-domain | workspace-core |
| OL07 | cross-cutting | workspace-core + personal-core |
| OL09 | cross-cutting | communication-core + system-control-core |
| OL10 | single-domain | communication-core |
| OL11–OL20 | (verify per routing-map) | … |

## Run matrix

### Run 1 — Replication (primary)

- Questions: **20**
- Conditions: **A, B, C**
- Router: **gold** (expected_cores)
- Cores: **expanded v1.1**

**Success criteria (descriptive):**
- B accuracy ≥ 1.50 (vs canonical 1.20)
- B accuracy ≥ A on ≥ 15/20 questions
- CCR_tokens ≥ 5×
- hypothesis_supported: true

### Run 2 — Hybrid ablation

- Questions: **cross-cutting only** (OL07, OL09 + others tagged cross-cutting)
- Conditions: **B, C, D**
- Router: gold

**Success criteria for H₁f:**
- D accuracy ≥ C accuracy on ≥ 60% cross-cutting Q
- D tokens ≤ 1.5× B tokens (mean)

### Run 3 — Production router (optional, same week)

- Questions: **20**
- Conditions: **B only**
- Router: **live ContextRouter.swift** (no gold override)

**Success criteria for H₁h:**
- Production F1 ≥ 0.85
- B_prod accuracy ≥ 0.80 × B_gold accuracy (Run 1)

## Commands (Oiloop repo)

See `Oiloop/context-os/eval/RUN-PHASE-3.1-NEXT.md` for copy-paste commands.

### Run 3 — Production router (H₁h)

```bash
cd /Users/alex0nder/Projects/Oiloop
node context-os/eval/run-eval.mjs \
  --condition b \
  --router keyword \
  --out context-os/eval/results/run-prod-router-$(date +%s)
node context-os/eval/aggregate.mjs context-os/eval/results/run-prod-router-<id>
```

### Run 2 — Hybrid ablation (H₁f)

```bash
node context-os/eval/run-eval.mjs \
  --filter cross-cutting \
  --condition bcd \
  --router gold \
  --out context-os/eval/results/run-hybrid-$(date +%s)
node context-os/eval/aggregate.mjs context-os/eval/results/run-hybrid-<id>
```

### Condition D flags

| Flag | Meaning |
|------|---------|
| `--condition d` | Hybrid only |
| `--condition bcd` | B + C + D |
| `--condition abcd` | Full matrix |
| `--filter cross-cutting` | 2+ expected_cores |

Legacy reference:

```bash
# Graph index (for C and D)
node context-os/eval/build-graph-index.mjs
```

## Export → public repo

После каждого run:

```bash
# Copy bundle to AI-Context-OS
cp -r context-os/eval/results/run-<id>/* \
  ../AI-Context-OS/experiments/oiloop/runs/run-<id>/
```

Обязательные файлы: SUMMARY.md, paired.csv, summary.json, results.json, manifest.json, run-meta.json, ABC-COMPARE.md.

## Reporting (post-run)

1. Обновить `Oiloop/docs/OILOOP-EXPERIMENT-RESULTS.md`
2. Export в AI-Context-OS/experiments/oiloop/runs/
3. Если Run 1 B ≥ 1.50 на 20 Q — обновить canonical в PHASE-3-RESULTS.md
4. Stratified table: accuracy/hallucination отдельно для single-domain vs cross-cutting
5. Не перезаписывать run-1781354424217 — новый run id

## Limitations (disclose)

- LLM-as-judge (not human κ)
- Private codebase
- D graph supplement size is a tunable hyperparameter — record in run-meta.json
```

---

## Cross-Reference

- Hypothesis v2: [docs/hypothesis.md](../docs/hypothesis.md)
- Core fixes: [experiments/oiloop/core-fixes-OL05-OL07.md](../experiments/oiloop/core-fixes-OL05-OL07.md)
- Canonical run: [run-1781354424217](../experiments/oiloop/runs/run-1781354424217/)
- Pilot run: [run-1781658621476](../experiments/oiloop/runs/run-1781658621476/)
