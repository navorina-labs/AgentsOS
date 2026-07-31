# OL13 (B)

## Answer

Oiloop safely runs terminal shell commands through the following mechanisms:

- **Shell Execution Validation**: It includes subprocesses, timeouts, and sandboxing checks to ensure safe execution.
- **User Confirmation**: Every shell command must be previewed and confirmed by the user before execution.
- **Headless Mode Bypass**: In headless mode, access to EventKit Reminders is bypassed if permissions are not determined, preventing potential issues.
