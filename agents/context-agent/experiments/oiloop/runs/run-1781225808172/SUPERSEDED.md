# Superseded run

Replaced by [run-1781344390027](../run-1781344390027/).

| | This run | Canonical |
|--|----------|-----------|
| Router F1 | 0.95 (OL08 → `technical-core`, F1=0) | **1.00** (OL08 → `workspace-core`) |
| B accuracy vs A | 1.05 vs **1.20** (−12.5%) | **1.05 vs 1.00** (+5.0%) |
| A hallucination | 20% | 35% |
| C hallucination | 15% | 30% |
| B mean tokens | 979 | 1,009 |
| CCR (B) | 83× | 112× |
| Expert preference | 60% | 75% |
| `hypothesis_supported` | false | true |

OL08 routing bug (`technical-core` fallback) fixed before canonical re-run. Keep for audit trail only.
