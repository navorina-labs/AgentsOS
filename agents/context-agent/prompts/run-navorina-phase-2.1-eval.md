# Prompt: Navorina Phase 2.1 Eval (copy-paste для агента)

Handoff-промпт для запуска formal A/B/C eval в репозитории **Navorina**.  
Инфраструктура Context OS уже есть — задача: прогон, gold answers, экспорт результатов.

---

## Copy-paste block (начало)

```
Ты работаешь в репозитории Navorina. Задача — formal Phase 2.1 eval для AI Context OS.

## Контекст

Navorina — третий проект в cross-project validation (Phase 2). MailAgent и Django REST уже measured. Navorina — infrastructure ready, eval pending. Все est.* нужно заменить на measured.

Методология: https://github.com/navorina-labs/AI-Context-OS/blob/main/research/evaluation-framework.md
Сводка Phase 2: https://github.com/navorina-labs/AI-Context-OS/blob/main/context-os/evaluations/PHASE-2-RESULTS.md
Navorina spec: https://github.com/navorina-labs/AI-Context-OS/blob/main/context-os/evaluations/navorina-phase-2.1.md
Question bank (42 Q): https://github.com/navorina-labs/AI-Context-OS/blob/main/context-os/evaluations/navorina-questions.json
Референс harness: https://github.com/Alex0nder/MailAgent/tree/main/context-os/eval

## Профиль проекта (измерено)

| Поле | Значение |
|------|----------|
| Codebase | ~270k LOC (~162k ts/js + ~106k html/css) |
| Cores | 11 (4 primary + 7 subcores, manifest.json) |
| Router routes | 14 (routing-map.json) |
| Context OS | 69 KB / ~1.6k lines |
| Typical B payload | ~625 tokens (router + 1 core + Sources) |
| Legacy A payload | ~122 KB (AGENTS.md + Hub + PRD + Roadmap + DS + UX + Component map) |
| Ожидаемый default | C + semantic (не B как MailAgent) |

## Условия A/B/C (тот же протокол, что MailAgent/DRF)

| Condition | Что подаётся в LLM |
|-----------|-------------------|
| **A** | Full repo baseline: AGENTS.md + Hub + PRD + Roadmap + DS + UX + Component map (~30.5k tokens est.) |
| **B** | Routed context cores: semantic router → primary core + secondary cores + Sources (~625 tokens est.) |
| **C** | Hermes-style graph retrieval + core supplement (~5.2k tokens est.) |

Model: **gpt-4o-mini** (как MailAgent run-1781075014160). Judge: LLM-as-judge (0–3 accuracy, hallucination flag).

## Задачи (по порядку)

### 1. Сверить question bank с routing-map.json

Скопируй question bank из AI-Context-OS:
`context-os/evaluations/navorina-questions.json` → `context-os/eval/questions.json`

Для каждого из 42 вопросов:
- Проверь `expected_cores` против реальных routes в `routing-map.json`
- Исправь core IDs если не совпадают (crypto_payments, nucleus, paywall и т.д.)
- Добавь `gold_answer` — краткий эталонный ответ из docs/code (обязательно для judge)

Кластеры (42 Q):
- revenue/paywall/billing — 9
- nucleus/FM — 12
- assistant/AI — 4
- release/ops — 6
- product/onboarding — 6
- cross-cutting — 5

### 2. Подготовить harness (если ещё нет)

Скопируй или адаптируй из MailAgent `context-os/eval/`:
- `run-eval.ts` / npm scripts
- A/B/C context builders
- graph index builder (для C)
- aggregate + export scripts

Проверь npm scripts:
```bash
npm run eval:context-os:graph-build   # для C
npm run eval:context-os               # A/B/C run
npm run eval:context-os:aggregate -- context-os/eval/results/run-<id>
npm run eval:context-os:export -- context-os/eval/results/run-<id>
```

### 3. Прогнать eval

- 42 вопроса × 3 conditions = 126 runs
- B: два режима router — keyword F1 и semantic F1 (отдельно логировать)
- Зафиксировать: accuracy, hallucination%, input tokens, cost, latency per condition

### 4. Собрать метрики

Обязательный output:

```
accuracy_A, accuracy_B, accuracy_C
cost_A, cost_B, cost_C
hallucination_A, hallucination_B, hallucination_C
tokens_A, tokens_B, tokens_C
compression_A_over_B
router_f1_keyword, router_f1_semantic
num_questions: 42
num_cores: 11
key_finding: (one sentence)
```

### 5. Экспорт в AI-Context-OS

```bash
npm run eval:context-os:export -- context-os/eval/results/run-<id>
cp -R context-os/eval/export/run-<id> \
  ../AI-Context-OS/experiments/navorina/runs/
```

Создай `experiments/navorina/results.md` по образцу MailAgent.

## Риски — проверь до прогона

1. **AGENTS.md (15 KB)** — убедись что A baseline не тянет устаревшие ops; если тянет — зафиксируй в limitations
2. **crypto_payments route** — тянет 3 secondary cores; проверь keyword F1 отдельно
3. **emulator ≠ prod** — вопросы release/ops могут галлюцинировать на B
4. **doc sprawl** — 142 md + roadmap 43 KB; formal compression может быть < 30×, не 49×

## Ожидаемые гипотезы (проверить, не подгонять)

| Метрика | Estimate | Что подтвердит/опровергнет |
|---------|----------|---------------------------|
| B_acc > A_acc | +20% | Гипотеза cores |
| B_hall | ~26% | Cross-cutting tax |
| C_hall < B_hall | ~13% vs 26% | C как production default |
| semantic F1 | ~0.86 | Router load-bearing |
| keyword F1 | ~0.74 | Bilingual routes penalty |

## Deliverables

1. `context-os/eval/questions.json` — 42 Q с gold answers и expected_cores
2. `context-os/eval/results/run-<id>/` — полный run (A/B/C per question)
3. `ABC-COMPARE.md` + `summary.json` + `tokens-summary.json`
4. Handoff summary в формате:

```
Project: Navorina
Phase: 2.1
accuracy_A: X.XX | accuracy_B: X.XX | accuracy_C: X.XX
cost_A: $X.XX | cost_B: $X.XX | cost_C: $X.XX
hallucination_A: X% | hallucination_B: X% | hallucination_C: X%
router_f1: X.XX (keyword) | X.XX (semantic)
compression: Xx
key_finding: ...
```

5. PR или commit с результатами + ссылка на run folder

## Не делать

- Не менять cores/routing во время eval (freeze snapshot)
- Не подгонять gold answers под ответы модели
- Не смешивать B gold-router и B production-router в одной метрике без пометки
- Не публиковать est.* как measured

Начни с шага 1: прочитай routing-map.json и manifest.json, сверь с navorina-questions.json, покажи diff expected_cores до прогона.
```

---

## Copy-paste block (конец)

---

## Быстрый вариант (если harness уже есть)

```
Navorina Phase 2.1 eval. 42 questions, A/B/C, gpt-4o-mini.

Question bank: AI-Context-OS/context-os/evaluations/navorina-questions.json
Сверь expected_cores с routing-map.json, добавь gold_answer на каждый вопрос.

Прогон → aggregate → export. Верни:
accuracy_A/B/C, cost_A/B/C, halluc_A/B/C, tokens, compression, router F1 (keyword + semantic), key_finding.

Ожидание: C лучше B по hallucination; B лучше A по accuracy/cost. Cross-cutting cluster — главный failure mode.
```

---

## После eval (для AI-Context-OS repo)

Агент в AI-Context-OS должен:

1. Обновить `context-os/evaluations/navorina-phase-2.1.md` — убрать `est.*`
2. Обновить Table 1 в `PHASE-2-RESULTS.md`
3. Создать `experiments/navorina/runs/run-<id>/` с артефактами
4. Создать `experiments/navorina/results.md`

---

## Ссылки

| Resource | Path |
|----------|------|
| Phase 2 report | [context-os/evaluations/PHASE-2-RESULTS.md](../context-os/evaluations/PHASE-2-RESULTS.md) |
| Navorina spec | [context-os/evaluations/navorina-phase-2.1.md](../context-os/evaluations/navorina-phase-2.1.md) |
| Question bank | [context-os/evaluations/navorina-questions.json](../context-os/evaluations/navorina-questions.json) |
| MailAgent reference run | [experiments/mailagent/runs/run-1781075014160/](../experiments/mailagent/runs/run-1781075014160/) |
| Eval framework | [research/evaluation-framework.md](../research/evaluation-framework.md) |
