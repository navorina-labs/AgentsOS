# Future Paper Outline

**Working title:** *Domain-Oriented Context Cores: Bounded Context for AI Decision Support in Software Projects*

**Target venues:** arXiv (preprint), ACL/EMNLP (NLP applications), ICSE/FSE (software engineering), or CHI (HCI decision support) — TBD after Phase 1 results.

---

## Abstract

- Problem: AI systems receive full repository context lacking decision boundaries
- Proposal: Context Cores — domain-oriented, minimal sufficient context units with explicit routing
- Method: Controlled A/B experiments on N real projects, 125-question evaluation bank
- Results: [TBD — accuracy, CCR, hallucination, latency]
- Contribution: Framework, evaluation methodology, open question bank, replication package

(~150 words)

---

## 1. Introduction

- Rise of AI coding assistants and full-repo context
- Anecdotal failures on scoped business/product questions
- Research question: do decision-bounded cores outperform full context?
- Contributions list (framework, experiment, dataset, null-result honesty)

---

## 2. Problem

### 2.1 Context Overload in AI-Assisted Development

- Token growth vs quality plateau
- Attention dilution (cite relevant LLM literature)

### 2.2 Absence of Responsibility Boundaries

- File-centric vs decision-centric organization
- Concrete failure example (revenue question + irrelevant code)

### 2.3 Why Window Size Is Insufficient

- Structural problem, not capacity problem

---

## 3. Related Work

### 3.1 Retrieval-Augmented Generation

- Naive RAG, chunking strategies, limitations

### 3.2 Knowledge Graphs and GraphRAG

- Entity-relationship modeling
- Gap: no decision boundaries

### 3.3 Code Intelligence and Repository-Level Models

- Code search, repo-level embeddings
- Gap: retrieval by similarity not by decision intent

### 3.4 Context Engineering

- Prompt engineering, context pruning
- Position: AI Context OS as structured alternative

---

## 4. Hypothesis

- Primary hypothesis H₁ (formal statement)
- Sub-hypotheses H₁a–H₁e
- Falsification criteria

---

## 5. Method: AI Context OS

### 5.1 Context Cores

- Definition, anatomy, four-domain taxonomy
- Subcores, composition

### 5.2 Router

- Intent classification, routing rules, deferral

### 5.3 Principles

- Minimal context, domain boundary, decision-centric, router first, compression

### 5.4 Core Construction Process

- Entity extraction, template population, validation, versioning
- Manual curation cost (honest assessment)

---

## 6. Experiments

### 6.1 Experimental Design

- Within-subjects A/B: Full Repository vs Context Core
- Controls (model, temperature, blinding)

### 6.2 Subjects

- MailAgent (Phase 1)
- OSS SaaS projects (Phase 2)
- [Private project — anonymized] (Phase 3)

### 6.3 Evaluation Metrics

- Accuracy, reasoning quality, hallucination, completeness, CCR, latency

### 6.4 Question Bank

- 125 questions, 5 domains
- Gold standard creation process

### 6.5 Raters and Inter-Rater Reliability

- Cohen's kappa protocol

---

## 7. Results

### 7.1 Primary Comparison (A vs B)

- Overall accuracy, effect size
- Per-domain breakdown

### 7.2 Context Compression

- CCR distribution
- Quality vs compression tradeoff curve

### 7.3 Hallucination Analysis

- Types and rates by condition
- Qualitative examples

### 7.4 Routing Accuracy

- Precision, recall, error analysis

### 7.5 Optional: GraphRAG Baseline (C)

- If conducted in Phase 2+

### 7.6 Expert Evaluation

- Blind preference study (Phase 3)

---

## 8. Discussion

### 8.1 When Context Cores Win

- Scoped decision questions
- Business/product domains (hypothesis)

### 8.2 When Full Repository Wins

- Exploration, greenfield understanding
- Small repos

### 8.3 Cost-Benefit of Manual Curation

- Hours per project vs quality gain
- Maintenance burden

### 8.4 Comparison with GraphRAG

- Complementary vs substitutive

### 8.5 Implications for AI Tooling

- Router as first-class component
- Not a product pitch — research implications only

---

## 9. Limitations

- Manual core curation does not scale (yet)
- Routing errors propagate
- Question bank bias toward SaaS/billing domains
- Model-specific results (may not generalize)
- Small number of subject projects
- Expert evaluation sample size

---

## 10. Future Work

- Semi-automated core generation from entity extraction
- Online core drift detection
- Hybrid core + graph retrieval
- Longitudinal maintenance study
- Cross-language / non-SaaS domains
- Integration with IDE workflows (research only)

---

## 11. Conclusion

- Summary of findings
- Honest statement: supported, partial, or rejected hypothesis
- Call for replication using open artifacts

---

## Appendices

- A: Full question bank
- B: Core templates
- C: Routing rules
- D: Rater instructions
- E: Statistical analysis details
- F: Example cores (MailAgent, redacted if needed)

---

## Artifacts for Reproducibility

- GitHub repository: AI Context OS
- Question bank + gold labels (no proprietary code)
- Scoring rubrics
- Raw scores (anonymized)
