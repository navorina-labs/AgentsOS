# System Control Core (Oiloop)

## Metadata

| Field | Value |
|-------|-------|
| id | system-control-core |
| version | 1.0.0 |
| parent_core | null |
| project | Oiloop |
| last_updated | 2026-06-12 |
| token_estimate | 950 |

---

## Purpose

Enables executing terminal shell commands, capturing screenshots, simulating keyboard/mouse macros, managing EventKit native reminders, and processing hand gesture camera streams.

---

## Scope

### In Scope

- Shell execution validation (subprocesses, timeouts, and sandboxing checks)
- Screencapture triggers and output path routing
- Simulating mouse clicks, keyboard text input, and system hotkeys
- Reading, creating, and deleting EventKit Native Reminders
- Parsing natural language reminder deadlines (English and Russian)
- Camera-based hand gesture detection (`AVCaptureSession` and Vision pose matching)

### Out of Scope

- Mail or Message replies → Communication Core
- Browser tab listing → Browsing Core
- File organization inside workspace folders → Workspace Core

---

## Key Entities

| Entity | Description |
|--------|-------------|
| `ShellExecutor` | Spawns zsh subprocesses and returns shell text. |
| `ScreenshotCapturer` | Handles `screencapture` commands and stores files in the workspace. |
| `KeyboardMouseExecutor` | Simulates mouse clicks, movements, and key inputs using CoreGraphics. |
| `RemindersReader` | Integrates with EventKit to fetch and store reminders. |
| `GestureEngine` | Classifies hand landmarks from local camera frames into confirmed gesture intents. |

---

## Invariants

- Every shell command, screenshot request, and mouse click macro must be previewed and confirmed by the user.
- Camera video frames must be analyzed on-device only (no video streaming or cloud storage).
- Accessing EventKit Reminders must be bypassed in headless mode (`--headless`) if permissions are not determined.

---

## Decision History (ADRs)

| Date | Decision | Rationale | ADR |
|------|----------|-----------|-----|
| 2026-06-10 | TCC Headless Bypass | Background agents block indefinitely on macOS permissions popup. Checking status first prevents freezes. | ADR-09 |
| 2026-06-11 | NSDataDetector parsing | Provides robust, offline, multi-lingual parsing of relative dates (e.g. "tomorrow at 5pm"). | ADR-10 |

---

## Sources

| Type | Reference | Description |
|------|-----------|-------------|
| File | [ShellExecutor.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/ShellExecutor.swift) | Subprocess shell runner |
| File | [KeyboardMouseExecutor.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/KeyboardMouseExecutor.swift) | CoreGraphics input simulator |
| File | [RemindersReader.swift](file:///Users/alex0nder/Projects/Oiloop/Tools/RemindersTools/RemindersReader.swift) | EventKit interface and date parser |
| File | [GestureEngine.swift](file:///Users/alex0nder/Projects/Oiloop/Core/Spatial/GestureEngine.swift) | Camera hand pose classifier |

---

## Exclusions

- Full keyboard code layouts or key mappings.
- Custom neural network gesture training code.

---

## Typical Outputs

- Terminal output reports.
- Reminders confirmation details.
- Gesture classifier events logs.
