# Workspace Core (Oiloop)

## Metadata

| Field | Value |
|-------|-------|
| id | workspace-core |
| version | 1.1.0 |
| parent_core | null |
| project | Oiloop |
| last_updated | 2026-06-17 |
| token_estimate | 1200 |

---

## Purpose

Responsible for file organization, loose files cleanup, directory auditing, security-scoped bookmarks, and enforcing user rules (such as "don't touch invoices").

---

## Scope

### In Scope

- File classification rules and target category folders
- Proposing and executing file move operations (Downloads, Desktop, etc.)
- Resolving security-scoped folder bookmarks (`URL.startAccessingSecurityScopedResource`)
- Evaluating user rules (e.g. ignoring certain file patterns)
- Confirm/Cancel visual previews for folder organization
- **`FilePreviewSheet`** (SwiftUI) — table of proposed moves (source → target, skipped items); **Apply** / **Cancel** call `confirmPendingOrganize` / `cancelPendingOrganize` on `ChatOrchestrator`

### Out of Scope

- System automation commands (Terminal shell, simulation) → System Control Core
- Mail/Messages triage → Communication Core
- Browser tab listing → Browsing Core
- Persona, tone, memory schemas → Personal Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| `FilePreviewSheet` | SwiftUI sheet listing pending file moves; user confirms or cancels organize plan. |
| `FileOrganizer` | Handles path calculations, duplicate checks, rule checks, and generating layout proposals. |
| `WorkspaceAccess` | Persists and resolves sandbox bookmark security data; wraps `startAccessingSecurityScopedResource` / `stopAccessingSecurityScopedResource`. |
| `FileOrganizeService` | Holds proposed state and coordinates confirmations. |
| `UserRuleParser` | Decodes custom text rules into SQLite `user_rules` rows (including `dontTouch` patterns). |
| `RuleEnforcer` | Evaluates whether files, mail, or messages should be skipped: `shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`. |

---

## Sandbox Access Flow (OL05)

1. User grants folder via picker → security-scoped bookmark **Data** persisted (settings / SQLite — see `WorkspaceAccess.swift`).
2. On file operation: resolve bookmark → `URL.startAccessingSecurityScopedResource()`.
3. Validate target URL is within whitelisted bookmark directories.
4. Execute operation → `URL.stopAccessingSecurityScopedResource()`.
5. On failure: surface only error types documented in `WorkspaceAccess.swift` Sources (do not invent enum names).

---

## Don't Touch Enforcement Chain (OL07)

```
UserRuleParser → user_rules (SQLite, dontTouch kind)
       ↓
RuleEnforcer.shouldSkipFile / shouldSkipMail / shouldSkipMessage
       ↓
FileOrganizer (skip matching paths before proposing moves)
       ↓
FilePreviewSheet (Apply required — no silent moves)
       ↓
Audit trail (skipped paths logged)
```

---

## Invariants

- File moves must only occur within whitelisted bookmark directories.
- No files are ever moved without explicit user confirmation via `FilePreviewSheet`.
- Skipped folders / paths must be logged in the audit trail.
- Only cite symbols listed in Key Entities and Sources — do not invent error types or services.

---

## Decision History (ADRs)

| Date | Decision | Rationale | ADR |
|------|----------|-----------|-----|
| 2026-05-20 | Sandboxed folder bookmarks | Necessary to allow file operations while complying with macOS sandbox regulations. | ADR-02 |
| 2026-06-05 | Dry-run propose-before-move | Protects user files from accidental or unwanted LLM-proposed actions. | ADR-03 |
| 2026-06-17 | RuleEnforcer + enforcement chain in core | Reduces OL07 hallucination (generic "Rule Enforcers", missing FilePreviewSheet link). | — |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| File | [FilePreviewSheet.swift](file:///Users/alex0nder/Projects/Oiloop/App/FilePreviewSheet.swift) | Move preview UI (Apply / Cancel) |
| File | [FileOrganizer.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/FileTools/FileOrganizer.swift) | Main sorting logic + rule checks |
| File | [WorkspaceAccess.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/FileTools/WorkspaceAccess.swift) | macOS sandbox bookmark resolver |
| File | [FileOrganizeService.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Orchestrator/FileOrganizeService.swift) | In-memory plan tracker |
| File | [UserRuleParser.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Proactive/UserRuleParser.swift) | UserRuleParser + RuleEnforcer enum |
| File | [ScheduledDigestBuilder.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Routine/ScheduledDigestBuilder.swift) | dontTouch section in routine digest |
| File | [FileModels.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/FileTools/FileModels.swift) | FileToolError.accessDenied |

---

## Exclusions

- Local file explorer UI styles.
- Generic file-system helpers.
- Undocumented services (e.g. do not cite "Scheduled Digest Warnings" unless added to Sources).

---

## Typical Outputs

- Proposed moves list (`file_a -> folder_b`).
- Validation reports of rules matching user files.
- Sandbox access audit logs.

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.1.0 | 2026-06-17 | Sandbox flow, RuleEnforcer, enforcement chain (OL05/OL07 fixes) |
| 1.0.0 | 2026-06-13 | FilePreviewSheet entity; initial workspace scope |

See [core-fixes-OL05-OL07.md](../core-fixes-OL05-OL07.md) for eval evidence.
