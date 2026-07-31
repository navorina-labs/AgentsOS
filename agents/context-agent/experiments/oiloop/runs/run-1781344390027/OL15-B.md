# OL15 (B)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing a headless bypass. This approach checks the status of permissions before attempting to access EventKit Reminders. If permissions are not determined, the access is bypassed, preventing background agents from blocking indefinitely on macOS permissions popups. 

This decision is documented in the decision history as follows:

- **Date**: 2026-06-10
- **Decision**: TCC Headless Bypass
- **Rationale**: Background agents block indefinitely on macOS permissions popup. Checking status first prevents freezes. 
- **ADR**: ADR-09
