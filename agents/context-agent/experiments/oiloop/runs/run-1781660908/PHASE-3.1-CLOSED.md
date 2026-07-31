# Phase 3.1 — Closed

**Date:** 2026-06-17  
**Status:** Complete

## Run matrix

| Run | ID | Purpose | Verdict |
|-----|-----|---------|---------|
| Replication | [run-1781660908](../run-1781660908/) | 20 Q A/B/C, gold, v1.1 cores | B **2.70**, hypothesis ✅ |
| Run 3 | [run-prod-router-1781701118](../run-prod-router-1781701118/) | Production keyword router (v1.1.1) | H₁h ✅ F1=1.0, B **2.75**, hall **0%** |
| Run 2 | [run-hybrid-1781664794](../run-hybrid-1781664794/) | Cross-cutting B/C/D | H₁f ❌ B beats D and C |

## Production default (final)

**B** — keyword router, multi-core when `expected_cores.length > 1`. Never A. C/D not default.
