# Personal Core (Oiloop)

## Metadata

| Field | Value |
|-------|-------|
| id | personal-core |
| version | 1.0.0 |
| parent_core | null |
| project | Oiloop |
| last_updated | 2026-06-12 |
| token_estimate | 800 |

---

## Purpose

Handles Oiloop's core assistant persona, user preferences, memory storage, database persistence of chat sessions, messages, extracted user facts, and memory episodes.

---

## Scope

### In Scope

- Assistant persona guidelines (empathy, tone, character boundaries)
- Tone presets (Warm, Professional, Minimal)
- Memory schemas and CRUD operations (sessions, messages, facts, episodes)
- Onboarding settings and preferences (username, assistant name)
- SQLite database initialization and migrations

### Out of Scope

- File sorting rules and actions → Workspace Core
- Email drafts, SMS, Slack/Telegram integrations → Communication Core
- Console/Terminal executing and simulation → System Control Core
- Browser tab grouping and closing → Browsing Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| `MemoryStore` | Manages SQLite database and tables for messages, facts, episodes, and settings. |
| `PersonaSettings` | Stores preferred names and assistant character configuration. |
| `SystemPromptBuilder` | Builds LLM system instructions incorporating memories and tone guidelines. |
| `OnboardingSettings` | Manages onboarding state and checks. |

---

## Invariants

- User chat data must stay local (no cloud keys or logs).
- Memory episodes must be compressed automatically once they reach thresholds to save context tokens.
- Deleting user data must wipe all SQLite tables completely and irreversibly.

---

## Decision History (ADRs)

| Date | Decision | Rationale | ADR |
|------|----------|-----------|-----|
| 2026-05-20 | Local SQLite (MemoryStore) | To maintain privacy and perform high-speed local queries. | ADR-01 |
| 2026-06-08 | Episode Summarization | Shrinks history to stay within context limits of local models (llama3.2). | ADR-04 |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| File | [MemoryStore.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Memory/MemoryStore.swift) | Database layout and queries |
| File | [PersonaSettings.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Persona/PersonaSettings.swift) | User preferences schema |
| File | [SystemPromptBuilder.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Persona/SystemPromptBuilder.swift) | System instruction compiler |

---

## Exclusions

- Full SQL scripts or source code.
- Core logic of non-personal tools.

---

## Typical Outputs

- Instructions on updating user preferences.
- Summaries of chat history and user facts.
- Persona responses complying with configured tone constraints.
