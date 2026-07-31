# Communication Core (Oiloop)

## Metadata

| Field | Value |
|-------|-------|
| id | communication-core |
| version | 1.0.0 |
| parent_core | null |
| project | Oiloop |
| last_updated | 2026-06-12 |
| token_estimate | 1000 |

---

## Purpose

Coordinating client interactions with communication channels, including Apple Mail, Apple Messages, custom IMAP/SMTP mail servers, and external Slack/Telegram bot webhooks.

---

## Scope

### In Scope

- Reading Apple Mail inbox headers and message triage classification
- Constructing drafts in Mail.app using JXA/AppleScript
- Custom IMAP fetching and SMTP sending protocols
- Retrieving unread Apple Messages transcripts
- Staging Message reply drafts on the system pasteboard
- Syncing Telegram and Slack channel summaries via Web API

### Out of Scope

- Shell execution, screenshotting → System Control Core
- Notes management, local calendars → Workspace/System Cores
- Safari/Chrome browser tab grouping → Browsing Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| `MailService` | Coordinates Apple Mail scripts and SMTP/IMAP network requests. |
| `MessagesService` | Integrates with Messages database and clipboard operations. |
| `CustomMailReader` | Standalone client executing curl-based IMAP and SMTP commands. |
| `RoutineConnectorService` | Manages Slack & Telegram tokens, chat fetches, and logs. |

---

## Invariants

- Direct messages or emails must **never** be sent without explicit user click/confirmation.
- Slack and Telegram tokens must be stored securely (not logged in the console).
- Unread messages are processed locally for summaries and are not sent to any cloud storage.

---

## Decision History (ADRs)

| Date | Decision | Rationale | ADR |
|------|----------|-----------|-----|
| 2026-06-07 | Draft-to-Pasteboard for Messages | Sandboxing restrictions on macOS prevent direct API insertion of sent iMessages. | ADR-07 |
| 2026-06-08 | SMTP direct send | Enables headless, direct email sending when Mail.app is closed or unconfigured. | ADR-08 |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| File | [MailService.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Orchestrator/MailService.swift) | Apple Mail automation interface |
| File | [CustomMailReader.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/MailTools/CustomMailReader.swift) | Custom IMAP/SMTP implementation |
| File | [MessagesService.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Orchestrator/MessagesService.swift) | Apple Messages database bridge |
| File | [RoutineConnectorService.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Routine/RoutineConnectorService.swift) | Slack & Telegram connector logic |

---

## Exclusions

- Full AppleScript / JXA script text blocks.
- External webhook payload schemas.

---

## Typical Outputs

- Classified emails listing (Reply needed, FYI, Archive).
- Message reply drafts.
- Transcripts summaries of Slack and Telegram channels.
