# Core Fixes: OL05 & OL07 (Hallucination Hotspots)

**Source run:** [run-1781658621476](runs/run-1781658621476/) · pilot 2026-06-17  
**Target core:** `workspace-core` (+ boundary with `personal-core` for OL07)  
**Apply in:** private Oiloop repo `Resources/cores/workspace-core.md` and public template [cores/workspace-core.md](cores/workspace-core.md)

---

## Problem Summary

| Q | Text | B acc | Halluc | Root cause |
|---|------|-------|--------|------------|
| **OL05** | Sandboxed folder access on macOS | 2 | ✅ yes | Invented error enum names; incomplete `WorkspaceAccess` API surface |
| **OL07** | How 'don't touch' rules are enforced | 2 | ✅ yes | Generic "Rule Enforcers"; invented "Scheduled Digest Warnings"; missing enforcement chain |

Both Q also marked hallucination under **C** — graph alone does not fix missing entity definitions in cores.

---

## OL05 — Sandbox Access Fixes

### What the model invented (do not leave implicit)

- `accessDenied` / `permissionDenied` as thrown error types — **not verified in core**; model fabricates plausible names
- Vague "database settings" without table/key name

### Add to `workspace-core.md`

**Key Entity — expand `WorkspaceAccess`:**

| Field | Content to add |
|-------|----------------|
| API | `URL.startAccessingSecurityScopedResource()` / `URL.stopAccessingSecurityScopedResource()` — call pair around every file op |
| Persistence | Security-scoped bookmark **Data** stored via settings / SQLite (name the actual key or table from `WorkspaceAccess.swift`) |
| Scope | Access limited to **whitelisted bookmark directories** only (invariant, already present — keep) |
| Errors | List **only** error cases that exist in source (enum cases or thrown types from `WorkspaceAccess.swift`) — no placeholder names |

**New section — Sandbox Access Flow:**

```
1. User grants folder via NSOpenPanel → bookmark Data persisted
2. On file op: resolve bookmark → startAccessingSecurityScopedResource
3. Validate target URL ∈ whitelisted bookmark paths
4. Execute op → stopAccessingSecurityScopedResource
5. On failure: surface documented error (cite exact type from code)
```

**Exclusions (explicit):**

- Do not cite error types not listed in Sources table
- Do not describe App Sandbox entitlements unless documented in ADR

---

## OL07 — Don't Touch Rules Fixes

### What the model invented

- **"Rule Enforcers"** (plural, generic) — should be **`RuleEnforcer`** (single class, verified in expert survey gold)
- **`Scheduled Digest Warnings`** — no source in core; appears fabricated
- **`shouldSkipFile` as free function** — should be method on `RuleEnforcer`
- Missing **`FilePreviewSheet`** in B answer (present in C) — core has entity but enforcement chain not wired in prose

### Add to `workspace-core.md`

**Key Entity — add `RuleEnforcer`:**

| Method | Purpose |
|--------|---------|
| `shouldSkipFile(path:rules:)` | Returns true if path matches any `dontTouch` pattern |
| `shouldSkipMail(...)` | Skip mail matching don't-touch rules |
| `shouldSkipMessage(...)` | Skip messages matching don't-touch rules |

**Key Entity — expand `UserRuleParser`:**

| Field | Content |
|-------|---------|
| Input | Plain-text user rules containing "don't touch" / ignore patterns |
| Output | Rows in SQLite **`user_rules`** table |
| Rule kind | `dontTouch` (cite exact enum/kind from code) |

**New section — Don't Touch Enforcement Chain:**

```
UserRuleParser → user_rules (SQLite)
       ↓
RuleEnforcer.shouldSkipFile / shouldSkipMail / shouldSkipMessage
       ↓
FileOrganizer (skip matching paths before proposing moves)
       ↓
FilePreviewSheet (user confirms; no move without Apply)
       ↓
Audit trail (skipped paths logged)
```

**Cross-core boundary (OL07 routes workspace + personal):**

- Rule **storage** and **parsing** → workspace-core
- Persona / tone / memory → personal-core (out of scope for OL07 answer)
- Do not attribute mail/message skip logic to personal-core

**Remove / do not add until verified:**

- ~~Scheduled Digest Warnings~~ — omit unless implemented in `DigestService` or similar with source link

---

## Version Bump

| Core | Old | New | Rationale |
|------|-----|-----|-----------|
| workspace-core | 1.0.0 | **1.1.0** | OL05/OL07 entity + flow additions |
| personal-core | 1.0.0 | 1.0.0 | No change for OL07 (boundary clarification only) |

---

## Verification Checklist (before Phase 3.1 run)

- [ ] Every entity in workspace-core has a row in **Sources** table pointing to real Swift file
- [ ] Every method name (`shouldSkipFile`, etc.) grep-verified in Oiloop repo
- [ ] Error types in OL05 section match Swift source — no placeholders
- [ ] Enforcement chain section present (OL07)
- [ ] `token_estimate` updated after expansion
- [ ] Re-run pilot OL05 + OL07 only (smoke) before full 20 Q

---

## Expected Impact

| Metric | Before (pilot) | Target (Phase 3.1) |
|--------|----------------|----------------------|
| OL05 B hallucination | true | false |
| OL07 B hallucination | true | false |
| OL07 B accuracy | 2 | 3 |
| Cross-cutting B halluc rate | 30% (pilot) | ≤ 20% |

Condition **D** still required if B alone does not reach accuracy 3 on OL07 after core fix.

---

## Cross-Reference

- Phase 3.1 eval protocol: [prompts/run-oiloop-phase-3.1-eval.md](../../prompts/run-oiloop-phase-3.1-eval.md)
- Hypothesis H₁a′ / H₁f: [docs/hypothesis.md](../../docs/hypothesis.md)
- Expert gold answers: [docs/expert-survey.md](../../docs/expert-survey.md) (OL05, OL07)
