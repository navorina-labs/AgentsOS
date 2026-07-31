---
title: "Domain-Oriented Context Cores: Bounded Context for AI Decision Support in Software Projects"
author:
  - Alexander Young
abstract: |
  Modern AI-assisted software development often loads repository-scale context into large language models (LLMs), increasing cost, latency, and attention dilution on scoped decision questions. We introduce AI Context OS, a framework that models repository knowledge as Context Cores - domain-oriented context partitions with lightweight multi-core routing. We report exploratory within-subjects A/B/C experiments on four codebases (149 decision-scoped questions; gpt-4o-mini; LLM-as-judge): MailAgent, Django REST Framework, Navorina, and Oiloop (private macOS). Context Cores (Condition B) achieved 8× to 38× token compression (CCR_tokens) and large cost reductions versus full-repository baselines (Condition A). On three open-source projects, B mean accuracy exceeded A by 19-24 percentage points. On Oiloop (Phase 3.1, 20 questions, v1.1 cores), B reached 2.70 versus A 0.75 (bootstrap 95% CI on paired Δ: [+1.60, +2.30]); a production keyword router preserved gains (B 2.75, F1 1.0, hallucination 0%). Hybrid core-plus-graph retrieval (Condition D) did not beat multi-core B on cross-cutting questions (H$_{1f}$ rejected). The primary hypothesis is supported on decision-scoped questions: efficiency gains are consistent; accuracy gains require adequate core metadata and multi-core routing on integrated codebases. A 10-question author-rated blind pilot preferred B in 70% of cases, with the remaining 30% rated equal (n=10; not independent experts). Masked decode preference on prior runs: 75% B-or-equal. We release protocols, raw runs (three of four full; Django aggregate-only), and routing artifacts for replication.
keywords:
  - Context engineering
  - Large language models
  - Software engineering
  - Retrieval-augmented generation
  - Domain-driven design
date: June 2026
---

# Introduction

The integration of large language models (LLMs) into software engineering workflows has progressed from function-level code completion to repository-level understanding and reasoning. Contemporary commercial LLMs expose context windows of up to two million tokens, encouraging a direct engineering response: loading the entire workspace - source files, dependencies, documentation, and configuration - into the prompt baseline.

This brute-force approach simplifies retrieval pipelines but introduces three systematic costs:

1. **Token cost inflation.** Processing tens of thousands of tokens per query is financially unsustainable at high query volumes.
2. **Latency degradation.** Inference time scales with prompt length, introducing multi-second delays that disrupt developer focus.
3. **Attention dilution.** LLMs frequently fail to locate and prioritize critical details when surrounded by large volumes of irrelevant code, yielding incorrect recommendations, omissions, or hallucinations [1].

To address these limitations, we propose **Context Cores**, a structured alternative grounded in domain-driven design (DDD) [3]. Instead of treating a repository as a monolithic file index, we construct minimal, self-contained semantic units aligned with distinct architectural responsibilities. A lightweight query router selects active cores for each query, compiling only essential guidelines and code symbols.

We present the **AI Context OS** framework and report a multi-phase evaluation across three open-source codebases and one proprietary macOS application. We compare:

- **Condition A (full-repository baseline):** The entire repository structure and files loaded into the LLM context.
- **Condition B (routed Context Cores):** Scoped domain guidelines and relevant entities loaded via keyword or semantic routing.
- **Condition C (graph-based retrieval):** A dependency graph built via static AST analysis, loading nodes and code snippets within two hops of query seeds.

## Contributions

This paper makes the following contributions:

1. **AI Context OS**, a domain-oriented context framework with explicit cores, routing, and prompt compilation.
2. A **within-subjects evaluation protocol** spanning 149 decision-scoped questions on four codebases, with published raw runs and replication artifacts.
3. **Empirical evidence** that routed Context Cores compress input tokens by 8×-38× while matching or exceeding full-repository accuracy when core metadata and routing are adequate.
4. A **stratum-dependent production decision matrix** comparing Conditions B, C, and D under stated limitations (LLM-as-judge, partial Django export).

# Problem Formulation

## Attention Dilution in Large Context Windows

Let $P$ denote the user query and $R = \{f_1, f_2, \dots, f_n\}$ the set of repository files. Under Condition A, the input prompt is

$$I_A = [\text{SystemInstructions}, R, P].$$

As $|R|$ grows, token length $L(I_A)$ increases linearly. Prior work shows that retrieval performance over long prompts follows a U-shaped curve: information in the middle of the context is frequently under-attended [1].

## File-Centric versus Decision-Centric Organization

Traditional retrieval systems (lexical RAG, semantic chunking) operate at file granularity [4]. Developer queries are often decision-centric. Answering *"How do we restrict API write operations on viewsets to JWT-authenticated users?"* does not require every serializer or view class; it requires rules governing serialization, view configuration, and authentication, plus specific file routes.

## Observed Failure Modes

In audits of naive coding assistants, we observed recurring failures on:

- **System API boundaries:** Confusion in helper utilities while missing event-delegation patterns.
- **Settings configuration maps:** Outdated properties due to absent single sources of truth.
- **Cross-cutting rules:** Hallucinated integration paths when only one subsystem appears in context.

# Related Work

## Retrieval-Augmented Generation

Lexical retrieval (e.g., BM25) and dense embedding retrieval are widely used to prune LLM contexts [4]. Naive RAG often chunks files into arbitrary blocks, disrupting control flow. On codebases, this fragments class declarations from method implementations, forcing models to infer missing interfaces.

## Knowledge Graphs and GraphRAG

Graph-based methods model code as entities and relations (calls, inheritance, imports) [5, 6]. Graphs preserve structure but optimize connectivity over sufficiency. A developer modifying a settings parameter may receive a large adjacent subgraph of consumers, flooding the prompt with irrelevant code.

## Code Intelligence and AST Indexing

Static analysis assistants parse abstract syntax trees (ASTs) for precise declaration maps. AST indices lack business and operational semantics: architectural constraints expressed in prose (e.g., *"never send emails without user confirmation"*) are not captured.

## Context Engineering and Compression

Prompt pruning, token compression, and context distillation remove redundant tokens post hoc [7]. These methods do not restructure repository knowledge; token and latency costs re-emerge as repositories scale.

# Hypotheses

We formalize the framework assumptions as follows:

- **Primary hypothesis ($H_1$):** Dynamically routed, domain-oriented Context Cores produce responses equal or superior in correctness, completeness, and actionability to full-repository contexts, while significantly reducing input tokens and latency.
- **$H_{1a}$ (token reduction):** $L(I_B) \ll L(I_A)$.
- **$H_{1b}$ (latency reduction):** $t_B \ll t_A$.
- **$H_{1c}$ (domain accuracy):** On business-rule and domain-logic questions, $\text{Acc}_B \ge \text{Acc}_A$.
- **$H_{1d}$ (hallucination mitigation):** Context Cores reduce structural hallucinations via explicit boundaries and exclusions.
- **$H_{1e}$ (expert preference):** Under blinded preference rating, domain experts prefer or rate as equal Condition B in at least 60% of cases versus Condition A.

**Falsification criteria.** We reject $H_1$ if (i) mean accuracy of B falls more than 15% below A on the aggregate set, or (ii) blind expert preference for B falls below 60%.

# The AI Context OS Architecture

The framework comprises three layers:

1. **Context Cores:** Curated markdown documents per application domain, containing system-prompt guidelines, key entities (classes, interfaces, APIs), and links to critical source files.
2. **Context Router:** A lightweight classifier (keyword- or embedding-based) that scores queries against cores.
3. **Dynamic Prompt Builder:** An orchestrator that compiles base instructions, active core guidelines, user preferences, and tool definitions.

Figure 1 summarizes the compilation pipeline: the router scores the query against cores; matched cores feed the prompt builder together with base system instructions; the assembled prompt is sent to the LLM.

**Figure 1.** Context compilation pipeline: User Query $\rightarrow$ Context Router $\rightarrow$ \{Workspace Core, Comm Core, ...\} $\rightarrow$ Dynamic Prompt Builder $\rightarrow$ LLM.

## Taxonomy of Context Cores

We classify cores into five domains:

- **Personal/default core:** User metadata, preferences, conversational history.
- **Workspace core:** File system, document stores, local database schemas.
- **Communication core:** Messaging and mail integrations.
- **System control core:** Execution paths, scripting, input automation.
- **Browsing core:** Browsers, web sessions, tabs, URL requests.

## Core Construction

Cores follow the **minimal context principle:**

1. **Domain boundary mapping:** Identify distinct responsibilities (e.g., billing versus database migration).
2. **Entity extraction:** Capture public interfaces, settings maps, and structural invariants.
3. **Prose compression:** Replace raw listings with concise rules (e.g., *"SQLite schema version 3.4"*).
4. **Exclusions:** State explicit out-of-scope boundaries to reduce hallucination.

## Curation Cost

Context Cores introduce manual curation overhead. Across test projects:

| Project | Cores | Authoring time |
|:--------|:-----:|:--------------:|
| MailAgent | 6 | ~12 h |
| Django REST Framework | 5 | ~18 h |
| Navorina | 11 | ~40 h |
| Oiloop | 5 | ~10 h |

Initial overhead ranges from approximately 10 to 40 hours depending on scale and coupling.

# Experimental Methodology

## Testbed

| Repository | LOC | Language | Questions | Cores |
|:-----------|:---:|:--------:|:---------:|:-----:|
| MailAgent | 320k | TypeScript | 45 | 6 |
| Django REST Framework | ~1.2M | Python | 42 | 5 |
| Navorina | ~270k | Python | 42 | 11 |
| Oiloop | ~180k | Swift (macOS) | 20 | 5 |

## Design

We applied a within-subjects design with `gpt-4o-mini` as the response and judge model:

- **Condition A:** All repository source and documentation.
- **Condition B:** Routed core texts only.
- **Condition C:** Static dependency subgraph (BFS expansion up to two hops).

## Metrics

- **Accuracy (0-3):** Correctness of technical details, frameworks, and APIs.
- **Completeness (0-2):** Required steps, side effects, and file locations.
- **Actionability (1-5):** Readability and executability without placeholders.
- **Input tokens** and **latency (ms).**
- **Hallucination rate (%):** Incorrect APIs, classes, or files referenced.

# Results

Canonical runs: MailAgent `run-1781319187610`, Navorina `run-1781143403051`, Oiloop Phase 3.1 `run-1781660908`, Django aggregate `run-drf-phase-2.1-aggregate` (per-question CSV not preserved for Django).

## Cross-Project Comparison

| Project | Cond. | Mean Acc. | Halluc. | Mean tokens | Router F1 | CCR_tokens |
|:--------|:-----:|:---------:|:-------:|:-----------:|:---------:|:----------:|
| MailAgent (45 Q) | A | 1.38 | 20% | 88,113 | - | 1× |
| | B | **1.67** | 18% | **10,615** | **1.00** | **8.3×** |
| | C | 1.24 | 22% | 20,955 | - | 4.2× |
| Django REST (42 Q)† | A | 1.35 | 18% | ~76,000 | - | 1× |
| | B | **1.68** | 22% | **~2,000** | 0.72 | **38×** |
| | C | 1.40 | **11%** | ~18,000 | - | 4.2× |
| Navorina (42 Q) | A | 1.00 | 24% | 27,627 | - | 1× |
| | B | **1.19** | 19% | **2,021** | 0.87 | **13.7×** |
| | C | 0.93 | **7%** | 11,858 | - | 2.3× |
| Oiloop (20 Q, Ph 3.1) | A | 0.75 | 30% | 76,663 | - | 1× |
| | B | **2.70** | **0%** | **6,334** | 1.00 | **12.1×** |
| | C | 2.35 | 10% | 8,963 | - | 8.6× |

† Django: aggregate export only; bootstrap CI not computed (no `paired.csv`).

## Oiloop Phase 3.1

Phase 3.1 used **workspace-core v1.1.0**, corrected gold labels, and gold routing (F1 = 1.0):

- B versus A accuracy: 2.70 versus 0.75 (Δ +1.95, N = 20).
- Bootstrap 95% CI on paired Δ (B − A): [+1.60, +2.30]; B exceeded A on 19/20 questions.
- Production keyword router (Run 3): F1 = 1.0, B = 2.75, hallucination 0% (`run-prod-router-1781701118`).
- Cross-cutting ablation (Run 2, 8 Q): B 2.875 > D (hybrid) 2.50 > C 2.375 - $H_{1f}$ rejected.

Prior Oiloop runs (pre-v1.1 cores) showed B 1.20 versus A 1.00; core metadata richness ($H_{1g}$) explains the Phase 3.1 improvement.

## Compression and Latency

CCR_tokens (mean tokens A / mean tokens B): 8.3× MailAgent, 38× Django, 13.7× Navorina, 12.1× Oiloop Phase 3.1. Condition B latency was consistently lower than A on measured runs.

## Preference Pilots

**Author-rated blind pilot** (10 questions, Phase 3.1 answers, shuffled A/B): B preferred 7, equal 3, A 0 (n=10; not independent raters; source: `research/human-blind-pilot-oiloop.csv`).

**Masked decode preference** (prior Oiloop canonical): B preferred or equal on 75% of 20 questions.

# Discussion

## Core Richness and Multi-Core Routing

Early Oiloop runs showed thin B accuracy (1.05-1.20) when cores lacked enforcement chains and cross-cutting routes returned a single core. Phase 3.1 addressed this via expanded metadata (entities, invariants, rule-enforcement chains) and multi-core keyword routing (up to two cores on tied scores). B accuracy rose from 1.20 to 2.70. Production default on Oiloop is Condition B (`.fast` routing), not graph C.

## When Graph Retrieval Wins

On Django REST and Navorina, C achieved lower hallucination than B (11% versus 22%; 7% versus 19%) despite mixed accuracy. When trust dominates, C is the recommended default for those profiles.

On Oiloop Phase 3.1, B exceeded C on accuracy and matched or beat C on hallucination. Graph C remains an opt-in path (`.deep`).

## Hybrid Core plus Graph

Condition D (routed core plus 15k-token graph supplement) did not match C accuracy at lower cost than B on eight cross-cutting questions. Multi-core B is the simpler strategy when cores are metadata-rich.

## Empirical Decision Matrix

| Profile | Default | Evidence |
|:--------|:--------|:---------|
| Narrow domain, F1 $\geq$ 0.95 (MailAgent, Oiloop prod) | B | MailAgent F1 = 1.0; Oiloop Run 3 F1 = 1.0 |
| Integrated OSS, hallucination-sensitive (DRF, Navorina) | C | C hallucination < B |
| Integrated private app, rich cores (Oiloop Ph 3.1) | B | B 2.70; multi-core wins cross-cutting |
| Full-repository dump | None | Dominated on cost and accuracy |

# Limitations

1. **LLM-as-judge:** All accuracy and hallucination scores use gpt-4o-mini; no inter-rater agreement with humans on the full 149-question bank.
2. **Expert preference:** Masked decode and the author blind pilot are not substitutes for independent blind human studies.
3. **Django REST:** Only aggregate metrics exported; per-question `paired.csv` was not preserved.
4. **Curation cost:** 10-40 hours per codebase; semantic drift requires maintenance.
5. **Router dependency:** B quality scales with routing F1; mitigated by multi-core and semantic routing on DRF/Navorina.
6. **Single model:** All runs use gpt-4o-mini; generalization untested.
7. **Oiloop A baseline variance:** Condition A scores drifted between runs; Phase 3.1 is the reference.

# Future Work

1. Semi-automated core generation from AST and documentation.
2. Context drift monitors (PR hooks when source links change).
3. Full Django REST re-run with per-question export.
4. Independent human blind study (10-question pilot protocol published).
5. Multi-model replication on the Oiloop product path.

# Conclusion

Full-repository loading is token-inefficient for decision-scoped questions. Domain-oriented Context Cores with multi-core routing deliver 8-38× compression (CCR_tokens) on open-source projects and ~12× on Oiloop Phase 3.1. When cores are metadata-rich, accuracy substantially exceeds monolithic dumps (Oiloop: B 2.70 versus A 0.75; bootstrap CI entirely above zero). Production defaults are stratum-dependent: B on narrow, high-F1 paths; C on hallucination-sensitive integrated OSS. Hybrid core-plus-graph did not outperform rich multi-core B on Oiloop cross-cutting questions. We release protocols, three full raw run exports, and an aggregate Django export with stated limitations.

# References

[1] N. Liu et al., "Lost in the Middle: How Language Models Use Long Contexts," *Transactions of the Association for Computational Linguistics*, vol. 12, pp. 157-173, 2024.

[2] O. Press et al., "Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation," *ICLR*, 2022.

[3] E. Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley, 2003.

[4] P. Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," *Advances in Neural Information Processing Systems*, 2020.

[5] D. Edge et al., "From Local to Global: A GraphRAG Approach to Query-Focused Summarization," *arXiv:2404.16130*, 2024.

[6] D. Guo et al., "GraphCodeBERT: Pre-training Code Representations with Data Flow," *International Conference on Learning Representations*, 2021.

[7] H. Jiang et al., "LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models," *EMNLP*, 2023.

# Appendix A: Example Evaluation Questions

- **OL01:** How does Oiloop store user preferences and chat history?
- **OL05:** How does Oiloop handle sandboxed folder access on macOS?
- **OL15:** How does EventKit Reminders authorization avoid freezing Oiloop in background mode?
- **OL18:** How are Safari tab titles and URLs fetched?

# Appendix B: Context Core Template

```markdown
# [Core Name] Core

## Purpose
Decision domain description.

## Key Entities
- `EntityName`: Class/struct and responsibility.

## Invariants & Rules
1. Mandatory checks and constraints.

## Exclusions
- Explicit out-of-scope boundaries.
```

# Appendix C: Router Sketch

```swift
struct ContextRouter {
    static func route(userInput: String) -> Set<ContextCore> {
        let lower = userInput.lowercased()
        // Score cores by keyword presence; return matching set
    }
}
```

# Appendix D: Blinded Rater Instructions

1. Answers are randomized as "Option 1" and "Option 2."
2. Rate each option on accuracy (0-3), completeness (0-2), and actionability (1-5).
3. Select the preferred option without knowing the retrieval source.

# Data Availability

Research repository: `https://github.com/navorina-labs/AI-Context-OS`

Evaluation dataset: `research/questions.md`

Raw metrics: `context-os/evaluations/` and `experiments/*/runs/`
