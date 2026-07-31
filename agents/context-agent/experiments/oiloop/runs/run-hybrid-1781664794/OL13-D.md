# OL13 (D)

## Answer

Oiloop safely runs terminal shell commands through the following mechanisms:

- **Shell Execution Validation**: 
  - Utilizes `ShellExecutor` to spawn a `/bin/zsh` subprocess.
  - Requires explicit user confirmation in `ShellPreviewSheet` before execution.
  - Limits commands to user-level execution privileges.
  - Logs all runs in an SQLite `audit_log` under the `shell_exec` action. 

These measures ensure that commands are validated, confirmed, and logged, enhancing security and accountability.
