# OL13 (C)

## Answer

Oiloop safely runs terminal shell commands through the following mechanisms:

- **Shell Execution Validation**: 
  - Utilizes `ShellExecutor` to spawn a subprocess with `/bin/zsh`.
  - Requires explicit user confirmation in `ShellPreviewSheet` before executing any command.
  - Limits commands to user-level execution privileges.

- **Logging**: 
  - Logs all executed commands in an SQLite `audit_log` under the `shell_exec` action.

These measures ensure that commands are validated and confirmed by the user, enhancing security and preventing unauthorized execution.
