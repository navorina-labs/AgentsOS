# Phase 3 — Private Project Validation Protocol

This document details the research protocol for **Phase 3 (Private Project Validation)** of the AI-Context-OS framework. The goal is to evaluate the decision-centric context cores approach on a private, complex codebase with real stakes, judged by domain experts.

---

## 1. Objectives

1. **Verify Accuracy & Utility:** Assess whether Context Core routing (Condition B) maintains or improves output quality compared to Full Repository context (Condition A).
2. **Masked Preference Pilot:** Measure the rate at which domain experts prefer core-routed outputs over full-repository outputs under masked conditions.
3. **Quantify Operational Actionability:** Grade the decision usefulness of responses on a standardized 1-5 scale.

---

## 2. Subject Selection & Roles

- **Subject Project:** `Oiloop` (Private macOS AI Companion ecosystem).
- **Domain Experts:** Project founders, lead developers, or domain architects who know the Oiloop architecture and requirements.
- **Evaluation Coordinator:** Handles running the A/B test pipeline, generating the masked survey, and decoding results.

---

## 3. Evaluation Metrics

Experts evaluate every shuffled option on the following criteria:

### A. Accuracy & Hallucination (0–3 Scale)
- **3 (Excellent):** Completely correct, no inaccurate details or hallucinations.
- **2 (Good):** Correct in substance, minor inaccuracies that do not affect the main conclusion.
- **1 (Poor):** Substantially incorrect or contains major hallucinations.
- **0 (Critical Fail):** Hallucinates incorrect APIs, security patterns, or logic.

### B. Completeness (0–2 Scale)
- **2 (Complete):** Answers all facets of the query.
- **1 (Partial):** Answers the main query but misses edge cases/details.
- **0 (Incomplete):** Fails to address the core query.

### C. Actionability / Decision Usefulness (1–5 Likert Scale)
- **5 (Highly Actionable):** Direct, ready-to-run recommendations or code edits.
- **3 (Informative):** Contextually correct but requires significant lookup/refactoring.
- **1 (Useless/Misleading):** Cannot be used to make decisions.

### D. Masked Preference
- Forced choice of: **Option 1 Preferred**, **Option 2 Preferred**, **Both Equal**, or **Neither Useful**.

---

## 4. Operational Workflow

### Step 1: Run the A/B Pipeline
Gather a set of 50-100 questions covering the five core domains (`personal`, `workspace`, `communication`, `systemControl`, `browsing`). Execute the query runs:
1. Condition A (Full Repo baseline)
2. Condition B (Routed Context Cores)

### Step 2: Generate the Shuffled Survey
Use the `expert-eval-generator.mjs` script to shuffle output options:
```bash
node research/expert-eval-generator.mjs --run results/run-latest.json --out docs/expert-survey.md
```
This writes:
- `docs/expert-survey.md` — Shuffled questions with hidden source identifiers.
- `research/survey-key.json` — The secret key decoding mappings.

### Step 3: Masked Expert Rating
Domain experts read `docs/expert-survey.md` and complete the scores without knowing which option corresponds to A or B.

### Step 4: Decode and Aggregate
The coordinator takes the finished scores, maps them back using `survey-key.json`, and computes:
- Preference rates (Target: Condition B preferred in $\ge 60\%$ of cases)
- Average accuracy and actionability score deltas
- Hallucination frequency reductions
