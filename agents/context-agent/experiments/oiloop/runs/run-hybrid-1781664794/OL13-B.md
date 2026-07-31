# OL13 (B)

## Answer

Oiloop safely runs terminal shell commands through the following mechanisms:

- **Shell Execution Validation**: 
  - Utilizes `ShellExecutor` to spawn a `/bin/zsh` subprocess.
  - Requires explicit user confirmation in `ShellPreviewSheet` before execution.
  - Limits commands to user-level execution privileges.

- **Logging**: 
  - Logs all executed commands in an SQLite `audit_log` under the `shell_exec` action.

These measures ensure that commands are validated, confirmed by the user, and logged for accountability.
