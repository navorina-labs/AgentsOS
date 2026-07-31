# OL08 — Judge variance, not router regression

**Question:** What SwiftUI view displays the preview of files to be moved?

## Same answer, different scores

| Run | Router | Answer (excerpt) | Accuracy | Judge notes |
|-----|--------|------------------|----------|-------------|
| run-1781660908 (gold) | gold | `FilePreviewSheet` | **3** | "lacks details on functionality" |
| run-prod-router-1781664681 | keyword | `FilePreviewSheet` | **1** | "lacks details about functionality" |

Routing, context (7 155 chars), and answer text are **equivalent**. The −2 accuracy delta is **LLM-as-judge inconsistency**, not a production router or core gap.

## Gold criteria (4 bullets)

Gold expects Apply/Cancel, `confirmPendingOrganize`, table of moves — minimal one-line answers score inconsistently.

## Mitigation (optional)

- Prompt: for UI/view questions, cite 2+ behaviors from core Key Entities.
- Or: human re-score OL08; do not treat as router regression.
