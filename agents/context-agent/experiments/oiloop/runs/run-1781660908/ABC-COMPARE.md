# A / B / C — Phase 3.1 Replication (20 Q, expanded cores)

**Run:** `run-1781660908` · **20 questions** · **gpt-4o-mini** · 2026-06-17  
**Changes vs canonical run-1781354424217:** workspace-core v1.1.0, fixed gold OL05/OL07

| Condition | Strategy | Mean context | Mean input tokens | Accuracy | Halluc. | Latency |
|-----------|----------|--------------|-------------------|----------|---------|---------|
| **A** | Full repo | 400k chars | 76 663 | 0.75 | 30.0% | 2.5s |
| **B** | Context OS cores | 21.2k chars | **6 334** | **2.70** | **0.0%** | **2.1s** |
| **C** | Hermes-style graph | 38.7k chars | 8 963 | 2.35 | 10.0% | 2.7s |

## vs Prior Runs

| Run | N | A | B | C | B hall |
|-----|---|---|---|---|--------|
| run-1781354424217 (canonical) | 20 | 1.00 | 1.20 | 1.55 | 20% |
| run-1781658621476 (pilot) | 10 | 0.50 | 2.10 | 2.40 | 30% |
| **run-1781660908 (Phase 3.1)** | **20** | **0.75** | **2.70** | **2.35** | **0%** |

## Findings

1. **H₁g confirmed:** expanded cores + fixed gold → B **2.70** (+1.50 vs prior canonical 1.20).
2. **B wins on accuracy** over C (2.70 vs 2.35) at **29× compression** and **0% hallucination**.
3. **A collapsed** to 0.75 (lost-in-the-middle at 400k chars).
4. **B latency** faster than A (2.1s vs 2.5s) — H₁c holds on full 20 Q.

## Limitations

- Gold router (F1 = 1.0) — production router not yet measured.
- Condition D not tested.
- LLM-as-judge.
