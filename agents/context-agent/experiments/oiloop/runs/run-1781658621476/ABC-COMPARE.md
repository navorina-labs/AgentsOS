# A / B / C — Pilot re-validation (OL01–OL10)

**Run:** `run-1781658621476` · **10 questions** · **gpt-4o-mini** · 2026-06-17

| Condition | Strategy | Mean context | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|----------|--------------|-------------------|----------|---------|---------|
| **A** | Full repo | 400k chars | 76 663 | 0.50 | 20.0% | 4.2s |
| **B** | Context OS cores | 21.8k chars | **6 629** | **2.10** | 30.0% | 4.8s |
| **C** | Hermes-style graph | 38.0k chars | 8 850 | **2.40** | 20.0% | 5.6s |

## Tokens and compression

| | A | B | C |
|---|---|---|---|
| Session input tokens | 767k | 66k | 89k |
| CCR input vs A | 1× | **11.6×** | 8.7× |
| CCR chars vs A | 1× | **31.7×** | 11.2× |

## Findings

1. **Context OS (B)** — 31.7× context compression vs full repo; accuracy +1.60 vs A (0.50 → 2.10).
2. **Hermes graph (C)** — best accuracy (2.40); +0.30 vs B at ~33% more tokens.
3. **Full repo (A)** — collapsed baseline (0.50 mean accuracy) at 400k chars — lost-in-the-middle degradation.
4. **B hallucination (30%)** — driven by mock cross-cutting Qs (OL01, OL05, OL07); C matches A at 20%.

**Quality per token (accuracy / mean input):** B > C >> A

## Relation to canonical Phase 3 run

| | Pilot (this run) | Canonical [run-1781354424217](../run-1781354424217/) |
|---|---|---|
| Questions | 10 (OL01–OL10) | 20 (OL01–OL20) |
| B mean context | 21.8k chars | 4.2k chars |
| B accuracy | 2.10 | 1.20 |
| C accuracy | 2.40 | 1.55 |

Pilot uses **expanded core content** (richer metadata per core). Canonical 20Q run remains the published Phase 3 benchmark; this pilot confirms hypothesis direction with updated cores on the first half of the question set.

## Limitations

- n = 10; not significance-tested.
- C = static graph index + keyword/BFS retrieval (not live CodeGraph MCP).
- B uses gold `expected_cores` (router F1 = 1.0).
- Judge tokens not included in cost estimates.
