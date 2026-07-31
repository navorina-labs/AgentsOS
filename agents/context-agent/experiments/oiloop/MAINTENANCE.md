# Oiloop Context Cores — Maintenance

When to update `context-os/cores/` and `Resources/cores/` after code changes.

**Rule:** both paths must stay **byte-identical** before eval pre-flight (`diff context-os/cores/X.md Resources/cores/X.md`).

---

## Code → core matrix

| Code change | Update core | Eval Q affected |
|-------------|-------------|-----------------|
| `App/FilePreviewSheet.swift` | `workspace-core` Key Entities + Organize flow | OL06, OL08 |
| `FileOrganizer.swift`, `FileOrganizeService.swift` | `workspace-core` Organize Downloads Flow | OL06 |
| `UserRuleParser.swift`, `RuleEnforcer` | `workspace-core` Don't Touch chain | OL05, OL07 |
| `WorkspaceAccess.swift`, bookmarks | `workspace-core` Sandbox Access Flow | OL05 |
| `ContextRouter.swift`, routing keywords | `context-os/router/routing-map.json` + [routing-rules.md](../../routing-rules.md) | route-eval F1 |
| `RemindersReader`, headless EventKit | `system-control-core` | OL15 |
| `SystemPromptBuilder`, graph loader | `context-os/graph/graph-index.json` | Condition C |
| New product domain surface | New or expanded core + router entry | New eval Q |

---

## Pre-merge checklist (context-os)

- [ ] Touched domain: core `.md` updated in **both** `context-os/cores/` and `Resources/cores/`
- [ ] `version` + `last_updated` bumped in core Metadata table
- [ ] Decision History row added if behavior changed
- [ ] Gold bullets in `context-os/eval/questions.json` aligned with core (no orphan symbols)
- [ ] `node context-os/eval/route-eval.mjs` — mean F1 ≥ 0.95 on changed routes
- [ ] OL08 dry-run: `node context-os/eval/run-eval.mjs --ids OL08 --router keyword --condition b --dry-run` → `context_chars > 0`

---

## After core content change

1. Sync: `cp context-os/cores/*.md Resources/cores/` (or project sync script)
2. Route smoke: `node context-os/eval/route-eval.mjs`
3. Targeted smoke: `--ids OLxx` for affected questions
4. Full replication (major): `node context-os/eval/run-eval.mjs --router keyword --condition all`
5. Export to AI-Context-OS: `node context-os/eval/export-results.mjs`
6. Update [PHASE-3-RESULTS.md](../../context-os/evaluations/PHASE-3-RESULTS.md) if canonical run changes

---

## OL06 hallucination guard (prod router)

**Symptom:** Prod run flags OL06 B as hallucination — answer cites `RuleEnforcer` / audit trail not in OL06 gold.

**Cause:** `workspace-core` documents RuleEnforcer in organize scope; model over-expands for "organize downloads" questions.

**Fix:** Use **Organize Downloads Flow (OL06)** section — answer shape limited to four gold bullets. Defer RuleEnforcer to OL07 / don't-touch questions.

**Verified:** 2026-06-17 — full prod run [run-prod-router-1781701118](runs/run-prod-router-1781701118/) B **2.75**, hall **0%**.

## Periodic

| When | Action |
|------|--------|
| Every core PR | route-eval + affected OLxx dry-run |
| Monthly | Full 20 Q replication vs canonical `run-1781660908` |
| Before paper/post | [validity-audit.md](../../research/validity-audit.md) claim check |

---

## Sources

- Eval protocol: [evaluation-framework.md](../../research/evaluation-framework.md)
- Phase 3.1 closed: [PHASE-3.1-CLOSED.md](runs/run-1781660908/PHASE-3.1-CLOSED.md)
- Navorina maintenance template: [navorina/instance/MAINTENANCE.md](../navorina/instance/MAINTENANCE.md)
