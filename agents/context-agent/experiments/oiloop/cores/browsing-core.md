# Browsing Core (Oiloop)

## Metadata

| Field | Value |
|-------|-------|
| id | browsing-core |
| version | 1.0.0 |
| parent_core | null |
| project | Oiloop |
| last_updated | 2026-06-12 |
| token_estimate | 750 |

---

## Purpose

Enables checking open browser tabs, finding and closing duplicate tabs, and grouping tabs into new windows for Safari and Google Chrome.

---

## Scope

### In Scope

- Querying Safari window and tab URLs and titles via AppleScript/JXA
- Querying Google Chrome window and tab URLs and titles
- Detecting identical or duplicate tab URLs
- Issuing AppleScript commands to close specific duplicate tabs
- Reorganizing browser windows (e.g., grouping domains)

### Out of Scope

- Draft messages, email management → Communication Core
- Spawning shell processes → System Control Core
- Local workspace file sorting → Workspace Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| `SafariReader` | Resolves Safari tab titles, URLs, and executes close scripts. |
| `ChromeReader` | Resolves Google Chrome tab listings. |
| `SafariService` | Manages browser tab plans (list, group, deduplicate). |

---

## Invariants

- Browser tabs must never be closed without explicit user confirmation.
- Direct read access is limited to open tab metadata (URLs, titles) and does not read web page content details.

---

## Decision History (ADRs)

| Date | Decision | Rationale | ADR |
|------|----------|-----------|-----|
| 2026-06-05 | AppleScript/JXA automation | Browser sandboxing limits external window access. AppleScript allows control of running Safari/Chrome processes. | ADR-06 |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| File | [SafariReader.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/SafariTools/SafariReader.swift) | Safari AppleScript wrapper |
| File | [ChromeReader.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/SafariTools/ChromeReader.swift) | Google Chrome AppleScript wrapper |
| File | [SafariService.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Orchestrator/SafariService.swift) | Browser action pipeline |

---

## Exclusions

- Web page content parser code.
- Custom browser extension communication scripts.

---

## Typical Outputs

- Open tab lists with duplicate markings.
- Browser tabs audit logs.
