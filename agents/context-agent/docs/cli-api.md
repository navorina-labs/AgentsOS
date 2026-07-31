# CLI API Contract

The CLI supports human-readable terminal output and explicit JSON output for
commands that document `--json`.

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Command completed successfully. |
| `1` | A validation, quality, budget, lifecycle, or comparison gate failed. |
| `2` | The command could not run because invocation or configuration was invalid. |

Gate failures are expected domain outcomes. Command errors include unknown
commands, missing required arguments, missing project contracts, and invalid
option values.

## JSON Success

Successful JSON output is one complete JSON object with top-level `ok: true`.
Report commands keep their report fields at the top level to avoid unnecessary
envelope nesting.

```json
{
  "ok": true,
  "routes": 4,
  "patterns": 27
}
```

## JSON Gate Failure

A completed gate that finds violations returns its normal report with
top-level `ok: false` and exits with code 1. The full JSON object is flushed
before process termination.

## JSON Command Error

When `--json` is present and the command cannot run, stdout contains:

```json
{
  "ok": false,
  "error": {
    "code": "COMMAND_ERROR",
    "message": "..."
  }
}
```

The process exits with code 2 and does not mix human diagnostics into stdout.
Without `--json`, the error message is written to stderr.

## Compatibility

Within a major CLI version:

- existing top-level JSON fields are not removed or renamed;
- new fields may be added;
- exit-code meanings remain stable;
- JSON output remains a single parseable document;
- human-readable output is not a machine API and may improve without notice.

Consumers should branch on `ok` and exit code, and ignore unknown JSON fields.
