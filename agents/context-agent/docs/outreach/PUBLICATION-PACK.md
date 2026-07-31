# Publication pack — AI Context OS

**Repo:** https://github.com/navorina-labs/AI-Context-OS

**Image:** [phase-3-twitter-card.png](../../context-os/evaluations/phase-3-twitter-card.png)

**CLI:** `npx context-os init --profile saas` (after npm publish)

**Paper:** [papers/arxiv-paper.pdf](../../papers/arxiv-paper.pdf) · [arxiv-abstract.txt](../../papers/arxiv-abstract.txt)

**Honest limits (include in long posts):** exploratory study · LLM-as-judge · not conference-grade significance · Django aggregate-only export · author-rated blind pilot (n=10), not independent experts.

---

# Twitter / X

## Thread (EN) — 6 tweets

**Tweet 1** (attach `phase-3-twitter-card.png`)

```
We tested a simple idea for coding agents:

Don't dump the whole repo into the LLM.
Route the question → load 1–2 domain "context cores" → answer.

149 decision-scoped questions · 4 codebases · open protocol 👇
```

**Tweet 2**

```
Setup (A/B/C):
A = full repository (~40k–80k tokens)
B = routed domain cores (business, billing, workspace…)
C = graph retrieval

Model: gpt-4o-mini · LLM-as-judge (exploratory, not confirmatory)
```

**Tweet 3**

```
Results (descriptive):
• B ≥ A on accuracy — all 4 projects
• CCR_tokens: 8× (MailAgent) → 38× (Django REST)
• Oiloop (private macOS): B 2.75 vs A 0.75 in prod router, 0% hallucination

Graph (C) won on hallucination for 2 OSS projects — not universal.
```

**Tweet 4**

```
When to use what:
• Narrow domain + good router → B (cores)
• Hallucination-sensitive OSS → sometimes C (graph)
• Full repo dump → never as default

Hybrid core+graph lost to rich multi-core B on Oiloop cross-cutting Q.
```

**Tweet 5**

```
We shipped a CLI:

npx context-os init --profile saas

→ cores + keyword router in your repo
→ validate · route · stats (no API key)

github.com/navorina-labs/AI-Context-OS
```

**Tweet 6**

```
Methods preprint + raw runs:
github.com/navorina-labs/AI-Context-OS

Replicate or break it — issues welcome.

(Not claiming p<0.05 or expert panels — limitations in SYNTHESIS.md)
```

---

## Single posts (EN)

**Launch (280 chars)**

```
Context OS: route coding questions to domain cores instead of full-repo dumps.

149 Q · 4 codebases · up to 38× fewer API tokens · B ≥ A everywhere.

CLI: npx context-os init --profile saas

github.com/navorina-labs/AI-Context-OS
```

**arXiv (after ID)**

```
Preprint: Domain-Oriented Context Cores for decision-scoped LLM questions.

8–38× token compression · Oiloop B 2.75 vs A 0.75 · limitations upfront.

arxiv.org/abs/XXXX.XXXXX
github.com/navorina-labs/AI-Context-OS
```

**CLI hook**

```
One command to scaffold context cores for coding agents:

npx context-os init --name myapp --profile saas

validate · route · stats — no API key needed.
```

---

## Thread (RU) — 4 твита

**1** (+ картинка)

```
Проверили гипотезу для coding agents:

Не кидаем весь репозиторий в LLM.
Вопрос → router → 1–2 domain cores → ответ.

149 вопросов · 4 кодовые базы · открытый протокол 👇
```

**2**

```
B (domain cores) ≥ A (full repo) по accuracy на всех 4 проектах.
Токены: 8–38× меньше (CCR_tokens).

Oiloop (prod): B 2.75 vs A 0.75, hallucination 0%.

Исследование exploratory, judge = LLM — не p<0.05.
```

**3**

```
CLI для своего репо:

npx context-os init --profile saas

cores + router для AI-агентов.

github.com/navorina-labs/AI-Context-OS
```

**4**

```
Полные runs, paper, limitations — в репо.
Фидбек и replication welcome.
```

---

## Reply-твит (теги, отдельно)

```
Open replication — if you work on context routing / coding-agent context, would love feedback on the eval protocol.

github.com/navorina-labs/AI-Context-OS
```

Тегай только 2–4 аккаунта с реальной связью с темой. Не спамь в основном твите.

**Hashtags (опционально, 1–2):** `#ContextEngineering` `#LLM` `#CodingAgents` `#RAG`

---

# Hacker News — Show HN

**Title**

```
Show HN: Context OS – domain cores beat full-repo context (8–38× tokens, 149 questions)
```

**Body**

```
We built an open eval protocol + CLI around a simple pipeline:

  Question → Router → Context Core(s) → LLM

instead of dumping the entire repository into the prompt.

We ran within-subjects A/B/C experiments on 149 decision-scoped questions across four codebases (MailAgent, Django REST Framework, Navorina, and a private macOS app). Conditions:

- A: full repository context
- B: routed domain-oriented markdown "cores" (purpose, entities, invariants, exclusions)
- C: graph retrieval

Findings (exploratory; gpt-4o-mini; LLM-as-judge):

- B matched or beat A on mean accuracy on all four projects
- CCR_tokens (API input): 8× to 38× reduction vs A
- On our private app (Oiloop), production keyword routing reached B 2.75 vs A 0.75 with 0% judged hallucination
- Graph C helped hallucination on two OSS projects but was not the universal winner; hybrid core+graph did not beat multi-core B on cross-cutting questions

We release raw run exports (3/4 full; Django is aggregate-only), question banks, and a CLI:

  npx context-os init --profile saas

Repo: https://github.com/navorina-labs/AI-Context-OS

Happy to answer methodology questions. Limitations are documented in research/SYNTHESIS.md — this is not a confirmatory clinical trial; we do not claim independent expert rating at scale.
```

**First comment (post immediately)**

```
Author here. Quick links:

- Synthesis: https://github.com/navorina-labs/AI-Context-OS/blob/main/research/SYNTHESIS.md
- CLI: https://github.com/navorina-labs/AI-Context-OS/tree/main/packages/cli
- Example scaffold: https://github.com/navorina-labs/AI-Context-OS/tree/main/examples/scaffold-saas

Relevant prior art we are NOT claiming to replace: codebase RAG, GraphRAG, or IDE indexing — we optimize decision-scoped sufficiency, not entity connectivity.
```

---

# Reddit

## r/LocalLLaMA

**Title:** `[Project] Context OS – route to domain cores instead of full-repo prompts (8–38× tokens, open eval)`

**Body:**

```
I open-sourced an eval framework for a context strategy that isn't "more RAG chunks" but decision-domain routing:

1. Author markdown "cores" per domain (billing, product, ops…)
2. Keyword router picks 1–2 cores per question
3. LLM answers from ~6k tokens instead of ~40k–80k

Measured on 149 questions / 4 repos (gpt-4o-mini, LLM judge). B (cores) ≥ A (full repo) on accuracy everywhere; up to 38× fewer API input tokens.

CLI scaffolds this into any repo:
npx context-os init --profile saas

https://github.com/navorina-labs/AI-Context-OS

Caveats: exploratory study, LLM-as-judge, not statistically confirmatory. Graph retrieval won on hallucination for 2/4 projects — YMMV.
```

## r/MachineLearning

**Title:** `[P] Domain-Oriented Context Cores – exploratory A/B/C on 149 SE decision questions (open replication)`

**Body:** Use arXiv abstract from `papers/arxiv-abstract.txt` + link to repo. Lead with limitations in first paragraph.

---

# LinkedIn

## EN

```
Most coding agents still default to "load the whole repository."

We tested whether decision-domain context cores do better on scoped questions.

149 questions · 4 codebases · A/B/C (full repo vs routed cores vs graph)

Key results (exploratory):
→ Domain cores: 8–38× fewer API tokens
→ Accuracy: cores ≥ full repo on all four projects
→ Production routing on a private macOS app: 2.75 vs 0.75 (judge scale 0–3)

We open-sourced the protocol, raw runs, and a CLI to scaffold cores in your repo.

GitHub: https://github.com/navorina-labs/AI-Context-OS

Not a peer-reviewed confirmatory study — LLM-as-judge, limitations documented. Feedback from teams building agent context welcome.
```

Attach: `phase-3-twitter-card.png`

## RU

```
Coding agents часто грузят весь репозиторий в контекст.

Мы проверили альтернативу: domain cores — сжатые markdown-слои по зонам ответственности (billing, product, ops) + router до вызова LLM.

149 вопросов · 4 кодовые базы · открытый протокол и raw runs.

Итог (exploratory): до 38× меньше API-токенов, accuracy cores ≥ full repo на всех проектах.

CLI для своего репо: github.com/navorina-labs/AI-Context-OS

Ограничения честно в SYNTHESIS.md — не claim на p-value и независимых экспертов.
```

---

# Dev.to / blog article

**Title:** `We Measured Full-Repo vs Domain Cores for Coding Agents (149 Questions, 4 Codebases)`

**Tags:** `ai`, `llm`, `opensource`, `programming`

**Cover:** `phase-3-twitter-card.png`

---

## Full article (copy-paste to Dev.to)

### The problem

Coding agents increasingly receive **entire repositories** as context. More tokens does not always mean better answers on **narrow, decision-scoped** questions ("How does Stripe webhook handling work?" does not need your CSS).

### The idea: Context OS

Instead of files or entity graphs, we model **decision domains**:

```
Question → Router → Context Core(s) → LLM
```

A **Context Core** is a bounded markdown artifact: purpose, key entities, invariants, exclusions, and pointers to sources — not raw code dumps.

### What we measured

- **149 questions** across MailAgent, Django REST Framework, Navorina, and Oiloop (private macOS)
- **Conditions:** A = full repo, B = routed cores, C = graph retrieval
- **Model:** gpt-4o-mini · **Judge:** same model (exploratory protocol)

### Results (descriptive)

| Project | B vs A | CCR_tokens | Prod default |
|---------|--------|------------|--------------|
| MailAgent | +21% | 8× | B |
| Django REST | +24% | 38× | C (lower hallucination) |
| Navorina | +19% | 14× | C |
| Oiloop | B 2.75 vs A 0.75 | ~12× | B |

**Takeaways:**

1. Full-repo (A) is a baseline, not a production default.
2. Token savings are consistent (8–38×).
3. Graph (C) is not universally better — it helped hallucination on two OSS projects; on Oiloop, rich multi-core B won.
4. **Core quality matters** — expanding core metadata moved Oiloop B from 1.20 → 2.70 in Phase 3.1.

### Try it: CLI

```bash
git clone https://github.com/navorina-labs/AI-Context-OS
cd AI-Context-OS
npm run context-os -- init --name myapp --profile saas --target ~/Projects/MyApp
```

Commands: `validate`, `route "question"`, `stats "question"`, `eval route` (routing F1, no API key).

### Limitations (read this)

- LLM-as-judge; not independent human raters at scale
- Exploratory multi-case study — we do **not** claim statistical significance on the full bank
- Django export is aggregate-only (no per-question CSV in repo)
- Author-rated blind pilot: 70% B-preferred, 30% equal (n=10)

### Links

- Repo: https://github.com/navorina-labs/AI-Context-OS
- Synthesis: https://github.com/navorina-labs/AI-Context-OS/blob/main/research/SYNTHESIS.md
- Paper draft: https://github.com/navorina-labs/AI-Context-OS/tree/main/papers

---

# Product Hunt

**Name:** Context OS

**Tagline:** Route coding questions to domain cores — not the whole repo

**Description:**

```
Context OS is an open research framework + CLI for AI coding agents.

Instead of dumping your entire repository into the LLM, you author decision-domain "cores" (billing, product, ops) and a keyword router loads 1–2 cores per question.

We measured 149 questions across 4 codebases:
• Up to 38× fewer API tokens
• Domain cores ≥ full-repo accuracy (descriptive)

Ships: eval protocol, raw runs, and `npx context-os init` for coding agents.

Exploratory study — limitations documented.
```

**Link:** https://github.com/navorina-labs/AI-Context-OS

**Gallery:** phase-3-twitter-card.png + screenshot of `context-os route` terminal output

---

# Bluesky / Mastodon

```
Open eval: domain context cores vs full-repo dumps for coding agents.

149 Q · 4 repos · up to 38× fewer tokens · B ≥ A on accuracy (exploratory).

CLI + raw runs: github.com/navorina-labs/AI-Context-OS

#ContextEngineering #FOSS #LLM
```

---

# GitHub Release (v0.1.0)

**Title:** `v0.1.0 — Context OS CLI + Phase 3.1 results`

**Body:**

```
## Highlights

- context-os CLI: init · route · validate · stats · eval route
- Phase 3.1 Oiloop: B 2.75 vs A 0.75 (prod router, 0% hallucination)
- Open eval across 4 codebases (149 questions)
- examples/scaffold-saas reference instance

## Install

npm run context-os -- init --help
# or after npm publish: npx context-os init --profile saas

## Paper

papers/arxiv-paper.pdf (methods preprint)

## Cite

See research/SYNTHESIS.md
```

**Assets:** `arxiv-paper.pdf`, `phase-3-twitter-card.png`

---

# Zenodo (metadata)

**Title:** Domain-Oriented Context Cores — AI Context OS evaluation bundle v0.1.0

**Description:** Exploratory A/B/C evaluation of domain-oriented context cores vs full-repository and graph retrieval on 149 decision-scoped software engineering questions. Includes raw run exports, CLI, and methods preprint PDF.

**Keywords:** context engineering, LLM, software engineering, coding agents, RAG

---

# Publication schedule (suggested)

| Day | Action |
|-----|--------|
| D0 | arXiv submit + GitHub Release v0.1.0 |
| D0 | Twitter thread + LinkedIn |
| D1 | Hacker News Show HN (Tue–Thu, 9–11am US ET) |
| D2 | Dev.to article |
| D3 | Reddit r/LocalLLaMA or r/MachineLearning |
| D+7 | Product Hunt (if npm published) |

---

# Asset checklist

- [ ] `context-os/evaluations/phase-3-twitter-card.png`
- [ ] `papers/arxiv-paper.pdf`
- [ ] Terminal screenshot: `context-os route "Stripe webhook failed"`
- [ ] arXiv ID (when live) — replace `XXXX.XXXXX` everywhere
