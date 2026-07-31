# OL13 (C)

## Answer

Oiloop safely runs terminal shell commands through the following mechanisms:

- **Shell Execution Validation**: It performs subprocess checks, timeouts, and sandboxing checks to ensure safe execution.
- **User Confirmation**: Every shell command must be previewed and confirmed by the user before execution.
- **Invariants**: The system enforces that no shell command is executed without explicit user consent, ensuring user control over the actions taken.
